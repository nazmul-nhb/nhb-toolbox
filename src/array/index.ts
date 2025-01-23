import type { Flatten } from './types';

/**
 * Flattens a nested array recursively or wraps any non-array data type in an array.
 *
 * @typeParam T : The type of the input, which can be a nested array or a non-array value.
 * @param input - The input value, which can be a nested array or a non-array value.
 * @returns A fully flattened array of type `Flatten<T>`. If the input is not an array, it wraps it in a single-element array.
 */
export const flattenArray = <T>(input: T | T[]): Flatten<T>[] => {
	if (!Array.isArray(input)) return [input] as Flatten<T>[];

	return input.reduce<Flatten<T>[]>((acc, item) => {
		// If item is an array, recursively flatten it; otherwise, add it directly.
		return acc.concat(Array.isArray(item) ? flattenArray(item) : [item]);
	}, []);
};
