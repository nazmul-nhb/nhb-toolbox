import { isArray } from './non-primitives';
import { isString } from './primitives';

/**
 * * Type guard to check if a value is a valid email string.
 * @param value - The value to check.
 * @returns `true` if the value is a valid email, otherwise `false`.
 */
export function isEmail(value: unknown): value is string {
	return (
		isString(value) &&
		/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
	);
}

/**
 * * Type guard to check if a value is an array of valid email strings.
 * @param value - The value to check.
 * @returns `true` if the value is an array of valid email strings, otherwise `false`.
 */
export function isEmailArray(value: unknown): value is string[] {
	return isArray(value) && value.every(isEmail);
}

/**
 * * Type guard to check if a value is a valid date string.
 * @param value - The value to check.
 * @returns `true` if the value is a valid date string, otherwise `false`.
 */
export function isDateString(value: unknown): value is string {
	return isString(value) && !isNaN(Date.parse(value));
}

/**
 * * Type guard to check if a value is a valid UUID (v4).
 * @param value - The value to check.
 * @returns `true` if the value is a valid UUID, otherwise `false`.
 */
export function isUUID(value: unknown): value is string {
	return (
		isString(value) &&
		/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
			value,
		)
	);
}

/**
 * * Type guard to check if the code is running in a browser environment.
 * @returns `true` if the code is running in a browser, otherwise `false`.
 */
export function isBrowser(): boolean {
	return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * * Type guard to check if the code is running in a Node.js environment.
 * @returns `true` if the code is running in Node.js, otherwise `false`.
 */
export function isNode(): boolean {
	return (
		typeof process !== 'undefined' &&
		process.versions != null &&
		process.versions.node != null
	);
}

/**
 * * Type guard to check if a value is a valid URL.
 * @param value - The value to check.
 * @returns `true` if the value is a valid URL, otherwise `false`.
 */
export function isURL(value: unknown): value is string {
	try {
		new URL(isString(value) ? value : '');
		return true;
	} catch {
		return false;
	}
}

/**
 * * Type guard to check if a value is a valid Base64 encoded string.
 * @param value - The value to check.
 * @returns `true` if the value is a valid Base64 string, otherwise `false`.
 */
export function isBase64(value: unknown): value is string {
	return (
		isString(value) &&
		/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
			value,
		)
	);
}

/**
 * * Type guard to check if a value is a valid phone number.
 * @param value - The value to check.
 * @returns `true` if the value is a valid phone number, otherwise `false`.
 */
export function isPhoneNumber(value: unknown): value is string {
	return isString(value) && /^\+?[1-9]\d{1,14}$/.test(value);
}

/**
 * * Type guard to check if a value is a valid IP address (IPv4 or IPv6).
 * @param value - The value to check.
 * @returns `true` if the value is a valid IP address, otherwise `false`.
 */
export function isIPAddress(value: unknown): value is string {
	return (
		isString(value) &&
		/^(?:\d{1,3}\.){3}\d{1,3}$|^([a-f0-9:]+:+)+[a-f0-9]+$/i.test(value)
	);
}

/**
 * * Type guard to check if the current environment matches a given string.
 * @param env - The expected environment (e.g., "production", "development").
 * @returns `true` if the current environment matches, otherwise `false`.
 */
export function isEnvironment(env: string): boolean {
	return process.env.NODE_ENV === env;
}

/**
 * * Type guard to check if a value is a numeric string.
 * @param value - The value to check.
 * @returns `true` if the value is a numeric string, otherwise `false`.
 */
export function isNumericString(value: unknown): value is `${number}` {
	return isString(value) && /^\d+(\.\d+)?$/.test(value);
}
