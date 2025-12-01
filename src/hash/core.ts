import { _md5cycle, _numToHex, _stringToNumbers } from './helpers';
import { bytesToHex, sha256Bytes, utf8ToBytes } from './utils';

/**
 * * Computes the `MD5` digest of the given string using a pure JavaScript implementation.
 *
 * @remarks
 * - Pure JavaScript implementation — runs on any JS engine. Does not rely on `crypto` or **Web APIs** or other external libraries.
 * - Highly inspired by the algorithm used in {@link https://github.com/eustatos/pure-md5.git pure-md5} package.
 *
 * @param str - Input text to hash.
 *
 * @returns The `MD5` hash as a 32-character hex string.
 *
 * @example
 * const hash = md5("hello");
 * // → "5d41402abc4b2a76b9719d911017c592" *
 *
 * @example
 * // Used inside UUID v3
 * const digest = md5(namespace + name);
 */

export function md5(str: string): string {
	const state = [1732584193, -271733879, -1732584194, 271733878];

	const len = str.length;

	let i: number;

	for (i = 64; i <= len; i += 64) {
		_md5cycle(state, _stringToNumbers(str.substring(i - 64, i)));
	}

	const $str = str.substring(i - 64);

	const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	for (i = 0; i < $str.length; i++) {
		tail[i >> 2] |= $str.charCodeAt(i) << (i % 4 << 3);
	}

	tail[i >> 2] |= 0x80 << (i % 4 << 3);

	if (i > 55) {
		_md5cycle(state, tail);
		for (let j = 0; j < 16; j++) {
			tail[j] = 0;
		}
	}

	tail[14] = len * 8;

	_md5cycle(state, tail);

	return state.map(_numToHex).join('');
}

/**
 * * Computes the `SHA-1` digest of the given string using a pure JavaScript implementation.
 *
 * @remarks Pure JavaScript implementation — runs on any JS engine. Does not rely on `crypto` or **Web APIs** or other external libraries.
 *
 * @param msg - Input text to hash.
 *
 * @returns The `SHA-1` hash as a 40-character hex string.
 *
 * @example
 * const hash = sha1("hello");
 * // → "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d"
 *
 * @example
 * // Used inside UUID v5
 * const digest = sha1(namespace + name);
 */
export function sha1(msg: string): string {
	const K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];

	const utf8 = utf8ToBytes(msg);

	const rotl = (n: number, bits: number) => (n << bits) | (n >>> (32 - bits));
	const toHex = (n: number) => (n >>> 0).toString(16).padStart(8, '0');

	// Pre-processing
	const len = utf8.length;
	const padBytes = (len + 9) % 64 ? 64 - ((len + 9) % 64) : 0;
	const total = len + 1 + padBytes + 8; // message + 0x80 + zeros + 64-bit length
	const words = new Uint32Array(total >>> 2);

	for (let i = 0; i < utf8.length; i++) {
		words[i >> 2] |= utf8[i] << (24 - (i % 4) * 8);
	}
	words[utf8.length >> 2] |= 0x80 << (24 - (utf8.length % 4) * 8);
	words[words.length - 1] = utf8.length * 8;

	const h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

	const W = new Uint32Array(80);

	for (let i = 0; i < words.length; i += 16) {
		for (let j = 0; j < 16; j++) W[j] = words[i + j] | 0;

		for (let j = 16; j < 80; j++) {
			W[j] = rotl(W[j - 3] ^ W[j - 8] ^ W[j - 14] ^ W[j - 16], 1);
		}

		let a = h[0],
			b = h[1],
			c = h[2],
			d = h[3],
			e = h[4];

		for (let j = 0; j < 80; j++) {
			let f: number, k: number;

			if (j < 20) {
				f = (b & c) | (~b & d);
				k = K[0];
			} else if (j < 40) {
				f = b ^ c ^ d;
				k = K[1];
			} else if (j < 60) {
				f = (b & c) | (b & d) | (c & d);
				k = K[2];
			} else {
				f = b ^ c ^ d;
				k = K[3];
			}

			const temp = (rotl(a, 5) + f + e + k + W[j]) | 0;

			e = d;
			d = c;
			c = rotl(b, 30);
			b = a;
			a = temp;
		}

		h[0] = (h[0] + a) | 0;
		h[1] = (h[1] + b) | 0;
		h[2] = (h[2] + c) | 0;
		h[3] = (h[3] + d) | 0;
		h[4] = (h[4] + e) | 0;
	}

	return h.map(toHex).join('');
}

/**
 * * Computes the `SHA-256` hash of a UTF-8 string and returns it as a lowercase hexadecimal string.
 *
 * @param msg - The input string to hash. Can contain any UTF-8 characters.
 * @returns A 64-character lowercase hexadecimal string representing the `SHA-256` hash.
 *
 * @remarks Pure JavaScript implementation — runs on any JS engine. Does not rely on `crypto` or **Web APIs** or other external libraries.
 *
 * @example
 * ```typescript
 * // Basic usage
 * const hash = sha256('hello');
 * // Returns: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
 *
 * // Empty string
 * const emptyHash = sha256('');
 * // Returns: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
 *
 * // Unicode string
 * const unicodeHash = sha256('Hello পৃথিবী!');
 * // Returns: '7037e204b825b83553ba336a6ec35b796d505599286ae864729ed6cb33ae9fe1'
 * ```
 *
 * @see {@link sha256Bytes} for hashing raw bytes
 * @see {@link utf8ToBytes} for converting string to UTF-8 bytes
 * @see {@link bytesToHex} for converting bytes to a hexadecimal string
 */
export function sha256(msg: string): string {
	return bytesToHex(sha256Bytes(utf8ToBytes(msg)));
}
