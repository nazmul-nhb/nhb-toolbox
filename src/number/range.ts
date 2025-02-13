import { shuffleArray } from '../array/basics';
import { convertArrayToString } from '../utils';
import { getRandomNumber } from './basics';
import { isPrime } from './prime';
import type { GetAs, NumberType, RangedNumbers, RangeOptions } from './types';

/**
 * * Function to get numbers within a range based on the provided `NumberType` and options.
 * * Returns either a string or an array of numbers based on the `getAs` property in options.
 *
 * @param type - The type of numbers to generate ('random', 'prime', etc.).
 * @param options - Options to configure number generation, including range and formatting.
 * @returns Either a string or an array of numbers.
 */
export function getNumbersInRange<T extends GetAs>(
	type: NumberType = 'any',
	options?: RangeOptions<T>,
): RangedNumbers<T> {
	const {
		getAs = 'array',
		min = 0,
		max = 100,
		includeMin = true,
		includeMax = true,
		separator = ',',
		multiples,
	} = options || {};

	let output: number[] = [];

	/**
	 * Apply multiples of a number if there is any.
	 * @param array Array of numbers to apply the condition on.
	 * @param multiples The multiples of which number.
	 * @returns Array of multiples of the desired number
	 */
	const _applyMultiples = (array: number[], multiples?: number): number[] => {
		if (!multiples) return array;
		return array.filter((n) => n % multiples === 0);
	};

	/**
	 * Helper function to apply range and get array of numbers in that range.
	 *
	 * @param start The start of the range.
	 * @param end The end of the range.
	 * @returns The array of numbers in the range.
	 */
	const _applyRangeOptions = (start: number, end: number): number[] => {
		let startNumber = start;
		let endNumber = end;

		if (start > end) {
			[startNumber, endNumber] = [end, start];
		}

		const numbers: number[] = [];

		for (let i = startNumber; i <= endNumber; i++) {
			if (
				i >= min &&
				i <= max &&
				(includeMin || i > min) &&
				(includeMax || i < max)
			) {
				numbers.push(i);
			}
		}
		return numbers;
	};

	if (type === 'prime' && multiples !== undefined) {
		console.warn(
			'Warning: The "multiples" option is ignored when the type is "prime"!',
		);
	}

	switch (type) {
		case 'random':
			output = shuffleArray(
				_applyRangeOptions(min, max).map((n) =>
					getRandomNumber({
						min: n,
						max: n,
						includeMin,
						includeMax,
					}),
				),
			);
			break;

		case 'prime':
			output = _applyRangeOptions(min, max).filter(isPrime);
			break;

		case 'odd':
			output = _applyRangeOptions(min, max).filter((i) => i % 2 !== 0);
			break;

		case 'even':
			output = _applyRangeOptions(min, max).filter((i) => i % 2 === 0);
			break;

		case 'natural':
			output = _applyRangeOptions(Math.max(min, 1), max);
			break;

		default:
			output = _applyRangeOptions(min, max);
			break;
	}

	if (type !== 'prime') {
		output = _applyMultiples(output, multiples);
	}

	return getAs === 'string' ?
			(convertArrayToString(output, separator) as RangedNumbers<T>)
		:	(output as RangedNumbers<T>);
}
