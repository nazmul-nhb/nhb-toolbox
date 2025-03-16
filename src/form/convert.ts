import { isValidEmptyArray } from '../array/basics';
import type { LooseObject } from '../object/types';

/**
 * * Utility to convert object into FormData.
 *
 * @param data Data to convert into FormData.
 * @returns Converted FormData.
 */
export const convertIntoFormData = <T extends LooseObject>(
	data: T,
): FormData => {
	const formData = new FormData();

	Object.entries(data).forEach(([key, value]) => {
		if (!isValidEmptyArray(value) && value[0]?.originFileObj) {
			formData.append(key, value[0].originFileObj);
		} else if (value !== undefined && value !== null && value !== '') {
			formData.append(key, value as string | Blob);
		}
	});

	return formData;
};

/**
 * * Check if a formdata object is empty.
 *
 * @param data FormData to check.
 * @returns Boolean (`true`/`false`) Whether the formdata is empty.
 */
export const isEmptyFormData = (data: FormData): boolean => {
	if ('entries' in data && typeof data.entries === 'function') {
		return Array.from(data.entries()).length === 0;
	}

	throw new Error(
		'`FormData.entries()` is not supported in this environment!',
	);
};
