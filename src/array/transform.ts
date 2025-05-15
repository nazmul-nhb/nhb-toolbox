import { isNumber } from '../guards/primitives';
import type { GenericObject } from '../object/types';
import { isDeepEqual } from '../utils';
import type { FieldValue, Option, OptionsConfig } from './types';

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
	V extends boolean = false,
>(
	data: T[],
	config: OptionsConfig<T, K1, K2, V>,
): Array<{ [P in K1 | K2]: FieldValue<P, T, K1, K2, V> }> => {
	const {
		firstFieldKey,
		secondFieldKey,
		firstFieldName = 'value' as K1,
		secondFieldName = 'label' as K2,
		retainNumberValue = false,
	} = config || {};

	if (data && data?.length) {
		return data?.map((datum) => {
			const firstValue =
				retainNumberValue && isNumber(datum[firstFieldKey]) ?
					datum[firstFieldKey]
				:	String(datum[firstFieldKey] ?? '');

			return {
				[firstFieldName]: firstValue,
				[secondFieldName]: String(datum[secondFieldKey] ?? ''),
			};
		}) as Array<Option<T, K1, K2, V>>;
	} else {
		return [] as Array<Option<T, K1, K2, V>>;
	}
};

/**
 * * Removes duplicate values from an array, supporting deep comparison for objects and arrays.
 *
 * @param array - The array from which duplicates need to be removed.
 * @returns A new array with duplicates removed.
 */
export function removeDuplicatesFromArray<T>(array: T[]): T[] {
	return array?.filter(
		(item, index, self) =>
			index === self?.findIndex((el) => isDeepEqual(el, item)),
	);
}

/**
 * * Finds duplicate values in an array, runs deep comparison for objects and arrays.
 *
 * @param array - The array in which to find duplicates.
 * @returns An array containing all duplicate entries (each one only once).
 */
export function getDuplicates<T>(array: T[]): T[] {
	const seen: T[] = [];
	const duplicates: T[] = [];

	for (const item of array) {
		const hasSeen = seen?.find((el) => isDeepEqual(el, item));
		const hasDuplicate = duplicates?.find((el) => isDeepEqual(el, item));

		if (hasSeen && !hasDuplicate) {
			duplicates.push(item);
		} else if (!hasSeen) {
			seen.push(item);
		}
	}

	return duplicates;
}

/**
 * * Finds elements missing from one array compared to another using deep comparison.
 *
 * @param options - Configuration to specify which array to compare and direction of check.
 * @returns An array of missing elements based on the comparison direction.
 */

/**
 * * Finds elements missing from one array compared to another using deep comparison.
 *
 * @param array1 The first array to compare.
 * @param array2 The second array to compare.
 * @param missingFrom Which direction to compare for missing values:.
 *					  - `'from-first'` → values in `array1` missing in `array2`.
 *					  - `'from-second'` → values in `array2` missing in `array1`.
 * @returns An array of missing elements based on the comparison direction.
 */
export function findMissingElements<T, U>(
	array1: T[],
	array2: U[],
	missingFrom: 'from-first' | 'from-second',
): (T | U)[] {
	const source = (missingFrom === 'from-first' ? array1 : array2) ?? [];
	const target = (missingFrom === 'from-first' ? array2 : array1) ?? [];

	return source.filter((s) => !target?.some((t) => isDeepEqual(t, s)));
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

	for (let i = 0; i < arr?.length; i += chunkSize) {
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
	const length = arr?.length;

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
