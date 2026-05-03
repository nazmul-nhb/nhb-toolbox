import { isValidArray } from '../guards/non-primitives';
import { isNonEmptyString } from '../guards/primitives';
import type { AnagramOptions } from './types';

/** `WeakMap` to cache user provided dictionary array */
const DICT_CACHE = /* @__PURE__ */ new WeakMap<object, Set<string>>();

/** Get cached dictionary `Set` */
function _getDictSet(dict: string[]) {
	if (DICT_CACHE.has(dict)) return DICT_CACHE.get(dict)!;

	const dictSet = new Set(dict.map((w) => w.toLowerCase()));

	DICT_CACHE.set(dict, dictSet);

	return dictSet;
}

/**
 * * Generates unique anagrams of a given word. Optionally looks up valid anagrams inside a provided dictionary.
 *
 * @param word The word from which to generate anagrams. Converted to lowercase internally.
 *
 * @param options Controls the output limit and optional dictionary lookup.
 *
 * @returns A list of unique, lowercase anagrams. The original word (lowercased) is always included as the first element.
 *
 * @remarks
 * - When a dictionary is provided, only anagrams found inside that dictionary are returned.
 * - The dictionary is cached internally (with converting to lowercase) using a `WeakMap`, allowing garbage collection of unused inputs.
 * - Repeated letters are handled efficiently using a per-level set to avoid duplicate permutations.
 *
 * @example
 * generateAnagrams("east", { limit: 10 });
 *
 * @example
 * generateAnagrams("tone", {
 *   dictionary: ["tone", "note", "one"],
 *   limit: "all"
 * });
 */
export function generateAnagrams(word: string, options?: AnagramOptions): Lowercase<string>[] {
	if (!isNonEmptyString(word)) return [];
	if (word?.length === 1) return [word?.toLowerCase<'T'>()];

	const { limit = 100, dictionary = false } = options || {};

	const outSet = new Set<string>();

	const dictSet = isValidArray<string>(dictionary) ? _getDictSet(dictionary) : undefined;

	/** Helper function to generate permutations. */
	const _permute = (current: string, remaining: string) => {
		if (!remaining.length) {
			if (!dictSet || dictSet.has(current)) {
				outSet.add(current);
			}
			return;
		}

		const usedSet = new Set<string>();

		for (let i = 0; i < remaining.length; i++) {
			const char = remaining[i];
			if (usedSet.has(char)) continue; // skip duplicate letter at this level
			usedSet.add(char);

			if (limit !== 'all' && outSet.size >= limit) return;

			_permute(current + char, remaining.slice(0, i) + remaining.slice(i + 1));
		}
	};

	_permute('', word.toLowerCase());

	return [...outSet] as Lowercase<string>[];
}
