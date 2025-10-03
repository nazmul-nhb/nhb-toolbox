import { isNotEmptyObject } from '../guards/non-primitives';
import type { Tuple } from '../utils/types';
import type { DeepKeysTuple, GenericObject } from './types';

/**
 * * Deep clone an object.
 *
 * @param obj Object to clone.
 * @returns Deep cloned object.
 */
export const cloneObject = <T extends GenericObject>(obj: T): T => {
	return JSON.parse(JSON.stringify(obj));
};

/**
 * * Count the number of fields in an object.
 *
 * @param obj Object to check.
 * @returns Number of fields in the object.
 */
export const countObjectFields = <T extends GenericObject>(obj: T): number => {
	if (obj != null) return Object.keys(obj)?.length;

	return 0;
};

/**
 * * Extracts all the top-level keys of an object as tuple.
 *
 * @remarks
 * - Internally uses `Object.keys(...)`.
 * - Returns an empty array (`[]`) for an empty object or a non-object value.
 *
 * @param obj The object from which to extract the keys.
 * @returns An tuple of keys from the specified object.
 */
export function extractObjectKeys<T extends GenericObject>(obj: T): Tuple<keyof T> {
	return (isNotEmptyObject(obj) ? Object.keys(obj) : []) as Tuple<keyof T>;
}

/**
 * * Recursively extracts all nested keys from an object as a tuple.
 *
 * @remarks
 * - Returns an empty array (`[]`) for an empty object or a non-object value.
 *
 * @param obj The object from which to extract the keys.
 * @returns An tuple of all the nested keys from the specified object.
 */
export function extractObjectKeysDeep<T extends GenericObject>(obj: T): DeepKeysTuple<T> {
	function _getDeepKeys(candidate: GenericObject): string[] {
		let result: string[] = [];

		for (const key in candidate) {
			result.push(key);

			if (isNotEmptyObject(candidate[key])) {
				result = [...result, ..._getDeepKeys(candidate[key])];
			}
		}

		return result;
	}

	return (isNotEmptyObject(obj) ? _getDeepKeys(obj) : []) as DeepKeysTuple<T>;
}
