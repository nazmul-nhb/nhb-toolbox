import { isDateLike } from '../date/guards';
import { isFileOrBlob } from '../form/guards';
import {
	isEmptyObject,
	isNotEmptyObject,
	isObject,
} from '../guards/non-primitives';
import type { FlattenPartial } from '../types/index';
import { isDeepEqual } from '../utils/index';
import { parseObjectValues } from './sanitize';
import type {
	Expand,
	FlattenDotValue,
	FlattenLeafValue,
	GenericObject,
	MergeAll,
	Objects,
} from './types';

/**
 * Deeply merges two or more objects.
 * Objects are merged recursively. Later values override earlier ones unless both are plain objects.
 *
 * @param objects - List of objects to be merged.
 * @returns A new object with deeply merged properties from all input objects.
 *
 * @example
 * const obj1 = { a: 1, b: { x: 10 } };
 * const obj2 = { b: { y: 20 }, c: 3 };
 * const merged = mergeObjects(obj1, obj2);
 * // merged = { a: 1, b: { x: 10, y: 20 }, c: 3 }
 *
 * @example
 * mergeObjects(
 *   { a: 1, b: 2 },
 *   { p: { c: 3 }, d: 4 },
 *   { p: { e: 5 }, f: 6 }
 * );
 * // => { a: 1, b: 2, p: { c: 3, e: 5 }, d: 4, f: 6 }
 */
export const mergeObjects = <T extends Objects>(
	...objects: T
): Expand<MergeAll<T>> => {
	const map = new Map<string, GenericObject>();

	for (const obj of objects) {
		for (const key in obj) {
			const existingValue = map.get(key);

			if (isNotEmptyObject(obj[key])) {
				if (isNotEmptyObject(existingValue)) {
					if (isDateLike(obj[key]) || isFileOrBlob(obj[key])) {
						map.set(key, obj[key]);
					} else {
						map.set(key, mergeObjects(existingValue, obj[key]));
					}
				} else {
					map.set(key, obj[key]);
				}
			} else {
				map.set(key, obj[key]);
			}
		}
	}

	const result: GenericObject = {};

	map?.forEach((value, key) => {
		result[key] = value;
	});

	return result as Expand<MergeAll<T>>;
};

/**
 * * Deeply merge objects and flatten nested objects.
 * * Useful for flattening a single object or merging multiple objects with duplicate key(s).
 * * If keys are duplicated, the last object's value will be used.
 *
 * @param objects Objects to merge.
 * @returns Merged object with flattened structure.
 */
export const mergeAndFlattenObjects = <T extends Objects>(
	...objects: T
): Expand<FlattenDotValue<MergeAll<T>>> => {
	const map = new Map<string, GenericObject>();

	const _flattenObject = (obj: GenericObject, parentKey = '') => {
		for (const key in obj) {
			const newKey = parentKey ? `${String(parentKey)}.${key}` : key;

			if (isNotEmptyObject(obj[key])) {
				if (isDateLike(obj[key]) || isFileOrBlob(obj[key])) {
					map.set(newKey, obj[key]);
				} else {
					_flattenObject(obj[key], newKey);
				}
			} else {
				map.set(newKey, obj[key]);
			}
		}
	};

	for (const obj of objects) {
		_flattenObject(obj);
	}

	const result = {} as GenericObject;

	map?.forEach((value, key) => {
		result[key] = value;
	});

	return result as Expand<FlattenDotValue<MergeAll<T>>>;
};

/**
 * * Flattens a nested object into key-value format.
 *
 * @param object - The `object` to flatten.
 * @returns A `flattened object` in key-value format.
 */
export const flattenObjectKeyValue = <T extends GenericObject>(
	object: T
): Expand<FlattenLeafValue<MergeAll<[T]>>> => {
	const flattened: GenericObject = {};

	for (const [key, value] of Object.entries(object)) {
		if (isNotEmptyObject(value)) {
			const nestedFlattened = flattenObjectKeyValue(value);

			if (isDateLike(value) || isFileOrBlob(value)) {
				flattened[key] = value;
			} else {
				Object.assign(flattened, nestedFlattened);
			}
		} else {
			flattened[key] = value;
		}
	}

	return flattened as Expand<FlattenLeafValue<MergeAll<[T]>>>;
};

/**
 * * Flattens a nested object into a dot notation format.
 *
 * @param object - The `object` to flatten.
 * @returns A `flattened object` with dot notation keys.
 */
export const flattenObjectDotNotation = <T extends GenericObject>(
	object: T
): Expand<FlattenDotValue<MergeAll<[T]>>> => {
	/**
	 * * Recursively flattens an object, transforming nested structures into dot-notation keys.
	 *
	 * @param source - The `object` to be flattened.
	 * @param prefix - The prefix to prepend to each key. Used for nested objects.
	 * @returns A flattened version of the input object.
	 */
	const _flattenObject = (
		source: GenericObject,
		prefix: keyof T = ''
	): GenericObject => {
		const flattened: GenericObject = {};

		for (const [key, value] of Object.entries(source)) {
			const newKey = prefix ? `${String(prefix)}.${key}` : key;

			if (isNotEmptyObject(value) || isFileOrBlob(value)) {
				if (isDateLike(value)) {
					flattened[newKey] = value;
				} else {
					Object.assign(flattened, _flattenObject(value, newKey));
				}
			} else {
				flattened[newKey] = value;
			}
		}

		return flattened;
	};

	return _flattenObject(object) as Expand<FlattenDotValue<MergeAll<[T]>>>;
};

