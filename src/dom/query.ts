import { flattenObjectKeyValue } from '../object/objectify';
import type { QueryObject } from '../object/types';
import type { QueryString } from '../string/types';

/**
 * * Utility to generate query parameters from an object.
 *
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
): QueryString => {
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
 * * Get query params as standard `JavaScript` Object `Record<string, string>`.
 * @returns Query string as key-value paired object. `Record<string, string>`.
 */
export function getQueryParams(): Record<string, string> {
	return Object.fromEntries(new URLSearchParams(window.location.search));
}

/**
 * * Update query params in the browser URL with given key and value.
 * @param key Key for the query to update.
 * @param value Value to updated against the given key.
 */
export function updateQueryParam(key: string, value: string) {
	const url = new URL(window.location.href);
	url.searchParams.set(key, value);
	window.history.replaceState({}, '', url.toString());
}
