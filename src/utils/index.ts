import { isValidButEmptyArray } from '../array/basics';
import type { LooseObject } from '../object/types';

/**
 * * Deeply compare two values (arrays, objects, or primitive values).
 *
 * @param a First value to compare.
 * @param b Second value to compare.
 * @returns Whether the values are deeply equal.
 */
export const isDeepEqual = <T>(a: T, b: T): boolean => {
	// If both values are strictly equal (handles primitive types and same references)
	if (a === b) return true;

	// If the types of the two values are different
	if (typeof a !== typeof b) return false;

	// If either is null or undefined, they must both be null or undefined
	if (a === null || b === null) return a === b;

	// Check for array equality
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		return a.every((element, index) => isDeepEqual(element, b[index]));
	}

	// Check for object equality
	if (typeof a === 'object' && typeof b === 'object') {
		const aKeys = Object.keys(a);
		const bKeys = Object.keys(b);

		if (aKeys.length !== bKeys.length) return false;

		return aKeys.every((key) =>
			isDeepEqual((a as LooseObject)[key], (b as LooseObject)[key]),
		);
	}

	return false;
};

/**
 * * Utility to convert an array to string with custom separator.
 *
 * @param array Array to convert.
 * @param separator Separate each element of the array. Can be `,`, `-`, `|` etc. Default is `,`.
 * @returns Converted array in string format with the separator.
 */
export const convertArrayToString = <T>(
	array: T[],
	separator: string = ',',
): string => {
	if (!isValidButEmptyArray) {
		throw new Error('Please, provide a valid array!');
	}
	return array.join(separator);
};
