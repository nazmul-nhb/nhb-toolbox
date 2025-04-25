import type { Numeric } from '../types';
import { thousands } from './constants';
import { _convertLessThanThousand } from './helpers';

/**
 * * Converts a number to words.
 * @Warning ***Supports numeric values up to `10e19` or `10^20` (one hundred quintillion).***
 * @param number - The number to convert into words.
 * @returns The number converted in words.
 */
export function numberToWords(num: Numeric): string {
	let number = Number(num);

	const isNegative = number < 0;

	if (number === 0) return 'zero';

	number = Math.abs(number);

	let i = 0;
	let result = '';

	while (number > 0) {
		if (i >= thousands.length) {
			return `Number exceeds supported range (max is 10e${thousands.length * 3 - 2})`;
		}

		if (number % 1000 !== 0) {
			const isLastGroup = i === 0 && number % 100 < 100;
			const prefix = _convertLessThanThousand(number % 1000, isLastGroup);

			result = `${prefix} ${thousands[i]} ${result}`;
		}

		number = Math.floor(number / 1000);

		i++;
	}

	const finalResult = result.trim().replace(/\s+/g, ' ');

	return isNegative ? `minus ${finalResult}` : finalResult;
}

/**
 * * Converts a number to a Roman numeral.
 * @param num - The number to convert.
 * @returns The Roman numeral representation.
 * @example convertToRomanNumerals(29) → "XXIX"
 */
export const convertToRomanNumerals = (num: Numeric): string => {
	let number = Number(num);

	if (number <= 0 || number >= 4000)
		throw new RangeError('Number must be between 1 and 3999');

	const romanMap: [number, string][] = [
		[1000, 'M'],
		[900, 'CM'],
		[500, 'D'],
		[400, 'CD'],
		[100, 'C'],
		[90, 'XC'],
		[50, 'L'],
		[40, 'XL'],
		[10, 'X'],
		[9, 'IX'],
		[5, 'V'],
		[4, 'IV'],
		[1, 'I'],
	];

	let result = '';
	for (const [value, numeral] of romanMap) {
		while (number >= value) {
			result += numeral;
			number -= value;
		}
	}
	return result;
};
