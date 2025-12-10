import { isArrayOfType, isObject, isValidArray } from '../guards/non-primitives';
import { isBoolean, isNumber, isString } from '../guards/primitives';
import type { GenericObject } from '../object/types';
import type { BasicPrimitive } from '../types/index';
import type { OrderOption, SortByOption, SortNature, SortOptions } from './types';

/**
 * Compare two strings using natural sorting (e.g., `"file2"` < `"file10"`).
 * - Optionally supports case-insensitive and locale-aware string chunk comparisons.
 *
 * @param a - The first string to compare.
 * @param b - The second string to compare.
 * @param options - Optional settings to configure comparison behavior.
 * @returns A negative number if `a` comes before `b`, a positive number if `a` comes after `b`, or 0 if equal.
 */
export function naturalSort(a: string, b: string, options?: SortNature): number {
	const { caseInsensitive = true, localeAware = false } = options || {};

	/**
	 * * Splits a string into an array of number and non-number chunks.
	 * @param str - The string to split.
	 * @returns An array of string and number parts.
	 */
	const _createChunks = (str: string): (string | number)[] => {
		const chunks: (string | number)[] = [];

		let current = '';
		let isNumeric = false;

		for (const char of str) {
			const charIsNum = !Number.isNaN(Number(char));

			if (current?.length === 0) {
				current = char;
				isNumeric = charIsNum;
				continue;
			}

			if (charIsNum === isNumeric) {
				current += char;
			} else {
				chunks?.push(isNumeric ? Number(current) : current);
				current = char;
				isNumeric = charIsNum;
			}
		}

		if (current?.length > 0) {
			chunks?.push(isNumeric ? Number(current) : current);
		}

		return chunks;
	};

	const aChunks = _createChunks(a);
	const bChunks = _createChunks(b);

	for (let i = 0; i < Math.min(aChunks?.length, bChunks?.length); i++) {
		let aChunk = aChunks[i];
		let bChunk = bChunks[i];

		// Normalize string chunks if case-insensitive
		if (caseInsensitive && typeof aChunk === 'string' && typeof bChunk === 'string') {
			aChunk = aChunk?.toLowerCase();
			bChunk = bChunk?.toLowerCase();
		}

		// Compare types: number vs string
		if (typeof aChunk !== typeof bChunk) {
			return typeof aChunk === 'string' ? 1 : -1;
		}

		// Compare same-type chunks
		if (aChunk !== bChunk) {
			if (typeof aChunk === 'number' && typeof bChunk === 'number') {
				return aChunk - bChunk;
			}

			if (typeof aChunk === 'string' && typeof bChunk === 'string') {
				if (localeAware) {
					const cmp = aChunk.localeCompare(bChunk, undefined, {
						sensitivity: caseInsensitive ? 'accent' : 'variant',
					});
					if (cmp !== 0) return cmp;
				}
				return aChunk < bChunk ? -1 : 1;
			}
		}
	}

	return aChunks?.length - bChunks?.length;
}

/**
 * * Sorts an array of objects based on the provided options.
 *
 * @remarks
 * - Sorts array by the specified field in the options `sortByField`.
 * - Uses {@link naturalSort} for sorting string values.
 *
 * @param array - The array of objects to sort.
 * @param options - Sorting options for objects.
 * @returns The sorted array.
 */
export function sortAnArray<T extends GenericObject>(array: T[], options: SortByOption<T>): T[];

/**
 * * Sorts an array of `strings`, `numbers` or `boolean` based on the provided options.
 *
 * @remarks
 * - If the array contains strings, it sorts them alphabetically.
 * - If the array contains numbers, it sorts them numerically.
 * - If the array contains booleans, it sorts them by their boolean value.
 * - Uses {@link naturalSort} for sorting string values.
 *
 * @param array - The array of `strings`, `numbers` or `boolean` to sort.
 * @param options - Sorting options.
 * @returns  The sorted array.
 */
export function sortAnArray<T extends BasicPrimitive>(array: T[], options?: OrderOption): T[];

/**
 * * Sorts an array of strings, numbers, booleans, or objects based on the provided options.
 *
 * @param array - The array to sort.
 * @param options - Sorting options.
 * @returns The sorted array.
 */
export function sortAnArray<T extends BasicPrimitive | GenericObject>(
	array: T[],
	options?: SortOptions<T>
): T[] {
	if (!isValidArray(array)) return array;

	// Check if the array contains strings
	if (isArrayOfType(array, isString)) {
		return [...array].sort((a, b) =>
			options?.sortOrder === 'desc' ? naturalSort(b, a) : naturalSort(a, b)
		);
	}

	// Check if the array contains numbers
	if (isArrayOfType(array, isNumber)) {
		return [...array].sort((a, b) => (options?.sortOrder === 'desc' ? b - a : a - b));
	}

	// Check if the array contains booleans
	if (isArrayOfType(array, isBoolean)) {
		return [...array].sort((a, b) =>
			options?.sortOrder === 'desc' ? Number(b) - Number(a) : Number(a) - Number(b)
		);
	}

	// Handle array of objects
	if (isArrayOfType(array, isObject) && options && 'sortByField' in options) {
		return [...array].sort((a, b) => {
			const _getKeyValue = (obj: T, path: string): unknown => {
				return path
					.split('.')
					.reduce<unknown>((acc, key) => (acc as T)?.[key as keyof T], obj);
			};

			const keyA = _getKeyValue(a, options?.sortByField);
			const keyB = _getKeyValue(b, options?.sortByField);

			if (keyA == null || keyB == null) {
				return keyA == null ? 1 : -1;
			}

			if (isString(keyA) && isString(keyB)) {
				return options?.sortOrder === 'desc' ?
						naturalSort(keyB, keyA)
					:	naturalSort(keyA, keyB);
			}

			if (isNumber(keyA) && isNumber(keyB)) {
				return options?.sortOrder === 'desc' ? keyB - keyA : keyA - keyB;
			}

			if (isBoolean(keyA) && isBoolean(keyB)) {
				return options?.sortOrder === 'desc' ?
						Number(keyB) - Number(keyA)
					:	Number(keyA) - Number(keyB);
			}

			return 0;
		});
	}

	return [...array];
}
