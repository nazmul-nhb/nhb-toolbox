/**
 * * Efficiently generates unique anagrams of a word.
 * @param word The word for generating anagrams.
 * @param limit The maximum number of anagrams to return ('all' for unlimited). Default is `100`.
 * @returns A list of generated anagrams.
 */
export function generateAnagrams(
	word: string,
	limit: number | 'all' = 100,
): string[] {
	if (word.length <= 1) return [word];

	const uniqueAnagrams = new Set<string>();

	/**
	 * * Helper function to generate permutations.
	 * @param str Current permutation being formed.
	 * @param remaining Remaining characters to process.
	 */
	const permute = (str: string, remaining: string) => {
		if (!remaining.length) {
			uniqueAnagrams.add(str);
			return;
		}

		for (let i = 0; i < remaining.length; i++) {
			permute(
				str + remaining[i],
				remaining.slice(0, i) + remaining.slice(i + 1),
			);

			if (limit !== 'all' && uniqueAnagrams.size >= limit) return;
		}
	};

	permute('', word);

	return Array.from(uniqueAnagrams);
}
