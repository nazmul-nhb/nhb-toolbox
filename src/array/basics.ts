import type { GenericObject } from '../object/types';
import type { Flattened } from './types';

/**
 * * Flattens a nested array recursively or wraps any non-array data type in an array.
 *
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
 * @deprecated _Please, use `findAll` instance method from `Finder` class for **more advanced filtering and searching.**_
 *
 * * Filters an array of objects based on multiple conditions for specified keys.
 * @param array - The array of objects to filter.
 * @param conditions - An object where keys represent the property names and values represent filter conditions.
 *                     The conditions can be a function `(value: T[K]) => boolean`.
 * @returns The filtered array of objects.
 * @throws `Error` If the input is not a valid array.
 */
export const filterArrayOfObjects = <T extends GenericObject>(
	array: T[],
	conditions: { [K in keyof T]?: (value: T[K] | undefined) => boolean }
): T[] => {
	if (!Array.isArray(array)) {
		throw new Error('The provided input is not a valid array!');
	}

	return array?.filter((item) =>
		Object.entries(conditions)?.every(([key, conditionFn]) => {
			if (typeof conditionFn === 'function') {
				return conditionFn(item[key as keyof T] as T[keyof T] | undefined);
			}
			return true;
		})
	);
};

/**
 * * Checks if a value is an empty array or an array with only empty values.
 *
 * @param value - The value to check.
 * @returns `true` if the value is not an array, an empty array, or an array containing only `null`, `undefined`, empty objects, or empty arrays.
 */
export const isInvalidOrEmptyArray = <T>(value: T): boolean => {
	if (!Array.isArray(value)) return true;

	if (value?.length === 0) return true;

	return value?.every(
		(item) =>
			item == null ||
			(Array.isArray(item) && item?.length === 0) ||
			(typeof item === 'object' && Object.keys(item || {})?.length === 0)
	);
};

/**
 * * Shuffle the elements of an array.
 *
 * @param array Array to shuffle.
 * @returns Shuffled array.
 */
export const shuffleArray = <T>(array: T[]): T[] => {
	if (isInvalidOrEmptyArray(array)) return array;

	const shuffled = structuredClone(array);

	for (let i = shuffled?.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	return shuffled;
};

/**
 * * Get the last element of an array.
 *
 * @param array Array to get the last element from.
 * @returns The last element or `undefined` if the array is empty.
 */
export const getLastArrayElement = <T>(array: T[]): T | undefined => {
	return array?.length > 0 ? array[array?.length - 1] : undefined;
};
