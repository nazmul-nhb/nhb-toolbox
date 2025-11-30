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
