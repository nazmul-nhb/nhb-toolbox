import { parseMs } from '../date/parse';
import { isNotEmptyObject } from '../guards/non-primitives';
import { isNonEmptyString } from '../guards/primitives';
import type { GenericObject } from '../object/types';
import { stableStringify } from '../utils/index';
import { _constantTimeEquals } from './helpers';
import type {
	DecodedToken,
	SignOptions,
	TokenHeader,
	TokenPayload,
	TokenString,
	VerifiedToken,
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
		const headerStr = bytesToUtf8(headerBytes);
		const payloadStr = bytesToUtf8(payloadBytes);

		let header: TokenHeader;

		try {
			header = JSON.parse(headerStr);
		} catch {
			throw new Error('Cannot parse header!');
		}

		let payload: TokenPayload<T>;

		try {
			const { iat, exp, nbf, aud, sub, iss, ...rest } = JSON.parse(payloadStr);

			payload = {
				iat,
				exp,
				nbf,
				aud,
				sub,
				iss,
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

		const _toSeconds = (ms: number) => Math.floor(ms / 1000);

		const iat = _toSeconds(Date.now());
		const exp = expiresIn ? iat + _toSeconds(parseMs(expiresIn)) : null;
		const nbf = notBefore ? iat + _toSeconds(parseMs(notBefore)) : null;

		const pld: TokenPayload = {
			iat,
			exp,
			nbf,
			aud: audience ?? null,
			sub: subject ?? null,
			iss: issuer ?? null,
			...payload,
		};

		const hdr: TokenHeader = { alg: 'HS256', typ: 'Custom' };
		const headerJson = stableStringify(hdr);
		const payloadJson = stableStringify(pld);
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

	verify<T extends GenericObject = GenericObject>(token: string): VerifiedToken<T> {
		try {
			const { signature, signingInput, payload } = this.#decode<T>(token);

			const expectedMac = hmacSha256(this.#secretBytes, utf8ToBytes(signingInput));
			const expectedSig = bytesToBase64(expectedMac);

			if (!_constantTimeEquals(signature, expectedSig)) {
				throw new Error('Invalid or tampered signature!');
			}

			if (payload.exp && Date.now() > payload.exp) {
				throw new Error('Token has expired!');
			}

			return { isValid: true, payload };
		} catch (e) {
			return {
				isValid: false,
				error: e instanceof Error ? e.message : String(e),
			};
		}
	}

	verifyOrThrow<T extends GenericObject = GenericObject>(token: string): VerifiedToken<T> {
		const res = this.verify<T>(token);

		if (!res.isValid) {
			throw new Error(res.error || 'Invalid, malformed or expired token!');
		}

		return res;
	}

	decodePayload<T extends GenericObject = GenericObject>(token: string): TokenPayload<T> {
		return this.#decode<T>(token).payload;
	}
}
