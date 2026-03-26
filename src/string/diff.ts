import { _buildCharLcsTable, _calculateSimilarity, _getLcsIndices } from './helpers';
import type { CharDiffResult, DiffLine, DiffResult } from './types';

/**
 * * Computes a line-based text diff between two strings using the Longest Common Subsequence (LCS) algorithm.
 *
 * @remarks
 * - Lines are classified as `added`, `removed`, `modified`, or `unchanged`.
 * - Detects and pairs similar `removed` and `added` lines as `modified` when their similarity exceeds the threshold.
 *
 * @param originalText The original (before) text.
 * @param modifiedText The modified (after) text.
 * @returns A {@link DiffResult} with the list of diff lines and summary statistics.
 *
 * @example
 * const result = computeTextDiff('hello\nworld', 'hello\nearth');
 * // result.stats → { linesAdded: 1, linesRemoved: 1, linesChanged: 0, linesUnchanged: 1 }
 *
 * @example
 * const result = computeTextDiff('foo\nbar', 'foo\nbaz\nqux');
 * result.stats.linesAdded;   // 1
 * result.stats.linesChanged; // 1
 */
export function computeTextDiff(originalText: string, modifiedText: string): DiffResult {
	const originalLines = originalText.split('\n');
	const modifiedLines = modifiedText.split('\n');

	const originalLen = originalLines.length;
	const modifiedLen = modifiedLines.length;

	// Build LCS table
	const lcs = Array(originalLen + 1)
		.fill(null)
		.map(() => Array(modifiedLen + 1).fill(0));

	for (let i = 1; i <= originalLen; i++) {
		for (let j = 1; j <= modifiedLen; j++) {
			if (originalLines[i - 1] === modifiedLines[j - 1]) {
				lcs[i][j] = lcs[i - 1][j - 1] + 1;
			} else {
				lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
			}
		}
	}

	// Backtrack to find the diff
	const diffLines: DiffLine[] = [];
	let i = originalLen;
	let j = modifiedLen;

	while (i > 0 || j > 0) {
		if (i > 0 && j > 0 && originalLines[i - 1] === modifiedLines[j - 1]) {
			// No change
			diffLines.unshift({
				type: 'unchanged',
				original: originalLines[i - 1],
				modified: modifiedLines[j - 1],
				originalLineNum: i,
				modifiedLineNum: j,
			});
			i--;
			j--;
		} else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
			// Added line
			diffLines.unshift({
				type: 'added',
				modified: modifiedLines[j - 1],
				modifiedLineNum: j,
			});
			j--;
		} else if (i > 0) {
			// Removed line
			diffLines.unshift({
				type: 'removed',
				original: originalLines[i - 1],
				originalLineNum: i,
			});
			i--;
		}
	}

	// Post-process: Detect and pair similar removed/added lines as "modified"
	const processedLines: DiffLine[] = [];
	const usedIndices = new Set<number>();
	const SIMILARITY_THRESHOLD = 0.6;

	for (let idx = 0; idx < diffLines.length; idx++) {
		if (usedIndices.has(idx)) continue;

		const line = diffLines[idx];

		if (line.type === 'removed') {
			// Look ahead for a similar added line
			for (let jdx = idx + 1; jdx < diffLines.length; jdx++) {
				if (usedIndices.has(jdx)) continue;

				const nextLine = diffLines[jdx];
				if (nextLine.type === 'added') {
					const similarity = _calculateSimilarity(
						line.original || '',
						nextLine.modified || ''
					);

					if (similarity >= SIMILARITY_THRESHOLD) {
						// Mark as modified
						processedLines.push({
							type: 'modified',
							original: line.original,
							modified: nextLine.modified,
							originalLineNum: line.originalLineNum,
							modifiedLineNum: nextLine.modifiedLineNum,
						});
						usedIndices.add(idx);
						usedIndices.add(jdx);
						break;
					}
				}
			}

			// If not paired, add as removed
			if (!usedIndices.has(idx)) {
				processedLines.push(line);
				usedIndices.add(idx);
			}
		} else if (line.type !== 'added' || !usedIndices.has(idx)) {
			// Add unchanged lines and unpaired added lines
			if (line.type !== 'added' || !usedIndices.has(idx)) {
				processedLines.push(line);
				usedIndices.add(idx);
			}
		}
	}

	// Calculate stats
	let linesAdded = 0;
	let linesRemoved = 0;
	let linesChanged = 0;
	let linesUnchanged = 0;

	for (const line of processedLines) {
		if (line.type === 'added') {
			linesAdded++;
		} else if (line.type === 'removed') {
			linesRemoved++;
		} else if (line.type === 'modified') {
			linesChanged++;
		} else if (line.type === 'unchanged') {
			linesUnchanged++;
		}
	}

	return {
		lines: processedLines,
		stats: {
			linesAdded,
			linesRemoved,
			linesChanged,
			linesUnchanged,
		},
	};
}

/**
 * * Highlights character-level differences between two strings using the LCS algorithm.
 *
 * @remarks
 * - The function returns two arrays of characters for the original and modified strings.
 * - Each character in both strings is annotated with a `highlighted` flag indicating whether it differs from the other string.
 *
 * @param original The original string to compare from.
 * @param modified The modified string to compare to.
 * @returns A {@link CharDiffResult} with annotated character arrays for both strings.
 *
 * @example
 * const diff = getCharacterDifferences('cat', 'car');
 * diff.original; // [{ text: 'c', highlighted: false }, { text: 'a', highlighted: false }, { text: 't', highlighted: true }]
 * diff.modified; // [{ text: 'c', highlighted: false }, { text: 'a', highlighted: false }, { text: 'r', highlighted: true }]
 *
 * @example
 * // When one string is empty, all characters in the other are highlighted
 * getCharacterDifferences('', 'hi');
 * // { original: [], modified: [{ text: 'h', highlighted: true }, { text: 'i', highlighted: true }] }
 *
 * @example
 * const diff = getCharacterDifferences('hello world', 'hello earth');
 * // Characters unique to each string will have highlighted: true
 */
export function getCharacterDifferences(original: string, modified: string): CharDiffResult {
	const result: CharDiffResult = {
		original: [],
		modified: [],
	};

	// Handle empty strings
	if (!original && !modified) return result;
	if (!original) {
		return {
			original: [],
			modified: modified.split('').map((text) => ({ text, highlighted: true })),
		};
	}
	if (!modified) {
		return {
			original: original.split('').map((text) => ({ text, highlighted: true })),
			modified: [],
		};
	}

	// Build LCS table for character-level matching
	const lcsTable = _buildCharLcsTable(original, modified);
	const [origMatched, modMatched] = _getLcsIndices(original, modified, lcsTable);

	// Build original string with highlighting
	for (let i = 0; i < original.length; i++) {
		result.original.push({
			text: original[i],
			highlighted: !origMatched.has(i),
		});
	}

	// Build modified string with highlighting
	for (let j = 0; j < modified.length; j++) {
		result.modified.push({
			text: modified[j],
			highlighted: !modMatched.has(j),
		});
	}

	return result;
}
