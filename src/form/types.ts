import type { DotNotationKey } from '../object/types';

/** - Configuration options to control FormData generation behavior. */
export interface FormDataConfigs<T> {
	/**
	 * * An array of dot-notation keys to exclude from processing.
	 * * Ignored keys are omitted entirely, even if included in other options.
	 */
	ignoreKeys?: DotNotationKey<T>[];

	/**
	 * * Specifies which keys should be included even if their values are falsy.
	 * * Use `*` to preserve all keys.
	 */
	requiredKeys?: '*' | DotNotationKey<T>[];

	/**
	 * * Defines which keys should be converted to lowercase.
	 * * Use `*` to apply to all keys.
	 */
	lowerCaseKeys?: '*' | DotNotationKey<T>[];

	/**
	 * * An array of dot-notation paths to preserve in their original structure.
	 * - Example: `'user.settings'` ensures `user` remains an object, and `settings` is not flattened.
	 * - Use `*` to preserve all keys in their dot-notation format.
	 * - If a key exists in both `dotNotateNested` and `stringifyNested`, `dotNotateNested` takes precedence.
	 */
	dotNotateNested?: '*' | DotNotationKey<T>[];

	/**
	 * * Specifies which nested objects should be stringified instead of being flattened or dot-notated.
	 * - Defaults to `*`, meaning all nested objects will be stringified. Which is standard in modern form submissions.
	 * - Use `*` to stringify all nested objects.
	 * - If a key exists in both `dotNotateNested` and `stringifyNested`, `dotNotateNested` takes precedence.
	 */
	stringifyNested?: '*' | DotNotationKey<T>[];

	/**
	 * * Controls how arrays should be serialized in FormData.
	 * - If a key is included, the array will be broken into individual key-value pairs (`key[0]: value, key[1]: value`).
	 * - Use `*` to apply this behavior to all array keys.
	 */
	breakArray?: '*' | DotNotationKey<T>[];

	/** - Enables automatic trimming of string values before appending them to FormData. */
	trimStrings?: boolean;
}

/** * Represents a file upload operation, commonly used in libraries like `FilePond` or `Ant Design Upload`. */
export interface FileUpload {
	/** The primary file being uploaded. */
	file: File | CustomFile;
	/** The list of files associated with the upload. */
	fileList: CustomFile[];
}

/** * Represents a custom file structure used in file upload components. */
export interface CustomFile {
	/** Unique identifier for the file. */
	uid: string;
	/** The timestamp (milliseconds) when the file was last modified. */
	lastModified: number;
	/** A string representation of the last modified date. */
	lastModifiedDate: Date;
	/** The name of the file. */
	name: string;
	/** The size of the file in bytes. */
	size: number;
	/** The MIME type of the file. */
	type: string;
	/** Upload progress percentage (0-100). */
	percent: number;
	/** The original file object before any transformations. */
	originFileObj: OriginFileObj;
	/** The URL for a thumbnail preview of the file. */
	thumbUrl: string;
	/** Optional error information if the upload fails. */
	error?: FileError;
	/** Optional server response after a successful upload. */
	response?: string;
	/** Optional status of the file upload (e.g., "uploading", "done", "error"). */
	status?: string;
}

/** * Represents the original file object before any modifications. */
export interface OriginFileObj extends File {
	/** Unique identifier for the original file. */
	uid: string;
}

/** * Represents an error that occurs during a file upload. */
export interface FileError extends Error {
	/** HTTP status code of the error. */
	status: number;
	/** The HTTP method used for the request (e.g., "POST", "PUT"). */
	method: string;
	/** The URL where the upload was attempted. */
	url: string;
}
