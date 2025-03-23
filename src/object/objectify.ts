import type { UncontrolledAny } from '../types';
import { isDeepEqual } from '../utils';
import { isEmptyObject, isObject } from './basics';
import type { GenericObject } from './types';

/**
 * * Deeply merge two or more objects using `Map`.
 *
 * @param objects Objects to merge.
 * @returns Merged object.
 */
export const mergeObjects = <T extends GenericObject>(...objects: T[]): T => {
	const map = new Map<string, UncontrolledAny>();

	objects.forEach((obj) => {
		for (const key in obj) {
			const existingValue = map.get(key);

			if ((obj[key] as T) instanceof Object && !Array.isArray(obj[key])) {
				// If the key already exists in the map and both are objects, merge them
				if (
					existingValue &&
					existingValue instanceof Object &&
					!Array.isArray(existingValue)
				) {
					map.set(
						key,
						mergeObjects(
							existingValue as GenericObject,
							obj[key] as GenericObject,
						),
					);
				} else {
					// Otherwise, just set the value
					map.set(key, obj[key]);
				}
			} else {
				// If it's not an object, just set the value
				map.set(key, obj[key]);
			}
		}
	});

	const result = {} as T;

	map.forEach((value, key) => {
		result[key as keyof T] = value as T[keyof T];
	});

	return result;
};

/**
 * * Deeply merge objects and flatten nested objects.
 * * Useful for flattening a single object or merging multiple objects with duplicate key(s).
 * * If keys are duplicated, the last object's value will be used.
 *
 * @param objects Objects to merge.
 * @returns Merged object with flattened structure.
 */
export const mergeAndFlattenObjects = <T extends GenericObject>(
	...objects: T[]
): GenericObject => {
	const map = new Map<string, unknown>();

	const _flattenObject = (obj: GenericObject, parentKey: keyof T = '') => {
		for (const key in obj) {
			const newKey = parentKey ? `${String(parentKey)}.${key}` : key;
			if (obj[key] instanceof Object && !Array.isArray(obj[key])) {
				// Recursively flatten nested objects
				_flattenObject(obj[key] as GenericObject, newKey);
			} else {
				// Set the flattened key
				map.set(newKey, obj[key]);
			}
		}
	};

	objects.forEach((obj) => _flattenObject(obj));

	const result = {} as T;

	map.forEach((value, key) => {
		result[key as keyof T] = value as T[keyof T];
	});

	return result;
};

/**
 * * Flattens a nested object into key-value format.
 *
 * @param object - The `object` to flatten.
 * @returns A `flattened object` in key-value format.
 */
export const flattenObjectKeyValue = <T extends GenericObject>(
	object: T,
): T => {
	const flattened: GenericObject = {};

	for (const [key, value] of Object.entries(object)) {
		if (
			typeof value === 'object' &&
			value !== null &&
			!Array.isArray(value)
		) {
			// Recursively flatten nested objects
			const nestedFlattened = flattenObjectKeyValue(value);
			Object.assign(flattened, nestedFlattened);
		} else {
			// Directly assign non-object values
			flattened[key] = value;
		}
	}

	return flattened as T;
};

/**
 * * Flattens a nested object into a dot notation format.
 *
 * @param object - The `object` to flatten.
 * @returns A `flattened object` with dot notation keys.
 */
export const flattenObjectDotNotation = <T extends GenericObject>(
	object: T,
): GenericObject => {
	/**
	 * * Recursively flattens an object, transforming nested structures into dot-notation keys.
	 *
	 * @param source - The `object` to be flattened.
	 * @param prefix - The prefix to prepend to each key. Used for nested objects.
	 * @returns A flattened version of the input object.
	 */
	const _flattenObject = (source: T, prefix: keyof T = ''): GenericObject => {
		const flattened: GenericObject = {};

		for (const [key, value] of Object.entries(source)) {
			// Construct the dot-notation key
			const newKey = prefix ? `${String(prefix)}.${key}` : key;

			if (
				value &&
				typeof value === 'object' &&
				!Array.isArray(value) &&
				value !== null
			) {
				// Recursively process nested objects
				Object.assign(flattened, _flattenObject(value as T, newKey));
			} else {
				// Directly assign non-object values
				flattened[newKey] = value;
			}
		}

		return flattened;
	};

	// Call the recursive function with an empty prefix initially
	return _flattenObject(object);
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
	updatedObject: Partial<T>,
): Partial<T> => {
	const updatedFields: Partial<T> = {};

	for (const key in updatedObject) {
		if (
			key in baseObject &&
			!isDeepEqual(updatedObject[key], baseObject[key])
		) {
			if (updatedObject[key] && isObject(updatedObject[key])) {
				updatedFields[key] = extractUpdatedFields(
					baseObject[key] as T,
					updatedObject[key],
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
	updatedObject: Partial<T> & Partial<U>,
): Partial<U> => {
	const newFields: Partial<U> = {};

	for (const key in updatedObject) {
		if (!(key in baseObject)) {
			// Directly assign new fields
			newFields[key as keyof Partial<U>] = updatedObject[key];
		} else if (isObject(updatedObject[key]) && isObject(baseObject[key])) {
			// Recursively extract new fields inside nested objects
			const nestedNewFields = extractNewFields(
				baseObject[key] as T,
				updatedObject[key] as Partial<T> & Partial<U>,
			);

			if (!isEmptyObject(nestedNewFields)) {
				newFields[key as keyof Partial<U>] =
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
	updatedObject: Partial<T> & Partial<U>,
): Partial<T> & Partial<U> => {
	const updatedFields: Partial<T> = {};
	const newFields: Partial<U> = {};

	for (const key in updatedObject) {
		if (!(key in baseObject)) {
			newFields[key as keyof Partial<U>] = updatedObject[key];
		} else if (!isDeepEqual(updatedObject[key], baseObject[key])) {
			if (updatedObject[key] && isObject(updatedObject[key])) {
				updatedFields[key as keyof T] = extractUpdatedAndNewFields(
					baseObject[key] as T,
					updatedObject[key],
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
