import type { ObjectToSanitize, SanitizeOptions } from './types';

/**
 * * Utility function to generate query parameters from an object.
 *
 * @template T - A generic type extending `Record<string, string | number | string[] | number[]>`.
 * @param params - Object containing query parameters.
 * @returns A query string as a URL-encoded string, e.g., `?key1=value1&key2=value2`.
 *
 * @example
 * generateQueryParams({ key1: 'value1', key2: 42 }); // "?key1=value1&key2=42"
 * generateQueryParams({ key1: ['value1', 'value2'], key2: 42 }); // "?key1=value1&key1=value2&key2=42"
 */
export const generateQueryParams = <
	T extends Record<string, string | number | string[] | number[]>,
>(
	params: T = {} as T,
): string => {
	const queryParams = Object.entries(params)
		.filter(([_, value]) => value !== undefined && value !== null)
		.flatMap(([key, value]) =>
			Array.isArray(value)
				? value.map(
						(v) =>
							`${encodeURIComponent(key)}=${encodeURIComponent(
								String(v),
							)}`,
					)
				: `${encodeURIComponent(key)}=${encodeURIComponent(
						String(value),
					)}`,
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
export const cloneObject = <T extends Record<string, unknown>>(obj: T): T => {
	return JSON.parse(JSON.stringify(obj));
};

/**
 * * Check if an object is empty.
 *
 * @param obj Object to check.
 * @returns Whether the object is empty.
 */
export const isEmptyObject = <T extends Record<string, unknown>>(
	obj: T,
): boolean => {
	return Object.keys(obj).length === 0;
};

/**
 * * Count the number of fields in an object.
 *
 * @param obj Object to check.
 * @returns Number of fields in the object.
 */
export const countObjectFields = <T extends Record<string, unknown>>(
	obj: T,
): number => {
	return Object.keys(obj).length;
};

/**
 * * Deeply merge two or more objects using `Map`.
 *
 * @param objects Objects to merge.
 * @returns Merged object.
 */
export const mergeObjects = <T extends Record<string, unknown>>(
	...objects: T[]
): T => {
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
							existingValue as Record<string, unknown>,
							obj[key] as Record<string, unknown>,
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
export const mergeAndFlattenObjects = <T extends Record<string, unknown>>(
	...objects: T[]
): Record<string, unknown> => {
	const map = new Map<string, unknown>();

	const _flattenObject = (
		obj: Record<string, unknown>,
		parentKey: keyof T = '',
	) => {
		for (const key in obj) {
			const newKey = parentKey ? `${String(parentKey)}.${key}` : key;
			if (obj[key] instanceof Object && !Array.isArray(obj[key])) {
				// Recursively flatten nested objects
				_flattenObject(obj[key] as Record<string, unknown>, newKey);
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
export const flattenObject = <T extends Record<string, unknown>>(
	object: T,
): Record<string, unknown> => {
	/**
	 * * Recursively flattens an object, transforming nested structures into dot-notation keys.
	 *
	 * @param source - The `object` to be flattened.
	 * @param prefix - The prefix to prepend to each key. Used for nested objects.
	 * @returns A flattened version of the input object.
	 */
	const _flattenObject = (
		source: T,
		prefix: keyof T = '',
	): Record<string, unknown> => {
		const flattened: Record<string, unknown> = {};

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
			isDeepEqual(
				(a as Record<string, unknown>)[key],
				(b as Record<string, unknown>)[key],
			),
		);
	}

	return false;
};

/**
 * * Processes an object by ignoring specified keys and trimming string values based on options provided.
 * * Also excludes nullish values (null, undefined) if specified.
 *
 * @param object - The object to process.
 * @param options - Options that define which keys to ignore, whether to trim string values, and whether to exclude nullish values.
 * @returns A new object with the specified modifications.
 */
export function sanitizeData<T extends ObjectToSanitize>(
	object: T,
	options?: SanitizeOptions<T>,
): T;

/**
 * * Processes an array of objects by ignoring specified keys and trimming string values based on options provided.
 * * Also excludes nullish values (null, undefined) if specified.
 *
 * @param object - The object to process.
 * @param options - Options that define which keys to ignore, whether to trim string values, and whether to exclude nullish values.
 * @returns A new array of objects with the specified modifications.
 */
export function sanitizeData<T extends ObjectToSanitize>(
	array: T[],
	options?: SanitizeOptions<T>,
): T[];

/**
 * Processes an object or array of objects by ignoring specified keys and trimming string values.
 * Also excludes nullish values (null, undefined) if specified.
 *
 * @param input - The object or array of objects to process.
 * @param options - Options for processing.
 * @returns A new object or array of objects with the specified modifications.
 */
export function sanitizeData<T extends ObjectToSanitize>(
	input: T | T[],
	options?: SanitizeOptions<T>,
): T | T[] {
	const {
		ignoreKeys = [],
		trimStrings = true,
		ignoreNullish = false,
	} = options || {};

	// Helper function to process a single object
	const _processObject = (obj: T): T =>
		Object.entries(obj).reduce((acc, [key, value]) => {
			// Skip ignored keys 
			if (ignoreKeys.includes(key as keyof T)) {
				return acc;
			}

			// Exclude nullish values if specified
			if (ignoreNullish && (value === null || value === undefined)) {
				return acc;
			}

			// Trim string values if enabled
			if (typeof value === 'string' && trimStrings) {
				acc[key as keyof T] = value.trim().replace(/\s+/g, ' ') as T[keyof T];
			} else if (value && typeof value === 'object' && !Array.isArray(value)) {
				// Recursively process nested objects
				acc[key as keyof T] = _processObject(value as T) as T[keyof T];
			} else {
				// Add other values as-is
				acc[key as keyof T] = value as T[keyof T];
			}

			return acc;
		}, {} as T);

	// Process the input
	if (Array.isArray(input)) {
		return input.map((obj) => _processObject(obj));
	} else if (typeof input === 'object' && input !== null) {
		return _processObject(input);
	}

	// Return input as-it-is if not an object or array
	return input;
}
