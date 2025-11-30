import { isNotEmptyObject } from '../guards/non-primitives';
import { isNonEmptyString } from '../guards/primitives';
import type { GenericObject } from '../object/types';
import { _constantTimeEquals, _stableStringify } from './helpers';
import { base64ToBytes, bytesToBase64, bytesToUtf8, hmacSha256, utf8ToBytes } from './utils';

type VerifiedResult = { isValid: true; payload: unknown } | { isValid: false; error: string };

type DecodedToken = {
	header: unknown;
	payload: unknown;
	signature: string;
	signingInput: string;
};

export class SimpleToken {
	#secretBytes: Uint8Array;

	constructor(secret: string) {
		if (!isNonEmptyString(secret)) {
			throw new Error('Secret must be a non-empty string!');
		}

		this.#secretBytes = utf8ToBytes(secret);
	}

	sign(payload: GenericObject, header?: GenericObject): string {
		if (!isNotEmptyObject(payload)) throw new Error('Payload must be a valid object!');

		const hdr: GenericObject = Object.assign({ alg: 'HS256', typ: 'JWT' }, header || {});
		const headerJson = _stableStringify(hdr);
		const payloadJson = _stableStringify(payload);
		const headerB = utf8ToBytes(headerJson);
		const payloadB = utf8ToBytes(payloadJson);
		const signingInput = bytesToBase64(headerB) + '.' + bytesToBase64(payloadB);

		const mac = hmacSha256(this.#secretBytes, utf8ToBytes(signingInput));
		const signature = bytesToBase64(mac);
		return signingInput + '.' + signature;
	}

	decode(token: string): DecodedToken {
		if (!isNonEmptyString(token)) throw new Error('Token must be a non-empty string!');

		const parts = token.split('.');
		if (parts.length !== 3) throw new Error('Token is tampered or malformed!');

		const [a, b, c] = parts;
		const headerBytes = base64ToBytes(a);
		const payloadBytes = base64ToBytes(b);
		const headerStr = bytesToUtf8(headerBytes);
		const payloadStr = bytesToUtf8(payloadBytes);

		let header: unknown;
		let payload: unknown;

		try {
			header = JSON.parse(headerStr);
		} catch {
			header = headerStr;
		}

		try {
			payload = JSON.parse(payloadStr);
		} catch {
			payload = payloadStr;
		}

		return {
			header,
			payload,
			signature: c,
			signingInput: a + '.' + b,
		};
	}

	verify(token: string): VerifiedResult {
		if (!isNonEmptyString(token)) {
			return {
				isValid: false,
				error: 'Token must be a non-empty string!',
			};
		}

		try {
			const parts = token.split('.');
			if (parts.length !== 3) {
				return {
					isValid: false,
					error: 'Token is tampered or malformed!',
				};
			}

			const [a, b, sig] = parts;
			const signingInput = a + '.' + b;
			const expectedMac = hmacSha256(this.#secretBytes, utf8ToBytes(signingInput));
			const expectedSig = bytesToBase64(expectedMac);

			// constant-time string compare
			const ok = _constantTimeEquals(sig, expectedSig);
			if (!ok) return { isValid: false, error: 'Invalid signature!' };
			// parse payload
			const payloadBytes = base64ToBytes(b);
			const payloadStr = bytesToUtf8(payloadBytes);

			let payload: unknown;
			try {
				payload = JSON.parse(payloadStr);
			} catch {
				payload = payloadStr;
			}

			return { isValid: true, payload };
		} catch (e) {
			return {
				isValid: false,
				error: e instanceof Error ? e.message : String(e),
			};
		}
	}

	verifyOrThrow(token: string): unknown {
		const res = this.verify(token);

		if (!res.isValid) {
			throw new Error(res.error || 'Invalid token!');
		}

		return res.payload;
	}

	decodePayload(token: string): unknown | null {
		try {
			return this.decode(token).payload;
		} catch {
			return null;
		}
	}
}
