/* eslint-disable no-control-regex */
/**
 * TinyCrypto - pure-TS JWT helper (HS256) with builtin SHA-256 & HMAC (no Web/Crypto APIs)
 *
 * - Implements: base64url encode/decode, SHA-256, HMAC-SHA256
 * - Usage: create instance with secret; use `sign`, `decode`, `verify`, `verifyOrThrow`
 *
 * This file is TypeScript and uses native TS types. JSDoc comments contain descriptions only.
 */

import { bytesToUtf8, utf8ToBytes } from '../src/hash/helpers';
import { base64Decode, base64Encode } from './cipher';

type JSONObject = Record<string, unknown>;

function isObject(v: unknown): v is JSONObject {
	return typeof v === 'object' && v !== null && !Array.isArray(v);
}

// ---------- Pure JS atob ----------
export function atobShim(base64: string): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	let str = '';
	let i = 0;

	base64 = base64.replace(/=+$/, '');

	while (i < base64.length) {
		const h1 = chars.indexOf(base64.charAt(i++));
		const h2 = chars.indexOf(base64.charAt(i++));
		const h3 = chars.indexOf(base64.charAt(i++));
		const h4 = chars.indexOf(base64.charAt(i++));

		const o1 = (h1 << 2) | (h2 >> 4);
		const o2 = ((h2 & 15) << 4) | (h3 >> 2);
		const o3 = ((h3 & 3) << 6) | h4;

		str += String.fromCharCode(o1);
		if (h3 !== 64) str += String.fromCharCode(o2);
		if (h4 !== 64) str += String.fromCharCode(o3);
	}

	return str.replace(/\x00+$/, '');
}

// ---------- Pure JS btoa ----------
export function btoaShim(text: string): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	let output = '';
	let i = 0;

	while (i < text.length) {
		const o1 = text.charCodeAt(i++);
		const o2 = text.charCodeAt(i++);
		const o3 = text.charCodeAt(i++);

		const h1 = o1 >> 2;
		const h2 = ((o1 & 3) << 4) | (o2 >> 4);
		const h3 = ((o2 & 15) << 2) | (o3 >> 6);
		const h4 = o3 & 63;

		output +=
			chars.charAt(h1) +
			chars.charAt(h2) +
			chars.charAt(isNaN(o2) ? 64 : h3) +
			chars.charAt(isNaN(o3) ? 64 : h4);
	}

	return output.replace(/\x00+$/, '');
}

/* ============================
   base64url helpers
   ============================ */

// /**
//  * Convert Uint8Array to base64url string (no padding)
//  * @param bytes Bytes to convert.
//  */
// export function base64UrlEncode(bytes: Uint8Array): string {
// 	// standard base64 from bytes
// 	let binary = '';
// 	const chunkSize = 0x8000;
// 	for (let i = 0; i < bytes.length; i += chunkSize) {
// 		binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
// 	}
// 	const b64 = btoaShim(binary);
// 	// base64url: replace +/, remove =
// 	return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
// }

// /**
//  * Decode base64url to Uint8Array
//  * @param b64url base64url string
//  */
// export function base64UrlDecode(b64url: string): Uint8Array {
// 	// convert to standard base64
// 	const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
// 	// add padding
// 	const pad = b64.length % 4 === 0 ? 0 : 4 - (b64.length % 4);
// 	const b64p = b64 + '='.repeat(pad);
// 	// decode
// 	const binary = atobShim(b64p);
// 	const bytes = new Uint8Array(binary.length);
// 	for (let i = 0; i < binary.length; i++) {
// 		bytes[i] = binary.charCodeAt(i);
// 	}
// 	return bytes;
// }

/* ============================
   UTF-8 helpers
   ============================ */

/* ============================
   Little/Big-endian helpers for words
   ============================ */

