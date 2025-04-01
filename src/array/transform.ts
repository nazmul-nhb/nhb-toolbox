import type { GenericObject } from '../object/types';
import { isDeepEqual } from '../utils';
import type { OptionsConfig } from './types';

/**
 * * Converts an array of objects into a formatted array of options.
 *
 * @param data - An array of objects to convert into options.
 * @param config - The configuration object to specify the keys for the `value` (firstFieldName) and `label` (secondFieldName) fields and rename as needed.
 * @returns An array of options, where each option has `value` and `label` fields as default or as specified by user in the config options.
 */
export const createOptionsArray = <
	T extends GenericObject,
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

/**
 * * Splits an array into chunks of a given size.
 *
 * @param arr The array to split.
 * @param chunkSize The size of each chunk.
 * @returns An array of chunked arrays.
 */
export function splitArray<T>(arr: T[], chunkSize: number): T[][] {
	const result: T[][] = [];

	for (let i = 0; i < arr.length; i += chunkSize) {
		result.push(arr.slice(i, i + chunkSize));
	}

	return result;
}

/**
 * * Rotates an array left or right by a given number of steps.
 *
 * @param arr The array to rotate.
 * @param steps The number of positions to rotate (positive: right, negative: left).
 * @returns The rotated array.
 */
export function rotateArray<T>(arr: T[], steps: number): T[] {
	const length = arr.length;

	if (length === 0) return arr;

	const offset = ((steps % length) + length) % length;

	return arr.slice(-offset).concat(arr.slice(0, -offset));
}

/**
 * * Moves an element within an array from one index to another.
 *
 * @param arr The array to modify.
 * @param fromIndex The index of the element to move.
 * @param toIndex The new index for the element.
 * @returns A new array with the element moved.
 */
export function moveArrayElement<T>(
	arr: T[],
	fromIndex: number,
	toIndex: number,
): T[] {
	const newArr = [...arr];

	const [item] = newArr.splice(fromIndex, 1);

	newArr.splice(toIndex, 0, item);

	return newArr;
}
