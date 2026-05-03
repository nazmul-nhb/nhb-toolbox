/**
 * * Extracts all numbers from a string as array of numbers.
 * @param input - The string to extract numbers from.
 * @returns An array of numbers found in the string.
 */
export const extractNumbersFromString = (input: string): number[] => {
	return (input.match(/\d+/g) || [])?.map(Number);
};

/**
 * * Computes the Levenshtein distance between two strings (space optimized).
 * @param str1 - First string to compare.
 * @param str2 - Second string to compare.
 * @returns The Levenshtein distance between the two strings.
 *
 * @remarks
 * - The Levenshtein distance is the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one string into the other.
 * - This implementation uses only O(min(len(a), len(b))) space by keeping only the current and previous rows of the distance matrix.
 *
 * @example
 * const distance = getLevenshteinDistance('kitten', 'sitting');
 * console.log(distance); // Output: 3
 */
export const getLevenshteinDistance = (str1: string, str2: string): number => {
	if (str1 === str2) return 0;

	const lenA = str1?.length;
	const lenB = str2?.length;

	if (lenA < lenB) {
		// Always use smaller string for columns → less memory
		return getLevenshteinDistance(str2, str1);
	}

	let prev: number[] = Array.from({ length: lenB + 1 }, (_, j) => j);
	let curr: number[] = new Array<number>(lenB + 1);

	for (let i = 1; i <= lenA; i++) {
		curr[0] = i;

		for (let j = 1; j <= lenB; j++) {
			curr[j] =
				str1[i - 1] === str2[j - 1]
					? prev[j - 1]
					: 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
		}

		// swap rows (no reallocation)
		[prev, curr] = [curr, prev];
	}

	return prev[lenB];
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
