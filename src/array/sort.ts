import type { GenericObject } from '../object/types';
import type { OrderOption, SortByOption, SortOptions } from './types';

/**
 * * Sorts an array of strings.
 *
 * @param array - The array of strings to sort.
 * @param options - Sorting options.
 * @returns  The sorted array.
 */
export function sortAnArray(array: string[], options?: OrderOption): string[];

/**
 * * Sorts an array of numbers.
 *
 * @param array - The array of numbers to sort.
 * @param options - Sorting options.
 * @returns The sorted array.
 */
export function sortAnArray(array: number[], options?: OrderOption): number[];

/**
 * * Sorts an array of booleans.
 *
 * @param array - The array of booleans to sort.
 * @param options - Sorting options.
 * @returns The sorted array.
 */
export function sortAnArray(array: boolean[], options?: OrderOption): boolean[];

/**
 * * Sorts an array of objects.
 *
 * - Sorts array by the specified field.
 *
 * @template T - The type of objects in the array.
 * @param array - The array of objects to sort.
 * @param options - Sorting options.
 * @returns The sorted array.
 */
export function sortAnArray<T extends GenericObject>(
	array: T[],
	options: SortByOption<T>,
): T[];

/**
 * * Sorts an array of strings, numbers, booleans, or objects based on the provided options.
 *
 * - If the array contains strings, it sorts them alphabetically.
 * - If the array contains numbers, it sorts them numerically.
 * - If the array contains booleans, it sorts them by their boolean value.
 * - If the array contains objects, it sorts them by the specified field.
 * @template T - The type of objects in the array.
 * @param array - The array to sort.
 * @param options - Sorting options for objects.
 * @returns The sorted array.
 */
export function sortAnArray<T extends GenericObject>(
	array: (number | string | boolean | T)[],
	options?: SortOptions<T>,
): (number | string | boolean | T)[] {
	if (!Array.isArray(array) || array.length === 0) return array;

	// Check if the array contains strings
	if (typeof array[0] === 'string') {
		return [...array].sort((a, b) =>
			options?.sortOrder === 'desc' ?
				(b as string).localeCompare(a as string)
			:	(a as string).localeCompare(b as string),
		);
	}

	// Check if the array contains numbers
	if (typeof array[0] === 'number') {
		return [...array].sort((a, b) =>
			options?.sortOrder === 'desc' ?
				(b as number) - (a as number)
			:	(a as number) - (b as number),
		);
	}

	// Check if the array contains booleans
	if (typeof array[0] === 'boolean') {
		return [...array].sort((a, b) =>
			options?.sortOrder === 'desc' ?
				Number(b) - Number(a)
			:	Number(a) - Number(b),
		);
	}

	// Handle array of objects
	if (options?.sortByField) {
		return [...array].sort((a, b) => {
			// const key = options.sortByField as keyof T;
			// const keyA = (a as T)[key];
			// const keyB = (b as T)[key];

			const getKeyValue = (obj: T, path: string): unknown =>
				path
					.split('.')
					.reduce<unknown>((acc, key) => (acc as T)?.[key], obj);

			const keyA = getKeyValue(a as T, options.sortByField as string);
			const keyB = getKeyValue(b as T, options.sortByField as string);

			if (keyA == null || keyB == null) {
				return keyA == null ? 1 : -1;
			}

			if (typeof keyA === 'string' && typeof keyB === 'string') {
				return options?.sortOrder === 'desc' ?
						keyB.localeCompare(keyA)
					:	keyA.localeCompare(keyB);
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
