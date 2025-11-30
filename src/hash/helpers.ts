import { isObjectWithKeys } from '../guards/non-primitives';
import { isNonEmptyString } from '../guards/primitives';
import { isUUID } from '../guards/specials';
import type { $UUIDOptionsV3V5, $UUIDVersion, UUID, UUIDVersion } from './types';
import { randomHex } from './utils';

/** Function type to run md5 rounds */
type MD5Round = (
	a: number,
	b: number,
	c: number,
	d: number,
	x: number,
	s: number,
	t: number
) => number;

/** Adds two 32-bit numbers */
function _add32(x: number, y: number): number {
	return (x + y) & 0xffffffff;
}

/** Converts a 32-bit number to a 4-byte hex string */
export function _numToHex(n: number): string {
	return [0, 8, 16, 24]
		.map((shift) => ((n >> shift) & 0xff).toString(16).padStart(2, '0'))
		.join('');
}

/** Converts a 64-character string block to an array of 16 numbers */
export function _stringToNumbers(s: string): number[] {
	return Array.from({ length: 16 }, (_, i) => {
		const x = i << 2;

		return (
			s.charCodeAt(x) |
			(s.charCodeAt(x + 1) << 8) |
			(s.charCodeAt(x + 2) << 16) |
			(s.charCodeAt(x + 3) << 24)
		);
	});
}

/** Common MD5 transformation function */
function _transform(q: number, a: number, b: number, x: number, s: number, t: number): number {
	const a1 = _add32(_add32(a, q), _add32(x, t));
	return _add32((a1 << s) | (a1 >>> (32 - s)), b);
}

/** Round 1 operation */
const ff: MD5Round = (a, b, c, d, x, s, t) => {
	return _transform((b & c) | (~b & d), a, b, x, s, t);
};

/** Round 2 operation */
const gg: MD5Round = (a, b, c, d, x, s, t) => {
	return _transform((b & d) | (c & ~d), a, b, x, s, t);
};

/** Round 3 operation */
const hh: MD5Round = (a, b, c, d, x, s, t) => {
	return _transform(b ^ c ^ d, a, b, x, s, t);
};

/** Round 4 operation */
const ii: MD5Round = (a, b, c, d, x, s, t) => {
	return _transform(c ^ (b | ~d), a, b, x, s, t);
};

/** Performs one MD5 cycle on a 4-element state with 16-word block */
export function _md5cycle(x: number[], k: number[]): void {
	let a = x[0];
	let b = x[1];
	let c = x[2];
	let d = x[3];

	// Round 1
	a = ff(a, b, c, d, k[0], 7, -680876936);
	d = ff(d, a, b, c, k[1], 12, -389564586);
	c = ff(c, d, a, b, k[2], 17, 606105819);
	b = ff(b, c, d, a, k[3], 22, -1044525330);
	a = ff(a, b, c, d, k[4], 7, -176418897);
	d = ff(d, a, b, c, k[5], 12, 1200080426);
	c = ff(c, d, a, b, k[6], 17, -1473231341);
	b = ff(b, c, d, a, k[7], 22, -45705983);
	a = ff(a, b, c, d, k[8], 7, 1770035416);
	d = ff(d, a, b, c, k[9], 12, -1958414417);
	c = ff(c, d, a, b, k[10], 17, -42063);
	b = ff(b, c, d, a, k[11], 22, -1990404162);
	a = ff(a, b, c, d, k[12], 7, 1804603682);
	d = ff(d, a, b, c, k[13], 12, -40341101);
	c = ff(c, d, a, b, k[14], 17, -1502002290);
	b = ff(b, c, d, a, k[15], 22, 1236535329);

	// Round 2
	a = gg(a, b, c, d, k[1], 5, -165796510);
	d = gg(d, a, b, c, k[6], 9, -1069501632);
	c = gg(c, d, a, b, k[11], 14, 643717713);
	b = gg(b, c, d, a, k[0], 20, -373897302);
	a = gg(a, b, c, d, k[5], 5, -701558691);
	d = gg(d, a, b, c, k[10], 9, 38016083);
	c = gg(c, d, a, b, k[15], 14, -660478335);
	b = gg(b, c, d, a, k[4], 20, -405537848);
	a = gg(a, b, c, d, k[9], 5, 568446438);
	d = gg(d, a, b, c, k[14], 9, -1019803690);
	c = gg(c, d, a, b, k[3], 14, -187363961);
	b = gg(b, c, d, a, k[8], 20, 1163531501);
	a = gg(a, b, c, d, k[13], 5, -1444681467);
	d = gg(d, a, b, c, k[2], 9, -51403784);
	c = gg(c, d, a, b, k[7], 14, 1735328473);
	b = gg(b, c, d, a, k[12], 20, -1926607734);

	// Round 3
	a = hh(a, b, c, d, k[5], 4, -378558);
	d = hh(d, a, b, c, k[8], 11, -2022574463);
	c = hh(c, d, a, b, k[11], 16, 1839030562);
	b = hh(b, c, d, a, k[14], 23, -35309556);
	a = hh(a, b, c, d, k[1], 4, -1530992060);
	d = hh(d, a, b, c, k[4], 11, 1272893353);
	c = hh(c, d, a, b, k[7], 16, -155497632);
	b = hh(b, c, d, a, k[10], 23, -1094730640);
	a = hh(a, b, c, d, k[13], 4, 681279174);
	d = hh(d, a, b, c, k[0], 11, -358537222);
	c = hh(c, d, a, b, k[3], 16, -722521979);
	b = hh(b, c, d, a, k[6], 23, 76029189);
	a = hh(a, b, c, d, k[9], 4, -640364487);
	d = hh(d, a, b, c, k[12], 11, -421815835);
	c = hh(c, d, a, b, k[15], 16, 530742520);
	b = hh(b, c, d, a, k[2], 23, -995338651);

	// Round 4
	a = ii(a, b, c, d, k[0], 6, -198630844);
	d = ii(d, a, b, c, k[7], 10, 1126891415);
	c = ii(c, d, a, b, k[14], 15, -1416354905);
	b = ii(b, c, d, a, k[5], 21, -57434055);
	a = ii(a, b, c, d, k[12], 6, 1700485571);
	d = ii(d, a, b, c, k[3], 10, -1894986606);
	c = ii(c, d, a, b, k[10], 15, -1051523);
	b = ii(b, c, d, a, k[1], 21, -2054922799);
	a = ii(a, b, c, d, k[8], 6, 1873313359);
	d = ii(d, a, b, c, k[15], 10, -30611744);
	c = ii(c, d, a, b, k[6], 15, -1560198380);
	b = ii(b, c, d, a, k[13], 21, 1309151649);
	a = ii(a, b, c, d, k[4], 6, -145523070);
	d = ii(d, a, b, c, k[11], 10, -1120210379);
	c = ii(c, d, a, b, k[2], 15, 718787259);
	b = ii(b, c, d, a, k[9], 21, -343485551);

	x[0] = _add32(a, x[0]);
	x[1] = _add32(b, x[1]);
	x[2] = _add32(c, x[2]);
	x[3] = _add32(d, x[3]);
}

