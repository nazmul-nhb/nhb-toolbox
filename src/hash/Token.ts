import { parseMSec } from '../date/parse';
import { isNotEmptyObject } from '../guards/non-primitives';
import { isNonEmptyString } from '../guards/primitives';
import type { GenericObject } from '../object/types';
import { stableStringify, stripJsonEdgeGarbage } from '../utils/index';
import { _constantTimeEquals, _secToDate, _toSeconds } from './helpers';
import type {
	DecodedToken,
	SignOptions,
	TokenHeader,
	TokenPayload,
	TokenString,
	VerifiedToken,
	VerifyOptions,
} from './types';
import { base64ToBytes, bytesToBase64, bytesToUtf8, hmacSha256, utf8ToBytes } from './utils';

export class SimpleToken {
	#secretBytes: Uint8Array;

	constructor(secret: string) {
		if (!isNonEmptyString(secret)) {
			throw new Error('Secret must be a non-empty string!');
		}

		this.#secretBytes = utf8ToBytes(secret);
	}

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

		let header: TokenHeader;

		try {
			header = JSON.parse(headerStr);
		} catch {
			throw new Error('Cannot parse header!');
		}

		let payload: TokenPayload<T>;

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

	sign(payload: GenericObject, options?: SignOptions): TokenString {
		if (!isNotEmptyObject(payload)) throw new Error('Payload must be a valid object!');

		const { expiresIn, notBefore, audience, issuer, subject } = options || {};

		const iat = _toSeconds(Date.now());

		const $payload: TokenPayload = {
			iat,
			iatDate: _secToDate(iat),
			...(expiresIn && { exp: iat + parseMSec(expiresIn, true) }),
			...(expiresIn && { expDate: _secToDate(iat + parseMSec(expiresIn, true)) }),
			...(notBefore && { nbf: iat + parseMSec(notBefore, true) }),
			...(notBefore && { nbfDate: _secToDate(iat + parseMSec(notBefore, true)) }),
			...(audience && { aud: audience }),
			...(subject && { sub: subject }),
			...(issuer && { iss: issuer }),
			...payload,
		};

		const header: TokenHeader = { alg: 'HS256', typ: 'JWT-LIKE' };
		const headerJson = stableStringify(header);
		const payloadJson = stableStringify($payload);
		const headerB = utf8ToBytes(headerJson);
		const payloadB = utf8ToBytes(payloadJson);
		const signingInput = `${bytesToBase64(headerB)}.${bytesToBase64(payloadB)}` as const;
		const mac = hmacSha256(this.#secretBytes, utf8ToBytes(signingInput));
		const signature = bytesToBase64(mac);

		return `${signingInput}.${signature}`;
	}

	decode<T extends GenericObject = GenericObject>(token: string): DecodedToken<T> {
		return this.#decode<T>(token);
	}

	hasExpired(token: string): boolean {
		const { exp } = this.#decode(token).payload;

		return exp ? _toSeconds(Date.now()) > exp : false;
	}

	isTooEarly(token: string): boolean {
		const { nbf } = this.#decode(token).payload;

		return nbf ? _toSeconds(Date.now()) < nbf : false;
	}

	isInvalidIssuer(token: string, issuer: string | undefined): boolean {
		if (!issuer) return false;

		const { iss } = this.#decode(token).payload;

		return iss ? iss !== issuer : false;
	}

	isInvalidAudience(token: string, audience: string | string[] | undefined): boolean {
		if (!audience) return false;

		const { aud } = this.#decode(token).payload;

		if (!aud) return false;

		const payloadAud = Array.isArray(aud) ? aud : [aud];

		const expectedAud = Array.isArray(audience) ? audience : [audience];

		return payloadAud.some((tokenAud) => expectedAud.includes(tokenAud));
	}

	isInvalidSubject(token: string, subject: string | undefined): boolean {
		if (!subject) return false;

		const { sub } = this.#decode(token).payload;

		return sub ? sub !== subject : false;
	}

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

	decodePayload<T extends GenericObject = GenericObject>(token: string): TokenPayload<T> {
		return this.#decode<T>(token).payload;
	}
}
