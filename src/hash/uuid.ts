import { isUUID } from '../guards/specials';
import { md5, sha1 } from './core';
import {
	_checkUUIDVersion,
	_clockSeq14,
	_formatUUID,
	_isOptionV3V5,
	_randomNode48,
	_uuidTimestamp,
} from './helpers';
import type { $UUIDVersion, DecodedUUID, SupportedVersion, UUID, UUIDOptions } from './types';
import { randomHex } from './utils';

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
 * - Use {@link https://toolbox.nazmul-nhb.dev/docs/utilities/string/generateRandomID generateRandomID} for customized id generation or {@link https://toolbox.nazmul-nhb.dev/docs/utilities/hash/randomHex randomHex} for hex-only random string with custom length.
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

			const raw =
				timestamp.slice(-8) +
				timestamp.slice(-12, -8) +
				vTimeHigh +
				clockSeqHi +
				clockSeq.slice(2) +
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

			const raw =
				timestamp.slice(0, 8) +
				timestamp.slice(8, 12) +
				vTimeLow +
				clockSeqHi +
				clockSeq.slice(2) +
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

			return _formatUUID(hex, 8, uppercase);
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
 * - Provides a cross-runtime UUID decoder covering essential metadata and timestamp interpretation for time-ordered UUID versions.
 * - **Notes**
 *   - `v1/v6` timestamps are converted from the UUID epoch (1582-10-15) to standard Unix milliseconds.
 *   - `v6` timestamps are lexicographically sortable and decoded accordingly.
 *   - `v7` timestamps map directly to Unix time (48-bit millisecond precision).
 *   - `v8` decoding is minimal because layouts are intentionally user-defined.
 *
 * - **Limitations**
 *   - `v2` decoding is not implemented specifically.
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
