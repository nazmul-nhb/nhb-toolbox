import { flattenObjectKeyValue } from '../object/objectify';
import { parseObjectValues } from '../object/sanitize';
import type { QueryObject, StrictObject } from '../object/types';
import type { QueryString } from '../string/types';
import { deepParsePrimitives } from '../utils/index';

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
		?.filter(
			([_, value]) =>
				value !== undefined &&
				value !== null &&
				!(typeof value === 'string' && value?.trim() === ''),
		)
		?.flatMap(([key, value]) =>
			Array.isArray(value) ?
				value
					?.filter(
						(v) =>
							v !== undefined &&
							v !== null &&
							!(typeof v === 'string' && v.trim() === ''),
					)
					?.map(
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
 *
 * - **Note:** *Extracts query parameters from the current URL (window.location.search).*
 *
 * @returns Query string as key-value paired object. `Record<string, string>`.
 */
export function getQueryParams(): Record<string, string> {
	return Object.fromEntries(new URLSearchParams(window?.location?.search));
}

/**
 * * Update query params in the browser URL with given key and value.
 * @param key Key for the query to update.
 * @param value Value to updated against the given key.
 */
export function updateQueryParam(key: string, value: string) {
	const url = new URL(window.location.href);
	url.searchParams.set(key, value);
	window.history.replaceState({}, '', url?.toString());
}

/**
 * Parses a query string (with optional `?` prefix) into an object.
 * Supports multiple values for the same key by returning arrays.
 * Optionally parses primitive string values into actual types (e.g., "1" → 1, "true" → true).
 *
 * - **Note:** *This function does **not** access or depend on `current URL` a.k.a `window.location.search`.*
 *
 * @param query - The query string to parse.
 * @param parsePrimitives - Whether to convert stringified primitives into real values (default: true).
 * @returns An object where keys are strings and values can be string, array, number, boolean, or null.
 */
export const parseQueryString = (
	query: string,
	parsePrimitives = true,
): StrictObject => {
	const params = new URLSearchParams(
		query.startsWith('?') ? query.slice(1) : query,
	);

	const entries: StrictObject = {};

	for (const [key, value] of params.entries()) {
		if (key in entries) {
			const current = entries[key];

			const array =
				Array.isArray(current) ? [...current, value] : [current, value];

			entries[key] = parsePrimitives ? deepParsePrimitives(array) : array;
		} else {
			entries[key] = value;
		}
	}

	return parsePrimitives ? parseObjectValues(entries) : entries;
};
