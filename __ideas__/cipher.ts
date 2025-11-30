/**
 * Cipher — pure-JS symmetric cipher with HMAC authentication.
 *
 * - Engine-agnostic: no `crypto` / `subtleCrypto` / `TextEncoder` / `btoa` required.
 * - Uses HMAC-SHA256 (pure JS) for key derivation, MAC, and keystream (HMAC-DRBG style).
 * - Output format: base64( iv (16 bytes) || ciphertext || tag (32 bytes) )
 *
 * Caveat: IV entropy uses Date.now() + Math.random() when secure RNG isn't available.
 * For production, use platform crypto RNG for IV.
 */

import { bytesToUtf8, utf8ToBytes } from '../src/hash/helpers';
import { hmacSha256, sha256Bytes } from './tiny-crypto';

/* ------------------ Base64 (pure JS) ------------------ */

const _b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

export function base64Encode(bytes: Uint8Array): string {
	let out = '';
	let i = 0;
	while (i < bytes.length) {
		const o1 = bytes[i++];
		const o2 = bytes[i++];
		const o3 = bytes[i++];
		const h1 = o1 >> 2;
		const h2 = ((o1 & 3) << 4) | (o2 >> 4);
		const h3 = ((o2 & 15) << 2) | (o3 >> 6);
		const h4 = o3 & 63;
		out +=
			_b64chars[h1] +
			_b64chars[h2] +
			_b64chars[isNaN(o2) ? 64 : h3] +
			_b64chars[isNaN(o3) ? 64 : h4];
	}
	return out;
}

export function base64Decode(str: string): Uint8Array {
	const out: number[] = [];
	let i = 0;
	while (i < str.length) {
		const h1 = _b64chars.indexOf(str[i++]);
		const h2 = _b64chars.indexOf(str[i++]);
		const h3 = _b64chars.indexOf(str[i++]);
		const h4 = _b64chars.indexOf(str[i++]);
		const o1 = (h1 << 2) | (h2 >> 4);
		const o2 = ((h2 & 15) << 4) | (h3 >> 2);
		const o3 = ((h3 & 3) << 6) | h4;
		out.push(o1);
		if (h3 !== 64) out.push(o2);
		if (h4 !== 64) out.push(o3);
	}
	return new Uint8Array(out);
}

/* ------------------ small helpers ------------------ */

function concatBytes(...parts: Uint8Array[]): Uint8Array {
	const len = parts.reduce((s, p) => s + p.length, 0);
	const out = new Uint8Array(len);
	let offset = 0;
	for (const p of parts) {
		out.set(p, offset);
		offset += p.length;
	}
	return out;
}

function intTo4BytesBE(n: number): Uint8Array {
	const b = new Uint8Array(4);
	b[0] = (n >>> 24) & 0xff;
	b[1] = (n >>> 16) & 0xff;
	b[2] = (n >>> 8) & 0xff;
	b[3] = n & 0xff;
	return b;
}

function constantTimeEquals(a: Uint8Array, b: Uint8Array): boolean {
	if (a.length !== b.length) return false;
	let res = 0;
	for (let i = 0; i < a.length; i++) res |= a[i] ^ b[i];
	return res === 0;
}

/* ------------------ Cipher Class ------------------ */

export class Cipher {
	#secretBytes: Uint8Array;
	#encKey: Uint8Array; // 32 bytes
	#macKey: Uint8Array; // 32 bytes

	/**
	 * id: 20001
	 * title: constructor
	 * function signature: constructor(secret: string)
	 * parameters:
	 *  - secret: secret passphrase used to derive encryption and MAC keys
	 * return value: Cipher instance
	 * example usage:
	 *  const sc = new Cipher('my-secret');
	 * notes:
	 *  - Derives two internal keys (enc, mac) via HMAC-SHA256(secret, 'enc'|'mac').
	 *  - secret is stored only as bytes in memory.
	 * aliases: new Cipher(secret)
	 * conclusion: Use instance to encrypt/decrypt without passing secret again.
	 */
	constructor(secret: string) {
		if (typeof secret !== 'string' || secret.length === 0)
			throw new Error('secret must be non-empty string');
		this.#secretBytes = utf8ToBytes(secret);
		// derive enc and mac keys
		this.#encKey = hmacSha256(this.#secretBytes, utf8ToBytes('enc'));
		this.#macKey = hmacSha256(this.#secretBytes, utf8ToBytes('mac'));
	}

