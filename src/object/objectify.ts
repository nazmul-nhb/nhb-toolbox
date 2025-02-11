import { isDeepEqual } from '../utils';
import { isEmptyObject, isObject } from './basics';
import type { GenericObject, LooseObject } from './types';

/**
 * * Deeply merge two or more objects using `Map`.
 *
 * @param objects Objects to merge.
 * @returns Merged object.
 */
export const mergeObjects = <T extends GenericObject>(...objects: T[]): T => {
	const map = new Map<string, unknown>();

	objects.forEach((obj) => {
		for (const key in obj) {
			const existingValue = map.get(key);

			if (obj[key] instanceof Object && !Array.isArray(obj[key])) {
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
 * * Flattens a nested object into a dot notation format.
 *
 * @param object - The `object` to flatten.
 * @returns A `flattened object` with dot notation keys.
 */
export const flattenObject = <T extends GenericObject>(
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

			if (value && typeof value === 'object' && !Array.isArray(value)) {
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
export const extractUpdatedFields = <T extends LooseObject>(
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
					baseObject[key],
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
export const extractNewFields = <T extends LooseObject>(
	baseObject: T,
	updatedObject: Partial<T>,
): Partial<T> => {
	const newFields: Partial<T> = {};

	for (const key in updatedObject) {
		if (!(key in baseObject)) {
			// Directly assign new fields
			newFields[key] = updatedObject[key];
		} else if (isObject(updatedObject[key]) && isObject(baseObject[key])) {
			// Recursively extract new fields inside nested objects
			const nestedNewFields = extractNewFields(
				baseObject[key] as LooseObject,
				updatedObject[key] as LooseObject,
			);

			if (!isEmptyObject(nestedNewFields)) {
				newFields[key] = nestedNewFields as T[keyof T];
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
export const extractUpdatedAndNewFields = <T extends LooseObject>(
	baseObject: T,
	updatedObject: Partial<T> & LooseObject,
): Partial<T> & LooseObject => {
	const updatedFields: Partial<T> = {};
	const newFields: LooseObject = {};

	for (const key in updatedObject) {
		if (!(key in baseObject)) {
			newFields[key] = updatedObject[key];
		} else if (!isDeepEqual(updatedObject[key], baseObject[key])) {
			if (updatedObject[key] && isObject(updatedObject[key])) {
				updatedFields[key as keyof T] = extractUpdatedAndNewFields(
					baseObject[key],
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
