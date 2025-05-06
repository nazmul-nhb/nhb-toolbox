import {
	isArrayOfType,
	isNotEmptyObject,
	isObject,
} from '../guards/non-primitives';
import { isString } from '../guards/primitives';
import { trimString } from '../string/basics';
import type { FlattenPartial, PartialOrRequired } from '../types';
import type { DotNotationKey, GenericObject, SanitizeOptions } from './types';

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
 * @param _return - By default return type is as it is, passing this parameter `true` makes the return type `Partial<T>`.
 * @returns A new object with the specified modifications.
 */
export function sanitizeData<
	T extends GenericObject,
	B extends PartialOrRequired = 'required',
>(
	object: T,
	options?: SanitizeOptions<T>,
	_return?: B,
): B extends 'partial' ? FlattenPartial<T> : T;

/**
 * * Sanitizes a deeply nested array that may contain arrays, objects or other (mixed) data types.
 * * Preserves structure while removing empty values and trimming strings and other operations.
 *
 * @param array - A mixed array that may contain arrays, objects or other data types.
 * @param options - Options to trim and filter values.
 * @param _return - By default return type is as it is, passing this parameter `partial` makes the return type `Partial<T>`.
 * @returns A new sanitized array with the specified modifications.
 */
export function sanitizeData<T, B extends PartialOrRequired = 'required'>(
	array: T[],
	options?: SanitizeOptions<T>,
	_return?: B,
): B extends 'partial' ? FlattenPartial<T>[] : T[];

/**
 * * Sanitizes a string, array of strings, an object or array of objects by ignoring specified keys and trimming string values.
 * * Also excludes nullish values (null, undefined) if specified. Always ignores empty nested object(s).
 *
 * @param input - The string, object or array of strings or objects to sanitize.
 * @param options - Options for processing.
 * @param _return - By default return type is as it is, passing this parameter `partial` makes the return type `Partial<T>`.
 * @returns A new string, object or array of strings or objects with the specified modifications.
 */
export function sanitizeData<
	T extends GenericObject,
	B extends PartialOrRequired = 'required',
>(
	input: string | string[] | T | T[],
	options?: SanitizeOptions<T>,
	_return?: B,
):
	| string
	| string[]
	| (B extends 'partial' ? FlattenPartial<T> : T)
	| (B extends 'partial' ? FlattenPartial<T>[] : T[]) {
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
	const _skipObject = (obj: unknown): boolean => {
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
				if (_skipObject(v) && !isRequiredKey(path)) return false;
				return true;
			});
	};

	/**
	 * * Helper function to process a single object.
	 *
	 * @param object The object to process.
	 * @param parentPath The parent path of a key.
	 *  */
	const _processObject = (object: T, parentPath = '') =>
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
			.map((item) => sanitizeData(item, options, _return))
			.filter((val) => {
				if (ignoreNullish && val == null) return false;
				if (ignoreFalsy && !val) return false;
				if (_skipObject(val)) return false;

				return true;
			}) as B extends 'partial' ? FlattenPartial<T>[] : T[];
	}

	// Process object
	if (isObject(input)) {
		return _processObject(input) as B extends 'partial' ? FlattenPartial<T>
		:	T;
	}

	return input;
}

/**
 * * Parse an object of stringified values into their appropriate primitive types.
 *
 * @description
 * - Attempts to convert string values into `boolean`, `number`, or JSON-parsed objects/arrays.
 * - Non-string values except arrays/objects are left unchanged. Nested arrays/objects are parsed recursively.
 *
 * @param object - The object with potentially stringified primitive values.
 * @param parseNested - Whether to convert stringified primitives in nested arrays/objects. (default: `true`).
 * @returns A new object with parsed values converted to their original types.
 */
export function parseObjectValues<T extends GenericObject>(
	object: T,
	parseNested = true,
): GenericObject {
	function _deepParseValues(data: unknown): unknown {
		if (Array.isArray(data)) {
			return data.map(_deepParseValues);
		} else if (isNotEmptyObject(data)) {
			const result: Record<string, unknown> = {};

			for (const [key, value] of Object.entries(data)) {
				result[key] = parseNested ? _deepParseValues(value) : value;
			}

			return result;
		} else if (isString(data)) {
			try {
				const parsed = JSON.parse(data);

				return _deepParseValues(parsed);
			} catch {
				if (data === 'true') return true;
				else if (data === 'false') {
					return false;
				} else if (data === 'null') {
					return null;
				} else if (data === 'undefined') {
					return undefined;
				} else if (!isNaN(Number(data))) {
					return Number(data);
				} else return data;
			}
		}
		return data;
	}

	const parsedBody: GenericObject = {};

	if (isNotEmptyObject(object)) {
		Object.entries(object).forEach(([key, value]) => {
			parsedBody[key] = _deepParseValues(value);
		});
	}

	return parsedBody;
}
