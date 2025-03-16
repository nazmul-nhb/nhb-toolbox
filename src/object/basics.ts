import { flattenObjectKeyValue } from './objectify';
import type { GenericObject, QueryObject } from './types';

/**
 * * Utility to generate query parameters from an object.
 *
 * @template T - A generic type extending `QueryObject`.
 * @param params - Object containing query parameters.
 * @returns A query string as a URL-encoded string, e.g., `?key1=value1&key2=value2`.
 *
 * @example
 * generateQueryParams({ key1: 'value1', key2: 42 }); // "?key1=value1&key2=42"
 * generateQueryParams({ key1: ['value1', 'value2'], key2: 42 }); // "?key1=value1&key1=value2&key2=42"
 * generateQueryParams({ key1: '', key2: null }); // ""
 * generateQueryParams({ key1: true, key2: false }); // "?key1=true&key2=false"
 * generateQueryParams({ filters: { category: 'laptop', price: 1000 } }); // "?category=laptop&price=1000"
 */
export const generateQueryParams = <T extends QueryObject>(
	params: T = {} as T,
): string => {
	// Flatten the nested object into key-value pairs
	const flattenedParams = flattenObjectKeyValue(params);

	// Generate the query string
	const queryParams = Object.entries(flattenedParams)
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
								typeof v === 'boolean' ? String(v) : String(v),
							)}`,
					)
			:	`${encodeURIComponent(key)}=${encodeURIComponent(
					typeof value === 'boolean' ? String(value) : String(value),
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
	if (obj != null) return countObjectFields(obj) === 0;

	return false;
};

/**
 * * Count the number of fields in an object.
 *
 * @param obj Object to check.
 * @returns Number of fields in the object.
 */
export const countObjectFields = <T extends GenericObject>(obj: T): number => {
	if (obj != null) return Object.keys(obj).length;

	return 0;
};

/**
 * * Check whether data is object and not array.
 *
 * @param data Data to check if its an object and not array.
 * @returns Boolean: `true` if it's an object, `false` if not.
 */
export const isObject = (data: unknown): boolean => {
	return typeof data === 'object' && !Array.isArray(data);
};