// function toUint32ArrayBE(bytes: Uint8Array): Uint32Array {
// 	const len = Math.ceil(bytes.length / 4);
// 	const out = new Uint32Array(len);
// 	for (let i = 0; i < len; i++) {
// 		const base = i * 4;
// 		out[i] =
// 			((bytes[base] || 0) << 24) |
// 			((bytes[base + 1] || 0) << 16) |
// 			((bytes[base + 2] || 0) << 8) |
// 			((bytes[base + 3] || 0) << 0);
// 	}
// 	return out;
// }

/* ============================
   SHA-256 implementation (pure JS)
   ============================
   Based on the standard algorithm; returns a 32-byte Uint8Array.
   ============================ */

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

/* ============================
   HMAC-SHA256
   ============================ */

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

/* ============================
   JSON stable stringify for reproducible signing
   (keeps object keys sorted)
   ============================ */

function stableStringify(obj: unknown): string {
	if (obj === null || typeof obj !== 'object') {
		return JSON.stringify(obj);
	}
	if (Array.isArray(obj)) {
		return '[' + obj.map((v) => stableStringify(v)).join(',') + ']';
	}
	const keys = Object.keys(obj as JSONObject).sort();
	return (
		'{' +
		keys
			.map((k) => JSON.stringify(k) + ':' + stableStringify((obj as JSONObject)[k]))
			.join(',') +
		'}'
	);
}

/* ============================
   TinyCrypto class
   ============================ */

export class TinyCrypto {
	#secretBytes: Uint8Array;

	/**
	 * id: 10001
	 * title: constructor
	 * function signature: constructor(secret: string)
	 * parameters:
	 *  - secret: the HMAC secret used for signing and verifying (kept internally)
	 * return value: instance of TinyCrypto
	 * example usage:
	 *  const jwt = new TinyCrypto('my-super-secret');
	 * notes: secret is converted to UTF-8 bytes and stored.
	 * aliases: new TinyCrypto(secret)
	 * conclusion: use the instance to sign and verify tokens without passing secret again.
	 */
	constructor(secret: string) {
		if (typeof secret !== 'string' || secret.length === 0) {
			throw new Error('secret must be a non-empty string');
		}
		this.#secretBytes = utf8ToBytes(secret);
	}

