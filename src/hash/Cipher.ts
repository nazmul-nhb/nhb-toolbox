import { isNonEmptyString } from '../guards/primitives';
import { isBase64 } from '../guards/specials';
import { _constantTimeEquals } from './helpers';
import {
	base64ToBytes,
	bytesToBase64,
	bytesToUtf8,
	concatBytes,
	hmacSha256,
	intTo4BytesBE,
	sha256Bytes,
	utf8ToBytes,
} from './utils';

/**
 * @class Lightweight stream-cipher–style encryption utility using `HMAC-SHA256` for keystream generation and authentication.
 *      - The class derives separate encryption and MAC keys from the provided secret.
 *
 * @remarks
 * - **The encryption scheme is:**
 *   - keystream = `HMAC(encKey, iv || counter)`
 *   - ciphertext = `plaintext XOR keystream`
 *   - tag = `HMAC(macKey, iv || ciphertext)`
 * - This is a custom construction and should not be used for production-grade cryptographic security.
 * - `Cipher` class is a pure JS implementation. It does not rely on `crypto` or Web APIs.
 */
export class Cipher {
	#secretBytes: Uint8Array;
	#encKey: Uint8Array; // 32 bytes
	#macKey: Uint8Array; // 32 bytes

	/**
	 * * Creates a new `Cipher` instance using the provided secret.
	 *
	 * @param secret - The secret string used to derive encryption and MAC keys.
	 * 				   Must be a non-empty string.
	 */
	constructor(secret: string) {
		if (!isNonEmptyString(secret)) {
			throw new Error('Secret must be non-empty string!');
		}

		this.#secretBytes = utf8ToBytes(secret);
		// derive enc and mac keys
		this.#encKey = hmacSha256(this.#secretBytes, utf8ToBytes('enc'));
		this.#macKey = hmacSha256(this.#secretBytes, utf8ToBytes('mac'));
	}

	/**
	 * Generates a keystream of the same length as the provided data using a `HMAC`-based counter mode.
	 * The keystream is deterministic from the encryption key and IV.
	 *
	 * @param target - The byte array whose length determines the keystream size.
	 * @param iv - The initialization vector used as input to the `HMAC`.
	 * @returns A byte array representing the generated keystream.
	 */
	#genKeystream(target: Uint8Array, iv: Uint8Array): Uint8Array {
		const blocks = Math.ceil(target.length / 32);
		const keystreamParts: Uint8Array[] = [];

		for (let counter = 0; counter < blocks; counter++) {
			keystreamParts.push(
				hmacSha256(this.#encKey, concatBytes(iv, intTo4BytesBE(counter)))
			);
		}

		return concatBytes(...keystreamParts).subarray(0, target.length);
	}

	/**
	 * * Encrypts a UTF-8 string.
	 *   - The output format is: `base64( iv || ciphertext || tag )`
	 *
	 * @param text - The plaintext string to encrypt.
	 * @returns A base64-encoded encrypted token.
	 */
	encrypt(text: string): string {
		const plain = utf8ToBytes(text);
		const seed = utf8ToBytes(String(Date.now()) + '-' + String(Math.random()));
		const ivFull = sha256Bytes(seed);
		const iv = ivFull.subarray(0, 16); // 16 byte IV

		const keystream = this.#genKeystream(plain, iv);

		// XOR produce ciphertext
		const ct = new Uint8Array(plain.length);
		for (let i = 0; i < plain.length; i++) ct[i] = plain[i] ^ keystream[i];

		// tag = HMAC(macKey, iv || ciphertext)
		const tag = hmacSha256(this.#macKey, concatBytes(iv, ct)); // 32 bytes

		const blob = concatBytes(iv, ct, tag);
		return bytesToBase64(blob);
	}

	/**
	 * * Checks if a token is structurally valid and contains a matching MAC using the same secret.
	 *
	 * @param token - The base64-encoded encrypted blob to validate.
	 * @returns `true` if the MAC is valid, `false` otherwise.
	 */
	isValid(token: string): boolean {
		if (!isBase64(token)) return false;

		const blob = base64ToBytes(token);

		if (blob.length < 48) return false;

		const iv = blob.subarray(0, 16);
		const tag = blob.subarray(blob.length - 32);
		const ct = blob.subarray(16, blob.length - 32);

		const expectedTag = hmacSha256(this.#macKey, concatBytes(iv, ct));

		return _constantTimeEquals(expectedTag, tag);
	}

	/**
	 * * Decrypts a previously encrypted token.
	 *   - Throws an error if the tag does not match or the token is malformed.
	 *
	 * @param token - The base64-encoded token produced by `encrypt`.
	 * @returns The decrypted plaintext string.
	 */
	decrypt(token: string): string {
		if (!isBase64(token)) throw new Error('Token must be a base64 string!');

		const blob = base64ToBytes(token);

		if (blob.length < 48) throw new Error('Malformed or tampered token!');

		const iv = blob.subarray(0, 16);
		const tag = blob.subarray(blob.length - 32);
		const ct = blob.subarray(16, blob.length - 32);

		const expectedTag = hmacSha256(this.#macKey, concatBytes(iv, ct));
		if (!_constantTimeEquals(expectedTag, tag)) {
			throw new Error('Key in the token is tampered or invalid!)');
		}

		// regenerate keystream
		const keystream = this.#genKeystream(ct, iv);

		// XOR to recover plaintext
		const pt = new Uint8Array(ct.length);
		for (let i = 0; i < ct.length; i++) pt[i] = ct[i] ^ keystream[i];

		return bytesToUtf8(pt);
	}
}
