import { isUUID } from '../guards/specials';
import { _formatUUID, _isV3OrV5, _runMd5Rounds } from './helpers';
import type { DecodedUUID, UUIDOptions, UUIDVersion } from './types';

/** Generate a random string of given length (hex) */
export function randomHexString(length: number): string {
	return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

/** Simple pure JS MD5 implementation (for v3 UUID) */
export function md5(str: string): string {
	// Initial hash values
	const h = [1732584193, -271733879, -1732584194, 271733878];

	// Text → bytes
	const bytes = Array.from(new TextEncoder().encode(str));

	// Padding (MD5 spec)
	const n = ((bytes.length + 8) >> 6) + 1;
	const words = new Array(n * 16).fill(0);

	bytes.forEach((b, i) => {
		words[i >> 2] |= b << ((i % 4) * 8);
	});

	words[bytes.length >> 2] |= 0x80 << ((bytes.length % 4) * 8);
	words[n * 16 - 2] = bytes.length * 8;

	// Process 512-bit blocks
	for (let i = 0; i < words.length; i += 16) {
		_runMd5Rounds(words.slice(i, i + 16), h);
	}

	// Final: convert to hex
	return h.map((n) => (n >>> 0).toString(16).padStart(8, '0')).join('');
}

/** Pure JS SHA-1 implementation — correct 80-word message schedule */
export function sha1(msg: string): string {
	const utf8 = new TextEncoder().encode(msg);

	const K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];

	const rotl = (n: number, bits: number) => (n << bits) | (n >>> (32 - bits));
	const toHex = (n: number) => (n >>> 0).toString(16).padStart(8, '0');

	// Pre-processing
	const words = new Uint32Array(((utf8.length + 8) >> 2) + 2);
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
 * * Generate UUID (`v1`, `v3`, `v4`, `v5`, `v6` and `v7`). Default generated UUID is `v4`.
 *   - `v1`: Timestamp-based (with randomness)
 *   - `v3`: MD5 namespace-based
 *   - `v4`: Pure random
 *   - `v5`: SHA-1 namespace-based
 *   - `v6`, v7: timestamp-first versions
 *
 * @param options Optional config for `v3`/`v5` and formatting
 */
export function uuid<V extends UUIDVersion = 'v4'>(options?: UUIDOptions<V>): string {
	const { version = 'v4', uppercase = false } = options || {};

	switch (version) {
		case 'v1': {
			const ts = Date.now().toString(16).padStart(12, '0');
			const rand = randomHexString(20);
			return _formatUUID(ts + rand, 1, uppercase);
		}
		case 'v3': {
			if (_isV3OrV5(options)) {
				const hash = md5(options.namespace + options.name);
				return _formatUUID(hash, 3, uppercase);
			}
			throw new Error('v3 requires namespace and name');
		}
		case 'v4': {
			const rand = randomHexString(32);
			return _formatUUID(rand, 4, uppercase);
		}
		case 'v5': {
			if (_isV3OrV5(options)) {
				const hash = sha1(options.namespace + options.name).slice(0, 32);
				return _formatUUID(hash, 5, uppercase);
			}
			throw new Error('v5 requires namespace and name');
		}
		case 'v6': {
			const ts = Date.now().toString(16).padStart(12, '0');
			const rand = randomHexString(20);
			return _formatUUID(ts + rand, 6, uppercase);
		}
		case 'v7': {
			const ts = Date.now().toString(16).padStart(12, '0');
			const rand = randomHexString(20);
			return _formatUUID(ts + rand, 7, uppercase);
		}
		default:
			throw new RangeError('Unsupported UUID version!');
	}
}

/**
 * Decode a UUID string into its components (v1–v7)
 * @param uuid - UUID string to decode
 */
export function decodeUUID(uuid: string): DecodedUUID | null {
	if (!isUUID(uuid)) return null;

	const parts = uuid.split('-');
	const version = parseInt(parts[2][0], 16) as DecodedUUID['version'];
	const variantNibble = parseInt(parts[3][0], 16);

	let variant: DecodedUUID['variant'] = 'RFC4122';

	if ((variantNibble & 0b1000) === 0) variant = 'NCS';
	else if ((variantNibble & 0b1100) === 0b1000) variant = 'RFC4122';
	else if ((variantNibble & 0b1110) === 0b1100) variant = 'Microsoft';
	else variant = 'Future';

	const decoded: DecodedUUID = { version, variant, raw: uuid };

	if (version === 1 || version === 6) {
		// Timestamp
		const timeHex = parts[0] + parts[1] + parts[2].slice(1); // 60-bit timestamp
		const timeInt = parseInt(timeHex, 16);
		decoded.timestamp = timeInt; // raw value; can convert to ms with proper UUID epoch
		if (version === 1) {
			decoded.clockSeq = parseInt(parts[3].slice(1), 16);
			decoded.node = parts[4];
		}
	}

	return decoded;
}
