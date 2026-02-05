import { _resolveNestedKey } from '../array/helpers';
import { sortAnArray } from '../array/sort';
import { isDateLike } from '../date/guards';
import {
	isArray,
	isArrayOfType,
	isMethodDescriptor,
	isNotEmptyObject,
	isObject,
	isValidArray,
} from '../guards/non-primitives';
import { isNonEmptyString, isPrimitive, isString } from '../guards/primitives';
import { isNumericString } from '../guards/specials';
import type { GenericObject } from '../object/types';
import type {
	ClassDetails,
	Constructor,
	DelayedFn,
	Maybe,
	Primitive,
	VoidFn,
} from '../types/index';
import type {
	ArrayOfObjectsToStringOptions,
	ArrayOfPrimitivesToStringOptions,
	ArrayToStringOptions,
	ProtoMethodOptions,
} from './types';

/**
 * * Deeply compare two values (arrays, objects, or primitive values).
 *
 * @param a First value to compare.
 * @param b Second value to compare.
 * @returns Whether the values are deeply equal.
 */
export const isDeepEqual = (a: unknown, b: unknown): boolean => {
	// If both values are strictly equal (handles primitive types and same references)
	if (a === b) return true;

	// If the types of the two values are different
	if (typeof a !== typeof b) return false;

	// If either is null or undefined, they must both be null or undefined
	if (a === null || b === null) return a === b;

	// Check for array equality
	if (isArray(a) && isArray(b)) {
		if (a?.length !== b?.length) return false;
		return a?.every((element, index) => isDeepEqual(element, b?.[index]));
	}

	// Check for object equality
	if (isObject(a) && isObject(b)) {
		const aKeys = Object.keys(a);
		const bKeys = Object.keys(b);

		if (aKeys?.length !== bKeys?.length) return false;

		return aKeys?.every((key) => isDeepEqual(a?.[key], b?.[key]));
	}

	return false;
};

/**
 * * Converts an array of objects to a string using a specific property (supports nested path to primitive values) and separator.
 *
 * @example
 * const users = [
 * 	{ id: 1, name: { first: 'Alice' }, city: 'Bangu', },
 * 	{ id: 4, name: { first: 'Bob' }, city: 'Banguland', },
 * ];
 * convertArrayToString(users, { target: 'name.first', separator: ' | ' });
 * // "Alice | Bob"
 *
 * @param array Array of objects to convert.
 * @param options Options including the target property and separator.
 * @returns String formed by joining the property values with the given separator.
 */
export function convertArrayToString<T extends GenericObject>(
	array: Maybe<T[]>,
	options: ArrayOfObjectsToStringOptions<T>
): string;

/**
 * * Converts an array of primitive values to a string using a custom separator.
 *
 * @example
 * convertArrayToString(['red', 'green', 'blue'], { separator: ' - ' });
 * // "red - green - blue"
 *
 * @example
 * convertArrayToString([1, 2, 3]);
 * // "1, 2, 3"
 *
 * @param array Array of primitive values to convert.
 * @param options Optional separator configuration.
 * @returns String formed by joining array elements with the given separator.
 */
export function convertArrayToString<T extends Primitive>(
	array: Maybe<T[]>,
	options?: ArrayOfPrimitivesToStringOptions
): string;

/**
 * * Converts an array of primitive values or objects to a string using a separator or target key.
 *
 * @param array Array to convert.
 * @param options Options for separator or key extraction from objects.
 * @returns String representation of array values.
 */
export function convertArrayToString<T extends Primitive | GenericObject>(
	array: Maybe<T[]>,
	options?: ArrayToStringOptions<T>
): string {
	if (!isValidArray(array)) return '';

	const { separator = ', ' } = options ?? {};

	if (isArrayOfType(array, isPrimitive)) {
		return array?.join(separator);
	} else if (isArrayOfType(array, isNotEmptyObject)) {
		if (options && 'target' in options) {
			return array?.map((el) => _resolveNestedKey(el, options?.target))?.join(separator);
		} else {
			return '';
		}
	}

	return '';
}

