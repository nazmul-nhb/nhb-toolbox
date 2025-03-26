import { reverseString } from './convert';

/**
 * * Extracts all numbers from a string as array of numbers.
 * @param input - The string to extract numbers from.
 * @returns An array of numbers found in the string.
 */
export const extractNumbersFromString = (input: string): number[] => {
	return (input.match(/\d+/g) || []).map(Number);
};

/**
 * * Checks if a string is a palindrome.
 * @param input - The string to check.
 * @returns True if the string is a palindrome, otherwise false.
 */
export const isPalindrome = (input: string): boolean => {
	const normalized = input.toLowerCase().replace(/[^a-z0-9]/g, '');
	return normalized === reverseString(normalized);
};

/**
 * * Computes the Levenshtein distance between two strings.
 * @param a - First string.
 * @param b - Second string.
 * @returns The Levenshtein distance between the two strings.
 */
export const getLevenshteinDistance = (a: string, b: string): number => {
	const lenA = a.length;
	const lenB = b.length;
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
