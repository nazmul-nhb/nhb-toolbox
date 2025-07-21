import {
	isArrayOfType,
	isObject,
	isValidArray,
} from '../guards/non-primitives';
import { isBoolean, isNumber, isString } from '../guards/primitives';
import type { GenericObject } from '../object/types';
import type { OrderOption, SortByOption, SortOptions } from './types';
import { naturalSort } from './utils';

/**
 * * Sorts an array of objects.
 *
 * - Sorts array by the specified field.
 *
 * @param array - The array of objects to sort.
 * @param options - Sorting options.
 * @returns The sorted array.
 */
export function sortAnArray<T extends GenericObject>(
	array: T[],
	options: SortByOption<T>
): T[];

/**
 * * Sorts an array of `strings`, `numbers` or `boolean`.
 *
 * @param array - The array of `strings`, `numbers` or `boolean` to sort.
 * @param options - Sorting options.
 * @returns  The sorted array.
 */
export function sortAnArray<T extends string | number | boolean>(
	array: T[],
	options?: OrderOption
): T[];

/**
 * * Sorts an array of strings, numbers, booleans, or objects based on the provided options.
 *
 * - If the array contains strings, it sorts them alphabetically.
 * - If the array contains numbers, it sorts them numerically.
 * - If the array contains booleans, it sorts them by their boolean value.
 * - If the array contains objects, it sorts them by the specified field in the options `sortByField`.
 *
 * @param array - The array to sort.
 * @param options - Sorting options for objects.
 * @returns The sorted array.
 */
export function sortAnArray<
	T extends number | string | boolean | GenericObject,
>(array: T[], options?: SortOptions<T>): T[] {
	if (!isValidArray(array)) return array;

	// Check if the array contains strings
	if (isArrayOfType(array, isString)) {
		return [...array].sort((a, b) =>
			options?.sortOrder === 'desc' ?
				naturalSort(b, a)
			:	naturalSort(a, b)
		);
	}

	// Check if the array contains numbers
	if (isArrayOfType(array, isNumber)) {
		return [...array].sort((a, b) =>
			options?.sortOrder === 'desc' ? b - a : a - b
		);
	}

	// Check if the array contains booleans
	if (isArrayOfType(array, isBoolean)) {
		return [...array].sort((a, b) =>
			options?.sortOrder === 'desc' ?
				Number(b) - Number(a)
			:	Number(a) - Number(b)
		);
	}

	// Handle array of objects
	if (isArrayOfType(array, isObject) && options && 'sortByField' in options) {
		return [...array].sort((a, b) => {
			const _getKeyValue = (obj: T, path: string): unknown => {
				return path
					.split('.')
					.reduce<unknown>(
						(acc, key) => (acc as T)?.[key as keyof T],
						obj
					);
			};

			const keyA = _getKeyValue(a, options?.sortByField);
			const keyB = _getKeyValue(b, options?.sortByField);

			if (keyA == null || keyB == null) {
				return keyA == null ? 1 : -1;
			}

			if (typeof keyA === 'string' && typeof keyB === 'string') {
				return options?.sortOrder === 'desc' ?
						naturalSort(keyB, keyA)
					:	naturalSort(keyA, keyB);
			}

			if (typeof keyA === 'number' && typeof keyB === 'number') {
				return options?.sortOrder === 'desc' ?
						keyB - keyA
					:	keyA - keyB;
			}

			if (typeof keyA === 'boolean' && typeof keyB === 'boolean') {
				return options?.sortOrder === 'desc' ?
						Number(keyB) - Number(keyA)
					:	Number(keyA) - Number(keyB);
			}

			return 0;
		});
	}

	return array;
}
