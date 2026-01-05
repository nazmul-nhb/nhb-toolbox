import { _secToDate, _toSeconds } from '../date/helpers';
import { parseMSec } from '../date/parse';
import { isNotEmptyObject } from '../guards/non-primitives';
import { isNonEmptyString } from '../guards/primitives';
import type { GenericObject } from '../object/types';
import type { Maybe } from '../types/index';
import { stableStringify, stripJsonEdgeGarbage } from '../utils/index';
import { _constantTimeEquals } from './helpers';
import type {
	DecodedToken,
	SignetHeader,
	SignetPayload,
	SignOptions,
	TokenString,
	VerifiedToken,
	VerifyOptions,
} from './types';
import { base64ToBytes, bytesToBase64, bytesToUtf8, hmacSha256, utf8ToBytes } from './utils';

/**
 * @class A lightweight, secure implementation of JWT-like tokens using `HMAC-SHA256` signatures.
 *      - This class provides methods to create, verify, and decode tokens with a simple API similar to JSON Web Tokens (`JWT`)
 *        but with a smaller footprint and zero dependencies.
 *
 * @remarks
 * - **Features:**
 *   - `HMAC-SHA256` signatures for security
 *   - Time-based claims (expiration, not-before)
 *   - Standard claims (audience, issuer, subject)
 *   - Constant-time signature comparison to prevent timing attacks
 *   - Automatic date conversion for timestamp claims
 *   - `Base64` URL-safe encoding (standard `Base64` in this implementation)
 *
 * - **Security considerations:**
 *   - Keep the secret key secure and rotate periodically
 *   - Use appropriate token expiration times
 *   - Validate all claims relevant to your application
 *   - Store tokens securely (HTTP-only cookies recommended for web)
 *
 * @example
 * ```typescript
 * // Create a token signer
 * const signet = new Signet('my-secret-key');
 *
 * // Sign a token with custom payload and options
 * const token = signet.sign(
 *   { userId: 123, role: 'admin' },
 *   {
 *     expiresIn: '1h',
 *     audience: 'my-app',
 *     issuer: 'auth-service'
 *   }
 * );
 *
 * // Verify a token
 * const result = signet.verify(token, {
 *   audience: 'my-app',
 *   issuer: 'auth-service'
 * });
 *
 * if (result.isValid) {
 *   console.log('Valid token for user:', result.payload.userId);
 * } else {
 *   console.log('Invalid token:', result.error);
 * }
 *
 * // Decode without verification
 * const decoded = signet.decode(token);
 * console.log('Token payload:', decoded.payload);
 * ```
 */
export class Signet {
	#secretBytes: Uint8Array;

	/**
	 * * Creates a new `Signet` instance with the specified secret key.
	 *
	 * @param secret - The secret key used for signing and verifying tokens.
	 *                 Must be a non-empty string.
	 *
	 * @throws If the secret is not a non-empty string.
	 *
	 * @remarks
	 * - The secret is converted to `UTF-8` bytes and stored internally.
	 * - Choose a strong secret (at least 32 characters) and store it securely.
	 * - For production, consider using key rotation strategies.
	 *
	 * @example
	 * ```typescript
	 * // Initialize with a secret key
	 * const signet = new Signet('super-secret-key-123');
	 *
	 * // Use environment variable for the secret
	 * const signet = new Signet(process.env.JWT_SECRET!);
	 * ```
	 */
	constructor(secret: string) {
		if (!isNonEmptyString(secret)) {
			throw new Error('Secret must be a non-empty string!');
		}

		this.#secretBytes = utf8ToBytes(secret);
	}

	/** Decodes a token without verifying its signature. */
	#decode<T extends GenericObject = GenericObject>(token: string): DecodedToken<T> {
		if (!isNonEmptyString(token)) {
			throw new Error('Token must be a non-empty string!');
		}

		const parts = token.split('.');

		if (parts.length !== 3) {
			throw new Error('Token is tampered or malformed!');
		}

		const [hdr, pld, signature] = parts;

		const headerBytes = base64ToBytes(hdr);
		const payloadBytes = base64ToBytes(pld);
		const headerStr = stripJsonEdgeGarbage(bytesToUtf8(headerBytes));
		const payloadStr = stripJsonEdgeGarbage(bytesToUtf8(payloadBytes));

		let header: SignetHeader;

		try {
			header = JSON.parse(headerStr);
		} catch {
			throw new Error('Cannot parse header!');
		}

		let payload: SignetPayload<T>;

