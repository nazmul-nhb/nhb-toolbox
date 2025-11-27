import { isValidArray } from '../guards/non-primitives';
import type { AnagramOptions } from './types';

/**
 * * Utility to generate unique anagrams of a word.
 * @param word The word for generating anagrams.
 * @param options The options to control the behavior: limit the output, whether to lookup in the dictionary.
 * @returns An array of generated anagrams. The first element is always the given word. Generated anagrams are always in lowercase.
 */
export function generateAnagrams(word: string, options?: AnagramOptions): Lowercase<string>[] {
	if (word?.length <= 1) {
		return [word?.toLowerCase() as Lowercase<string>];
	}

	const { limit = 100, dictionary: dict = false } = options || {};

	const uniqueAnagrams = new Set<string>();
	const dictionarySet = isValidArray<string>(dict) ? new Set(dict) : undefined;

	/** * Helper function to generate permutations. */
	const _permute = (current: string, remaining: string) => {
		if (!remaining.length) {
			if (!dictionarySet || dictionarySet.has(current)) {
				uniqueAnagrams.add(current);
			}
			return;
		}

		const used = new Set<string>();

		for (let i = 0; i < remaining.length; i++) {
			const char = remaining[i];
			if (used.has(char)) continue; // skip duplicate letter at this level
			used.add(char);

			if (limit !== 'all' && uniqueAnagrams.size >= limit) return;

			_permute(current + char, remaining.slice(0, i) + remaining.slice(i + 1));
		}
	};

	_permute('', word.toLowerCase());

	return [...uniqueAnagrams] as Lowercase<string>[];
}
