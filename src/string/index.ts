/**
 * Utility to convert the first letter of any string to uppercase and the rest lowercase (unless specified).
 * @param string String to be capitalized.
 * @param capEach If true, capitalizes the first letter of each word (space separated). Defaults to `false`.
 * @param lowerRest If true, ensures that the rest of the string is lowercase. Defaults to `true`.
 * @returns Capitalized string.
 */
export const capitalizeString = (
	string: string,
	capEach: boolean = false,
	lowerRest: boolean = true,
): string => {
	if (!string) return '';

	const trimmedString = string.trim();

	if (!trimmedString) return '';

	if (capEach) {
		return trimmedString
			.split(' ')
			.map((word) => capitalizeString(word, false, lowerRest))
			.join(' ');
	} else {
		if (lowerRest) {
			return trimmedString
				.charAt(0)
				.toUpperCase()
				.concat(trimmedString.slice(1).toLowerCase());
		}

		return trimmedString
			.charAt(0)
			.toUpperCase()
			.concat(trimmedString.slice(1));
	}
};
