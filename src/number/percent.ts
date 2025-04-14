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
	switch (options?.mode) {
		case 'get-percent': {
			const { part, total } = options;

			if (areInvalidNumbers(part, total) || total === 0) {
				return NaN;
			}

			return Math.round((part / total) * 100 * 1000) / 1000;
		}

		case 'get-value': {
			const { percentage, total } = options;

			if (areInvalidNumbers(percentage, total) || total === 0) {
				return NaN;
			}

			return Math.round((percentage / 100) * total * 1000) / 1000;
		}

		case 'get-original': {
			const { percentage, value } = options;

			if (areInvalidNumbers(percentage, value) || percentage === 0) {
				return NaN;
			}

			return Math.round((value / percentage) * 100 * 1000) / 1000;
		}

		case 'get-change-percent': {
			const { oldValue, newValue } = options;

			if (areInvalidNumbers(oldValue, newValue) || oldValue === 0) {
				return NaN;
			}

			const change = ((newValue - oldValue) / oldValue) * 100;

			return Math.round(change * 1000) / 1000;
		}

		case 'apply-percent-change': {
			const { baseValue, percentage } = options;

			if (areInvalidNumbers(baseValue, percentage)) {
				return NaN;
			}

			const value = baseValue * (1 + percentage / 100);

			return Math.round(value * 1000) / 1000;
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

			return Math.round(diff * 1000) / 1000;
		}

		case 'inverse-percent': {
			const { part, total } = options;

			if (areInvalidNumbers(part, total) || part === 0) {
				return NaN;
			}

			return Math.round((total / part) * 100 * 1000) / 1000;
		}

		default:
			return NaN;
	}
}
