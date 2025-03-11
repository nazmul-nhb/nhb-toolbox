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
	input: number | `${number}`,
	options?: DecimalOptions<T>,
): ConvertedDecimal<T> => {
	const { decimalPlaces = 2, isString = false } = options || {};

	let number: number;

	if (typeof input === 'number') {
		number = input;
	} else {
		number = Number(input);
	}

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
export const calculateHCF = (...numbers: number[]): number => {
	let hcf = numbers[0];

	for (let i = 1; i < numbers.length; i++) {
		hcf = _find2NumbersHCF(hcf, numbers[i]);
	}

	return hcf;
};

/**
 * * Calculates the LCM/LCD of multiple numbers.
 *
 * @param numbers - List of numbers to find the LCM/LCD for.
 * @returns The LCM/LCD of all the provided numbers.
 */
export const calculateLCM = (...numbers: number[]): number => {
	let lcm = numbers[0];

	for (let i = 1; i < numbers.length; i++) {
		lcm = _find2NumbersLCM(lcm, numbers[i]);
	}

	return lcm;
};

/**
 * * Check if a number is even or not.
 *
 * @param input The number to check.
 * @returns Boolean: `true` if even and `false` if not even.
 */
export const isEven = (input: number): boolean => {
	return input % 2 === 0;
};

/**
 * * Checks if a number is odd or not.
 *
 * @param input The number to check.
 * @returns Boolean: `true` if odd and `false` if not odd.
 */
export const isOdd = (input: number): boolean => {
	return input % 2 !== 0;
};

/**
 * * Checks if a number is a multiple of another number.
 *
 * @param input - The number to check.
 * @param multipleOf - The number to check against.
 * @returns `true` if `input` is a multiple of `multipleOf`, otherwise `false`.
 */
export const isMultiple = (input: number, multipleOf: number): boolean => {
	return input % multipleOf === 0;
};
