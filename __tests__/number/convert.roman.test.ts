import { convertToRomanNumerals, romanToInteger } from '../../src/index';

describe('convertToRomanNumerals', () => {
	it('converts single-digit numbers', () => {
		expect(convertToRomanNumerals(1)).toBe('I');
		expect(convertToRomanNumerals(4)).toBe('IV');
		expect(convertToRomanNumerals(9)).toBe('IX');
	});

	it('converts double-digit numbers', () => {
		expect(convertToRomanNumerals(29)).toBe('XXIX');
		expect(convertToRomanNumerals(44)).toBe('XLIV');
		expect(convertToRomanNumerals(58)).toBe('LVIII');
		expect(convertToRomanNumerals(99)).toBe('XCIX');
	});

	it('converts triple-digit numbers', () => {
		expect(convertToRomanNumerals(399)).toBe('CCCXCIX');
		expect(convertToRomanNumerals(444)).toBe('CDXLIV');
		expect(convertToRomanNumerals(999)).toBe('CMXCIX');
	});

	it('converts numbers up to 3999', () => {
		expect(convertToRomanNumerals(1000)).toBe('M');
		expect(convertToRomanNumerals(1987)).toBe('MCMLXXXVII');
		expect(convertToRomanNumerals(3999)).toBe('MMMCMXCIX');
	});

	it('throws RangeError for numbers out of range', () => {
		expect(() => convertToRomanNumerals(0)).toThrow(RangeError);
		expect(() => convertToRomanNumerals(-5)).toThrow(RangeError);
		expect(() => convertToRomanNumerals(4000)).toThrow(RangeError);
	});
});

describe('romanToInteger', () => {
	it('converts simple Roman numerals', () => {
		expect(romanToInteger('I')).toBe(1);
		expect(romanToInteger('IV')).toBe(4);
		expect(romanToInteger('IX')).toBe(9);
	});

	it('converts mixed numerals', () => {
		expect(romanToInteger('XXIX')).toBe(29);
		expect(romanToInteger('XLIV')).toBe(44);
		expect(romanToInteger('LVIII')).toBe(58);
		expect(romanToInteger('XCIX')).toBe(99);
	});

	it('converts large numerals', () => {
		expect(romanToInteger('CCCXCIX')).toBe(399);
		expect(romanToInteger('CDXLIV')).toBe(444);
		expect(romanToInteger('CMXCIX')).toBe(999);
		expect(romanToInteger('MCMLXXXVII')).toBe(1987);
		expect(romanToInteger('MMMCMXCIX')).toBe(3999);
	});

	it('accepts lowercase input', () => {
		expect(romanToInteger('i')).toBe(1);
		expect(romanToInteger('xiv')).toBe(14);
		expect(romanToInteger('mmxxv')).toBe(2025);
	});

	it('throws error on empty or non-string input', () => {
		expect(() => romanToInteger('')).toThrow(TypeError);
		// @ts-expect-error testing invalid type
		expect(() => romanToInteger(null)).toThrow(TypeError);
	});

	it('throws error on invalid characters', () => {
		expect(() => romanToInteger('ABC')).toThrow(Error);
		expect(() => romanToInteger('VX')).toThrow(Error); // malformed Roman numeral
		expect(() => romanToInteger('IIII')).toThrow(Error); // invalid repetition
	});

	it('throws error if result out of range', () => {
		// theoretically only possible if input > 3999
		expect(() => romanToInteger('MMMM')).toThrow(RangeError);
	});

	it('round-trip consistency', () => {
		for (const num of [1, 4, 9, 29, 44, 58, 99, 399, 444, 999, 1987, 3999]) {
			const roman = convertToRomanNumerals(num);
			const arabic = romanToInteger(roman);
			expect(arabic).toBe(num);
		}
	});
});
