import { isUUID } from '../guards/specials';
import {
	_checkUUIDVersion,
	_clockSeq14,
	_formatUUID,
	_isOptionV3V5,
	_randomNode48,
	_runMd5Rounds,
	_uuidTimestamp,
} from './helpers';
import type { $UUIDVersion, DecodedUUID, SupportedVersion, UUID, UUIDOptions } from './types';

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

/**
 * * Computes an `MD5` digest of the given string using a pure JavaScript implementation.
 *
 * @remarks
 * - Pure JavaScript implementation — runs on any JS engine.
 * - Output is deterministic but may differ from other MD5 implementations due to algorithmic or encoding variations.
 *
 * @param str - Input text to hash.
 *
 * @returns The `MD5` hash as a 32-character hex string.
 *
 * @example
 * const hash = md5("hello");
 * // → "2a40415d762a4bbc919d71b992c51710"
 */

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

/**
 * * Computes a `SHA-1` digest of the given string using a pure JavaScript implementation.
 *
 * @remarks
 * - Pure JavaScript implementation — runs on any JS engine.
 * - Output is deterministic but may differ from other MD5 implementations due to algorithmic or encoding variations.
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
 * * Generates UUIDs across all major RFC-compliant versions (1, 3, 4, 5, 6, 7, 8), following standards from `RFC4122`. Default version is `v4`.
 *
 * - **Version behavior:**
 *   - `v1` → Timestamp & node-identifier–based
 *   - `v3` → MD5(namespace + name)
 *   - `v4` → Pure random (correct variant + version injection)
 *   - `v5` → SHA-1(namespace + name)
 *   - `v6` → Re-ordered timestamp variant of `v1` (lexicographically sortable)
 *   - `v7` → Unix-time–based, monotonic-friendly
 *   - `v8` → Custom layout, '“Future'` variant (timestamp + randomness)
 *
 * @param options Controls version, formatting, and required fields for `v3` and `v5`.
 * @returns A 5-parts UUID string formatted with correct version/variant bits.
 *
 * @example
 * // Generate a random UUID v4
 * const id = uuid();
 *
 * @example
 * // Generate uppercase v7
 * const id = uuid({ version: 'v7', uppercase: true });
 *
 * @example
 * // Generate v5 UUID
 * const id = uuid({
 *   version: 'v5',
 *   namespace: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
 *   name: 'example'
 * });
 *
 * @remarks
 * - This utility provides a complete, engine-agnostic UUID generator with full RFC compliance, predictable formatting, and reliable uniqueness characteristics, suitable for browsers, Node.js, and restricted JavaScript runtimes.
 * - **Notes**
 *   - `v1` and `v6` use a generated pseudo-node identifier.
 *   - `v4`, `v7`, `v8` **do not rely on crypto APIs**, preserving engine-agnostic behavior.
 *   - `v3` and `v5` use internal `MD5`/`SHA-1` implementations and remain fully deterministic.
 *
 * - **Limitations**
 *   - `v1`/`v6`: Node identifier is pseudo-random, not derived from real MAC addresses (for privacy).
 *   - `v3`/`v5`: Hash algorithms (`MD5`/`SHA-1`) follow RFC specs but are not cryptographically secure.
 *   - `v7`: Millisecond precision; extremely high throughput may still cause rare collisions.
 *   - `v8`: Uses a simple timestamp + randomness layout; custom layouts are not supported here.
 *
 * - Use {@link https://toolbox.nazmul-nhb.dev/docs/utilities/string/generateRandomID generateRandomID} for customized id generation or {@link randomHex} for hex-only string with custom length.
 */
