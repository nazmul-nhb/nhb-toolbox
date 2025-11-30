import { parseMs } from '../date/parse';
import { isNotEmptyObject } from '../guards/non-primitives';
import { isNonEmptyString } from '../guards/primitives';
import type { GenericObject } from '../object/types';
import { stableStringify } from '../utils/index';
import { _constantTimeEquals } from './helpers';
import type {
	DecodedToken,
	TokenOptions,
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

	sign(payload: GenericObject, options?: TokenOptions): TokenString {
		if (!isNotEmptyObject(payload)) throw new Error('Payload must be a valid object!');

		const { expiresIn } = options || {};

		const now = Date.now();
		const updatedPayload: TokenPayload = {
			iat: now,
			exp: expiresIn ? now + parseMs(expiresIn) : null,
			...payload,
		};

		const hdr: TokenOptions = { alg: 'HS256', typ: 'JWT', ...options };
		const headerJson = stableStringify(hdr);
		const payloadJson = stableStringify(updatedPayload);
		const headerB = utf8ToBytes(headerJson);
		const payloadB = utf8ToBytes(payloadJson);
		const signingInput = `${bytesToBase64(headerB)}.${bytesToBase64(payloadB)}` as const;
		const mac = hmacSha256(this.#secretBytes, utf8ToBytes(signingInput));
		const signature = bytesToBase64(mac);

		return `${signingInput}.${signature}`;
	}

	decode<T extends GenericObject = GenericObject>(token: string): DecodedToken<T> {
		if (!isNonEmptyString(token)) throw new Error('Token must be a non-empty string!');

		const parts = token.split('.');
		if (parts.length !== 3) throw new Error('Token is tampered or malformed!');

		const [hdr, pld, signature] = parts;
		const headerBytes = base64ToBytes(hdr);
		const payloadBytes = base64ToBytes(pld);
		const headerStr = bytesToUtf8(headerBytes);
		const payloadStr = bytesToUtf8(payloadBytes);

		let header: TokenOptions;
		let payload: TokenPayload<T>;

		try {
			header = JSON.parse(headerStr);
		} catch {
			throw new Error('Cannot parse header!');
		}

		try {
			payload = JSON.parse(payloadStr);
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

	verify<T extends GenericObject = GenericObject>(token: string): VerifiedToken<T> {
		if (!isNonEmptyString(token)) {
			throw new Error('Token must be a non-empty string!');
		}

		try {
			const parts = token.split('.');
			if (parts.length !== 3) {
				throw new Error('Token is tampered or malformed!');
			}

			const [hdr, pld, sig] = parts;
			const signingInput = hdr + '.' + pld;
			const expectedMac = hmacSha256(this.#secretBytes, utf8ToBytes(signingInput));
			const expectedSig = bytesToBase64(expectedMac);

			if (!_constantTimeEquals(sig, expectedSig)) {
				throw new Error('Invalid or tampered signature!');
			}

			const payloadBytes = base64ToBytes(pld);
			const payloadStr = bytesToUtf8(payloadBytes);

			let payload: TokenPayload<T>;
			try {
				payload = JSON.parse(payloadStr);
			} catch {
				throw new Error('Cannot parse payload!');
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
		return this.decode<T>(token).payload;
	}
}