/**
 * * A generic debounce function that delays the execution of a callback.
 *
 * @param callback - The function to debounce.
 * @param delay - The delay in milliseconds. Default is `300ms`.
 * @returns A debounced version of the callback function.
 *
 * @example
 * const debouncedSearch = debounceAction((query: string) => {
 *   console.log(`Searching for: ${query}`);
 * }, 300);
 *
 * debouncedSearch('laptop'); // Executes after 300ms of inactivity.
 */
export function debounceAction<T extends VoidFn>(callback: T, delay = 300): DelayedFn<T> {
	let timeoutId: ReturnType<typeof setTimeout>;

	return (...args: Parameters<T>) => {
		// Clear the previous timeout
		clearTimeout(timeoutId);

		// Set a new timeout
		timeoutId = setTimeout(() => {
			callback(...args);
		}, delay);
	};
}

/**
 * * A generic throttle function that ensures a callback is executed at most once per specified interval.
 *
 * @param callback - The function to throttle.
 * @param delay - The delay in milliseconds. Default is `150ms`.
 * @returns A throttled version of the callback function.
 *
 * @example
 * const throttledResize = throttleAction(() => {
 *   console.log('Resized');
 * }, 300);
 *
 * window.addEventListener('resize', throttledResize);
 */
export function throttleAction<T extends VoidFn>(callback: T, delay = 150): DelayedFn<T> {
	let lastCall = 0;

	return (...args: Parameters<T>) => {
		const now = Date.now();

		if (now - lastCall >= delay) {
			lastCall = now;
			callback(...args);
		}
	};
}

/**
 * * Retrieves the names of all instance methods defined directly on a class prototype.
 *
 * @param cls - The class constructor (not an instance).
 * @returns A sorted array of instance method names.
 */
export function getInstanceMethodNames(cls: Constructor): string[] {
	const prototype = cls.prototype;

	const methods = Object.getOwnPropertyNames(prototype).filter((method) => {
		if (method === 'constructor') {
			return false;
		}

		const descriptor = Object.getOwnPropertyDescriptor(prototype, method);

		return isMethodDescriptor(descriptor);
	});

	return sortAnArray(methods);
}

/**
 * * Retrieves the names of all static methods defined directly on a class constructor.
 *
 * @param cls - The class constructor (not an instance).
 * @returns A sorted array of static method names.
 */
export function getStaticMethodNames(cls: Constructor): string[] {
	const methods = Object.getOwnPropertyNames(cls).filter((method) => {
		return method !== 'prototype' && method !== 'name' && method !== 'length';
	});

	return sortAnArray(methods);
}

/**
 * * Counts the number of instance methods defined directly on a class prototype.
 *
 * @param cls - The class constructor (not an instance).
 * @returns The number of instance methods defined on the class prototype.
 */
export function countInstanceMethods(cls: Constructor): number {
	return getInstanceMethodNames(cls)?.length;
}

/**
 * * Counts the number of static methods defined directly on a class constructor.
 *
 * @param cls - The class constructor (not an instance).
 * @returns The number of static methods defined on the class constructor.
 */
export function countStaticMethods(cls: Constructor): number {
	return getStaticMethodNames(cls)?.length;
}

/**
 * * Retrieves the names of all instance getters defined directly on a class prototype.
 *
 * @param cls - The class constructor (not an instance).
 * @returns A sorted array of instance getter names.
 */
export function getInstanceGetterNames(cls: Constructor): string[] {
	const descriptors = Object.getOwnPropertyDescriptors(cls.prototype);

	const result = Object.entries(descriptors)
		.filter(([key, desc]) => typeof desc.get === 'function' && key !== 'constructor')
		.map(([key]) => key);

	return sortAnArray(result);
}

/**
 * * Retrieves the names of all static getters defined directly on a class constructor.
 *
 * @param cls - The class constructor (not an instance).
 * @returns A sorted array of static getter names.
 */