export function uuid<V extends SupportedVersion = 'v4'>(options?: UUIDOptions<V>): UUID<V> {
	const { version = 'v4', uppercase = false } = options || {};

	switch (version) {
		case 'v1': {
			const timestamp = _uuidTimestamp().toString(16).padStart(15, '0');

			const vTimeHigh = (parseInt(timestamp.slice(0, -12).padStart(3, '0'), 16) | 0x1000) // version 1
				.toString(16)
				.padStart(4, '0');

			const clockSeq = _clockSeq14();
			const clockSeqHi = ((parseInt(clockSeq.slice(0, 2), 16) & 0x3f) | 0x80) // variant
				.toString(16)
				.padStart(2, '0');
			const clockSeqLow = clockSeq.slice(2);

			const raw =
				timestamp.slice(-8) +
				timestamp.slice(-12, -8) +
				vTimeHigh +
				clockSeqHi +
				clockSeqLow +
				_randomNode48();

			return _formatUUID(raw, 1, uppercase);
		}
		case 'v3': {
			if (_isOptionV3V5(options)) {
				const hash = md5(options.namespace + options.name);
				return _formatUUID(hash, 3, uppercase);
			}
			throw new Error('v3 requires valid namespace (uuid) and name!');
		}
		case 'v4': {
			const bytes = new Uint8Array(16);

			for (let i = 0; i < 16; i++) {
				bytes[i] = Math.floor(Math.random() * 256);
			}

			// Convert to hex
			let hex = '';
			for (let i = 0; i < 16; i++) {
				hex += bytes[i].toString(16).padStart(2, '0');
			}

			return _formatUUID(hex, 4, uppercase);
		}
		case 'v5': {
			if (_isOptionV3V5(options)) {
				const hash = sha1(options.namespace + options.name).slice(0, 32);
				return _formatUUID(hash, 5, uppercase);
			}
			throw new Error('v5 requires valid namespace (uuid) and name!');
		}
		case 'v6': {
			const timestamp = _uuidTimestamp().toString(16).padStart(15, '0');

			const vTimeLow = (parseInt(timestamp.slice(12).padStart(3, '0'), 16) | 0x6000) // version 6
				.toString(16)
				.padStart(4, '0');

			const clockSeq = _clockSeq14();
			const clockSeqHi = ((parseInt(clockSeq.slice(0, 2), 16) & 0x3f) | 0x80) // variant
				.toString(16)
				.padStart(2, '0');
			const clockSeqLow = clockSeq.slice(2);

			const raw =
				timestamp.slice(0, 8) +
				timestamp.slice(8, 12) +
				vTimeLow +
				clockSeqHi +
				clockSeqLow +
				_randomNode48();

			return _formatUUID(raw, 6, uppercase);
		}
		case 'v7': {
			const tsHex = Date.now().toString(16).padStart(12, '0');
			return _formatUUID(tsHex + randomHex(20), 7, uppercase);
		}
		case 'v8': {
			// 48-bit timestamp (6 bytes)
			const ts = BigInt(Date.now());
			const bytes = new Uint8Array(16);

			// place timestamp big-endian into bytes[0..5]
			let temp = ts;
			for (let i = 5; i >= 0; i--) {
				bytes[i] = Number(temp & 0xffn);
				temp >>= 8n;
			}

			for (let i = 6; i < 16; i++) {
				bytes[i] = Math.floor(Math.random() * 256);
			}

			// Convert full 16 bytes into one contiguous 32-hex string
			let hex = '';
			for (let i = 0; i < 16; i++) {
				hex += bytes[i].toString(16).padStart(2, '0');
			}

			return _formatUUID<V>(hex, 8, uppercase);
		}
		default:
			throw new RangeError('Unsupported UUID version!');
	}
}

