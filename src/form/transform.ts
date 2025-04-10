import { generateQueryParams } from '../dom/query';
import type { ParsedFormData, SerializedForm } from './types';

/**
 * * Serialize form data into an object or a query string.
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

	formData.forEach((value, key) => {
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
 * * Parse form data from a query string or FormData object into a structured object format.
 *
 * @param formData - The FormData object or query string to parse.
 * @returns The parsed form data as an object.
 */
export function parseFormData<T extends FormData | string>(
	formData: T,
): ParsedFormData<T> {
	const data: Record<string, unknown> = {};

	if (typeof formData === 'string') {
		const params = new URLSearchParams(formData);

		params.forEach((value, key) => {
			const existing = data[key];

			if (typeof existing === 'string') {
				data[key] = [existing, value];
			} else if (Array.isArray(existing)) {
				data[key] = [...existing, value];
			} else {
				data[key] = value;
			}
		});
	} else {
		formData.forEach((value, key) => {
			const existing = data[key];

			if (value instanceof File) {
				if (Array.isArray(existing)) {
					data[key] = [...existing, value];
				} else if (existing instanceof File) {
					data[key] = [existing, value];
				} else {
					data[key] = value;
				}
			} else {
				if (typeof existing === 'string') {
					data[key] = [existing, value];
				} else if (Array.isArray(existing)) {
					data[key] = [...existing, value];
				} else {
					data[key] = value;
				}
			}
		});
	}

	return data as ParsedFormData<T>;
}
