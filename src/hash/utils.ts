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

/** Convert string to UTF-8 bytes */
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

/** Convert UTF-8 bytes to string */
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

/**
 * * Converts a 32-bit integer into a 4-byte `Uint8Array` in Big-Endian order.
 *
 * @param n - The integer to convert.
 * @returns A 4-byte `Uint8Array` representing the value in Big-Endian format.
 */
export function intTo4BytesBE(n: number): Uint8Array {
	const b = new Uint8Array(4);
	b[0] = (n >>> 24) & 0xff;
	b[1] = (n >>> 16) & 0xff;
	b[2] = (n >>> 8) & 0xff;
	b[3] = n & 0xff;
	return b;
}

export function unit8To32ArrayBE(bytes: Uint8Array): Uint32Array {
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

export function sha256Bytes(message: Uint8Array): Uint8Array {
	// Initialize hash values:
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
	const withOne = new Uint8Array(message.length + 1);
	withOne.set(message, 0);
	withOne[message.length] = 0x80;

	// length of padding: append zeros until last 64 bits for message length
	const padLen = ((64 - ((withOne.length + 8) % 64)) % 64) + withOne.length + 8;
	const padded = new Uint8Array(padLen);
	padded.set(withOne, 0);
	// append 64-bit big-endian length
	for (let i = 0; i < 8; i++) {
		padded[padded.length - 1 - i] = (ml >>> (i * 8)) & 0xff;
	}

	// Process the message in successive 512-bit chunks:
	const w = new Uint32Array(64);
	for (let offset = 0; offset < padded.length; offset += 64) {
		// prepare message schedule
		for (let t = 0; t < 16; t++) {
			const i = offset + t * 4;
			w[t] =
				(padded[i] << 24) |
				(padded[i + 1] << 16) |
				(padded[i + 2] << 8) |
				(padded[i + 3] << 0);
		}
		for (let t = 16; t < 64; t++) {
			const s0 =
				((w[t - 15] >>> 7) | (w[t - 15] << (32 - 7))) ^
				((w[t - 15] >>> 18) | (w[t - 15] << (32 - 18))) ^
				(w[t - 15] >>> 3);
			const s1 =
				((w[t - 2] >>> 17) | (w[t - 2] << (32 - 17))) ^
				((w[t - 2] >>> 19) | (w[t - 2] << (32 - 19))) ^
				(w[t - 2] >>> 10);
			w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
		}

		// initialize working variables
		let a = H[0] | 0;
		let b = H[1] | 0;
		let c = H[2] | 0;
		let d = H[3] | 0;
		let e = H[4] | 0;
		let f = H[5] | 0;
		let g = H[6] | 0;
		let h = H[7] | 0;

		for (let t = 0; t < 64; t++) {
			const S1 =
				((e >>> 6) | (e << (32 - 6))) ^
				((e >>> 11) | (e << (32 - 11))) ^
				((e >>> 25) | (e << (32 - 25)));
			const ch = (e & f) ^ (~e & g);
			const temp1 = (h + S1 + ch + K[t] + w[t]) >>> 0;
			const S0 =
				((a >>> 2) | (a << (32 - 2))) ^
				((a >>> 13) | (a << (32 - 13))) ^
				((a >>> 22) | (a << (32 - 22)));
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

		H[0] = (H[0] + a) >>> 0;
		H[1] = (H[1] + b) >>> 0;
		H[2] = (H[2] + c) >>> 0;
		H[3] = (H[3] + d) >>> 0;
		H[4] = (H[4] + e) >>> 0;
		H[5] = (H[5] + f) >>> 0;
		H[6] = (H[6] + g) >>> 0;
		H[7] = (H[7] + h) >>> 0;
	}

	// produce the final hash value (big-endian)
	const out = new Uint8Array(32);
	for (let i = 0; i < 8; i++) {
		out[i * 4 + 0] = (H[i] >>> 24) & 0xff;
		out[i * 4 + 1] = (H[i] >>> 16) & 0xff;
		out[i * 4 + 2] = (H[i] >>> 8) & 0xff;
		out[i * 4 + 3] = (H[i] >>> 0) & 0xff;
	}
	return out;
}

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
