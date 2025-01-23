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
