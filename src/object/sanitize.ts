import {
	isArrayOfType,
	isNotEmptyObject,
	isObject,
} from '../guards/non-primitives';
import { isString } from '../guards/primitives';
import { trimString } from '../string/basics';
import type { FlattenPartial } from '../types';
import type {
	DotNotationKey,
	GenericObject,
	ParsedPrimitive,
	SanitizeOptions,
} from './types';

/**
 * * Trims all the words in a string.
 *
 * @param input String to sanitize.
 * @returns Sanitized string .
 */
export function sanitizeData(input: string): string;

/**
 * * Trims all the words in an array of strings.
 *
 * @param input Array of strings to sanitize.
 * @returns Sanitized array of strings.
 */
export function sanitizeData(input: string[]): string[];

/**
 * * Sanitizes an object by ignoring specified keys and trimming string values based on options provided.
 * * Also excludes nullish values (`null`, `undefined`), falsy (`nullish` + `0` & `""`) or empty values (`object`, `array`) if specified.
 *
 * @param object - The object to sanitize.
 * @param options - Options that define which keys to ignore, whether to trim string values, and whether to exclude nullish, falsy or empty values.
 * @returns A new object with the specified modifications.
 */
export function sanitizeData<T extends GenericObject>(
	object: T,
	options?: SanitizeOptions<T>,
): FlattenPartial<T>;

/**
 * * Sanitizes a deeply nested array that may contain arrays, objects or other (mixed) data types.
 * * Preserves structure while removing empty values and trimming strings and other operations.
 *
 * @param array - A mixed array that may contain arrays, objects or other data types.
 * @param options - Options to trim and filter values.
 * @returns A new sanitized array with the specified modifications.
 */
export function sanitizeData<T>(
	array: T[],
	options?: SanitizeOptions<T>,
): FlattenPartial<T>[];

/**
 * * Sanitizes a string, array of strings, an object or array of objects by ignoring specified keys and trimming string values.
 * * Also excludes nullish values (null, undefined) if specified. Always ignores empty nested object(s).
 *
 * @param input - The string, object or array of strings or objects to sanitize.
 * @param options - Options for processing.
 * @returns A new string, object or array of strings or objects with the specified modifications.
 */
