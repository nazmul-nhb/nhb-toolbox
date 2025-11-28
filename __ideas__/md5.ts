// MD5 Hash Implementation in TypeScript
// Inspired by https://github.com/eustatos/pure-md5.git

/** Adds two 32-bit numbers */
function _add32(x: number, y: number): number {
	return (x + y) & 0xffffffff;
}

/** Converts a 32-bit number to a 4-byte hex string */
function _numToHex(n: number): string {
	return [0, 8, 16, 24]
		.map((shift) => ((n >> shift) & 0xff).toString(16).padStart(2, '0'))
		.join('');
}

/** Converts an array of 32-bit numbers to a hex string */
function _numArrayToHex(x: number[]): string {
	return x.map(_numToHex).join('');
}

/** Converts a 64-character string block to an array of 16 numbers */
function _stringToNumbers(s: string): number[] {
	const md5blocks: number[] = [];

	for (let i = 0; i < 64; i += 4) {
		md5blocks[i >> 2] =
			s.charCodeAt(i) +
			(s.charCodeAt(i + 1) << 8) +
			(s.charCodeAt(i + 2) << 16) +
			(s.charCodeAt(i + 3) << 24);
	}

	return md5blocks;
}

// Common and core MD5 transformation functions
function _transform(q: number, a: number, b: number, x: number, s: number, t: number): number {
	const a1 = _add32(_add32(a, q), _add32(x, t));
	return _add32((a1 << s) | (a1 >>> (32 - s)), b);
}

/** Round 1 operation */
function ff(
	a: number,
	b: number,
	c: number,
	d: number,
	x: number,
	s: number,
	t: number
): number {
	return _transform((b & c) | (~b & d), a, b, x, s, t);
}

/** Round 2 operation */
function gg(
	a: number,
	b: number,
	c: number,
	d: number,
	x: number,
	s: number,
	t: number
): number {
	return _transform((b & d) | (c & ~d), a, b, x, s, t);
}

/** Round 3 operation */
function hh(
	a: number,
	b: number,
	c: number,
	d: number,
	x: number,
	s: number,
	t: number
): number {
	return _transform(b ^ c ^ d, a, b, x, s, t);
}

/** Round 4 operation */
function ii(
	a: number,
	b: number,
	c: number,
	d: number,
	x: number,
	s: number,
	t: number
): number {
	return _transform(c ^ (b | ~d), a, b, x, s, t);
}

// Main MD5 cycle
function _md5cycle(x: number[], k: number[]): void {
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

// MD5 core function
export function md51(s: string): string {
	const n = s.length;
	const state = [1732584193, -271733879, -1732584194, 271733878];
	let i: number;

	for (i = 64; i <= n; i += 64) {
		_md5cycle(state, _stringToNumbers(s.substring(i - 64, i)));
	}

	const s1 = s.substring(i - 64);
	const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	for (i = 0; i < s1.length; i++) {
		tail[i >> 2] |= s1.charCodeAt(i) << (i % 4 << 3);
	}

	tail[i >> 2] |= 0x80 << (i % 4 << 3);

	if (i > 55) {
		_md5cycle(state, tail);
		for (let j = 0; j < 16; j++) {
			tail[j] = 0;
		}
	}

	tail[14] = n * 8;
	_md5cycle(state, tail);

	return _numArrayToHex(state);
}

// Example usage:
// console.log(md5('hello')); // '5d41402abc4b2a76b9719d911017c592'
// console.log(md5('')); // 'd41d8cd98f00b204e9800998ecf8427e'
