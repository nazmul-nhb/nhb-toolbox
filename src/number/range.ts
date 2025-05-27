import { shuffleArray } from '../array/basics';
import { convertArrayToString } from '../utils/index';
import { getRandomNumber } from './basics';
import { isEven, isOdd } from './guards';
import { _applyMultiples } from './helpers';
import { isPrime } from './prime';
import type { NumberType, RangedNumbers, RangeOptions } from './types';

/**
 * * Function to get numbers within a range based on the provided `NumberType` and options.
 * * Returns either a string or an array of numbers based on the `getAs` property in options.
 *
 * @param type - The type of numbers to generate ('random', 'prime', etc.).
 * @param options - Options to configure number generation, including range and formatting.
 * @returns Either a string or an array of numbers.
 */
export function getNumbersInRange<T extends boolean = false>(
	type: NumberType = 'any',
	options?: RangeOptions<T>,
): RangedNumbers<T> {
	const {
		getAsString = false,
		min = 0,
		max = 100,
		includeMin = true,
		includeMax = true,
		separator = ', ',
		multiplesOf,
	} = options || {};

	let output: number[] = [];

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
				i >= startNumber &&
				i <= endNumber &&
				(includeMin || i > startNumber) &&
				(includeMax || i < endNumber)
			) {
				numbers.push(i);
			}
		}
		return numbers;
	};

	if (type === 'prime' && multiplesOf !== undefined) {
		console.warn(
			'Warning: The "multiplesOf" option is ignored when the type is "prime"!',
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
			output = _applyRangeOptions(min, max).filter(isOdd);
			break;

		case 'even':
			output = _applyRangeOptions(min, max).filter(isEven);
			break;

		case 'natural':
			output = _applyRangeOptions(Math.max(min, 1), max);
			break;

		default:
			output = _applyRangeOptions(min, max);
			break;
	}

	if (type !== 'prime') {
		output = _applyMultiples(output, multiplesOf);
	}

	return getAsString ?
			(convertArrayToString(output, separator) as RangedNumbers<T>)
		:	(output as RangedNumbers<T>);
}
