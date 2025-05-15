import { generateQueryParams } from '../dom/query';
import { parseObjectValues } from '../object/sanitize';
import type { ParsedFormData, SerializedForm } from './types';

/**
 * * Serialize form data into an object or a query string.
 * - **N.B.** Be cautious when using this in SSR (Server-Side Rendering) environments (such as `Next.js` Server Components), as it may not work as expected.
 *
 * @param form - The form element to serialize.
 * @param toQueryString - Whether to return the result as a query string. If false, returns an object.
 * @returns The serialized form data as an object or query string.
 */
export function serializeForm<T extends boolean = false>(
	form: HTMLFormElement,
	toQueryString: T = false as T,
): SerializedForm<T> {
	const formData = new FormData(form);
	const data: Record<string, string | string[]> = {};

	formData?.forEach((value, key) => {
		// If the key already exists, we make it an array to handle multiple selections
		if (data[key]) {
			data[key] =
				Array.isArray(data[key]) ?
					[...data[key], value.toString()]
				:	[data[key], value.toString()];
		} else {
			data[key] = value.toString();
		}
	});

	if (toQueryString) {
		const queryString = generateQueryParams(data);
		return queryString as SerializedForm<T>;
	}

	return data as SerializedForm<T>;
}

/**
 * * Parse form data from a `FormData` object or query string into a structured object format.
 *
 * @param data - The `FormData` object or query string to parse.
 * @param parsePrimitives - Whether to parse string values into primitive types (e.g., boolean, number, array, object). Defaults to `true`.
 * @returns The parsed form data as an object.
 */
export function parseFormData<T extends FormData | string>(
	data: T,
	parsePrimitives = true,
): ParsedFormData<T> {
	const parsed: Record<string, unknown> = {};

	if (typeof data === 'string') {
		const params = new URLSearchParams(data);

		params?.forEach((value, key) => {
			const existing = parsed[key];

			if (typeof existing === 'string') {
				parsed[key] = [existing, value];
			} else if (Array.isArray(existing)) {
				parsed[key] = [...existing, value];
			} else {
				parsed[key] = value;
			}
		});
	} else {
		data?.forEach((value, key) => {
			const existing = parsed[key];

			if (value instanceof File) {
				if (Array.isArray(existing)) {
					parsed[key] = [...existing, value];
				} else if (existing instanceof File) {
					parsed[key] = [existing, value];
				} else {
					parsed[key] = value;
				}
			} else {
				if (typeof existing === 'string') {
					parsed[key] = [existing, value];
				} else if (Array.isArray(existing)) {
					parsed[key] = [...existing, value];
				} else {
					parsed[key] = value;
				}
			}
		});
	}

	if (parsePrimitives) {
		return parseObjectValues(parsed) as ParsedFormData<T>;
	} else {
		return parsed as ParsedFormData<T>;
	}
}
