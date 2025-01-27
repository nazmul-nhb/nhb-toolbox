import type { CapitalizeOptions, RandomIdOptions } from './types';

/**
 * * Utility to convert the first letter of any string to uppercase and the rest lowercase (unless specified).
 * Handles surrounding symbols like quotes or parentheses.
 *
 * @param string String to be capitalized.
 * @param options Options to customize the capitalization.
 * @returns Capitalized string.
 */
export const capitalizeString = (
	string: string,
	options?: CapitalizeOptions,
): string => {
	if (typeof string !== 'string' || !string) return '';

	const trimmedString = string.trim();

	if (!trimmedString) return '';

	const {
		capitalizeAll = false,
		capitalizeEachFirst = false,
		lowerCaseRest = true,
	} = options || {};

	if (capitalizeAll) {
		return trimmedString.toUpperCase();
	}

	if (capitalizeEachFirst) {
		return trimmedString
			.split(/\s+/)
			.map((word) => capitalizeString(word, { lowerCaseRest }))
			.join(' ');
	}

	const matchArray = trimmedString.match(/^(\W*)(\w)(.*)$/);

	if (matchArray && matchArray.length === 4) {
		const [_, leadingSymbols, firstLetter, rest] = matchArray;

		return leadingSymbols
			.concat(firstLetter.toUpperCase())
			.concat(lowerCaseRest ? rest.toLowerCase() : rest);
	}

	return trimmedString
		.charAt(0)
		.toUpperCase()
		.concat(
			lowerCaseRest ?
				trimmedString.slice(1).toLowerCase()
			:	trimmedString.slice(1),
		);
};

/**
 * * Utility to truncate a string to a specified length.
 *
 * @param string The string to truncate.
 * @param maxLength The maximum length of the truncated string.
 * @returns Truncated string;
 */
export const truncateString = (string: string, maxLength: number): string => {
	if (typeof string !== 'string' || !string) return '';

	const trimmedString = string.trim();

	if (!trimmedString) return '';

	if (!trimmedString) return '';

	if (trimmedString.length <= maxLength) return trimmedString;

	return trimmedString.slice(0, maxLength).concat('...');
};

/**
 * * Generates a random alphanumeric (16 characters long, this length is customizable in the options) ID string composed of an optional `prefix`, `suffix`, a `timestamp`, and a customizable separator.
 *
 * @param options Configuration options for random ID generation.
 * @returns The generated ID string composed of the random alphanumeric string of specified length with optional `timeStamp`, `prefix`, and `suffix`, `caseOption` and `separator`.
 */
export const generateRandomID = (options?: RandomIdOptions): string => {
	const {
		prefix = '',
		suffix = '',
		timeStamp = false,
		length = 16,
		separator = '',
		caseOption = null,
	} = options || {};

	// generate timestamp
	const date: number | string = timeStamp ? Date.now() : '';

	// Generate a random string of alphanumeric characters
	const randomString: string = Array.from({ length }, () =>
		Math.random().toString(36).slice(2, 3),
	).join('');

	const ID: string = [
		prefix && prefix.trim(),
		date,
		randomString,
		suffix && suffix.trim(),
	]
		.filter(Boolean)
		.join(separator);

	if (caseOption === 'upper') {
		return ID.toUpperCase();
	} else if (caseOption === 'lower') {
		return ID.toLowerCase();
	} else {
		return ID;
	}
};

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
	if (typeof input === 'string' && !Array.isArray(input)) {
		return input.trim().replace(/\s+/g, ' ');
	}

	// If the input is an array of strings, trim each string in the array
	if (Array.isArray(input)) {
		return input.map((str) =>
			typeof str === 'string' ? str.trim().replace(/\s+/g, ' ') : str,
		);
	}

	throw new Error('Invalid input type. Expected string or array of strings!');
}
