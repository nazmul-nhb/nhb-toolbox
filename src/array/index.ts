import type { Flatten, SelectOptions } from './types';

/**
 * * Flattens a nested array recursively or wraps any non-array data type in an array.
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

/**
 * * Converts an array of objects into a formatted array of select options.
 *
 * @typeParam T - The type of each object in the `data` array.
 * @param data - An array of objects to convert into select options.
 * @param valueKey - The key in each object to use as the `value` field in the select options.
 * @param labelKey - The key in each object to use as the `label` field in the select options.
 * @returns An array of select options, where each option has a `value` and `label` field.
 */
export const createSelectOptions = <
	T extends Record<string, string | number | null | undefined>,
>(
	data: T[],
	valueKey: keyof T,
	labelKey: keyof T,
): SelectOptions[] => {
	if (data && data.length) {
		return data.map((datum) => ({
			value: String(datum[valueKey] ?? ''),
			label: String(datum[labelKey] ?? ''),
		}));
	} else {
		return [];
	}
};
