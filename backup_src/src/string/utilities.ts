/**
 * * Extracts all numbers from a string as array of numbers.
 * @param input - The string to extract numbers from.
 * @returns An array of numbers found in the string.
 */
export const extractNumbersFromString = (input: string): number[] => {
	return (input.match(/\d+/g) || [])?.map(Number);
};

/**
 * * Computes the Levenshtein distance between two strings.
 * @param a - First string.
 * @param b - Second string.
 * @returns The Levenshtein distance between the two strings.
 */
export const getLevenshteinDistance = (a: string, b: string): number => {
	const lenA = a?.length;
	const lenB = b?.length;
	const dp: number[][] = Array.from({ length: lenA + 1 }, (_, i) =>
		Array.from({ length: lenB + 1 }, (_, j) =>
			i === 0 ? j
			: j === 0 ? i
			: 0,
		),
	);

	for (let i = 1; i <= lenA; i++) {
		for (let j = 1; j <= lenB; j++) {
			dp[i][j] =
				a[i - 1] === b[j - 1] ?
					dp[i - 1][j - 1]
				:	1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
		}
	}

	return dp[lenA][lenB];
};

/**
 * * Counts the number of words in a string, supporting multiple languages and scripts.
 *
 * @param text - The input string to count words from.
 * @returns Number of words (Unicode-aware).
 */
export function countWords(text: string): number {
	return (text?.match(/\p{L}[\p{L}\p{M}\p{Pd}'’]*|\p{N}+/gu) || [])?.length;
}
