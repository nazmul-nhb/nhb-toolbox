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
