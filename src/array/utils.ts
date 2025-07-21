import type { SortNature } from './types';

/**
 * * Compare two strings using natural sorting (e.g., "file2" < "file10").
 * Optionally supports case-insensitive and locale-aware string chunk comparisons.
 *
 * @param a - The first string to compare.
 * @param b - The second string to compare.
 * @param options - Optional settings to configure comparison behavior.
 * @param options.caseInsensitive - If true, compares string chunks without case sensitivity. Defaults to `true`.
 * @param options.localeAware - If true, uses localeCompare for string chunk comparisons. Defaults to `false`.
 * @returns A negative number if `a` comes before `b`, a positive number if `a` comes after `b`, or 0 if equal.
 */
export function naturalSort(
	a: string,
	b: string,
	options?: SortNature
): number {
	const { caseInsensitive = true, localeAware = false } = options || {};

	/**
	 * * Splits a string into an array of number and non-number chunks.
	 * @param str - The string to split.
	 * @returns An array of string and number parts.
	 */
	const _createChunks = (str: string): (string | number)[] => {
		const chunks: (string | number)[] = [];

		let current = '';
		let isNumeric = false;

		for (const char of str) {
			const charIsNum = !Number.isNaN(Number(char));

			if (current?.length === 0) {
				current = char;
				isNumeric = charIsNum;
				continue;
			}

			if (charIsNum === isNumeric) {
				current += char;
			} else {
				chunks?.push(isNumeric ? Number(current) : current);
				current = char;
				isNumeric = charIsNum;
			}
		}

		if (current?.length > 0) {
			chunks?.push(isNumeric ? Number(current) : current);
		}

		return chunks;
	};

	const aChunks = _createChunks(a);
	const bChunks = _createChunks(b);

	for (let i = 0; i < Math.min(aChunks?.length, bChunks?.length); i++) {
		let aChunk = aChunks[i];
		let bChunk = bChunks[i];

		// Normalize string chunks if case-insensitive
		if (
			caseInsensitive &&
			typeof aChunk === 'string' &&
			typeof bChunk === 'string'
		) {
			aChunk = aChunk?.toLowerCase();
			bChunk = bChunk?.toLowerCase();
		}

		// Compare types: number vs string
		if (typeof aChunk !== typeof bChunk) {
			return typeof aChunk === 'string' ? 1 : -1;
		}

		// Compare same-type chunks
		if (aChunk !== bChunk) {
			if (typeof aChunk === 'number' && typeof bChunk === 'number') {
				return aChunk - bChunk;
			}

			if (typeof aChunk === 'string' && typeof bChunk === 'string') {
				if (localeAware) {
					const cmp = aChunk.localeCompare(bChunk, undefined, {
						sensitivity: caseInsensitive ? 'accent' : 'variant',
					});
					if (cmp !== 0) return cmp;
				}
				return aChunk < bChunk ? -1 : 1;
			}
		}
	}

	return aChunks?.length - bChunks?.length;
}
