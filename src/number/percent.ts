import { getAverage } from './basics';
import { areInvalidNumbers } from './guards';
import type { PercentageOptions } from './types';

/**
 * * Performs a percentage-related calculation based on the given mode and inputs.
 *
 * - `get-percent`: Calculates what percentage the `part` is of the `total`.
 * - `get-value`: Calculates the value from a given `percentage` of a `total`.
 * - `get-original`: Calculates the original value from a known `value` and `percentage`.
 * - `get-change-percent`: Percent increase/decrease from `oldValue` to `newValue`.
 * - `apply-percent-change`: Applies increase/decrease by `percentage` to `baseValue`.
 * - `get-percent-difference`: Absolute percent difference between two values.
 * - `inverse-percent`: What percent `total` is of `part`.
 *
 * @param options - The calculation mode and inputs required for the operation.
 * @returns The calculated number rounded to three decimal places, or `NaN` if input is invalid.
 */
export function calculatePercentage(options: PercentageOptions): number {
	const { roundTo = 3 } = options;

	/**
	 * - Rounds a number to the specified number of decimal places.
	 *
	 * @param num - The number to round.
	 * @returns The rounded number.
	 */
	const _roundNumber = (num: number) => {
		const factor = Math.pow(10, roundTo);

		return Math.round(num * factor) / factor;
	};

	switch (options?.mode) {
		case 'get-percent': {
			const { part, total } = options;

			if (areInvalidNumbers(part, total) || total === 0) {
				return NaN;
			}

			return _roundNumber((part / total) * 100);
		}

		case 'get-value': {
			const { percentage, total } = options;

			if (areInvalidNumbers(percentage, total) || total === 0) {
				return NaN;
			}

			return _roundNumber((percentage / 100) * total);
		}

		case 'get-original': {
			const { percentage, value } = options;

			if (areInvalidNumbers(percentage, value) || percentage === 0) {
				return NaN;
			}

			return _roundNumber((value / percentage) * 100);
		}

		case 'get-change-percent': {
			const { oldValue, newValue } = options;

			if (areInvalidNumbers(oldValue, newValue) || oldValue === 0) {
				return NaN;
			}

			const change = ((newValue - oldValue) / oldValue) * 100;

			return _roundNumber(change);
		}

		case 'apply-percent-change': {
			const { baseValue, percentage } = options;

			if (areInvalidNumbers(baseValue, percentage)) {
				return NaN;
			}

			const value = baseValue * (1 + percentage / 100);

			return _roundNumber(value);
		}

		case 'get-percent-difference': {
			const { value1, value2 } = options;

			if (areInvalidNumbers(value1, value2)) {
				return NaN;
			}

			const avg = getAverage(value1, value2);

			if (avg === 0) {
				return NaN;
			}

			const diff = (Math.abs(value1 - value2) / avg) * 100;

			return _roundNumber(diff);
		}

		case 'inverse-percent': {
			const { part, total } = options;

			if (areInvalidNumbers(part, total) || part === 0) {
				return NaN;
			}

			return _roundNumber((total / part) * 100);
		}

		default:
			return NaN;
	}
}