/**
 * * Decodes a UUID into its internal components, including version, variant, timestamps for time-based UUIDs and other metadata.
 *   - Supports `RFC4122` UUID versions: 1-8.
 *
 * @param uuid The UUID string to decode.
 * @returns A structured `DecodedUUID` object, or `null` for invalid UUIDs.
 *
 * @example
 * const info = decodeUUID("f47ac10b-58cc-4372-a567-0e02b2c3d479");
 *
 * @example
 * const info = decodeUUID(uuid({ version: "v1" }));
 *
 * @remarks
 * - Provides a cross-runtime, spec-accurate UUID decoder covering essential metadata and timestamp interpretation for time-ordered UUID versions.
 * - **Notes**
 *   - `v1/v6` timestamps are converted from the UUID epoch (1582-10-15) to standard Unix milliseconds.
 *   - `v6` timestamps are lexicographically sortable and decoded accordingly.
 *   - `v7` timestamps map directly to Unix time (48-bit millisecond precision).
 *   - `v8` decoding is minimal because layouts are intentionally user-defined.
 *
 * - **Limitations**
 *   - `v2` UUID decoding is not implemented.
 *   - `v8` decoding only returns timestamp if it matches a known layout.
 *   - `v3/v5` hash UUIDs contain no timestamp information.
 */
export function decodeUUID(uuid: string): DecodedUUID | null {
	if (!isUUID(uuid)) return null;

	const plain = uuid.replace(/-/g, '');
	const parts = uuid.toLowerCase().split('-');
	const version = parseInt(parts[2][0], 16) as $UUIDVersion;
	const variantNibble = parseInt(parts[3][0], 16);

	// Variant detection (RFC4122 rules)
	let variant: DecodedUUID['variant'] = 'RFC4122';
	if ((variantNibble & 0b1000) === 0) variant = 'NCS';
	else if ((variantNibble & 0b1100) === 0b1000) variant = 'RFC4122';
	else if ((variantNibble & 0b1110) === 0b1100) variant = 'Microsoft';
	else variant = 'Future';

	const decoded: DecodedUUID = {
		version,
		variant,
		raw: uuid,
		plain,
		singleInt: BigInt('0x' + plain),
	};

	// UUID epoch offset (from Gregorian: 1582-10-15 → Unix epoch)
	const UUID_EPOCH_DIFF = 122192928000000000n; // 100ns units

	if (version === 1 || version === 6) {
		// remove version nibble with parts[2].slice(1)
		let tsHex = parts[2].slice(1) + parts[1] + parts[0];
		if (version === 6) tsHex = parts[0] + parts[1] + parts[2].slice(1);

		// Convert 100ns → Unix ms
		const unixMs = Number((BigInt('0x' + tsHex) - UUID_EPOCH_DIFF) / 10000n);
		decoded.timestamp = unixMs;

		decoded.node = parts[4];
		return decoded;
	}

	if (version === 7 || version === 8) {
		// first 6 bytes = timestamp
		const tsHex = parts.join('').slice(0, 12); // 48 bits

		decoded.variant = version === 7 ? 'RFC4122' : 'Future';
		decoded.timestamp = parseInt(tsHex, 16);
		return decoded;
	}

	return decoded;
}

/** Check if a value is UUID version 1 */
export function isUUIDv1(value: unknown): value is UUID<'v1'> {
	return _checkUUIDVersion(value, '1');
}

/** Check if a value is UUID version 2 */
export function isUUIDv2(value: unknown): value is UUID<'v2'> {
	return _checkUUIDVersion(value, '2');
}

/** Check if a value is UUID version 3 */
export function isUUIDv3(value: unknown): value is UUID<'v3'> {
	return _checkUUIDVersion(value, '3');
}

/** Check if a value is UUID version 4 */
export function isUUIDv4(value: unknown): value is UUID<'v4'> {
	return _checkUUIDVersion(value, '4');
}

/** Check if a value is UUID version 5 */
export function isUUIDv5(value: unknown): value is UUID<'v5'> {
	return _checkUUIDVersion(value, '5');
}

/** Check if a value is UUID version 6 */
export function isUUIDv6(value: unknown): value is UUID<'v6'> {
	return _checkUUIDVersion(value, '6');
}

/** Check if a value is UUID version 7 */
export function isUUIDv7(value: unknown): value is UUID<'v7'> {
	return _checkUUIDVersion(value, '7');
}

/** Check if a value is UUID version 8 */
export function isUUIDv8(value: unknown): value is UUID<'v8'> {
	return _checkUUIDVersion(value, '8');
}

export { generateRandomID } from '../string/basics';
export { isUUID };
