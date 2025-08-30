import type { Percent } from '../number/types';
import { ALPHABET_COLOR_PALETTE, NUMBER_COLOR_PALETTE } from './constants';
import { _applyOpacity, _convertOpacityToHex } from './helpers';
import type { ColorInput, ColorInputArray, Hex8 } from './types';

/**
 *  * Generates a hex (`Hex8` format) color based on the first character (initial) of a string or number.
 *
 * - For numbers, it uses 10 predefined colors (0-9).
 * - For letters, it uses 26 predefined colors (A-Z).
 * - Invalid characters handled with a fallback color.
 * @param input - A string or number.
 * @param opacity - A value from 0 to 100 representing the opacity percentage.
 * @returns A hex color for the first character of the provided string/number.
 */
export function getColorForInitial(input: string | number, opacity?: Percent): Hex8;

/**
 *  * Generates an array of hex (`Hex8` format) colors based on the first character (initial) of an array of strings/numbers or even nested arrays of strings/numbers.
 *
 * - For numbers, it uses 10 predefined colors (0-9).
 * - For letters, it uses 26 predefined colors (A-Z).
 * - For empty array it returns all 36 colors.
 * - Invalid characters and inputs are handled with a fallback color.
 * @param input - A string, number, or an array of strings/numbers or even nested arrays of strings/numbers.
 * @param opacity - A value from 0 to 100 representing the opacity percentage.
 * @returns A hex color for a string/number, or an array of hex colors for each element of the provided array.
 */
export function getColorForInitial(input: ColorInputArray, opacity?: Percent): Hex8[];

/**
 *  * Generates a hex color (`Hex8` format) based on the first character (initial) of a string or number; or an array of hex colors based on the first character (initial) of an array of strings/numbers or even nested arrays of strings/numbers.
 *
 * - For numbers, it uses 10 predefined colors (0-9).
 * - For letters, it uses 26 predefined colors (A-Z).
 * - For empty array it returns all 36 colors.
 * - Invalid characters and inputs are handled with a fallback color.
 * @param input - A string, number, or an array of strings/numbers or even nested arrays of strings/numbers.
 * @param opacity - A value from 0 to 100 representing the opacity percentage.
 * @returns A hex color for a string/number, or an array of hex colors for each element of the provided array.
 */
export function getColorForInitial(
	input: ColorInput | ColorInputArray = '',
	opacity: Percent = 100
): Hex8 | Hex8[] {
	let initial: string;

	const hexOpacity = _convertOpacityToHex(opacity);

	const NUMBERS = '0123456789';

	const DEFAULT = '#010514';

	// Handle empty string case
	if (!input) return _applyOpacity(DEFAULT, hexOpacity);

	// Handle string input
	if (typeof input === 'string') {
		initial = input[0];

		// Handle number as string
		if (NUMBERS.includes(initial)) {
			return _applyOpacity(NUMBER_COLOR_PALETTE[parseInt(initial, 10)], hexOpacity);
		}

		const upperInitial = initial.toUpperCase();
		const index = upperInitial.charCodeAt(0) - 'A'.charCodeAt(0);

		// Validate alphabet
		if (index >= 0 && index < ALPHABET_COLOR_PALETTE?.length) {
			return _applyOpacity(ALPHABET_COLOR_PALETTE[index], hexOpacity);
		}

		return _applyOpacity(DEFAULT, hexOpacity);
		// Handle number input
	} else if (typeof input === 'number' && !isNaN(input)) {
		initial = input.toString()[0];

		if (NUMBERS.includes(initial)) {
			return _applyOpacity(NUMBER_COLOR_PALETTE[parseInt(initial, 10)], hexOpacity);
		}

		return _applyOpacity(DEFAULT, hexOpacity);
		// Handle array of strings/numbers
	} else if (Array.isArray(input)) {
		if (input?.length < 1)
			return [...ALPHABET_COLOR_PALETTE, ...NUMBER_COLOR_PALETTE].map((color) =>
				_applyOpacity(color, hexOpacity)
			);

		return input
			.map((el) => {
				if (Array.isArray(el)) {
					return getColorForInitial(el, opacity);
				}
				return getColorForInitial(el, opacity);
			})
			.flat();
	}

	return _applyOpacity(DEFAULT, hexOpacity);
}