/**
 * Computes UUID timestamp in 100-nanosecond intervals since
 * 00:00:00.00 15 October 1582 (Gregorian epoch).
 */
export function _uuidTimestamp(): bigint {
	const UUID_EPOCH_DIFF = 12219292800000n; // milliseconds
	const unixMs = BigInt(Date.now());
	const uuidMs = unixMs + UUID_EPOCH_DIFF;
	return uuidMs * 10000n; // convert ms → 100ns intervals
}

/**
 * Generates a random 48-bit node ID.
 * LSB of first byte must be 1 to indicate a randomly generated node.
 */
export function _randomNode48(): string {
	const node = randomHex(12).split('');

	// Set multicast bit (LSB of first octet)
	const firstByte = parseInt(node.slice(0, 2).join(''), 16);
	const modified = (firstByte | 0b00000001).toString(16).padStart(2, '0');

	return modified + node.slice(2).join('');
}

/**
 * Generates a 14-bit clock sequence (2 bytes, but only 14 bits used).
 */
export function _clockSeq14(): string {
	const seq = parseInt(randomHex(4), 16) & 0x3fff; // mask to 14 bits
	return seq.toString(16).padStart(4, '0');
}

/** Convert a hex string to UUID format */
export function _formatUUID<V extends UUIDVersion>(h: string, v: number, up: boolean): UUID<V> {
	// replace the first nibble of the 3rd group with the version digit
	const part3 = String(v) + h.slice(13, 16); // positions 12 replaced by version; keep 13..15
	// adjust byte at positions 16..17 (2 hex chars) and combine with positions 18..19
	const part4 = _hexVariant(h.slice(16, 18)) + h.slice(18, 20);

	const formatted = [h.slice(0, 8), h.slice(8, 12), part3, part4, h.slice(20, 32)].join('-');

	return (up ? formatted.toUpperCase() : formatted) as UUID<V>;
}

/** Ensure UUID variant is RFC4122 compliant */
function _hexVariant(hex: string): string {
	const v = parseInt(hex, 16);
	return ((v & 0x3f) | 0x80).toString(16).padStart(2, '0');
}

/** Check if the uuid `options` is compatible for `v3` and `v5` */
export function _isOptionV3V5(opt: unknown): opt is $UUIDOptionsV3V5<'v3' | 'v5'> {
	if (isObjectWithKeys(opt, ['name', 'namespace'])) {
		return isUUID(opt?.namespace) && isNonEmptyString(opt?.name);
	}

	return false;
}

/** Check UUID version after checking for valid UUID from `v1-v8` */
export function _checkUUIDVersion(value: unknown, v: `${$UUIDVersion}`) {
	return isUUID(value) && value[14] === v;
}

export function _constantTimeEquals(a: Uint8Array, b: Uint8Array): boolean {
	if (a.length !== b.length) return false;
	let res = 0;
	for (let i = 0; i < a.length; i++) res |= a[i] ^ b[i];
	return res === 0;
}
