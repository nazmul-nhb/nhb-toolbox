import type { Flattened, ConfigOptions, OptionInput } from './types';

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
 * * Converts an array of objects into a formatted array of options.
 *
 * @typeParam T - The type of each object in the `data` array.
 * @param data - An array of objects to convert into options.
 * @param config - The configuration object to specify the keys for the `value` (firstFieldName) and `label` (secondFieldName) fields and rename as needed.
 * @returns An array of options, where each option has `value` and `label` fields as default or as specified by user in the config options.
 */
export const createOptionsArray = <
	T extends OptionInput,
	K1 extends string = 'value',
	K2 extends string = 'label',
>(
	data: T[],
	config: ConfigOptions<T, K1, K2>,
): { [P in K1 | K2]: string }[] => {
	const {
		firstFieldKey,
		secondFieldKey,
		firstFieldName = 'value' as K1,
		secondFieldName = 'label' as K2,
	} = config || {};
	if (data && data.length) {
		return data.map((datum) => ({
			[firstFieldName]: String(datum[firstFieldKey] ?? ''),
			[secondFieldName]: String(datum[secondFieldKey] ?? ''),
		})) as { [P in K1 | K2]: string }[];
	} else {
		return [];
	}
};
