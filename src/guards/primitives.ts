import type {
	FalsyPrimitive,
	NormalPrimitive,
	Primitive,
} from '../types/index';

/**
 * * Type guard to check whether a value is a finite number (excluding `NaN` and `Infinity`).
 * @param value - The value to test.
 * @returns `true` if the value is a finite number; otherwise `false`.
 */
export function isNumber(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value);
}

/**
 * * Type guard to check if a value is a string.
 * @param value - The value to check.
 * @returns `true` if the value is a string, otherwise `false`.
 */
export function isString(value: unknown): value is string {
	return typeof value === 'string';
}

/**
 * * Type guard to check if a value is an integer.
 * @param value - The value to check.
 * @returns `true` if the value is an integer, otherwise `false`.
 */
export function isInteger(value: unknown): value is number {
	return isNumber(value) && Number.isInteger(value);
}

/**
 * * Type guard to check if a value is a positive integer.
 * @param value - The value to check.
 * @returns `true` if the value is a positive integer, otherwise `false`.
 */
export function isPositiveInteger(value: unknown): value is number {
	return isInteger(value) && value > 0;
}

/**
 * * Type guard to check if a value is a boolean.
 * @param value - The value to check.
 * @returns `true` if the value is a boolean, otherwise `false`.
 */
export function isBoolean(value: unknown): value is boolean {
	return typeof value === 'boolean';
}

/**
 * * Type guard to check if a value is null.
 * @param value - The value to check.
 * @returns `true` if the value is null, otherwise `false`.
 */
export function isNull(value: unknown): value is null {
	return value === null;
}

/**
 * * Type guard to check if a value is undefined.
 * @param value - The value to check.
 * @returns `true` if the value is undefined, otherwise `false`.
 */
export function isUndefined(value: unknown): value is undefined {
	return value === undefined;
}

/**
 * * Type guard to check if a value is a symbol.
 * @param value - The value to check.
 * @returns `true` if the value is a symbol, otherwise `false`.
 */
export function isSymbol(value: unknown): value is symbol {
	return typeof value === 'symbol';
}

/**
 * * Type guard to check if a value is a BigInt.
 * @param value - The value to check.
 * @returns `true` if the value is a BigInt, otherwise `false`.
 */
export function isBigInt(value: unknown): value is bigint {
	return typeof value === 'bigint';
}

/**
 * * Type guard to check if a value is a primitive (i.e. `string | number | boolean | symbol | bigint | null | undefined`).
 * @param value - The value to check.
 * @returns `true` if the value is a primitive, otherwise `false`.
 */
export function isPrimitive(value: unknown): value is Primitive {
	return (
		value === null ||
		[
			'string',
			'number',
			'boolean',
			'symbol',
			'bigint',
			'undefined',
		].includes(typeof value)
	);
}

/**
 * * Type guard to check if a value is a normal primitive (i.e. `string | number | boolean | null | undefined`).
 * @param value - The value to check.
 * @returns `true` if the value is a primitive, otherwise `false`.
 */
export function isNormalPrimitive(value: unknown): value is NormalPrimitive {
	return (
		value == null ||
		['string', 'number', 'boolean', 'undefined'].includes(typeof value)
	);
}

/**
 * * Type guard to check if a value is a non-empty string.
 * @param value - The value to check.
 * @returns `true` if the value is a non-empty string, otherwise `false`.
 */
export function isNonEmptyString(value: unknown): value is string {
	return isString(value) && value?.length > 0;
}

/**
 * * Type guard to check if a value is falsy.
 * @param value - The value to check.
 * @returns `true` if the value is falsy, otherwise `false`.
 */
export function isFalsy(value: unknown): value is FalsyPrimitive {
	return !value;
}

/**
 * * Type guard to check if a value is truthy.
 * @param value - The value to check.
 * @returns `true` if the value is truthy (not null or undefined), otherwise `false`.
 */
export function isTruthy<T>(value: T): value is Exclude<T, FalsyPrimitive> {
	return Boolean(value);
}
