import type { DecimalOptions, RandomNumberOptions } from './types';

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
 * * Utility to round a number to a given decimal places.
 *
 * @param num - Number to round.
 * @param options - Options for rounding behavior, including decimal places and return type.
 * @returns Converted number (as a `number`) or string (if `isString` is `true`).
 */
export const convertToDecimal = (
	num: number,
	options?: DecimalOptions,
): number | string => {
	const { decimalPlaces = 2, isString = false } = options || {};

	if (isString) {
		return num.toFixed(decimalPlaces);
	}

	return parseFloat(num.toFixed(decimalPlaces));
};
