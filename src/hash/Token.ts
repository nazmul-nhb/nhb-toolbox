import { isNotEmptyObject } from '../guards/non-primitives';
import { isNonEmptyString } from '../guards/primitives';
import type { GenericObject } from '../object/types';
import { _constantTimeEquals, _stableStringify } from './helpers';
import { toMilliseconds } from './ms';
import type { TimeWithUnit } from './types';
import { base64ToBytes, bytesToBase64, bytesToUtf8, hmacSha256, utf8ToBytes } from './utils';

type VerifiedResult<T extends GenericObject = GenericObject> =
	| { isValid: true; payload: TokenPayload<T> }
	| { isValid: false; error: string };

type TokenOptions = {
	alg?: 'HS256';
	typ?: 'JWT';
	expiresIn?: TimeWithUnit | number;
};

type TokenPayload<T extends GenericObject = GenericObject> = {
	iat: number;
	exp: number | undefined;
} & { [K in keyof T]: T[K] };

type DecodedToken<T extends GenericObject = GenericObject> = {
	header: TokenOptions;
	payload: TokenPayload<T>;
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

	sign(payload: GenericObject, options?: TokenOptions): string {
		if (!isNotEmptyObject(payload)) throw new Error('Payload must be a valid object!');

		const now = Date.now();
		const updatedPayload: TokenPayload = {
			iat: now,
			exp: options?.expiresIn ? now + toMilliseconds(options?.expiresIn) : undefined,
			...payload,
		};

		const hdr: TokenOptions = { alg: 'HS256', typ: 'JWT', ...options };
		const headerJson = _stableStringify(hdr);
		const payloadJson = _stableStringify(updatedPayload);
		const headerB = utf8ToBytes(headerJson);
		const payloadB = utf8ToBytes(payloadJson);
		const signingInput = bytesToBase64(headerB) + '.' + bytesToBase64(payloadB);

		const mac = hmacSha256(this.#secretBytes, utf8ToBytes(signingInput));
		const signature = bytesToBase64(mac);
		return signingInput + '.' + signature;
	}

	decode<T extends GenericObject = GenericObject>(token: string): DecodedToken<T> {
		if (!isNonEmptyString(token)) throw new Error('Token must be a non-empty string!');

		const parts = token.split('.');
		if (parts.length !== 3) throw new Error('Token is tampered or malformed!');

		const [a, b, c] = parts;
		const headerBytes = base64ToBytes(a);
		const payloadBytes = base64ToBytes(b);
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
			signature: c,
			signingInput: a + '.' + b,
		};
	}

	verify<T extends GenericObject = GenericObject>(token: string): VerifiedResult<T> {
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

			let payload: TokenPayload<T>;
			try {
				payload = JSON.parse(payloadStr);
			} catch {
				throw new Error('Cannot parse payload!');
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

	decodePayload<T extends GenericObject = GenericObject>(token: string): TokenPayload<T> {
		return this.decode<T>(token).payload;
	}
}
