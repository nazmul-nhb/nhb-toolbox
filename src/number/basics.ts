import type { Numeric } from '../types';
import { _find2NumbersHCF, _find2NumbersLCM } from './helpers';
import type {
	ConvertedDecimal,
	DecimalOptions,
	RandomNumberOptions,
} from './types';

/**
 * * Utility to generate a random number between a given range.
 * * If no options are provided, it will generate a random number between `0` and `100` (inclusive).
 * * If `min` is greater than `max`, it will swap the values and generate a random number.
 *
 * @param options - Options for configuring random number generator.
 * @returns Random number.
 */
export const getRandomNumber = (options?: RandomNumberOptions): number => {
	const {
		min = 0,
		max = 100,
		includeMin = true,
		includeMax = true,
	} = options || {};

	let minimum = min,
		maximum = max;

	if (min > max) {
		[minimum, maximum] = [max, min];

		return getRandomNumber({
			min: minimum,
			max: maximum,
			includeMin,
			includeMax,
		});
	}

	if (min === max) {
		return min;
	}

	if (includeMin && includeMax) {
		// Generate random number between min and max, inclusive
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	if (!includeMin && !includeMax) {
		// Generate random number between min and max, exclusive
		return Math.floor(Math.random() * (max - min - 1)) + min + 1;
	}

	if (includeMin && !includeMax) {
		// Generate random number between min and max, inclusive of min but exclusive of max
		return Math.floor(Math.random() * (max - min)) + min;
	}

	if (!includeMin && includeMax) {
		// Generate random number between min and max, exclusive of min but inclusive of max
		return Math.floor(Math.random() * (max - min)) + min + 1;
	}

	return 0;
};

/**
 * * Utility to round a number to given decimal places.
 *
 * @param input - Number or `stringified` number to round.
 * @param options - Options for rounding behavior, including decimal places and return type.
 * @returns Converted number as `number` (default) or `string` (if `isString` is `true`).
 */
export const convertToDecimal = <T extends boolean | undefined = false>(
	input: Numeric,
	options?: DecimalOptions<T>,
): ConvertedDecimal<T> => {
	const { decimalPlaces = 2, isString = false } = options || {};

	const number = typeof input === 'number' ? input : Number(input);

	return isString ?
			(number.toFixed(decimalPlaces) as ConvertedDecimal<T>)
		:	(Number(number.toFixed(decimalPlaces)) as ConvertedDecimal<T>);
};

/**
 * * Calculates the HCF/GCD of multiple numbers.
 *
 * @param numbers - List of numbers to find the HCF/GCD for.
 * @returns The HCF/GCD of all the provided numbers.
 */
export const calculateHCF = (...numbers: Numeric[]): number => {
	const converted = numbers.map(Number);

	if (converted.length === 0) return 0;

	let hcf = converted[0];

	for (let i = 1; i < converted.length; i++) {
		hcf = _find2NumbersHCF(hcf, converted[i]);
	}

	return hcf;
};

/**
 * * Calculates the LCM/LCD of multiple numbers.
 *
 * @param numbers - List of numbers to find the LCM/LCD for.
 * @returns The LCM/LCD of all the provided numbers.
 */
export const calculateLCM = (...numbers: Numeric[]): number => {
	const converted = numbers.map(Number);

	if (converted.length === 0) return 0;

	let lcm = converted[0];

	for (let i = 1; i < converted.length; i++) {
		lcm = _find2NumbersLCM(lcm, converted[i]);
	}

	return lcm;
};

/**
 * * Sums up all digits of a number.
 *
 * @param num The input number.
 * @returns The sum of its digits.
 */
export function sumDigits(num: Numeric): number {
	return Math.abs(Number(num))
		.toString()
		.split('')
		.reduce((sum, digit) => sum + Number(digit), 0);
}

/**
 * * Sums up numbers.
 *
 * @param numbers The input numbers.
 * @returns The sum of the numbers.
 */
export function sumNumbers(...numbers: Numeric[]): number {
	return numbers
		.map((num) => Number(num))
		.reduce((sum, number) => sum + number, 0);
}

/**
 * * Reverses a number (e.g., `123` → `321`).
 *
 * @param num The number to reverse.
 * @returns The reversed number.
 */
export function reverseNumber(num: Numeric): number {
	const reversed = parseInt(
		Math.abs(Number(num)).toString().split('').reverse().join(''),
		10,
	);

	return Number(num) < 0 ? -reversed : reversed;
}

/**
 * * Calculates the average of a set of numbers.
 *
 * @param numbers - A list of numbers for which to calculate the average.
 * @returns The average of the provided numbers. Returns `NaN` if no numbers are valid.
 */
export function getAverage(...numbers: Numeric[]): number {
	let sum = 0;
	let count = 0;

	for (const n of numbers) {
		const num = Number(n);
		if (typeof num === 'number' && !isNaN(num)) {
			sum += num;
			count++;
		}
	}

	return count === 0 ? NaN : Math.round((sum / count) * 1000) / 1000;
}
