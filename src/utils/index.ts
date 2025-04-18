import { isInvalidOrEmptyArray } from '../array/basics';
import { sortAnArray } from '../array/sort';
import { isMethodDescriptor, isObject } from '../guards/non-primitives';
import { isString } from '../guards/primitives';
import { isNumericString } from '../guards/specials';
import type { GenericObject } from '../object/types';
import type {
	ClassDetails,
	Constructor,
	DelayedFn,
	ThrottledFn,
	VoidFunction,
} from '../types';

/**
 * * Deeply compare two values (arrays, objects, or primitive values).
 *
 * @param a First value to compare.
 * @param b Second value to compare.
 * @returns Whether the values are deeply equal.
 */
export const isDeepEqual = <T>(a: T, b: T): boolean => {
	// If both values are strictly equal (handles primitive types and same references)
	if (a === b) return true;

	// If the types of the two values are different
	if (typeof a !== typeof b) return false;

	// If either is null or undefined, they must both be null or undefined
	if (a === null || b === null) return a === b;

	// Check for array equality
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		return a.every((element, index) => isDeepEqual(element, b[index]));
	}

	// Check for object equality
	if (typeof a === 'object' && typeof b === 'object') {
		const aKeys = Object.keys(a);
		const bKeys = Object.keys(b);

		if (aKeys.length !== bKeys.length) return false;

		return aKeys.every((key) =>
			isDeepEqual((a as GenericObject)[key], (b as GenericObject)[key]),
		);
	}

	return false;
};

/**
 * * Utility to convert an array to string with custom separator.
 *
 * @param array Array to convert.
 * @param separator Separate each element of the array. Can be `,`, `-`, `|` etc. Default is `,`.
 * @returns Converted array in string format with the separator.
 */
export const convertArrayToString = <T>(
	array: T[],
	separator: string = ',',
): string => {
	if (!isInvalidOrEmptyArray) {
		throw new Error('Please, provide a valid array!');
	}
	return array.join(separator);
};

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
export const debounceAction = <T extends VoidFunction>(
	callback: T,
	delay = 300,
): DelayedFn<T> => {
	let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;

	return (...args: Parameters<T>) => {
		// Clear the previous timeout
		clearTimeout(timeoutId);

		// Set a new timeout
		timeoutId = setTimeout(() => {
			callback(...args);
		}, delay);
	};
};

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
export const throttleAction = <T extends VoidFunction>(
	callback: T,
	delay = 150,
): ThrottledFn<T> => {
	let lastCall = 0;

	return (...args: Parameters<T>) => {
		const now = Date.now();

		if (now - lastCall >= delay) {
			lastCall = now;
			callback(...args);
		}
	};
};

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
		return (
			method !== 'prototype' && method !== 'name' && method !== 'length'
		);
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
	return getInstanceMethodNames(cls).length;
}

/**
 * * Counts the number of static methods defined directly on a class constructor.
 *
 * @param cls - The class constructor (not an instance).
 * @returns The number of static methods defined on the class constructor.
 */
export function countStaticMethods(cls: Constructor): number {
	return getStaticMethodNames(cls).length;
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

	return {
		instanceNames,
		staticNames,
		instances: instanceNames.length,
		statics: staticNames.length,
		total: instanceNames.length + staticNames.length,
	};
}

/**
 * * Parses a JSON string and optionally converts stringified primitives inside objects or arrays.
 *
 * @param value - The JSON string to parse.
 * @param parsePrimitives - Whether to convert stringified primitives (default: `true`).
 * @returns The parsed JSON value with optional primitive parsing.
 */
export const parseJSON = (value: string, parsePrimitives = true): unknown => {
	try {
		const parsed = JSON.parse(value);

		return parsePrimitives ? deepParsePrimitives(parsed) : parsed;
	} catch {
		return {};
	}
};

/**
 * Recursively parses primitive values inside objects and arrays.
 *
 * @param input - Any input value to parse recursively.
 * @returns Input with primitives (strings like "true", "123") converted.
 */
export function deepParsePrimitives(input: unknown): unknown {
	if (Array.isArray(input)) {
		return input.map(deepParsePrimitives);
	}

	if (isObject(input)) {
		const result: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(input)) {
			result[key] = deepParsePrimitives(value);
		}

		return result;
	}

	if (isString(input)) {
		if (/^(true|false)$/i.test(input)) {
			return input.toLowerCase() === 'true';
		}

		if (isNumericString(input)) {
			return Number(input);
		}

		if (input === 'null') {
			return null;
		}

		if (input === 'undefined') {
			return undefined;
		}
	}

	return input;
}
