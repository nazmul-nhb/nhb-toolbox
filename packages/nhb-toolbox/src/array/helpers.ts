import { isNotEmptyObject } from '../guards/non-primitives';
import { normalizeNumber } from '../number/utilities';

/**
 * Safely resolves nested keys from a dot-separated string like "user.city".
 *
 * @param obj - The source object
 * @param path - The nested path string (e.g. "user.city")
 * @returns The resolved value or `undefined`
 */
export function _resolveNestedKey(obj: unknown, path: string): unknown {
	if (isNotEmptyObject(obj)) {
		return path?.split('.').reduce<unknown>((acc, key) => {
			if (isNotEmptyObject(acc)) {
				return acc[key];
			}
		}, obj);
	}
}

/**
 * Retrieves a numeric value from a nested property in dot notation.
 * Falls back to 0 if value is not a number or numeric string.
 *
 * @param obj - The source object to read from.
 * @param path - The path string like 'user.income.tax'.
 * @returns The numeric value at that path, or 0 if not valid.
 */
export function _getNumericProp(obj: unknown, path: string): number {
	if (isNotEmptyObject(obj)) {
		const value = path?.split('.').reduce<unknown>((acc, key) => {
			if (isNotEmptyObject(acc)) {
				return acc[key];
			}
		}, obj);

		return normalizeNumber(value) ?? 0;
	} else {
		return 0;
	}
}
