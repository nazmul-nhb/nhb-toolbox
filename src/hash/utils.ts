import { isHexString } from '../guards/specials';
import { _splitByCharLength } from './helpers';

/**
 * * Generates a random hexadecimal string of the specified length.
 *
 * @param length - Number of hex characters to generate.
 * @param uppercase - Whether to return uppercase `A–F` characters.
 *
 * @returns A randomly generated hexadecimal string.
 *
 * @example
 * // 16-character lowercase hex
 * const id = randomHex(16);
 *
 * @example
 * // 8-character uppercase hex
 * const token = randomHex(8, true);
 */
export function randomHex(length: number, uppercase = false): string {
	const genHex = () => Math.floor(Math.random() * 16).toString(16);
	const hex = Array.from({ length }, genHex).join('');

	return uppercase ? hex.toUpperCase() : hex;
}

// ! UTF-8 Utilities

/**
 * * Converts a UTF-8 string to a byte array (`Uint8Array`).
 *
 * This function encodes a JavaScript string into UTF-8 bytes, handling all Unicode code points including supplementary characters (surrogate pairs).
 *
 * @example
 * ```typescript
 * // Basic ASCII
 * const asciiBytes = utf8ToBytes('hello');
 * // Returns:
 * Uint8Array(5) [104, 101, 108, 108, 111]
 *
 * // Unicode characters
 * const unicodeBytes = utf8ToBytes('Hello পৃথিবী!');
 * // Returns:
 * Uint8Array(25) [
 *  72, 101, 108, 108, 111,  32,
 * 224, 166, 170, 224, 167, 131,
 * 224, 166, 165, 224, 166, 191,
 * 224, 166, 172, 224, 167, 128,
 *  33
 * ]
 * ```
 *
 * @param str - The input string to encode as UTF-8 bytes.
 * @returns A `Uint8Array` containing the UTF-8 encoded bytes.
 *
 * @remarks
 * - The encoding follows the UTF-8 specification:
 *   - 1-byte sequence for code points U+0000 to U+007F (ASCII)
 *   - 2-byte sequence for code points U+0080 to U+07FF
 *   - 3-byte sequence for code points U+0800 to U+FFFF
 *   - 4-byte sequence for code points U+10000 to U+10FFFF (surrogate pairs)
 *
 * **Note:** Invalid surrogate pairs in the input string are silently ignored.
 *
 * @see {@link bytesToUtf8} for the inverse operation
 */
export function utf8ToBytes(str: string): Uint8Array {
	const out: number[] = [];
	for (let i = 0; i < str.length; i++) {
		const code = str.charCodeAt(i);

		if (code < 0x80) out.push(code);
		else if (code < 0x800) {
			out.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
		} else if (code >= 0xd800 && code <= 0xdfff) {
			// surrogate pair
			if (code < 0xdc00 && i + 1 < str.length) {
				const hi = code;
				const lo = str.charCodeAt(++i);
				const codePoint = 0x10000 + ((hi - 0xd800) << 10) + (lo - 0xdc00);
				out.push(
					0xf0 | (codePoint >> 18),
					0x80 | ((codePoint >> 12) & 0x3f),
					0x80 | ((codePoint >> 6) & 0x3f),
					0x80 | (codePoint & 0x3f)
				);
			}
		} else {
			out.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
		}
	}

	return new Uint8Array(out);
}

/**
 * * Converts `UTF-8` encoded bytes back to a string.
 *
 * This function decodes a `Uint8Array` containing `UTF-8` bytes into a JavaScript string.
 *
 * @example
 * ```typescript
 * // Decode UTF-8 bytes
 * const bytes = new Uint8Array([104, 101, 108, 108, 111]);
 * const str = bytesToUtf8(bytes);
 * // Returns: 'hello'
 *
 * // Round-trip conversion
 * const original = 'Hello 🌍';
 * const bytes = utf8ToBytes(original);
 * const decoded = bytesToUtf8(bytes);
 * console.log(original === decoded); // true
 * ```
 *
 * @param bytes - A `Uint8Array` containing `UTF-8` encoded bytes.
 * @returns The decoded string.
 *
 * @remarks
 * - The function handles all valid `UTF-8` sequences:
 *   - 1-byte sequences (0xxxxxxx) → ASCII characters
 *   - 2-byte sequences (110xxxxx 10xxxxxx)
 *   - 3-byte sequences (1110xxxx 10xxxxxx 10xxxxxx)
 *   - 4-byte sequences (11110xxx 10xxxxxx 10xxxxxx 10xxxxxx) → surrogate pairs
 *
 * @see {@link utf8ToBytes} for the inverse operation
 */
