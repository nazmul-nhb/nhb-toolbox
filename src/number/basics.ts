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
 * @returns The average of the provided numbers. Returns `NaN` if no numbers are provided or if any invalid values are encountered.
 */
export function getAverage(...numbers: Numeric[]): number {
	const cNumbers = numbers.map(Number);
	// Edge case: check if the input is an empty array or contains invalid values
	if (cNumbers.length === 0) {
		return NaN; // Return NaN if no numbers are provided
	}

	// Validate each number in the array
	const validNumbers = cNumbers.filter(
		(num) => typeof num === 'number' && !isNaN(num),
	);

	// Edge case: check if the valid numbers array is empty after filtering
	if (validNumbers.length === 0) {
		return NaN; // Return NaN if no valid numbers are found
	}

	// Calculate the sum of the valid numbers
	const sum = validNumbers.reduce((acc, curr) => acc + curr, 0);

	// Return the average
	return sum / validNumbers.length;
}

/**
 * * Calculates the percentage of a number based on a given part and total.
 *
 * @param part - The part of the total value.
 * @param total - The total value.
 * @returns The percentage of the part in relation to the total, rounded to two decimal places.
 *          Returns `NaN` if the total is zero or invalid.
 */
export function getPercentage(part: number, total: number): number {
	if (total === 0 || !Number.isFinite(total) || !Number.isFinite(part)) {
		return NaN; // Prevent division by zero or invalid values
	}
	return (part / total) * 100;
}

/**
 * * Calculates the number that a given percentage corresponds to based on a total value.
 *
 * @param percentage - The percentage of the total value.
 * @param total - The total value.
 * @returns The number corresponding to the given percentage of the total, rounded to two decimal places.
 *          Returns `NaN` if the total is zero or invalid.
 */
export function getValueFromPercentage(
	percentage: number,
	total: number,
): number {
	if (
		total === 0 ||
		!Number.isFinite(total) ||
		!Number.isFinite(percentage)
	) {
		return NaN; // Prevent division by zero or invalid values
	}
	return (percentage / 100) * total;
}

/**
 * * Calculates the original number based on the given percentage and the corresponding value.
 *
 * @param percentage - The percentage value (e.g., 10 for 10%).
 * @param percentageValue - The value corresponding to the given percentage.
 * @returns The original number from which the percentage value is derived, or `NaN` if invalid inputs are provided.
 */
export function getOriginalFromPercentage(
	percentage: number,
	percentageValue: number,
): number {
	if (
		percentage === 0 ||
		percentageValue === 0 ||
		!Number.isFinite(percentage) ||
		!Number.isFinite(percentageValue)
	) {
		return NaN; // Prevent division by zero or invalid values
	}

	const original = (percentageValue / percentage) * 100;
	return Math.round(original * 100) / 100;
}