/**
 * * Extracts only the fields that have changed between the original and updated object.
 *
 * @param baseObject The original object to compare against.
 * @param updatedObject The modified object containing potential updates.
 * @returns A new object containing only the changed fields.
 */
export const extractUpdatedFields = <T extends GenericObject>(
	baseObject: T,
	updatedObject: FlattenPartial<T>
): FlattenPartial<T> => {
	const updatedFields: FlattenPartial<T> = {};

	for (const key in updatedObject) {
		if (
			key in baseObject &&
			!isDeepEqual(updatedObject[key], baseObject[key])
		) {
			if (updatedObject[key] && isNotEmptyObject(updatedObject[key])) {
				updatedFields[key] = extractUpdatedFields(
					baseObject[key],
					updatedObject[key] as FlattenPartial<T>
				) as T[keyof T];

				if (updatedFields[key] && isEmptyObject(updatedFields[key])) {
					delete updatedFields[key];
				}
			} else {
				updatedFields[key] = updatedObject[key];
			}
		}
	}

	return updatedFields;
};

/**
 * * Extracts only new fields that exist in updatedObject but not in baseObject.
 *
 * @param baseObject The original object to compare against.
 * @param updatedObject The modified object containing potential new fields.
 * @returns A new object containing only the new fields.
 */
export const extractNewFields = <
	T extends GenericObject,
	U extends GenericObject,
>(
	baseObject: T,
	updatedObject: FlattenPartial<T> & FlattenPartial<U>
): FlattenPartial<U> => {
	const newFields: FlattenPartial<U> = {};

	for (const key in updatedObject) {
		if (!(key in baseObject)) {
			// Directly assign new fields
			newFields[key as keyof FlattenPartial<U>] = updatedObject[key];
		} else if (
			isNotEmptyObject(updatedObject[key]) &&
			isNotEmptyObject(baseObject[key])
		) {
			// Recursively extract new fields inside nested objects
			const nestedNewFields = extractNewFields(
				baseObject[key] as T,
				updatedObject[key] as FlattenPartial<T> & FlattenPartial<U>
			);

			if (isNotEmptyObject(nestedNewFields)) {
				newFields[key as keyof FlattenPartial<U>] =
					nestedNewFields as T[keyof T];
			}
		}
	}

	return newFields;
};

/**
 * * Extracts changed fields from the updated object while also identifying newly added keys.
 *
 * @param baseObject The original object to compare against.
 * @param updatedObject The modified object containing potential updates.
 * @returns An object containing modified fields and new fields separately.
 */
export const extractUpdatedAndNewFields = <
	T extends GenericObject,
	U extends GenericObject,
>(
	baseObject: T,
	updatedObject: FlattenPartial<T> & FlattenPartial<U>
): FlattenPartial<T> & FlattenPartial<U> => {
	const updatedFields: FlattenPartial<T> = {};
	const newFields: FlattenPartial<U> = {};

	for (const key in updatedObject) {
		if (!(key in baseObject)) {
			newFields[key as keyof FlattenPartial<U>] = updatedObject[key];
		} else if (!isDeepEqual(updatedObject[key], baseObject[key])) {
			if (updatedObject[key] && isNotEmptyObject(updatedObject[key])) {
				updatedFields[key as keyof T] = extractUpdatedAndNewFields(
					baseObject[key] as T,
					updatedObject[key]
				) as T[keyof T];

				if (updatedFields[key] && isEmptyObject(updatedFields[key])) {
					delete updatedFields[key];
				}
			} else {
				updatedFields[key as keyof T] = updatedObject[key];
			}
		}
	}

	return { ...updatedFields, ...newFields };
};

/**
 * * Safely parses a JSON string into an object.
 * * Optionally converts stringified primitive values inside the object (e.g., `"0"` → `0`, `"true"` → `true`, `"null"` → `null`).
 *
 * @param value - The JSON string to parse.
 * @param parsePrimitives - Whether to convert stringified primitives into real values (default: `true`).
 * @returns A parsed object with primitive conversions, or an empty object on failure or if the root is not a valid object.
 * - Returns `{}` if parsing fails, such as when the input is malformed or invalid JSON or passing single quoted string.
 *
 * - **N.B.** This function will return an empty object if the JSON string is invalid or if the root element is not an object.
 *
 * - *Unlike `parseJSON`, which returns any valid JSON structure (including arrays, strings, numbers, etc.),
 * this function strictly ensures that the result is an object and optionally transforms stringified primitives.*
 *
 * @see parseJSON - For parsing generic JSON values (arrays, numbers, etc.) with optional primitive transformation.
 *
 */
export const parseJsonToObject = <T extends GenericObject = GenericObject>(
	value: string,
	parsePrimitives = true
): T => {
	try {
		const data = JSON.parse(value) as T;

		if (!isObject(data)) {
			return {} as T;
		}

		return parsePrimitives ? parseObjectValues<T>(data) : data;
	} catch {
		return {} as T;
	}
};
