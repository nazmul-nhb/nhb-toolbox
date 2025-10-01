import { isNotEmptyObject } from '../guards/non-primitives';
import type { GenericObject } from './types';

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
 * * Extracts the keys of an object with proper typing.
 *
 * @remarks
 * - Internally uses `Object.keys(...)`.
 * - Returns an empty array (`[]`) for an empty object or a non-object value.
 *
 * @param obj The object from which to extract the keys.
 * @returns An array of keys from the specified object.
 */
export function extractObjectKeys<T extends GenericObject>(obj: T): Array<keyof T> {
	return isNotEmptyObject(obj) ? Object.keys(obj) : [];
}
