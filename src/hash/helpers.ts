import { isObjectWithKeys } from '../guards/non-primitives';
import { isString } from '../guards/primitives';
import { randomHex } from './index';
import type { UUID, UUIDVersion } from './types';

/** Executes all 64 MD5 operations in a DRY way */
export function _runMd5Rounds(words: number[], h: number[]): void {
	let [a, b, c, d] = h;

	/** Round operation functions */
	const funcs = [
		(b: number, c: number, d: number) => (b & c) | (~b & d), // ff
		(b: number, c: number, d: number) => (b & d) | (c & ~d), // gg
		(b: number, c: number, d: number) => b ^ c ^ d, // hh
		(b: number, c: number, d: number) => c ^ (b | ~d), // ii
	] as const;

	const r1 = [7, 12, 17, 22];
	const r2 = [5, 9, 14, 20];
	const r3 = [4, 11, 16, 23];
	const r4 = [6, 10, 15, 21];

	/** Shift amounts (official MD5 spec) */
	const shifts = [
		...r1, // Round 1
		...r1, // Round 1
		...r1, // Round 1
		...r1, // Round 1
		...r2, // Round 2
		...r2, // Round 2
		...r2, // Round 2
		...r2, // Round 2
		...r3, // Round 3
		...r3, // Round 3
		...r3, // Round 3
		...r3, // Round 3
		...r4, // Round 4
		...r4, // Round 4
		...r4, // Round 4
		...r4, // Round 4
	];

	/** Constants (from RFC 1321) */
	const K = Array.from({ length: 64 }, (_, i) =>
		Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32)
	);

	function rotl(x: number, c: number) {
		return (x << c) | (x >>> (32 - c));
	}
	function add(x: number, y: number) {
		return (x + y) | 0;
	}

	/** Main 64-step loop */
	for (let i = 0; i < 64; i++) {
		const round = i >> 4; // 0..3
		const f = funcs[round](b, c, d);
		let g;

		if (round === 0) g = i;
		else if (round === 1) g = (5 * i + 1) % 16;
		else if (round === 2) g = (3 * i + 5) % 16;
		else g = (7 * i) % 16;

		const temp = d;
		d = c;
		c = b;
		b = add(b, rotl(add(add(a, f), add(words[g], K[i])), shifts[i]));
		a = temp;
	}

	h[0] = add(h[0], a);
	h[1] = add(h[1], b);
	h[2] = add(h[2], c);
	h[3] = add(h[3], d);
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
export function _formatUUID<V extends UUIDVersion>(
	hex: string,
	version: number,
	uppercase: boolean
): UUID<V> {
	const v = String(version);
	const part1 = hex.slice(0, 8);
	const part2 = hex.slice(8, 12);
	// replace the first nibble of the 3rd group with the version digit
	const part3 = v + hex.slice(13, 16); // positions 12 replaced by version; keep 13..15
	const variantByte = _hexVariant(hex.slice(16, 18)); // adjust byte at positions 16..17 (2 hex chars)
	const part4 = variantByte + hex.slice(18, 20); // combine with positions 18..19
	const part5 = hex.slice(20, 32);

	const formatted = [part1, part2, part3, part4, part5].join('-');

	return (uppercase ? formatted.toUpperCase() : formatted) as UUID<V>;
}

/** Ensure UUID variant is RFC4122 compliant */
function _hexVariant(hex: string): string {
	const v = parseInt(hex, 16);
	return ((v & 0x3f) | 0x80).toString(16).padStart(2, '0');
}

/** Check if the uuid `options` is compatible for `v3` and `v5` */
export function _isV3OrV5(opt: unknown): opt is Record<'name' | 'namespace', string> {
	if (isObjectWithKeys(opt, ['name', 'namespace'])) {
		return isString(opt?.namespace) && isString(opt?.name);
	}

	return false;
}
