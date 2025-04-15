import { isNotEmptyObject } from '../guards/non-primitives';
import { trimString } from '../string/basics';
import type { FlattenPartial } from '../types';
import type {
	DotNotationKey,
	GenericObject,
	SanitizeOptions,
	StrictObject,
} from './types';

/**
 * * Sanitizes an object by ignoring specified keys and trimming string values based on options provided.
 * * Also excludes nullish values (null, undefined) if specified. Always ignores empty nested object(s).
 *
 * @param object - The object to sanitize.
 * @param options - Options that define which keys to ignore, whether to trim string values, and whether to exclude nullish values.
 * @returns A new object with the specified modifications.
 */
export function sanitizeData<T extends GenericObject>(
	object: T,
	options?: SanitizeOptions<T>,
): FlattenPartial<T>;

/**
 * * Sanitizes an array of objects by ignoring specified keys and trimming string values based on options provided.
 * * Also excludes nullish values (null, undefined) if specified. Always ignores empty nested object(s).
 *
 * @param object - The object to sanitize.
 * @param options - Options that define which keys to ignore, whether to trim string values, and whether to exclude nullish values.
 * @returns A new array of objects with the specified modifications.
 */
export function sanitizeData<T extends GenericObject>(
	array: T[],
	options?: SanitizeOptions<T>,
): FlattenPartial<T>[];

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
		keysToIgnore: ignoreKeys = [],
		trimStrings = true,
		ignoreNullish = false,
	} = options || {};

	// Flatten the object keys and use the keys for comparison
	const ignoreKeySet = new Set(ignoreKeys);

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
			if (ignoreNullish && (value === null || value === undefined)) {
				return acc;
			}

			// Trim string values if enabled
			if (typeof value === 'string' && trimStrings) {
				acc[key as keyof T] = trimString(value) as T[keyof T];
			} else if (
				value &&
				typeof value === 'object' &&
				!Array.isArray(value)
			) {
				// Recursively process nested objects
				const processedValue = _processObject(value as T, fullKeyPath);
				// Only add the property if it's not an empty object
				if (isNotEmptyObject(processedValue)) {
					acc[key as keyof T] = processedValue as T[keyof T];
				}
			} else {
				// Add other values as-is
				acc[key as keyof T] = value as T[keyof T];
			}

			return acc;
		}, {} as T);

	// Process strings
	if (typeof input === 'string') {
		return trimString(input);
	}

	// Process array of strings and objects
	if (Array.isArray(input)) {
		// Process array of strings
		if (typeof input[0] === 'string') {
			return trimString(input as string[]);
		}

		// Process array of objects
		return input
			.map((obj) => _processObject(obj as T))
			.filter((obj) => isNotEmptyObject(obj));
	}

	// Process object
	if (typeof input === 'object' && input !== null) {
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
export function parseObjectValues(object: GenericObject): StrictObject {
	const parsedBody: StrictObject = {};

	if (isNotEmptyObject(object)) {
		Object.entries(object).forEach(([key, value]) => {
			if (typeof value !== 'string') {
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

	return parsedBody;
}
