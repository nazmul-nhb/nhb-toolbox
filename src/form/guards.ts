import type { CustomFile, FileUpload, OriginFileObj } from './types';

/**
 * * Checks if a given value is a valid `FormData` & it's not empty.
 * @param value - The value to check.
 * @returns `true` if the value is a valid `FormData` and not empty, otherwise `false`.
 */
export function isValidFormData(value: unknown): value is FormData {
	if (!(value instanceof FormData)) return false;

	if ('entries' in value) {
		if (typeof value.entries !== 'function') {
			console.warn('`FormData.entries()` is not supported!');
			return false;
		}

		return Array.from(value.entries()).length > 0;
	}

	return false;
}

/**
 * * Checks if a given value is an `OriginFileObj`.
 * @param value - The value to check.
 * @returns `true` if the value is a valid `OriginFileObj`, otherwise `false`.
 */
export function isOriginFileObj(value: unknown): value is OriginFileObj {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		return false;
	}

	const obj = value as Record<string, unknown>;

	return typeof obj.uid === 'string';
}

/**
 * * Checks if a given value is a `CustomFile`.
 * @param value - The value to check.
 * @returns `true` if the value is a valid `CustomFile`, otherwise `false`.
 */
export function isCustomFile(value: unknown): value is CustomFile {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		return false;
	}

	const obj = value as Record<string, unknown>;

	return 'originFileObj' in obj && isOriginFileObj(obj.originFileObj);
}

/**
 * * Checks if a given value is an array of `CustomFile` objects.
 * @param value - The value to check.
 * @returns `true` if the value is a valid `CustomFile[]`, otherwise `false`.
 */
export function isCustomFileArray(value: unknown): value is CustomFile[] {
	return (
		Array.isArray(value) && value.length > 0 && value.every(isCustomFile)
	);
}

/**
 * * Checks if a given value is a `FileUpload` object.
 * @param value - The value to check.
 * @returns `true` if the value is a valid `FileUpload`, otherwise `false`.
 */
export function isFileUpload(value: unknown): value is FileUpload {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		return false;
	}

	const obj = value as Record<string, unknown>;

	return (
		('file' in obj && isCustomFile(obj.file)) ||
		('fileList' in obj && isCustomFileArray(obj.fileList))
	);
}
