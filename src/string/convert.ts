/**
 * * Converts a string to `camelCase`, `snake_case`, or `kebab-case`.
 *
 * @param string - The input string to be converted. Words should be separated by **non-alphanumeric characters** (e.g., spaces, hyphens, underscores, dots, slashes, etc.).
 * @param format - The format to convert the string to (`'camelCase'`, `'snake_case'`, or `'kebab-case'`).
 * @returns The formatted string in the specified case format.
 */

export function convertStringCase(
	string: string,
	format: 'camelCase' | 'snake_case' | 'kebab-case',
): string {
	if (!string || typeof string !== 'string') return '';

	const formattedString = string.replace(
		/[^a-zA-Z0-9]+(.)?/g,
		(_, chr: string) => (chr ? chr.toUpperCase() : ''),
	);

	if (!formattedString) return '';

	switch (format) {
		case 'camelCase':
			return (
				formattedString.charAt(0).toLowerCase() +
				formattedString.slice(1)
			);

		case 'snake_case':
			return formattedString.replace(/[A-Z]/g, (letter, index) =>
				index === 0 ? letter.toLowerCase() : `_${letter.toLowerCase()}`,
			);

		case 'kebab-case':
			return formattedString.replace(/[A-Z]/g, (letter, index) =>
				index === 0 ? letter.toLowerCase() : `-${letter.toLowerCase()}`,
			);

		default:
			return formattedString;
	}
}

/**
 * Replaces all occurrences of a string or pattern in the given input string.
 *
 * - If `find` is a string, it is converted into a global regular expression (`/find/g`).
 * - If `find` is a `RegExp`, the global (`g`) flag is ensured.
 * - Trims the input before performing replacements.
 *
 * @param input - The string in which replacements should be performed.
 * @param find - The substring or regex pattern to search for.
 * @param replace - The string to replace matches with.
 * @returns The modified/refined string with replacements applied.
 */
export const replaceAllInString = (
	input: string,
	find: string | RegExp,
	replace: string,
): string => {
	if (!input) return '';

	const trimmedString = input?.trim();

	if (!trimmedString) return '';

	const regex =
		typeof find === 'string' ?
			new RegExp(find, 'g')
		:	new RegExp(
				find,
				find.flags.includes('g') ? find.flags : find.flags + 'g',
			);

	return trimmedString?.replace(regex, replace);
};