	/**
	 * id: 20002
	 * title: encrypt
	 * function signature: encrypt(plaintext: string) => string
	 * parameters:
	 *  - plaintext: string to encrypt
	 * return value: base64 string containing iv||ciphertext||tag
	 * example usage:
	 *  const token = cipher.encrypt('hello');
	 * notes:
	 *  - Generates a 16-byte IV (Date.now()+Math.random() hashed). For stronger randomness, provide a secure RNG.
	 *  - Generates keystream blocks using HMAC(encKey, iv || counter).
	 *  - Produces a 32-byte HMAC tag over iv||ciphertext using macKey.
	 * aliases: seal, encode
	 * conclusion: returns Base64 blob that decrypt() can reverse (only with same secret).
	 */
	encrypt(plaintext: string): string {
		const pt = utf8ToBytes(plaintext);
		// IV: 16 bytes derived from time + Math.random (use crypto RNG if available)
		const seed = utf8ToBytes(String(Date.now()) + '-' + String(Math.random()));
		const ivFull = sha256Bytes(seed);
		const iv = ivFull.subarray(0, 16); // 16 byte IV

		// keystream generation (HMAC-DRBG style): produce ceil(pt.length / 32) blocks
		const blocks = Math.ceil(pt.length / 32);
		const keystreamParts: Uint8Array[] = [];
		for (let counter = 0; counter < blocks; counter++) {
			const msg = concatBytes(iv, intTo4BytesBE(counter));
			const block = hmacSha256(this.#encKey, msg); // 32 bytes
			keystreamParts.push(block);
		}
		const keystream = concatBytes(...keystreamParts).subarray(0, pt.length);

		// XOR produce ciphertext
		const ct = new Uint8Array(pt.length);
		for (let i = 0; i < pt.length; i++) ct[i] = pt[i] ^ keystream[i];

		// tag = HMAC(macKey, iv || ciphertext)
		const tag = hmacSha256(this.#macKey, concatBytes(iv, ct)); // 32 bytes

		const blob = concatBytes(iv, ct, tag);
		return base64Encode(blob);
	}

	/**
	 * id: 20003
	 * title: decrypt
	 * function signature: decrypt(token: string) => string
	 * parameters:
	 *  - token: base64 string produced by encrypt
	 * return value: decrypted plaintext string
	 * example usage:
	 *  const pt = cipher.decrypt(token);
	 * notes:
	 *  - Verifies tag before decrypting. Throws on tampering or wrong secret.
	 *  - Throws descriptive errors on malformed input.
	 * aliases: open, decode
	 * conclusion: returns plaintext string when tag passes.
	 */
	decrypt(token: string): string {
		if (typeof token !== 'string') throw new Error('token must be a base64 string');
		const blob = base64Decode(token);
		if (blob.length < 16 + 32) throw new Error('malformed token');

		const iv = blob.subarray(0, 16);
		const tag = blob.subarray(blob.length - 32);
		const ct = blob.subarray(16, blob.length - 32);

		// verify tag
		const expectedTag = hmacSha256(this.#macKey, concatBytes(iv, ct));
		if (!constantTimeEquals(expectedTag, tag))
			throw new Error('authentication failed (tampered or wrong key)');

		// regenerate keystream
		const blocks = Math.ceil(ct.length / 32);
		const keystreamParts: Uint8Array[] = [];
		for (let counter = 0; counter < blocks; counter++) {
			const msg = concatBytes(iv, intTo4BytesBE(counter));
			const block = hmacSha256(this.#encKey, msg);
			keystreamParts.push(block);
		}
		const keystream = concatBytes(...keystreamParts).subarray(0, ct.length);

		// XOR to recover plaintext
		const pt = new Uint8Array(ct.length);
		for (let i = 0; i < ct.length; i++) pt[i] = ct[i] ^ keystream[i];

		return bytesToUtf8(pt);
	}
}