export function bytesToUtf8(bytes: Uint8Array): string {
	let out = '';
	let i = 0;
	while (i < bytes.length) {
		const b1 = bytes[i++];
		if (b1 < 0x80) out += String.fromCharCode(b1);
		else if (b1 >= 0xc0 && b1 < 0xe0) {
			const b2 = bytes[i++];
			out += String.fromCharCode(((b1 & 0x1f) << 6) | (b2 & 0x3f));
		} else if (b1 >= 0xe0 && b1 < 0xf0) {
			const b2 = bytes[i++];
			const b3 = bytes[i++];
			out += String.fromCharCode(((b1 & 0x0f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f));
		} else {
			// 4-byte sequence -> surrogate pair
			const b2 = bytes[i++];
			const b3 = bytes[i++];
			const b4 = bytes[i++];
			let codePoint =
				((b1 & 0x07) << 18) | ((b2 & 0x3f) << 12) | ((b3 & 0x3f) << 6) | (b4 & 0x3f);
			codePoint -= 0x10000;
			out += String.fromCharCode(
				0xd800 + ((codePoint >> 10) & 0x3ff),
				0xdc00 + (codePoint & 0x3ff)
			);
		}
	}

	return out;
}

// ! Base64 Utilities

/**
 * * Decodes a `Base64` string to bytes.
 *   - This function converts a `Base64`-encoded string back to its original byte representation.
 *   - It handles standard `Base64` encoding with '=', '+', '/' characters.
 *
 * @example
 * ```typescript
 * // Decode Base64 string
 * const bytes = base64ToBytes('aGVsbG8gd29ybGQ=');
 * // Returns: Uint8Array(11) [104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]
 *
 * // Empty string
 * const empty = base64ToBytes('');
 * // Returns: Uint8Array(0) []
 * ```
 *
 * @param str - The `Base64`-encoded string to decode.
 * @returns A `Uint8Array` containing the decoded bytes.
 *
 * @remarks
 * - The function supports:
 *   - Standard `Base64` alphabet (A-Z, a-z, 0-9, +, /)
 *   - Padding with '=' characters
 *   - Ignores whitespace (though not explicitly trimmed in this implementation)
 *
 * @see {@link bytesToBase64} for the inverse operation
 */
export function base64ToBytes(str: string): Uint8Array {
	const _b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

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

/**
 * * Encodes bytes to a `Base64` string.
 *   - This function converts a `Uint8Array` to a `Base64`-encoded string using the standard `Base64` alphabet with padding.
 *
 * @example
 * ```typescript
 * // Encode bytes to Base64
 * const bytes = new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]);
 * const b64 = bytesToBase64(bytes);
 * // Returns: 'aGVsbG8gd29ybGQ='
 *
 * // Empty array
 * const empty = bytesToBase64(new Uint8Array(0));
 * // Returns: ''
 * ```
 *
 * @param bytes - The bytes to encode as `Base64`.
 * @returns The `Base64`-encoded string.
 *
 * @remarks
 * The encoding uses:
 * - Standard `Base64` alphabet (A-Z, a-z, 0-9, +, /)
 * - '=' padding for incomplete groups
 * - No line breaks or whitespace
 *
 * This is a pure JavaScript implementation that doesn't rely on `btoa()`.
 *
 * @see {@link base64ToBytes} for the inverse operation
 */
export function bytesToBase64(bytes: Uint8Array): string {
	const _b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

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

// ! Bytes (Uint8Array) utilities

/**
 * * Concatenates multiple `Uint8Array`s into a single `Uint8Array`.
 *   - This function efficiently combines multiple byte arrays without creating intermediate strings or arrays.
 *
 * @example
 * ```typescript
 * // Concatenate multiple arrays
 * const a = new Uint8Array([1, 2, 3]);
 * const b = new Uint8Array([4, 5]);
 * const c = new Uint8Array([6, 7, 8, 9]);
 * const result = concatBytes(a, b, c);
 * // Returns: Uint8Array(9) [1, 2, 3, 4, 5, 6, 7, 8, 9]
 *
 * // Single array
 * const single = concatBytes(new Uint8Array([1, 2, 3]));
 * // Returns: Uint8Array(3) [1, 2, 3]
 *
 * // No arrays
 * const empty = concatBytes();
 * // Returns: Uint8Array(0) []
 * ```
 *
 * @param parts - One or more `Uint8Array`s to concatenate.
 * @returns A new `Uint8Array` containing all the bytes from the input arrays in the order they were provided.
 *
 * @remarks The function allocates a single `Uint8Array` of the total combined length and copies all bytes into it using `set()` for optimal performance.
 */
export function concatBytes(...parts: Uint8Array[]): Uint8Array {
	const len = parts.reduce((s, p) => s + p.length, 0);
	const out = new Uint8Array(len);
	let offset = 0;
	for (const p of parts) {
		out.set(p, offset);
		offset += p.length;
	}
	return out;
}

// ! Bytes Hashing Utilities

/**
 * * Computes the `SHA-256` hash of raw bytes.
 *   - This is a pure JavaScript implementation of the `SHA-256` cryptographic hash function that operates directly on byte arrays (`Uint8Array`).
 *
 * @example
 * ```typescript
 * // Hash raw bytes
 * const bytes = new Uint8Array([104, 101, 108, 108, 111]); // "hello"
 * const hash = sha256Bytes(bytes);
 * // Returns: Uint8Array(32) with SHA-256 hash
 *
 * // Verify with string hash
 * const strHash = sha256('hello');
 * const bytesHash = bytesToHex(sha256Bytes(utf8ToBytes('hello')));
 * console.log(strHash === bytesHash); // true
 * ```
 *
 * @param message - The bytes to hash as a `Uint8Array`.
 * @returns A `Uint8Array` of 32 bytes (256 bits) containing the `SHA-256` hash.
 *
 * @remarks
 * - Implementation details:
 *   - Follows the `SHA-256` specification (FIPS 180-4)
 *   - Uses big-endian byte order throughout
 *   - Processes messages in 512-bit (64-byte) blocks
 *   - Applies proper padding with message length
 *   - Uses all required `SHA-256` round constants
 *   - Returns hash as 32-byte array
 *
 * @see {@link hmacSha256} for `HMAC-SHA256` computation
 */
export function sha256Bytes(message: Uint8Array): Uint8Array {
	// Initialize hash values
	const H = new Uint32Array([
		0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab,
		0x5be0cd19,
	]);

	// Round constants
	const K = new Uint32Array([
		0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4,
		0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe,
		0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f,
		0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
		0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,
		0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
		0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116,
		0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
		0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7,
		0xc67178f2,
	]);

	// Pre-processing (padding)
	const ml = message.length * 8;

	// Create padding - simpler approach
	const padding = new Uint8Array((message.length + 8 + 64) & ~63 || 64);
	padding.set(message, 0);
	padding[message.length] = 0x80;

	// Append 64-bit big-endian length at the end
	const lenView = new DataView(padding.buffer);
	lenView.setUint32(padding.length - 8, Math.floor(ml / 0x100000000), false); // high 32 bits
	lenView.setUint32(padding.length - 4, ml & 0xffffffff, false); // low 32 bits

	// Process the message in successive 512-bit chunks:
	const w = new Uint32Array(64);
	const chunkView = new DataView(padding.buffer);

	for (let offset = 0; offset < padding.length; offset += 64) {
		// prepare message schedule (convert bytes to 32-bit big-endian words)
		for (let t = 0; t < 16; t++) {
			w[t] = chunkView.getUint32(offset + t * 4, false); // big-endian read
		}

		// Extend the first 16 words into the remaining 48 words
		for (let t = 16; t < 64; t++) {
			const s0 =
				((w[t - 15] >>> 7) | (w[t - 15] << 25)) ^
				((w[t - 15] >>> 18) | (w[t - 15] << 14)) ^
				(w[t - 15] >>> 3);
			const s1 =
				((w[t - 2] >>> 17) | (w[t - 2] << 15)) ^
				((w[t - 2] >>> 19) | (w[t - 2] << 13)) ^
				(w[t - 2] >>> 10);

			w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
		}

		// Initialize working variables
		let a = H[0];
		let b = H[1];
		let c = H[2];
		let d = H[3];
		let e = H[4];
		let f = H[5];
		let g = H[6];
		let h = H[7];

		// Main compression loop
		for (let t = 0; t < 64; t++) {
			const S1 =
				((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
			const ch = (e & f) ^ (~e & g);
			const temp1 = (h + S1 + ch + K[t] + w[t]) >>> 0;
			const S0 =
				((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
			const maj = (a & b) ^ (a & c) ^ (b & c);
			const temp2 = (S0 + maj) >>> 0;

			h = g;
			g = f;
			f = e;
			e = (d + temp1) >>> 0;
			d = c;
			c = b;
			b = a;
			a = (temp1 + temp2) >>> 0;
		}

		// Add the compressed chunk to the current hash value
		H[0] = (H[0] + a) >>> 0;
		H[1] = (H[1] + b) >>> 0;
		H[2] = (H[2] + c) >>> 0;
		H[3] = (H[3] + d) >>> 0;
		H[4] = (H[4] + e) >>> 0;
		H[5] = (H[5] + f) >>> 0;
		H[6] = (H[6] + g) >>> 0;
		H[7] = (H[7] + h) >>> 0;
	}

	// Produce the final hash value (big-endian)
	const out = new Uint8Array(32);
	const outView = new DataView(out.buffer);

	for (let i = 0; i < 8; i++) {
		outView.setUint32(i * 4, H[i], false); // big-endian write
	}

	return out;
}

/**
 * * Computes `HMAC-SHA256` (Hash-based Message Authentication Code using `SHA-256`).
 *  - This function implements the `HMAC` algorithm with `SHA-256` as the underlying hash function, providing message authentication and integrity verification.
 *
 * @example
 * ```typescript
 * // Basic HMAC calculation
 * const key = new TextEncoder().encode('secret-key');
 * const message = new TextEncoder().encode('Hello, world!');
 * const hmac = hmacSha256(key, message);
 *
 * // Using with string inputs
 * const keyBytes = new TextEncoder().encode('my-key');
 * const msgBytes = new TextEncoder().encode('data to authenticate');
 * const hmacResult = hmacSha256(keyBytes, msgBytes);
 * const hexResult = bytesToHex(hmacResult);
 * ```
 *
 * @param key - The secret key as a `Uint8Array`.
 * @param message - The message to authenticate as a `Uint8Array`.
 * @returns A `Uint8Array` of 32 bytes containing the `HMAC-SHA256` tag.
 *
 * @remarks
 * - Algorithm steps:
 *   - 1. Keys longer than 64 bytes are hashed with `SHA-256`
 *   - 2. Keys shorter than 64 bytes are padded with zeros
 *   - 3. Inner hash: `SHA-256((key ⊕ ipad) || message)` where ipad = 0x36 repeated
 *   - 4. Outer hash: `SHA-256((key ⊕ opad) || inner_hash)` where opad = 0x5C repeated
 *
 * - The implementation follows RFC 2104 and RFC 4231 specifications.
 * - Block size for `SHA-256` HMAC is 64 bytes (512 bits).
 *
 * **Common use cases:**
 * - API authentication tokens
 * - Message integrity verification
 * - Key derivation (as part of `HKDF`)
 *
 * @see {@link sha256Bytes} for the underlying hash function
 */
export function hmacSha256(key: Uint8Array, message: Uint8Array): Uint8Array {
	const blockSize = 64; // bytes
	let k = key;
	if (k.length > blockSize) {
		k = sha256Bytes(k);
	}
	if (k.length < blockSize) {
		const tmp = new Uint8Array(blockSize);
		tmp.set(k, 0);
		k = tmp;
	}
	const oKeyPad = new Uint8Array(blockSize);
	const iKeyPad = new Uint8Array(blockSize);
	for (let i = 0; i < blockSize; i++) {
		oKeyPad[i] = k[i] ^ 0x5c;
		iKeyPad[i] = k[i] ^ 0x36;
	}
	const inner = new Uint8Array(iKeyPad.length + message.length);
	inner.set(iKeyPad, 0);
	inner.set(message, iKeyPad.length);
	const innerHash = sha256Bytes(inner);
	const outer = new Uint8Array(oKeyPad.length + innerHash.length);
	outer.set(oKeyPad, 0);
	outer.set(innerHash, oKeyPad.length);
	return sha256Bytes(outer);
}

/**
 * * Converts a `Uint8Array` to a `Uint32Array` with big-endian byte order.
 *   - This function groups bytes into 32-bit integers, reading them in big-endian (most significant byte first) order. Missing bytes are treated as zero.
 *
 * @example
 * ```typescript
 * // Convert bytes to 32-bit integers
 * const bytes = new Uint8Array([0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC]);
 * const words = uint8To32ArrayBE(bytes);
 * // Returns: Uint32Array(2) [0x12345678, 0x9ABC0000] or equivalent: Uint32Array(2) [ 305419896, 2596012032 ]
 *
 * // Partial final word
 * const partial = new Uint8Array([0xFF, 0xEE, 0xDD]);
 * const words2 = uint8To32ArrayBE(partial);
 * // Returns: Uint32Array(1) [0xFFEEDD00] or equivalent: Uint32Array(1) [ 4293844224 ]
 * ```
 *
 * @param bytes - The bytes to convert to 32-bit words.
 * @returns A `Uint32Array` containing the 32-bit big-endian words.
 *
 * @remarks
 * - Input length doesn't need to be a multiple of 4
 * - Missing bytes in the final word are padded with zeros
 * - Byte order: `bytes[0]` is the most significant byte of `out[0]`
 * - This is useful for cryptographic operations that work with 32-bit words
 */
export function uint8To32ArrayBE(bytes: Uint8Array): Uint32Array {
	const len = Math.ceil(bytes.length / 4);
	const out = new Uint32Array(len);

	for (let i = 0; i < len; i++) {
		const base = i * 4;
		out[i] =
			((bytes[base] || 0) << 24) |
			((bytes[base + 1] || 0) << 16) |
			((bytes[base + 2] || 0) << 8) |
			((bytes[base + 3] || 0) << 0);
	}

	return out;
}

/**
 * * Converts a 32-bit integer into a 4-byte `Uint8Array` in big-endian (network) byte order.
 *   - This function takes a 32-bit integer and encodes it as 4 bytes with the most significant byte first (big-endian order), which is the standard for network protocols and many cryptographic operations.
 *
 * @example
 * ```typescript
 * // Convert integer to bytes
 * const bytes = intTo4BytesBE(0x12345678);
 * // Returns: Uint8Array(4) [0x12, 0x34, 0x56, 0x78] or equivalent: Uint8Array(4) [ 18, 52, 86, 120 ]
 *
 * // Maximum 32-bit value
 * const maxBytes = intTo4BytesBE(0xFFFFFFFF);
 * // Returns: Uint8Array(4) [0xFF, 0xFF, 0xFF, 0xFF]
 *
 * // Zero
 * const zeroBytes = intTo4BytesBE(0);
 * // Returns: Uint8Array(4) [0x00, 0x00, 0x00, 0x00]
 * ```
 *
 * @param n - The 32-bit integer to convert. Values beyond 32 bits will be truncated.
 * @returns A 4-byte `Uint8Array` representing the value in big-endian format.
 *
 * @remarks
 * - The function uses unsigned 32-bit arithmetic (`>>>` operator)
 * - Only the lower 32 bits of the input are used (truncation)
 * - Output is always exactly 4 bytes
 * - Big-endian order: byte[0] = most significant, byte[3] = least significant
 *
 * **Common use cases:**
 * - Encoding message lengths in network protocols
 * - Preparing data for cryptographic operations
 * - Converting integers for storage or transmission
 *
 * @see {@link uint8To32ArrayBE} for bytes to 32-bit integers conversion
 */
export function intTo4BytesBE(n: number): Uint8Array {
	const b = new Uint8Array(4);
	b[0] = (n >>> 24) & 0xff;
	b[1] = (n >>> 16) & 0xff;
	b[2] = (n >>> 8) & 0xff;
	b[3] = n & 0xff;
	return b;
}

/**
 * * Converts a `Uint8Array` to a lowercase hexadecimal string.
 *   - This function encodes binary data (bytes) as a hexadecimal string, with each byte represented as two lowercase hexadecimal digits (0-9, a-f).
 *
 * @example
 * ```typescript
 * // Convert bytes to hex
 * const bytes = new Uint8Array([0x12, 0xAB, 0xFF, 0x00]);
 * const hex = bytesToHex(bytes);
 * // Returns: '12abff00'
 *
 * // Empty array
 * const emptyHex = bytesToHex(new Uint8Array(0));
 * // Returns: ''
 *
 * // SHA-256 hash to hex
 * const hashBytes = sha256Bytes(utf8ToBytes('hello'));
 * const hashHex = bytesToHex(hashBytes);
 * // Returns: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
 * ```
 *
 * @param bytes - The bytes to convert to hexadecimal representation.
 * @returns A lowercase hexadecimal string where each byte is represented by two characters (00-ff).
 *
 * @remarks
 * - Always returns lowercase letters (a-f)
 * - Zero pads single-digit hex values (e.g., 0x0F → "0f", not "f")
 * - Efficient O(n) implementation using string concatenation
 * - No prefix (e.g., no "0x" at the beginning)
 *
 * **Common use cases:**
 * - Displaying cryptographic hashes and signatures
 * - Debugging binary data
 * - Converting binary data for JSON serialization
 * - Creating hex-encoded strings for APIs and protocols
 *
 * @see {@link hexToBytes} for reverse process
 */
export function bytesToHex(bytes: Uint8Array): string {
	let hex = '';
	for (let i = 0; i < bytes.length; i++) {
		const byte = bytes[i].toString(16).padStart(2, '0');
		hex += byte;
	}
	return hex;
}

/**
 * * Converts a hexadecimal string to a `Uint8Array`.
 *   - This function decodes a hexadecimal-encoded string into its raw byte representation, where every two hexadecimal characters (00–ff) are converted into one byte.
 *
 * @example
 * ```ts
 * // Convert hex to bytes
 * const hex = '12abff00';
 * const bytes = hexToBytes(hex);
 * // Returns: Uint8Array(4) [18, 171, 255, 0]
 *
 * // Empty string
 * const emptyBytes = hexToBytes('');
 * // Returns: Uint8Array []
 *
 * // Decode SHA-256 hash from hex
 * const hashHex = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';
 * const hashBytes = hexToBytes(hashHex);
 * // Returns: Uint8Array(32)
 * ```
 *
 * @param hex - A hexadecimal string where each byte is represented by two characters (00–ff).
 * @returns A `Uint8Array` containing the decoded bytes. Returns an empty array for invalid input.
 *
 * @remarks
 * - Accepts lowercase and uppercase hexadecimal characters (0–9, a–f, A–F) with or without space between bytes
 * - Ignores no prefixes (e.g., does not support "0x")
 * - Requires an even number of hexadecimal characters
 * - Efficient O(n) implementation with direct byte parsing
 *
 * **Common use cases:**
 * - Decoding cryptographic hashes and signatures
 * - Parsing hex-encoded binary payloads
 * - Reconstructing binary data from storage or transport formats
 * - Working with low-level protocols and binary APIs
 *
 * @see {@link bytesToHex} for the reverse process
 */
export function hexToBytes(hex: string): Uint8Array {
	if (!isHexString(hex)) return new Uint8Array();

	const bytes = _splitByCharLength(hex, 2).map((h) => parseInt(h, 16));

	return new Uint8Array(bytes);
}