	/**
	 * id: 10002
	 * title: sign
	 * function signature: sign(payload: Record<string, unknown>, header?: Record<string, unknown>) => string
	 * parameters:
	 *  - payload: the JWT payload (an object)
	 *  - header: optional header object (defaults to { alg: 'HS256', typ: 'JWT' })
	 * return value: JWT compact serialization string
	 * example usage:
	 *  const token = jwt.sign({ sub: '123', iat: Math.floor(Date.now()/1000) });
	 * notes:
	 *  - Uses stable key ordering for deterministic tokens.
	 *  - Uses HS256 (HMAC-SHA256).
	 * aliases: create, encode
	 * conclusion: returns the signed JWT token.
	 */
	sign(payload: JSONObject, header?: JSONObject): string {
		if (!isObject(payload)) throw new Error('payload must be an object');
		const hdr: JSONObject = Object.assign({ alg: 'HS256', typ: 'JWT' }, header || {});
		const headerJson = stableStringify(hdr);
		const payloadJson = stableStringify(payload);
		const headerB = utf8ToBytes(headerJson);
		const payloadB = utf8ToBytes(payloadJson);
		const signingInput = base64Encode(headerB) + '.' + base64Encode(payloadB);

		const mac = hmacSha256(this.#secretBytes, utf8ToBytes(signingInput));
		const signature = base64Encode(mac);
		return signingInput + '.' + signature;
	}

	/**
	 * id: 10003
	 * title: decode
	 * function signature: decode(token: string) => { header: any; payload: any; signature: string; signingInput: string }
	 * parameters:
	 *  - token: JWT compact string
	 * return value: object with header, payload, signature, signingInput
	 * example usage:
	 *  const decoded = jwt.decode(token);
	 * notes:
	 *  - decode does NOT verify signature.
	 *  - throws on malformed token.
	 * aliases: parse
	 * conclusion: use decode to read token fields before verify.
	 */
	decode(token: string): {
		header: unknown;
		payload: unknown;
		signature: string;
		signingInput: string;
	} {
		if (typeof token !== 'string') throw new Error('token must be a string');
		const parts = token.split('.');
		if (parts.length !== 3) throw new Error('token must have three parts');
		const [a, b, c] = parts;
		const headerBytes = base64Decode(a);
		const payloadBytes = base64Decode(b);
		const headerStr = bytesToUtf8(headerBytes);
		const payloadStr = bytesToUtf8(payloadBytes);

		let header: unknown;
		let payload: unknown;

		try {
			header = JSON.parse(headerStr);
		} catch {
			header = headerStr;
		}
		try {
			payload = JSON.parse(payloadStr);
		} catch {
			payload = payloadStr;
		}
		return { header, payload, signature: c, signingInput: a + '.' + b };
	}

	/**
	 * id: 10004
	 * title: verify
	 * function signature: verify(token: string) => { valid: boolean; payload?: any; error?: string }
	 * parameters:
	 *  - token: JWT compact string
	 * return value: object with valid boolean; if valid, payload is returned
	 * example usage:
	 *  const res = jwt.verify(token);
	 *  if (res.valid) console.log(res.payload);
	 * notes:
	 *  - Verifies signature using stored secret; does NOT automatically check exp/nbf etc.
	 *  - You may check standard claims yourself after verify (e.g., exp).
	 * aliases: check
	 * conclusion: returns validation result and payload if valid.
	 */
	verify(token: string): { valid: boolean; payload?: unknown; error?: string } {
		try {
			const parts = token.split('.');
			if (parts.length !== 3) return { valid: false, error: 'malformed token' };
			const [a, b, sig] = parts;
			const signingInput = a + '.' + b;
			const expectedMac = hmacSha256(this.#secretBytes, utf8ToBytes(signingInput));
			const expectedSig = base64Encode(expectedMac);

			// constant-time string compare
			const ok = constantTimeEquals(sig, expectedSig);
			if (!ok) return { valid: false, error: 'invalid signature' };
			// parse payload
			const payloadBytes = base64Decode(b);
			const payloadStr = bytesToUtf8(payloadBytes);
			let payload: unknown;
			try {
				payload = JSON.parse(payloadStr);
			} catch {
				payload = payloadStr;
			}
			return { valid: true, payload };
		} catch (e: unknown) {
			return { valid: false, error: e instanceof Error ? e.message : String(e) };
		}
	}

	/**
	 * id: 10005
	 * title: verifyOrThrow
	 * function signature: verifyOrThrow(token: string) => any
	 * parameters:
	 *  - token: JWT compact string
	 * return value: payload (parsed)
	 * example usage:
	 *  const payload = jwt.verifyOrThrow(token);
	 * notes:
	 *  - Throws if verification fails.
	 *  - Convenient for code paths that expect valid tokens.
	 * aliases: assert
	 * conclusion: returns parsed payload on success or throws on failure.
	 */
	verifyOrThrow(token: string): unknown {
		const res = this.verify(token);
		if (!res.valid) throw new Error(res.error || 'invalid token');
		return res.payload;
	}

	/**
	 * id: 10006
	 * title: decodePayload (utility)
	 * function signature: decodePayload(token: string) => any
	 * parameters:
	 *  - token: JWT compact string
	 * return value: parsed payload or null on error
	 * example usage:
	 *  const payload = jwt.decodePayload(token);
	 * notes:
	 *  - does not verify signature
	 * aliases: getPayload
	 * conclusion: quick helper to extract payload.
	 */
	decodePayload(token: string): unknown | null {
		try {
			const parts = token.split('.');
			if (parts.length !== 3) return null;
			const payload = base64Decode(parts[1]);
			const s = bytesToUtf8(payload);
			try {
				return JSON.parse(s);
			} catch {
				return s;
			}
		} catch {
			return null;
		}
	}
}

/* ============================
   small helpers
   ============================ */

export function constantTimeEquals(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let res = 0;
	for (let i = 0; i < a.length; i++) {
		res |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return res === 0;
}
