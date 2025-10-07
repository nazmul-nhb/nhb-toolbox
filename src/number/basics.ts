import { isNumber } from '../guards/primitives';
import type { Numeric } from '../types/index';
import { _find2NumbersHCF, _find2NumbersLCM } from './helpers';
import type { ConvertedDecimal, DecimalOptions, RandomNumberOptions } from './types';
import { normalizeNumber } from './utilities';

/**
 * * Utility to generate a random number between a given range.
 * * If no options are provided, it will generate a random number between `0` and `100` (inclusive).
 * * If `min` is greater than `max`, it will swap the values and generate a random number.
 *
 * @param options - Options for configuring random number generator.
 * @returns Random number.
 */
export const getRandomNumber = (options?: RandomNumberOptions): number => {
	const { min = 0, max = 100, includeMin = true, includeMax = true } = options || {};

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
	options?: DecimalOptions<T>
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
	const converted = numbers?.map(Number);

	if (converted?.length === 0) return 0;

	let hcf = converted[0];

	for (let i = 1; i < converted?.length; i++) {
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
	const converted = numbers?.map(Number);

	if (converted?.length === 0) return 0;

	let lcm = converted[0];

	for (let i = 1; i < converted?.length; i++) {
		lcm = _find2NumbersLCM(lcm, converted[i]);
	}

	return lcm;
};

/**
 * * Computes the factorial of a non-negative numeric value recursively.
 *
 * @remarks
 * - Returns `undefined` if the input is negative, not numeric, non-integer, or `undefined`.
 *
 * @param int - A numeric input value (integer) whose factorial should be calculated.
 *
 * @returns The factorial result as a number if valid, otherwise `undefined`.
 *
 * @example
 * ```ts
 * factorial(5); // → 120
 * factorial(0); // → 1
 * factorial(-3); // → undefined
 * factorial(undefined); // → undefined
 * factorial(5.5); // → undefined
 * ```
 *
 * @notes
 * - Factorial of `0` and `1` is `1`.
 * - Uses recursive approach internally.
 * - Input is normalized via `normalizeNumber` before computation.
 * - May return large values quickly due to factorial growth rate.
 */
export function factorial(int: Numeric | undefined): number | undefined {
	const num = normalizeNumber(int);

	if (!isNumber(num) || num < 0 || !Number.isInteger(num)) {
		return undefined;
	} else if (num === 0 || num === 1) {
		return 1;
	} else {
		return num * (factorial(num - 1) ?? 1);
	}
}

/**
 * * Efficiently computes all positive integer factors (divisors) of a normalized number.
 *
 * @param int - Numeric value to find factors for. Non-integer or negative values return an empty array.
 *
 * @returns An array of positive factors in ascending order.
 *
 * @example
 * ```ts
 * getFactors(12); // → [1, 2, 3, 4, 6, 12]
 * getFactors(7);  // → [1, 7]
 * getFactors(-4); // → []
 * getFactors(undefined); // → []
 * ```
 *
 * @notes
 * - Uses the square root method for better performance (`O(√n)`).
 * - Returns an empty array for invalid, negative, or non-integer input.
 */
export function getFactors(int: Numeric | undefined): number[] {
	const num = normalizeNumber(int);

	if (!isNumber(num) || num <= 0 || !Number.isInteger(num)) return [];

	if (num === 1) return [1];

	const factors = new Set<number>([1, num]);

	const sqrt = Math.floor(Math.sqrt(num));

	for (let i = 2; i <= sqrt; i++) {
		if (num % i === 0) {
			factors.add(i);
			factors.add(num / i);
		}
	}

	return [...factors].sort((a, b) => a - b);
}

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
	return numbers?.map((num) => Number(num))?.reduce((sum, number) => sum + number, 0);
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
		10
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

/**
 * * Rounds a number to a specified number of decimal places.
 *
 * @param number - The number to round.
 * @param roundTo - The number of decimal places to round to (default is `2`).
 * - If `roundTo` is negative, the number is rounded to the left of the decimal point (e.g., `-1` rounds to the nearest 10, `-2` to nearest 100 etc.).
 * @returns The rounded number, either in float or integer (if a whole number).
 *
 * @example
 * roundNumber(1234.56, -2); // 1200
 * roundNumber(1234.56, 1);  // 1234.6
 */
export function roundNumber(number: Numeric, roundTo = 2): number {
	const factor = Math.pow(10, roundTo);

	const num = isNumber(number) ? number : Number(number);

	return Math.round(num * factor) / factor;
}
