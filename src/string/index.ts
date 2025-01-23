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
			lowerCaseRest
				? trimmedString.slice(1).toLowerCase()
				: trimmedString.slice(1),
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
 * * Generates a unique ID string composed of an optional `prefix`, `suffix`, a `timestamp`, `separator`, and a random alphanumeric string, separated by a customizable separator.
 *
 * @param options Configuration options for random ID generation.
 * @returns The generated ID string composed of the random alphanumeric string, timestamp, prefix, and suffix, separated by the specified separator.
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

