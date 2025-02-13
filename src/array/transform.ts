import { isDeepEqual } from '../utils';
import type { OptionInput, OptionsConfig } from './types';

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
	config: OptionsConfig<T, K1, K2>,
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
 * * Removes duplicate values from an array, supporting deep comparison for objects and arrays.
 *
 * @param array - The array from which duplicates need to be removed.
 * @returns A new array with duplicates removed.
 */
export function removeDuplicatesFromArray<T>(array: T[]): T[] {
	return array.filter(
		(item, index, self) =>
			index === self.findIndex((el) => isDeepEqual(el, item)),
	);
}
