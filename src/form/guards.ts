import type { CustomFile, FileUpload, OriginFileObj } from './types';

/**
 * * Checks if a given value is a valid `FormData` & it's not empty.
 * - **N.B.** Be cautious when using this in SSR (Server-Side Rendering) environments (such as `Next.js` Server Components), as it may not work as expected.
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

		return Array.from(value.entries())?.length > 0;
	}

	return false;
}

/**
 * * Checks if a given value is an `OriginFileObj`.
 * - **N.B.** Be cautious when using this in SSR (Server-Side Rendering) environments (such as `Next.js` Server Components), as it may not work as expected.
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
 * - **N.B.** Be cautious when using this in SSR (Server-Side Rendering) environments (such as `Next.js` Server Components), as it may not work as expected.
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
 * - **N.B.** Be cautious when using this in SSR (Server-Side Rendering) environments (such as `Next.js` Server Components), as it may not work as expected.
 * @param value - The value to check.
 * @returns `true` if the value is a valid `CustomFile[]`, otherwise `false`.
 */
export function isCustomFileArray(value: unknown): value is CustomFile[] {
	return (
		Array.isArray(value) && value?.length > 0 && value?.every(isCustomFile)
	);
}

/**
 * * Checks if a given value is an array of `File/Blob` objects.
 * - **N.B.** Be cautious when using this in SSR (Server-Side Rendering) environments (such as `Next.js` Server Components), as it may not work as expected.
 * @param value - The value to check.
 * @returns `true` if the value is a valid `File[]` or `Blob[]`, otherwise `false`.
 */
export function isFileArray(value: unknown): value is File[] | Blob[] {
	return (
		Array.isArray(value) && value?.length > 0 && value?.every(isFileOrBlob)
	);
}

/**
 * * Checks if a given value is an instance of `FileList`.
 * @param value - The value to check.
 * @returns `true` if the value is a valid `FileList`, otherwise `false`.
 */
export function isFileList(value: unknown): value is FileList {
	return typeof FileList !== 'undefined' && value instanceof FileList;
}

/**
 * * Checks if a given value is an instance of `File` or `Blob`.
 * @param value - The value to check.
 * @returns `true` if the value is an instance of `File` or `Blob`, otherwise `false`.
 */
export function isFileOrBlob(value: unknown): value is File | Blob {
	return (
		(typeof File !== 'undefined' && value instanceof File) ||
		(typeof Blob !== 'undefined' && value instanceof Blob)
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
