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
export const deepClone = <T extends Record<string, unknown>>(obj: T): T => {
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
 *
 * @param objects Objects to merge.
 * @returns Merged object with flattened structure.
 */
export const flattenObject = <T extends Record<string, unknown>>(
	...objects: T[]
): T => {
	const map = new Map<string, unknown>();

	const flattenObject = (obj: Record<string, unknown>, parentKey = '') => {
		for (const key in obj) {
			const newKey = parentKey ? `${parentKey}.${key}` : key;
			if (obj[key] instanceof Object && !Array.isArray(obj[key])) {
				// Recursively flatten nested objects
				flattenObject(obj[key] as Record<string, unknown>, newKey);
			} else {
				// Set the flattened key
				map.set(newKey, obj[key]);
			}
		}
	};

	objects.forEach((obj) => flattenObject(obj));

	const result = {} as T;

	map.forEach((value, key) => {
		result[key as keyof T] = value as T[keyof T];
	});

	return result;
};

/**
 * * Deeply compare two values (arrays, objects, or primitive values).
 *
 * @param a First value to compare.
 * @param b Second value to compare.
 * @returns Whether the values are deeply equal.
 */
export const deepEqual = <T>(a: T, b: T): boolean => {
	// If both values are strictly equal (handles primitive types and same references)
	if (a === b) return true;

	// If the types of the two values are different
	if (typeof a !== typeof b) return false;

	// If either is null or undefined, they must both be null or undefined
	if (a === null || b === null) return a === b;

	// Check for array equality
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		return a.every((element, index) => deepEqual(element, b[index]));
	}

	// Check for object equality
	if (typeof a === 'object' && typeof b === 'object') {
		const aKeys = Object.keys(a);
		const bKeys = Object.keys(b);

		if (aKeys.length !== bKeys.length) return false;

		return aKeys.every((key) =>
			deepEqual(
				(a as Record<string, unknown>)[key],
				(b as Record<string, unknown>)[key],
			),
		);
	}

	return false;
};