		try {
			const { iat, iatDate, exp, expDate, nbf, nbfDate, aud, sub, iss, ...rest } =
				JSON.parse(payloadStr);

			payload = {
				iat,
				iatDate: iatDate ? new Date(iatDate) : _secToDate(iat),
				...(exp && { exp }),
				...(exp && { expDate: expDate ? new Date(expDate) : _secToDate(exp) }),
				...(nbf && { nbf }),
				...(nbf && { nbfDate: nbfDate ? new Date(nbfDate) : _secToDate(nbf) }),
				...(aud && { aud }),
				...(sub && { sub }),
				...(iss && { iss }),
				...rest,
			};
		} catch {
			throw new Error('Cannot parse payload!');
		}

		return {
			header,
			payload,
			signature,
			signingInput: `${hdr}.${pld}`,
		};
	}

	/**
	 * * Creates and signs a new token with the given payload and options.
	 *
	 * @param payload - Custom data to include in the token payload.
	 *                  Must be a `non-empty object`.
	 * @param options - Optional configuration for token claims and expiration.
	 *
	 * @returns A signed token string in the format `header.payload.signature`.
	 *
	 * @throws If payload is not a valid object.
	 *
	 * @remarks
	 * - **The token structure follows JWT format:**
	 *   - Header: Contains algorithm (`HS256`) and token type (`SIGNET+JWT`)
	 *   - Payload: Includes standard claims (`iat`, `exp`, `nbf`, `aud`, `sub`, `iss`) plus custom data
	 *   - Signature: `HMAC-SHA256(signingInput, secret)` (the result of the hash)
	 *   - Signing Inputs: `base64(header) + "." + base64(payload)` (the string that gets hashed)
	 *
	 * - **Automatic claims added:**
	 *   - `iat` (issued at): Current time in seconds
	 *   - `iatDate`: Current time as Date object
	 *   - If `expiresIn` is provided: `exp` and `expDate`
	 *   - If `notBefore` is provided: `nbf` and `nbfDate`
	 *
	 * @example
	 * ```typescript
	 * // Basic token with custom data
	 * const token = signet.sign({ userId: 123, name: 'John' });
	 *
	 * // Token with expiration and claims
	 * const token = signet.sign(
	 *   { userId: 123 },
	 *   {
	 *     expiresIn: '2h',
	 *     audience: 'api.example.com',
	 *     issuer: 'auth-service',
	 *     subject: 'user-123'
	 *   }
	 * );
	 *
	 * // Token valid after 5 minutes
	 * const token = signet.sign(
	 *   { action: 'reset-password' },
	 *   { notBefore: '5m' }
	 * );
	 * ```
	 */
	sign(payload: GenericObject, options?: SignOptions): TokenString {
		if (!isNotEmptyObject(payload)) throw new Error('Payload must be a valid object!');

		const { expiresIn, notBefore, audience, issuer, subject } = options || {};

		const iat = _toSeconds(Date.now());

		const $payload: SignetPayload = {
			iat,
			iatDate: _secToDate(iat),
			...(expiresIn && { exp: iat + _toSeconds(parseMSec(expiresIn)) }),
			...(expiresIn && { expDate: _secToDate(iat + _toSeconds(parseMSec(expiresIn))) }),
			...(notBefore && { nbf: iat + _toSeconds(parseMSec(notBefore)) }),
			...(notBefore && { nbfDate: _secToDate(iat + _toSeconds(parseMSec(notBefore))) }),
			...(audience && { aud: audience }),
			...(subject && { sub: subject }),
			...(issuer && { iss: issuer }),
			...payload,
		};

		const header: SignetHeader = { alg: 'HS256', typ: 'SIGNET+JWT' };
		const headerJson = stableStringify(header);
		const payloadJson = stableStringify($payload);
		const headerB = utf8ToBytes(headerJson);
		const payloadB = utf8ToBytes(payloadJson);
		const signingInput = `${bytesToBase64(headerB)}.${bytesToBase64(payloadB)}` as const;
		const mac = hmacSha256(this.#secretBytes, utf8ToBytes(signingInput));
		const signature = bytesToBase64(mac);

		return `${signingInput}.${signature}`;
	}

	/**
	 * * Decodes a token without verifying its signature.
	 *
	 * @typeParam T - Type of custom data in the token payload.
	 * @param token - The token string to decode.
	 *
	 * @returns The decoded token parts including header, payload, and signatures.
	 *
	 * @throws If the token is malformed, empty, or cannot be parsed.
	 *
	 * @remarks
	 * - Use this method when you need to inspect token contents without verification.
	 * - **Warning:** This does not validate the signature, so the data may have been tampered with.
	 * - Always use {@link verify} method for security-critical operations.
	 * - The payload includes both timestamp values (numbers) and {@link Date} objects for convenience.
	 *
	 * @example
	 * ```typescript
	 * // Decode token to inspect contents
	 * const decoded = signet.decode(token);
	 * console.log('Header:', decoded.header);
	 * console.log('Payload:', decoded.payload);
	 * console.log('Signature:', decoded.signature);
	 *
	 * // Access custom payload data with type safety
	 * const decoded = signet.decode<{ userId: number }>(token);
	 * const userId = decoded.payload.userId; // Type: number
	 * ```
	 */
	decode<T extends GenericObject = GenericObject>(token: string): DecodedToken<T> {
		return this.#decode<T>(token);
	}

	/**
	 * * Checks if a token has expired based on its `exp` claim.
	 *
	 * @param token - The token to check.
	 *
	 * @returns `true` if the token has an `exp` claim and current time is past it,
	 *          `false` if token has no expiration or is still valid.
	 *
	 * @throws If the token is malformed or cannot be decoded.
	 *
	 * @remarks
	 * - Tokens without `exp` claim are considered non-expiring (returns `false`)
	 * - Uses current system time for comparison ({@link Date.now()})
	 * - Does not verify the signature (use only with trusted tokens or after verification)
	 *
	 * @example
	 * ```typescript
	 * // Check expiration
	 * if (signet.hasExpired(token)) {
	 *   console.log('Token has expired');
	 *   // Prompt user to re-authenticate
	 * }
	 *
	 * // Use with other validation
	 * const isValid = !signet.hasExpired(token) && !signet.isTooEarly(token);
	 * ```
	 */
	hasExpired(token: string): boolean {
		const { exp } = this.#decode(token).payload;

		return exp ? _toSeconds(Date.now()) > exp : false;
	}

	/**
	 * * Checks if a token's `nbf` (not-before) claim indicates it's too early to use.
	 *
	 * @param token - The token to check.
	 *
	 * @returns `true` if the token has an `nbf` claim and current time is before it,
	 *          `false` if token has no `nbf` claim or is already valid.
	 *
	 * @throws If the token is malformed or cannot be decoded.
	 *
	 * @remarks
	 * - Useful for implementing time-based access control, like activation links that shouldn't be used until a certain time.
	 * - Uses current system time for comparison ({@link Date.now()})
	 * - Does not verify the signature (use only with trusted tokens or after verification)
	 *
	 * @example
	 * ```typescript
	 * // Check if token is active yet
	 * if (signet.isTooEarly(token)) {
	 *   console.log('Token not valid yet');
	 *   // Wait before using
	 * }
	 * ```
	 */
	isTooEarly(token: string): boolean {
		const { nbf } = this.#decode(token).payload;

		return nbf ? _toSeconds(Date.now()) < nbf : false;
	}

	/**
	 * * Validates a token's `iss` (issuer) claim against an expected value.
	 *
	 * @param token - The token to check.
	 * @param expected - The expected issuer value. If `undefined`, always returns `false`.
	 *
	 * @returns `true` if the token has an `iss` claim that doesn't match the expected value,
	 *          `false` if issuer matches, token has no issuer claim, or expected issuer is undefined.
	 *
	 * @throws If the token is malformed or cannot be decoded.
	 *
	 * @remarks Use this to ensure tokens come from trusted sources in multi-issuer scenarios.
	 *
	 * @example
	 * ```typescript
	 * // Validate issuer
	 * if (signet.isInvalidIssuer(token, 'auth-service')) {
	 *   console.log('Token from unexpected issuer');
	 *   // Reject token
	 * }
	 *
	 * // With optional issuer check
	 * const issuer = process.env.EXPECTED_ISSUER;
	 * if (issuer && signet.isInvalidIssuer(token, issuer)) {
	 *   throw new Error('Invalid issuer');
	 * }
	 * ```
	 */
	isInvalidIssuer(token: string, expected: Maybe<string>): boolean {
		if (!expected) return false;

		const { iss } = this.#decode(token).payload;

		return iss ? iss !== expected : false;
	}

	/**
	 * * Validates a token's `aud` (audience) claim against expected values.
	 *
	 * @param token - The token to check.
	 * @param expected - The expected audience(s). Can be a string or array of strings.
	 *                   If `undefined`, always returns `false`.
	 *
	 * @returns `true` if the token has an `aud` claim and none of its values match any of the expected audiences, `false` otherwise.
	 *
	 * @throws If the token is malformed or cannot be decoded.
	 *
	 * @remarks
	 * - Tokens can have single audience (string) or multiple audiences (string[])
	 * - Returns `false` (valid) if at least one audience matches
	 * - Useful for multi-tenant or multi-service architectures
	 *
	 * @example
	 * ```typescript
	 * // Single audience check
	 * if (signet.isInvalidAudience(token, 'api.example.com')) {
	 *   console.log('Token not intended for this audience');
	 * }
	 *
	 * // Multiple allowed audiences
	 * const validAudiences = ['web-app', 'mobile-app', 'admin-panel'];
	 * if (signet.isInvalidAudience(token, validAudiences)) {
	 *   throw new Error('Invalid audience');
	 * }
	 *
	 * // Token with multiple audiences
	 * // Token payload: { aud: ['web-app', 'mobile-app'] }
	 * // Check if at least one matches
	 * const isValid = !signet.isInvalidAudience(token, ['web-app', 'admin-panel']);
	 * // Returns false (valid) because 'web-app' matches
	 * ```
	 */
	isInvalidAudience(token: string, expected: Maybe<string | string[]>): boolean {
		if (!expected) return false;

		const { aud } = this.#decode(token).payload;

		if (!aud) return false;

		const payloadAud = Array.isArray(aud) ? aud : [aud];

		const expectedAud = Array.isArray(expected) ? expected : [expected];

		return payloadAud.some((tokenAud) => expectedAud.includes(tokenAud));
	}

	/**
	 * * Validates a token's `sub` (subject) claim against an expected value.
	 *
	 * @param token - The token to check.
	 * @param expected - The expected subject value. If `undefined`, always returns `false`.
	 *
	 * @returns `true` if the token has a `sub` claim that doesn't match the expected value,
	 *          `false` if subject matches, token has no subject claim, or expected subject is undefined.
	 *
	 * @throws If the token is malformed or cannot be decoded.
	 *
	 * @remarks
	 * - Use this to ensure tokens are being used by the intended user/entity.
	 * - Common for authorization checks where tokens should be user-specific.
	 *
	 * @example
	 * ```typescript
	 * // Validate subject
	 * const userId = 'user-123';
	 * if (signet.isInvalidSubject(token, userId)) {
	 *   console.log('Token not for this user');
	 *   // Reject request
	 * }
	 *
	 * // Optional subject validation
	 * const expectedSubject = getExpectedSubjectFromRequest();
	 * if (expectedSubject && signet.isInvalidSubject(token, expectedSubject)) {
	 *   return response.status(403).send('Invalid subject');
	 * }
	 * ```
	 */
	isInvalidSubject(token: string, expected: Maybe<string>): boolean {
		if (!expected) return false;

		const { sub } = this.#decode(token).payload;

		return sub ? sub !== expected : false;
	}

	/**
	 * * Verifies a token's signature and validates all claims.
	 *
	 * @typeParam T - Type of custom data in the token payload.
	 * @param token - The token string to verify.
	 * @param options - Optional validation criteria for token claims.
	 *
	 * @returns A {@link VerifiedToken} object indicating success or failure.
	 *          - If valid: `{ isValid: true, payload: SignetPayload<T> }`
	 *          - If invalid: `{ isValid: false, error: string }`
	 *
	 * @remarks
	 * - **Performs the following checks in order:**
	 *   - Token structure (3 parts separated by dots)
	 *   - Base64 decoding of header and payload
	 *   - JSON parsing of header and payload
	 *   - Signature verification (constant-time comparison)
	 *   - Expiration check (if `exp` claim exists)
	 *   - Not-before check (if `nbf` claim exists)
	 *   - Issuer validation (if provided in options)
	 *   - Audience validation (if provided in options)
	 *   - Subject validation (if provided in options)
	 *
	 * - **This is the recommended method for most token validation scenarios.**
	 *
	 * @example
	 * ```typescript
	 * // Basic verification
	 * const result = signet.verify(token);
	 * if (result.isValid) {
	 *   console.log('Valid token:', result.payload);
	 * } else {
	 *   console.log('Invalid token:', result.error);
	 * }
	 *
	 * // With claim validation
	 * const result = signet.verify(token, {
	 *   audience: 'api.example.com',
	 *   issuer: 'auth-service',
	 *   subject: 'user-123'
	 * });
	 *
	 * // Type-safe custom payload
	 * interface UserToken {
	 *   userId: number;
	 *   role: string;
	 * }
	 * const result = signet.verify<UserToken>(token);
	 * if (result.isValid) {
	 *   const { userId, role } = result.payload;
	 *   // userId and role are typed
	 * }
	 * ```
	 */
	verify<T extends GenericObject = GenericObject>(
		token: string,
		options?: VerifyOptions
	): VerifiedToken<T> {
		try {
			const { signature, signingInput, payload } = this.#decode<T>(token);
			const { audience, issuer, subject } = options || {};

			const expectedMac = hmacSha256(this.#secretBytes, utf8ToBytes(signingInput));
			const expectedSig = bytesToBase64(expectedMac);

			if (!_constantTimeEquals(signature, expectedSig)) {
				throw new Error('Invalid or tampered signature!');
			}

			if (this.hasExpired(token)) {
				throw new Error('Token has expired!');
			}

			if (this.isTooEarly(token)) {
				throw new Error('Token is not active yet!');
			}

			if (this.isInvalidIssuer(token, issuer)) {
				throw new Error('Invalid token issuer!');
			}

			if (this.isInvalidAudience(token, audience)) {
				throw new Error('Invalid token audience(s!');
			}

			if (this.isInvalidSubject(token, subject)) {
				throw new Error('Invalid token subject!');
			}

			return { isValid: true, payload };
		} catch (e) {
			return {
				isValid: false,
				error: e instanceof Error ? e.message : String(e),
			};
		}
	}

	/**
	 * * Verifies a token and throws an error if invalid.
	 *
	 * @typeParam T - Type of custom data in the token payload.
	 * @param token - The token string to verify.
	 * @param options - Optional validation criteria for token claims.
	 *
	 * @returns A valid {@link VerifiedToken} with `isValid: true`.
	 *
	 * @throws If the token is invalid, with a message describing the failure.
	 *
	 * @remarks
	 * - This method is a convenience wrapper around {@link verify} that throws instead of returning an error object.
	 * - Useful for `express`-style middleware or when you want to handle authentication failures with exceptions.
	 * - The thrown error message is the same as the `error` property in the invalid result from {@link verify}.
	 *
	 * @example
	 * ```typescript
	 * // Use in middleware/guard
	 * function authMiddleware(req, res, next) {
	 *   const token = req.headers.authorization?.replace('Bearer ', '');
	 *
	 *   try {
	 *     const result = signet.verifyOrThrow(token, {
	 *       audience: 'api.example.com'
	 *     });
	 *     req.user = result.payload;
	 *     next();
	 *   } catch (error) {
	 *     res.status(401).json({ error: error.message });
	 *   }
	 * }
	 *
	 * // In application code
	 * try {
	 *   const result = signet.verifyOrThrow(token);
	 *   // Token is guaranteed valid here
	 *   processUserRequest(result.payload);
	 * } catch (error) {
	 *   handleAuthError(error);
	 * }
	 * ```
	 */
	verifyOrThrow<T extends GenericObject = GenericObject>(
		token: string,
		options?: VerifyOptions
	): VerifiedToken<T> {
		const res = this.verify<T>(token, options);

		if (!res.isValid) {
			throw new Error(res.error || 'Invalid, malformed or expired token!');
		}

		return res;
	}

	/**
	 * * Extracts only the payload from a token without full verification.
	 *
	 * @typeParam T - Type of custom data in the token payload.
	 * @param token - The token string to decode.
	 *
	 * @returns The token payload including standard claims and custom data.
	 *
	 * @throws If the token is malformed, empty, or cannot be parsed.
	 *
	 * @remarks
	 * - This is a convenience method equivalent to `decode(token).payload`.
	 *
	 * - **Security Note:** This method does NOT verify the token signature.
	 *
	 * - **Only use it when:**
	 *   - You've already verified the token elsewhere
	 *   - The token comes from a trusted source
	 *   - You're debugging or logging
	 *   - The operation is not security-critical
	 *
	 * - For security-sensitive operations, always use {@link verify} or {@link verifyOrThrow} method.
	 *
	 * @example
	 * ```typescript
	 * // Quick payload extraction for non-critical operations
	 * const payload = signet.decodePayload(token);
	 * console.log('User ID:', payload.userId);
	 * console.log('Issued at:', payload.iatDate);
	 *
	 * // Type-safe with custom interface
	 * interface AppToken {
	 *   userId: number;
	 *   permissions: string[];
	 * }
	 * const payload = signet.decodePayload<AppToken>(token);
	 * const canDelete = payload.permissions.includes('delete');
	 * ```
	 */
	decodePayload<T extends GenericObject = GenericObject>(token: string): SignetPayload<T> {
		return this.#decode<T>(token).payload;
	}
}
