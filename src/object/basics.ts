import type { GenericObject, QueryObject } from './types';

/**
 * * Utility to generate query parameters from an object.
 *
 * @template T - A generic type extending `Record<string, string | number | (string | number | null | undefined)[]>` (`QueryObject`).
 * @param params - Object containing query parameters.
 * @returns A query string as a URL-encoded string, e.g., `?key1=value1&key2=value2`.
 *
 * @example
 * generateQueryParams({ key1: 'value1', key2: 42 }); // "?key1=value1&key2=42"
 * generateQueryParams({ key1: ['value1', 'value2'], key2: 42 }); // "?key1=value1&key1=value2&key2=42"
 * generateQueryParams({ key1: '', key2: null }); // ""
 */
export const generateQueryParams = <T extends QueryObject>(
	params: T = {} as T,
): string => {
	const queryParams = Object.entries(params)
		.filter(
			([_, value]) =>
				value !== undefined &&
				value !== null &&
				!(typeof value === 'string' && value.trim() === ''),
		)
		.flatMap(([key, value]) =>
			Array.isArray(value) ?
				value
					.filter(
						(v) =>
							v !== undefined &&
							v !== null &&
							!(typeof v === 'string' && v.trim() === ''),
					)
					.map(
						(v) =>
							`${encodeURIComponent(key)}=${encodeURIComponent(
								String(v),
							)}`,
					)
			:	`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
		)
		.join('&');

	return queryParams ? `?${queryParams}` : '';
};

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
 * * Check if an object is empty.
 *
 * @param obj Object to check.
 * @returns Whether the object is empty.
 */
export const isEmptyObject = <T extends GenericObject>(obj: T): boolean => {
	return Object.keys(obj).length === 0 && obj.constructor === Object;
};

/**
 * * Count the number of fields in an object.
 *
 * @param obj Object to check.
 * @returns Number of fields in the object.
 */
export const countObjectFields = <T extends GenericObject>(obj: T): number => {
	return Object.keys(obj).length;
};

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
			isDeepEqual((a as GenericObject)[key], (b as GenericObject)[key]),
		);
	}

	return false;
};
