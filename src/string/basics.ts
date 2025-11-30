import { isNonEmptyString } from '../guards/primitives';
import type { RandomIdOptions } from './types';

/**
 * * Utility to truncate a string to a specified length.
 *
 * @param str The string to truncate.
 * @param maxLength The maximum length of the truncated string.
 * @returns Truncated string with ellipsis (`...`) (only if it has more length than `maxLength`).
 */
export function truncateString(str: string, maxLength: number): string {
	if (!isNonEmptyString(str)) return '';

	const trimmedString = str.trim();

	if (!trimmedString) return '';

	if (trimmedString.length <= maxLength) return trimmedString;

	return trimmedString.slice(0, maxLength)?.concat('...');
}

/**
 * * Generates a random alphanumeric (16 characters long, this length is customizable in the options) ID string composed of an optional `prefix`, `suffix`, a `timestamp`, `caseOption` and a customizable `separator`.
 *
 * @param options Configuration options for random ID generation.
 * @returns The generated ID string composed of the random alphanumeric string of specified length with optional `timeStamp`, `prefix`, and `suffix`, `caseOption` and `separator`.
 */
export function generateRandomID(options?: RandomIdOptions): string {
	const {
		prefix = '',
		suffix = '',
		timeStamp = false,
		length = 16,
		separator = '',
		caseOption = null,
	} = options || {};

	// generate timestamp
	const date = timeStamp ? Date.now() : '';

	// Generate a random string of alphanumeric characters
	const randomString: string = Array.from({ length }, () =>
		Math.random().toString(36).slice(2, 3)
	).join('');

	const ID = [prefix && prefix.trim(), date, randomString, suffix && suffix.trim()]
		?.filter(Boolean)
		?.join(separator);

	switch (caseOption) {
		case 'upper':
			return ID.toUpperCase();
		case 'lower':
			return ID.toLowerCase();
		default:
			return ID;
	}
}

/**
 * * Trims all the words in a string.
 *
 * @param input The string to trim.
 * @returns Trimmed string.
 */
export function trimString(input: string): string;

/**
 * * Trims all the words in an array of strings.
 *
 * @param input The array of strings to trim.
 * @returns Trimmed array of strings.
 */
export function trimString(input: string[]): string[];

/**
 * * Trims all the words in a string or an array of strings.
 *
 * @param input String or array of strings.
 * @returns Trimmed string or array of strings.
 */
export function trimString(input: string | string[]): string | string[] {
	if (!input) return '';

	// If the input is a string, trim each word
	if (isNonEmptyString(input)) {
		return input.trim().replace(/\s+/g, ' ');
	}

	// If the input is an array of strings, trim each string in the array
	if (Array.isArray(input)) {
		return input.map((str) =>
			isNonEmptyString(str) ? str.trim().replace(/\s+/g, ' ') : str
		);
	}

	throw new TypeError('Expected string or array of strings!', {
		cause: 'Invalid Input Type',
	});
}