export function getStaticGetterNames(cls: Constructor): string[] {
	const descriptors = Object.getOwnPropertyDescriptors(cls);

	const result = Object.entries(descriptors)
		.filter(([key, desc]) => typeof desc.get === 'function' && key !== 'prototype')
		.map(([key]) => key);

	return sortAnArray(result);
}

/**
 * * Gathers detailed information about the instance and static methods of a class.
 *
 * @param cls - The class constructor (not an instance).
 * @returns An object containing names and counts of instance and static methods.
 */
export function getClassDetails(cls: Constructor): ClassDetails {
	const instanceNames = getInstanceMethodNames(cls);
	const staticNames = getStaticMethodNames(cls);
	const instanceGetters = getInstanceGetterNames(cls);
	const staticGetters = getStaticGetterNames(cls);

	return {
		instanceMethods: instanceNames,
		staticMethods: staticNames,
		instanceGetters,
		staticGetters,
		instanceCount: instanceNames?.length,
		staticCount: staticNames?.length,
		totalGetters: instanceGetters?.length + staticGetters?.length,
		totalMethods: instanceNames?.length + staticNames?.length,
	};
}

/**
 * * Create a deterministic JSON string representation of any value.
 *   - The output format matches standard JSON but with guaranteed sorted keys.
 *
 * @remarks
 * - This function guarantees **stable, repeatable output** by:
 * 	 - Sorting all object keys alphabetically.
 * 	 - Recursively stabilizing nested objects and arrays.
 * 	 - Converting all `undefined` values into `null` so the output remains valid JSON.
 *   - Converting date-like objects (`Date`, `Chronos`, `Moment.js`, `Day.js`, `Luxon`, `JS-Joda`, `Temporal`) **in the same way that {@link JSON.stringify} would serialize them**, ensuring predictable and JSON-compliant output.
 *   - Falling back to native JSON serialization for primitives.
 *
 * - **Useful for:**
 *   - Hash generation (e.g., signatures, cache keys)
 *   - Deep equality checks
 *   - Producing predictable output across environments
 *
 * @param obj - The value to stringify into a deterministic JSON string.
 * @returns A stable, deterministic string representation of the input.
 */
export function stableStringify(obj: unknown): string {
	const _replacer = (_: unknown, v: unknown) => (v === undefined ? null : v);

	if (isNotEmptyObject(obj)) {
		const keys = Object.keys(obj).sort();

		return (
			'{' +
			keys
				.map(
					(k) =>
						JSON.stringify(k, _replacer) +
						':' +
						(isDateLike(obj[k]) ? JSON.stringify(obj[k]) : stableStringify(obj[k]))
				)
				.join(',') +
			'}'
		);
	}

	if (isValidArray(obj)) {
		return '[' + obj.map((v) => stableStringify(v)).join(',') + ']';
	}

	return JSON.stringify(obj, _replacer);
}

/**
 * * Remove trailing or leading garbage characters **after/before JSON object or array**.
 * @param str String to sanitize/strip.
 * @returns Sanitized/stripped JSON string.
 */
export function stripJsonEdgeGarbage(str: string): string {
	if (!isNonEmptyString(str)) return '';

	const lastIdx = Math.max(str.lastIndexOf('}'), str.lastIndexOf(']'));

	const _idxOf = (sym: '{' | '[') => (str.indexOf(sym) !== -1 ? str.indexOf(sym) : Infinity);

	const firstIdx = Math.min(_idxOf('{'), _idxOf('['));

	if (lastIdx === -1 || firstIdx === Infinity) return str;

	return str.slice(firstIdx, lastIdx + 1);
}

