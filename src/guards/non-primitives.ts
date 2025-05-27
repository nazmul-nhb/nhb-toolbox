import type { GenericObject } from '../object/types';
import type { AsyncFunction, GenericFn } from '../types/index';
import { isString } from './primitives';

/**
 * * Type guard to check if a value is an array.
 * @param value - The value to check.
 * @returns `true` if the value is an array, otherwise `false`.
 */
export function isArray<T>(value: unknown): value is Array<T> {
	return Array.isArray(value);
}

/**
 * * Type guard to check if a value is an array with length.
 * @param value - The value to check.
 * @returns `true` if the value is an array with length, otherwise `false`.
 */
export function isValidArray<T>(value: unknown): value is Array<T> {
	return Array.isArray(value) && value?.length > 0;
}

/**
 * * Type guard to check if a value is an object (excluding null).
 * @param value - The value to check.
 * @returns `true` if the value is an object, otherwise `false`.
 */
export function isObject(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !isArray(value);
}

/**
 * * Type guard to check if a value is an object (excluding null) and has keys in it.
 * @param value - The value to check.
 * @returns `true` if the value is an object with valid keys, otherwise `false`.
 */
export function isNotEmptyObject(
	value: unknown,
): value is Record<string, unknown> {
	return isObject(value) && Object.keys(value)?.length > 0;
}

/**
 * * Type guard to check if a value is an object with specific keys.
 * @param value - The value to check.
 * @param keys - The set of keys the object should contain.
 * @returns `true` if the value is an object with the specified keys, otherwise `false`.
 */
export function isObjectWithKeys<T extends Record<string, unknown>>(
	value: unknown,
	keys: (keyof T)[],
): value is T {
	return isObject(value) && keys?.every((key) => key in value);
}

/**
 * * Type guard to check if a value is an empty object.
 * @param value - The value to check.
 * @returns `true` if the value is an empty object, otherwise `false`.
 */
export function isEmptyObject<T extends GenericObject>(value: T): boolean {
	return isObject(value) && Object.keys(value)?.length === 0;
}

/**
 * * Type guard to check if a value is a function.
 * @param value - The value to check.
 * @returns `true` if the value is a function, otherwise `false`.
 */
export function isFunction(value: unknown): value is GenericFn {
	return typeof value === 'function';
}

/**
 * * Determines whether the provided property descriptor represents a method.
 *
 * @param descriptor - The property descriptor to check.
 * @returns `true` if the descriptor is defined and its value is a function; otherwise, `false`.
 */
export const isMethodDescriptor = (
	descriptor: PropertyDescriptor | undefined,
): boolean => {
	return !!descriptor && typeof descriptor?.value === 'function';
};

/**
 * * Type guard to check if a value is a Date object.
 * @param value - The value to check.
 * @returns `true` if the value is a Date object, otherwise `false`.
 */
export function isDate(value: unknown): value is Date {
	return value instanceof Date;
}

/**
 * * Type guard to check if a value is an array of a specific type.
 * @param value - The value to check.
 * @param typeCheck - The type guard function to check each item of the array.
 * @returns `true` if the value is an array of the specified type, otherwise `false`.
 */
export function isArrayOfType<T>(
	value: unknown,
	typeCheck: (item: unknown) => item is T,
): value is T[] {
	return isArray(value) && value?.every(typeCheck);
}

/**
 * * Type guard to check if a value is a Promise.
 * @param value - The value to check.
 * @returns `true` if the value is a Promise, otherwise `false`.
 */
export function isPromise(value: unknown): value is Promise<unknown> {
	return isObject(value) && isFunction(value.then);
}

/**
 * * Type guard to check if a value is a Set.
 * @param value - The value to check.
 * @returns `true` if the value is a Set, otherwise `false`.
 */
export function isSet<T>(value: unknown): value is Set<T> {
	return value instanceof Set;
}

/**
 * * Type guard to check if a value is a Map.
 * @param value - The value to check.
 * @returns `true` if the value is a Map, otherwise `false`.
 */
export function isMap<K, V>(value: unknown): value is Map<K, V> {
	return value instanceof Map;
}

/**
 * * Type guard to check if a value is a RegExp.
 * @param value - The value to check.
 * @returns `true` if the value is a RegExp, otherwise `false`.
 */
export function isRegExp(value: unknown): value is RegExp {
	return value instanceof RegExp;
}

/**
 * * Type guard to check if a value is an Error object.
 * @param value - The value to check.
 * @returns `true` if the value is an Error object, otherwise `false`.
 */
export function isError(value: unknown): value is Error {
	return value instanceof Error;
}

/**
 * * Type guard to check if a string is valid JSON.
 * @param value - The value to check.
 * @returns `true` if the value is valid JSON, otherwise `false`.
 */
export function isJSON(value: unknown): value is string {
	if (!isString(value)) return false;

	try {
		JSON.parse(value);
		return true;
	} catch {
		return false;
	}
}

/**
 * * Type guard to check if a function returns a Promise.
 * @param fn - The function to check.
 * @returns `true` if the function returns a Promise, otherwise `false`.
 */
export function isReturningPromise<T>(fn: unknown): fn is AsyncFunction<T> {
	return isFunction(fn) && fn.constructor?.name === 'AsyncFunction';
}
