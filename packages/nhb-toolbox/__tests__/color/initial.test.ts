import { getColorForInitial } from '../../src';
import { ALPHABET_COLOR_PALETTE, NUMBER_COLOR_PALETTE } from '../../src/colors/constants';
import { _percentToHex } from '../../src/colors/helpers';

describe('getColorForInitial', () => {
	test('returns correct color for single alphabet input', () => {
		expect(getColorForInitial('A')).toBe(ALPHABET_COLOR_PALETTE[0] + 'FF');
		expect(getColorForInitial('Z')).toBe(ALPHABET_COLOR_PALETTE[25] + 'FF');
	});

	test('returns correct color for single numeric input', () => {
		expect(getColorForInitial('0')).toBe(NUMBER_COLOR_PALETTE[0] + 'FF');
		expect(getColorForInitial('9')).toBe(NUMBER_COLOR_PALETTE[9] + 'FF');
	});

	test('returns correct color for number type input', () => {
		expect(getColorForInitial(3)).toBe(NUMBER_COLOR_PALETTE[3] + 'FF');
		expect(getColorForInitial(7)).toBe(NUMBER_COLOR_PALETTE[7] + 'FF');
	});

	test('returns fallback color for invalid character', () => {
		expect(getColorForInitial('#')).toBe('#010514FF');
		expect(getColorForInitial('!')).toBe('#010514FF');
	});

	test('returns correct color with opacity applied', () => {
		expect(getColorForInitial('A', 50)).toBe(ALPHABET_COLOR_PALETTE[0] + _percentToHex(50));
		expect(getColorForInitial('9', 75)).toBe(NUMBER_COLOR_PALETTE[9] + _percentToHex(75));
	});

	test('returns correct colors for an array of inputs', () => {
		expect(getColorForInitial(['A', 'B', '1'])).toEqual([
			ALPHABET_COLOR_PALETTE[0] + 'FF',
			ALPHABET_COLOR_PALETTE[1] + 'FF',
			NUMBER_COLOR_PALETTE[1] + 'FF',
		]);
	});

	test('returns correct colors for nested arrays', () => {
		expect(getColorForInitial([['A', 'B'], 'C'])).toEqual([
			ALPHABET_COLOR_PALETTE[0] + 'FF',
			ALPHABET_COLOR_PALETTE[1] + 'FF',
			ALPHABET_COLOR_PALETTE[2] + 'FF',
		]);
	});

	test('returns all colors when empty array is provided', () => {
		expect(getColorForInitial([])).toEqual(
			[...ALPHABET_COLOR_PALETTE, ...NUMBER_COLOR_PALETTE].map((color) => color + 'FF')
		);
	});

	test('returns fallback color for null, undefined, or empty string', () => {
		// @ts-expect-error
		expect(getColorForInitial(null)).toBe('#010514FF');
		// @ts-expect-error
		expect(getColorForInitial(undefined)).toBe('#010514FF');
		expect(getColorForInitial('')).toBe('#010514FF');
	});
});
