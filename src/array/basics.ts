import type { GenericObject } from '../object/types';
import type { Flattened } from './types';

/**
 * * Flattens a nested array recursively or wraps any non-array data type in an array.
 *
 * @typeParam T : The type of the input, which can be a nested array or a non-array value.
 * @param input - The input value, which can be a nested array or a non-array value.
 * @returns A fully flattened array of type `Flatten<T>`. If the input is not an array, it wraps it in a single-element array.
 */
export const flattenArray = <T>(input: T | T[]): Flattened<T>[] => {
	if (!Array.isArray(input)) return [input] as Flattened<T>[];

	return input.reduce<Flattened<T>[]>((acc, item) => {
		// If item is an array, recursively flatten it; otherwise, add it directly.
		return acc.concat(Array.isArray(item) ? flattenArray(item) : [item]);
	}, []);
};

/**
 * * Filters an array of objects based on multiple conditions for specified keys.
 *
 * @template T - The type of objects in the array.
 * @param array - The array of objects to filter.
 * @param conditions - An object where keys represent the property names and values represent the filter conditions.
 *                     The conditions can be a value, a range, or a function.
 * @returns The filtered array of objects.
 */
export const filterArrayOfObjects = <T extends GenericObject>(
	array: T[],
	conditions: { [K in keyof T]?: (value: T[K]) => boolean },
): T[] => {
	if (!Array.isArray(array)) {
		throw new Error('The provided input is not an array!');
	}

	return array.filter((item) =>
		Object.entries(conditions).every(([key, conditionFn]) => {
			// Ensure only check the key in the object if the condition function is provided
			if (conditionFn) {
				// Type assertion for the value since it's unknown
				return conditionFn(item[key as keyof T] as T[keyof T]);
			}
			// If no condition function, include all values for the key
			return true;
		}),
	);
};

/**
 * * Check if an array is empty.
 *
 * @param array Array to check.
 * @returns Whether the array is empty.
 */
export const isValidButEmptyArray = <T>(array: T[] | unknown): boolean => {
	return Array.isArray(array) && array.length === 0;
};
