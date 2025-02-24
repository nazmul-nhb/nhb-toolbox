import { isValidEmptyArray } from '../array/basics';
import type { LooseObject } from '../object/types';
import type { DelayedFn, GenericFn, ThrottledFn } from '../types';

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
			isDeepEqual((a as LooseObject)[key], (b as LooseObject)[key]),
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
	if (!isValidEmptyArray) {
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
export const debounceAction = <T extends GenericFn>(
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
export const throttleAction = <T extends GenericFn>(
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
