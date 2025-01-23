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
	options: CapitalizeOptions = {
		capitalizeAll: false,
		capitalizeEachFirst: false,
		lowerCaseRest: true,
	},
): string => {
	if (typeof string !== 'string' || !string.trim()) return '';

	if (!string) return '';

	const trimmedString = string.trim();

	if (!trimmedString) return '';

	const { capitalizeAll, capitalizeEachFirst, lowerCaseRest } = options;

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

		return (
			leadingSymbols +
			firstLetter
				.toUpperCase()
				.concat(lowerCaseRest ? rest.toLowerCase() : rest)
		);
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