/**
 * * Parses any valid JSON string, optionally converting stringified primitives inside (nested) arrays or objects.
 *
 * @typeParam T - Expected return type (default is unknown).
 * @param value - The JSON string to parse.
 * @param parsePrimitives - Whether to convert stringified primitives (default: `true`).
 * @returns The parsed JSON value typed as `T`, or the original parsed value with optional primitive conversion.
 * - Returns `{}` if parsing fails, such as when the input is malformed or invalid JSON or passing single quoted string.
 *
 * - *Unlike {@link https://toolbox.nazmul-nhb.dev/docs/utilities/object/parseJsonToObject parseJsonToObject}, which ensures the root value is an object,
 * this function returns any valid JSON structure such as arrays, strings, numbers, or objects.*
 *
 * This is useful when you're not sure of the root structure of the JSON, or when you expect something other than an object.
 *
 * @see {@link https://toolbox.nazmul-nhb.dev/docs/utilities/object/parseJsonToObject parseJsonToObject} for strict object-only parsing.
 */
export const parseJSON = <T = unknown>(value: string, parsePrimitives = true): T => {
	try {
		const parsed = JSON.parse(value);

		return (parsePrimitives ? deepParsePrimitives(parsed) : parsed) as T;
	} catch {
		return {} as T;
	}
};

/**
 * * Recursively parses primitive values inside objects and arrays.
 *
 * @typeParam T - Expected return type after parsing (default is unknown).
 * @param input - Any input value to parse recursively.
 * @returns Input with primitives (strings like "true", "123") converted, typed as `T`.
 */
export function deepParsePrimitives<T = unknown>(input: unknown): T {
	if (Array.isArray(input)) {
		return input?.map(deepParsePrimitives) as T;
	}

	if (isObject(input)) {
		const result: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(input)) {
			result[key] = deepParsePrimitives(value);
		}

		return result as T;
	}

	if (isString(input)) {
		if (/^(true|false)$/i.test(input)) {
			return (input?.toLowerCase() === 'true') as T;
		}

		if (isNumericString(input)) {
			return Number(input) as T;
		}

		if (input === 'null') {
			return null as T;
		}

		if (input === 'undefined') {
			return undefined as T;
		}

		return input as T;
	}

	return input as T;
}

/**
 * * Defines a method on any prototype — including built-in prototypes — in a safe, idempotent manner.
 * 	 - The method is non-enumerable by default and will not overwrite an existing method unless explicitly allowed.
 *
 * @param proto   The target prototype object (e.g., String.prototype).
 * @param name    The method name to define on the prototype.
 * @param impl    The function implementation for the method.
 * @param options Optional property-descriptor settings and overwrite rules.
 *
 * @example
 * // Safely augment prototype methods by extending the global interface:
 * declare global {
 * 	interface String {
 * 		toBang(): string;
 * 	}
 * }
 *
 * // Define a custom method on String.prototype
 * definePrototypeMethod(String.prototype, 'toBang', function (this: String) {
 * 	return this.toString().concat('!');
 * 	// or
 * 	// return this.concat('!');
 * });
 *
 * "Hi".toBang(); // "Hi!"
 *
 * // Attempting to redefine without overwrite option is ignored
 * definePrototypeMethod(String.prototype, 'toBang', () => 'x'); // ignored
 *
 * // Overwrite intentionally using the overwrite option
 * definePrototypeMethod(
 *   String.prototype,
 *   'toBang',
 *   function (this: String) { return this.concat('!!!'); },
 *   { overwrite: true }
 * );
 *
 * "Hi".toBang(); // "Hi!!!"
 */
export function definePrototypeMethod<Proto extends object, Name extends keyof Proto>(
	proto: Proto,
	name: Name,
	impl: (...args: unknown[]) => unknown,
	options?: ProtoMethodOptions
): void {
	const alreadyExists = Object.prototype.hasOwnProperty.call(proto, name);

	if (alreadyExists && !options?.overwrite) return;

	Object.defineProperty(proto, name, {
		value: function (this: Proto, ...args: unknown[]) {
			return impl.apply(this, args);
		},

		enumerable: options?.enumerable ?? false,
		configurable: options?.configurable ?? false,
		writable: options?.writable ?? true,
	});
}
