import { TextCodec } from '../../src/hash/TextCodec';

describe('TextCodec – validators', () => {
	test('isValidHex', () => {
		expect(TextCodec.isValidHex('ff 0a')).toBe(true);
		expect(TextCodec.isValidHex('ff0a')).toBe(true);
		expect(TextCodec.isValidHex('fg')).toBe(false);
	});

	test('isValidBinary', () => {
		expect(TextCodec.isValidBinary('01000001')).toBe(true);
		expect(TextCodec.isValidBinary('010000012')).toBe(false);
	});

	test('isValidBase64', () => {
		expect(TextCodec.isValidBase64('SGVsbG8=')).toBe(true);
		expect(TextCodec.isValidBase64('@@@')).toBe(false);
	});
});

describe('TextCodec – UTF-8 ↔ Hex', () => {
	test('utf8ToHex (spaced / unspaced)', () => {
		expect(TextCodec.utf8ToHex('Hi')).toBe('48 69');
		expect(TextCodec.utf8ToHex('Hi', false)).toBe('4869');
	});

	test('hexToUtf8', () => {
		expect(TextCodec.hexToUtf8('48 69')).toBe('Hi');
		expect(TextCodec.hexToUtf8('4869')).toBe('Hi');
	});

	test('round-trip utf8 → hex → utf8 (unicode)', () => {
		const text = 'ভাষা';
		expect(TextCodec.hexToUtf8(TextCodec.utf8ToHex(text))).toBe(text);
	});
});

describe('TextCodec – UTF-8 ↔ Binary', () => {
	test('utf8ToBinary (spaced / unspaced)', () => {
		expect(TextCodec.utf8ToBinary('A')).toBe('01000001');
		expect(TextCodec.utf8ToBinary('A', false)).toBe('01000001');
	});

	test('binaryToUtf8', () => {
		expect(TextCodec.binaryToUtf8('01001000 01101001')).toBe('Hi');
	});

	test('invalid binary returns empty string', () => {
		expect(TextCodec.binaryToUtf8('010010012')).toBe('');
	});
});

describe('TextCodec – Hex ↔ Binary', () => {
	test('hexToBinary', () => {
		expect(TextCodec.hexToBinary('ff')).toBe('11111111');
		expect(TextCodec.hexToBinary('ff', false)).toBe('11111111');
	});

	test('binaryToHex', () => {
		expect(TextCodec.binaryToHex('11111111')).toBe('ff');
	});

	test('invalid hex/binary returns empty string', () => {
		expect(TextCodec.hexToBinary('fg')).toBe('');
		expect(TextCodec.binaryToHex('01012')).toBe('');
	});
});

describe('TextCodec – Base64 ↔ UTF-8', () => {
	test('utf8ToBase64', () => {
		expect(TextCodec.utf8ToBase64('Hello')).toBe('SGVsbG8=');
	});

	test('base64ToUtf8', () => {
		expect(TextCodec.base64ToUtf8('SGVsbG8=')).toBe('Hello');
	});

	test('invalid base64 returns empty string', () => {
		expect(TextCodec.base64ToUtf8('@@@')).toBe('');
	});
});

describe('TextCodec – Base64 ↔ Hex / Binary', () => {
	test('base64ToHex', () => {
		expect(TextCodec.base64ToHex('SGVsbG8=')).toBe('48 65 6c 6c 6f');
	});

	test('base64ToBinary', () => {
		expect(TextCodec.base64ToBinary('SGVsbG8=')).toBe(
			'01001000 01100101 01101100 01101100 01101111'
		);
	});

	test('hexToBase64', () => {
		expect(TextCodec.hexToBase64('48 69')).toBe('SGk=');
	});

	test('binaryToBase64', () => {
		expect(TextCodec.binaryToBase64('01001000 01101001')).toBe('SGk=');
	});
});
