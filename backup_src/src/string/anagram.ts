/**
 * * Utility to generate unique anagrams of a word.
 * @param word The word for generating anagrams.
 * @param limit The maximum number of anagrams to return ('all' for unlimited). Default is `100`.
 * @returns An array of generated anagrams. The first element is always the given word. Generated anagrams are always in lowercase.
 */
export function generateAnagrams(
	word: string,
	limit: number | 'all' = 100,
): Lowercase<string>[] {
	if (word?.length <= 1) {
		return [word?.toLowerCase() as Lowercase<string>];
	}

	const uniqueAnagrams = new Set<string>();

	/**
	 * * Helper function to generate permutations.
	 * @param str Current permutation being formed.
	 * @param remaining Remaining characters to process.
	 */
	const _permute = (str: string, remaining: string) => {
		if (!remaining?.length) {
			uniqueAnagrams.add(str);
			return;
		}

		for (let i = 0; i < remaining?.length; i++) {
			if (limit !== 'all' && uniqueAnagrams.size >= limit) return;

			_permute(
				str + remaining[i],
				remaining?.slice(0, i) + remaining?.slice(i + 1),
			);
		}
	};

	_permute('', word.toLowerCase());

	return Array.from(uniqueAnagrams) as Lowercase<string>[];
}
