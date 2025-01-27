import type {
	Flattened,
	ConfigOptions,
	OptionInput,
	SortOptions,
	InputObject,
	OrderOption,
} from './types';

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
export function sortAnArray<T extends InputObject>(
	array: T[],
	options: SortOptions<T>,
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
export function sortAnArray<T extends InputObject>(
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

	// Handle object arrays
	if (options?.sortByField) {
		return [...array].sort((a, b) => {
			const key = options.sortByField as keyof T;
			const keyA = (a as T)[key];
			const keyB = (b as T)[key];

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

			throw new Error(
				'Cannot compare non-string/non-number/non-boolean properties.',
			);
		});
	}

	throw new Error('Invalid array or missing "sortByField" for objects.');
}

/**
 * * Filters an array of objects based on multiple conditions for specified keys.
 *
 * @template T - The type of objects in the array.
 * @param array - The array of objects to filter.
 * @param conditions - An object where keys represent the property names and values represent the filter conditions.
 *                     The conditions can be a value, a range, or a function.
 * @returns The filtered array of objects.
 */
export const filterArrayOfObjects = <T extends Record<string, unknown>>(
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