export function sanitizeData<T extends GenericObject>(
	input: string | string[] | T | T[],
	options?: SanitizeOptions<T>,
): string | string[] | FlattenPartial<T> | FlattenPartial<T>[] {
	const {
		keysToIgnore = [],
		requiredKeys = [],
		trimStrings = true,
		ignoreNullish = false,
		ignoreFalsy = false,
		ignoreEmpty = false,
	} = options || {};

	// Flatten the object keys and use the keys for comparison
	const ignoreKeySet = new Set(keysToIgnore);

	/**
	 * * Determines if a key is required
	 * @param key The key to check.
	 * @returns `true` if the key is required, otherwise `false`.
	 */
	const isRequiredKey = (key: string) => {
		return Array.isArray(requiredKeys) ?
				requiredKeys?.some(
					(path) => key === path || key.startsWith(`${path}.`),
				)
			:	requiredKeys === '*';
	};

	/**
	 * * Check if a value is an object and determines whether it should skip based on `ignoreEmpty` flag.
	 * @param obj Object value to check.
	 * @returns `true` if the object is skippable, otherwise `false`.
	 */
	const skipObject = (obj: unknown): boolean => {
		return ignoreEmpty && isObject(obj) && !isNotEmptyObject(obj);
	};

	/**
	 * * Recursively process an array and its nested content(s).
	 * @param arr Array to process.
	 * @param path Full path as dot notation if needed.
	 * @returns Processed array.
	 */
	const _processArray = (arr: unknown[], path: string): unknown[] => {
		return arr
			.map((item) => {
				if (isString(item) && trimStrings) {
					return trimString(item);
				}

				if (Array.isArray(item)) {
					// Recursive sanitize
					return _processArray(item, path);
				}

				if (isObject(item)) {
					return _processObject(item as T, path);
				}

				return item;
			})
			.filter((v) => {
				if (ignoreNullish && v == null) return false;
				if (ignoreFalsy && !v) return false;
				if (skipObject(v) && !isRequiredKey(path)) return false;
				return true;
			});
	};

	/**
	 * * Helper function to process a single object.
	 *
	 * @param object The object to process.
	 * @param parentPath The parent path of a key.
	 *  */
	const _processObject = (object: T, parentPath = ''): FlattenPartial<T> =>
		Object.entries(object).reduce((acc, [key, value]) => {
			// Compute the full key path
			const fullKeyPath = parentPath ? `${parentPath}.${key}` : key;

			// Skip ignored keys
			if (ignoreKeySet.has(fullKeyPath as DotNotationKey<T>)) {
				return acc;
			}

			// Exclude nullish values if specified
			if (ignoreNullish && !isRequiredKey(fullKeyPath) && value == null) {
				return acc;
			}

			// Exclude falsy values `0`, `false`, `null` and `undefined`
			if (ignoreFalsy && !value && !isRequiredKey(fullKeyPath)) {
				return acc;
			}

			if (isString(value) && trimStrings) {
				// Trim string values if enabled
				acc[key as keyof T] = trimString(value) as T[keyof T];
			} else if (value && isObject(value)) {
				// Recursively process nested objects
				const processedValue = _processObject(value as T, fullKeyPath);
				// Add the property conditionally if it's not an empty object
				if (
					!ignoreEmpty ||
					isRequiredKey(fullKeyPath) ||
					isNotEmptyObject(processedValue)
				) {
					acc[key as keyof T] = processedValue as T[keyof T];
				}
			} else if (value && Array.isArray(value)) {
				// Keep file arrays untouched
				// if (isFileArray(value) || isCustomFileArray(value)) {
				// 	acc[key as keyof T] = value as T[keyof T];
				// }
				const processedArray = _processArray(value, fullKeyPath);

				if (
					!ignoreEmpty ||
					isRequiredKey(fullKeyPath) ||
					processedArray.length > 0
				) {
					acc[key as keyof T] = processedArray as T[keyof T];
				}
			} else {
				// Add other values untouched
				acc[key as keyof T] = value as T[keyof T];
			}

			return acc;
		}, {} as T);

	// Process strings
	if (isString(input)) {
		return trimString(input);
	}

	// Process array of strings and objects
	if (Array.isArray(input)) {
		// Process array of strings
		if (isArrayOfType(input, isString)) {
			return trimString(input);
		}

		// * Handle arrays with nested strings/arrays/objects
		return input
			.map((item) => sanitizeData(item, options))
			.filter((val) => {
				if (ignoreNullish && val == null) return false;
				if (ignoreFalsy && !val) return false;
				if (skipObject(val)) return false;

				return true;
			});
	}

	// Process object
	if (isObject(input)) {
		return _processObject(input);
	}

	return input;
}

/**
 * * Parse an object of stringified values into their appropriate primitive types.
 *
 * Attempts to convert string values into `boolean`, `number`, or JSON-parsed objects/arrays.
 * Non-string values are left unchanged.
 *
 * @param object - The object with potentially stringified primitive values.
 * @returns A new object with parsed values converted to their original types.
 */
export function parseObjectValues<T extends Record<string, string>>(
	object: T,
): {
	[K in keyof T]: ParsedPrimitive<T[K]>;
} {
	const parsedBody: GenericObject = {};

	if (isNotEmptyObject(object)) {
		Object.entries(object).forEach(([key, value]) => {
			if (!isString(value)) {
				parsedBody[key] = value;
				return;
			}

			try {
				const parsedValue = JSON.parse(value);
				parsedBody[key] = parsedValue;
			} catch {
				if (value === 'true') {
					parsedBody[key] = true;
				} else if (value === 'false') {
					parsedBody[key] = false;
				} else if (!isNaN(Number(value))) {
					parsedBody[key] = Number(value);
				} else if (value === 'undefined') {
					parsedBody[key] = undefined;
				} else if (value === 'null') {
					parsedBody[key] = null;
				} else {
					parsedBody[key] = value;
				}
			}
		});
	}

	return parsedBody as {
		[K in keyof T]: ParsedPrimitive<T[K]>;
	};
}
