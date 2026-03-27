import type { TupleOf } from '../utils/types';
import { getLevenshteinDistance } from './utilities';

/**
 * Calculates the similarity between two strings using the Levenshtein edit distance.
 *
 * @param str1 The first string to compare.
 * @param str2 The second string to compare.
 * @returns A score between `0` and `1`, where `1` means identical and `0` means completely different.
 */
export function _calculateSimilarity(str1: string, str2: string): number {
	// Quick check for identical strings
	if (str1 === str2) return 1;

	const maxLen = Math.max(str1.length, str2.length);

	if (maxLen === 0) return 1;

	const distance = getLevenshteinDistance(str1, str2);

	return 1 - distance / maxLen;
}

/**
 * Builds an LCS (Longest Common Subsequence) table for two strings at the character level.
 *
 * @param original The original string.
 * @param modified The modified string.
 * @returns A 2D matrix where each cell `[i][j]` holds the LCS length of `original[0..i-1]` and `modified[0..j-1]`.
 */
export function _buildCharLcsTable(original: string, modified: string): number[][] {
	const origLen = original.length;
	const modLen = modified.length;

	const lcs: number[][] = Array(origLen + 1)
		.fill(null)
		.map(() => Array(modLen + 1).fill(0));

	for (let i = 1; i <= origLen; i++) {
		for (let j = 1; j <= modLen; j++) {
			if (original[i - 1] === modified[j - 1]) {
				lcs[i][j] = lcs[i - 1][j - 1] + 1;
			} else {
				lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
			}
		}
	}

	return lcs;
}

/**
 * Backtracks through an LCS table to extract matched character indices in both strings.
 *
 * @param original The original string.
 * @param modified The modified string.
 * @param lcs The precomputed LCS table from {@link buildCharLcsTable}.
 * @returns A tuple `[origMatched, modMatched]` — sets of matched character indices for the original and modified strings respectively.
 */
export function _getLcsIndices(original: string, modified: string, lcs: number[][]) {
	const origLen = original.length;
	const modLen = modified.length;

	const origMatched = new Set<number>();
	const modMatched = new Set<number>();

	let i = origLen;
	let j = modLen;

	while (i > 0 && j > 0) {
		if (original[i - 1] === modified[j - 1]) {
			origMatched.add(i - 1);
			modMatched.add(j - 1);
			i--;
			j--;
		} else if (lcs[i - 1][j] > lcs[i][j - 1]) {
			i--;
		} else {
			j--;
		}
	}

	return [origMatched, modMatched] as TupleOf<Set<number>, 2>;
}
