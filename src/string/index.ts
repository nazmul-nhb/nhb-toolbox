import type { CapitalizeOptions } from './types';

/**
 * Utility to convert the first letter of any string to uppercase and the rest lowercase (unless specified).
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
 * Utility to truncate a string to a specified length.
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
