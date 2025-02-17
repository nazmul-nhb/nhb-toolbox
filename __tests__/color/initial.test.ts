import { getColorForInitial } from '../../src';
import {
	alphabetColorPalette,
	numberColorPalette,
} from '../../src/colors/constants';
import { _convertOpacityToHex } from '../../src/colors/helpers';

describe('getColorForInitial', () => {
	test('returns correct color for single alphabet input', () => {
		expect(getColorForInitial('A')).toBe(alphabetColorPalette[0] + 'FF');
		expect(getColorForInitial('Z')).toBe(alphabetColorPalette[25] + 'FF');
	});

	test('returns correct color for single numeric input', () => {
		expect(getColorForInitial('0')).toBe(numberColorPalette[0] + 'FF');
		expect(getColorForInitial('9')).toBe(numberColorPalette[9] + 'FF');
	});

	test('returns correct color for number type input', () => {
		expect(getColorForInitial(3)).toBe(numberColorPalette[3] + 'FF');
		expect(getColorForInitial(7)).toBe(numberColorPalette[7] + 'FF');
	});

	test('returns fallback color for invalid character', () => {
		expect(getColorForInitial('#')).toBe('#010514FF');
		expect(getColorForInitial('!')).toBe('#010514FF');
	});

	test('returns correct color with opacity applied', () => {
		expect(getColorForInitial('A', 50)).toBe(
			alphabetColorPalette[0] + _convertOpacityToHex(50),
		);
		expect(getColorForInitial('9', 75)).toBe(
			numberColorPalette[9] + _convertOpacityToHex(75),
		);
	});

	test('returns correct colors for an array of inputs', () => {
		expect(getColorForInitial(['A', 'B', '1'])).toEqual([
			alphabetColorPalette[0] + 'FF',
			alphabetColorPalette[1] + 'FF',
			numberColorPalette[1] + 'FF',
		]);
	});

	test('returns correct colors for nested arrays', () => {
		expect(getColorForInitial([['A', 'B'], 'C'])).toEqual([
			alphabetColorPalette[0] + 'FF',
			alphabetColorPalette[1] + 'FF',
			alphabetColorPalette[2] + 'FF',
		]);
	});

	test('returns all colors when empty array is provided', () => {
		expect(getColorForInitial([])).toEqual(
			[...alphabetColorPalette, ...numberColorPalette].map(
				(color) => color + 'FF',
			),
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
