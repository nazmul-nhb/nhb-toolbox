import type { GenericObject } from '../object/types';
import type { OwnKeys } from '../types/index';
import type { FindOptions } from './types';

type KeySelector<T> = Extract<OwnKeys<T>, string | number> | ((item: T) => string | number);

type CacheEntry<T> = { result: T[]; timestamp: number };

/**
 * The `Finder` class performs optimized searching on arrays.
 * It supports binary search, fuzzy search, and smart caching with TTL.
 */
export class Finder<T extends GenericObject> {
	static readonly #DEFAULT_TTL = 1000 * 60 * 5;

	readonly #cachedResult: Map<string, CacheEntry<T>> = new Map();
	readonly #sortedCache: Map<string, CacheEntry<T>> = new Map();
	readonly #ttl: number;
	readonly #items: T[];

	/**
	 * * Creates a new `Finder` instance with a static array of items.
	 *
	 * @param data An array of items to initialize the search dataset.
	 * @param ttl Optional time-to-live (in milliseconds) for cached search results. Defaults to {@link Finder.#DEFAULT_TTL 5 Minutes}.
	 */
	constructor(data: T[], ttl?: number);

	/**
	 * * Creates a new `Finder` instance with a lazy-evaluated item provider.
	 *
	 * @param cb A function returning an array of items to initialize the search dataset.
	 * @param ttl Time-to-live (in milliseconds) for cached search results. Defaults to {@link Finder.#DEFAULT_TTL 5 Minutes}.
	 */
	constructor(cb: () => T[], ttl?: number);

	/**
	 * * Creates a new `Finder` instance.
	 *
	 * @param data The initial array of items or a callback returning them.
	 * @param ttl Time-to-live (in milliseconds) for cached search results. Defaults to {@link Finder.#DEFAULT_TTL 5 Minutes}.
	 */
	constructor(data: T[] | (() => T[]), ttl: number = Finder.#DEFAULT_TTL) {
		this.#ttl = ttl;
		this.#items = typeof data === 'function' ? data() : data;
	}

	/**
	 * @instance Clears cache globally or for a specific key.
	 * @param key Optional key to clear only a specific cache entry.
	 */
	clearCache(key?: string): void {
		if (key) {
			this.#cachedResult.delete(key);
		} else {
			this.#cachedResult.clear();
		}
	}

	/**
	 * @instance Finds all items that match the provided matcher using optional caching or fuzzy logic.
	 * @param matcher The value to match against.
	 * @param keySelector Property key or selector function.
	 * @param options Optional settings for search behavior and source list.
	 */
	findAll(
		matcher: string | number,
		keySelector: KeySelector<T>,
		options?: FindOptions<T>
	): T[] {
		const {
			fuzzy = false,
			needSorting = true,
			cacheKey = 'finder-cache',
			forceBinary = false,
			caseInsensitive = true,
			data,
		} = options ?? {};

		const source = typeof data === 'function' ? data() : (data ?? this.#items);

		if (!source?.length) return [];

		const rawGetKey =
			typeof keySelector === 'function' ? keySelector : (
				(item: T) => item[keySelector] as string | number
			);

		const getKey = Finder.#createMemoizedKeyGetter(rawGetKey);

		const normalizedMatcher =
			caseInsensitive && typeof matcher === 'string' ? matcher.toLowerCase() : matcher;

		if (cacheKey) {
			const entry = this.#cachedResult.get(cacheKey);

			if (entry && Date.now() - entry.timestamp < this.#ttl) {
				return entry.result;
			} else {
				this.#cachedResult.delete(cacheKey);
			}
		}

		let results: T[] = [];

		if (source.length < 100 && !forceBinary) {
			results = source.filter((item) => {
				const key = getKey(item);
				const value =
					caseInsensitive && typeof key === 'string' ? key.toLowerCase() : key;
				return value === normalizedMatcher;
			});
		} else {
			const sorted = needSorting ? this.#sortAndCache(source, getKey, cacheKey) : source;

			const firstMatch = this.binarySearch(
				sorted,
				normalizedMatcher,
				getKey,
				caseInsensitive
			);

			if (firstMatch) {
				const baseKey = getKey(firstMatch);

				const base =
					caseInsensitive && typeof baseKey === 'string' ?
						baseKey.toLowerCase()
					:	baseKey;

				results = sorted.filter((item) => {
					const key = getKey(item);

					const value =
						caseInsensitive && typeof key === 'string' ? key.toLowerCase() : key;

					return value === base;
				});
			}
		}

		if (!results.length && fuzzy && typeof normalizedMatcher === 'string') {
			results = source.filter((item) => {
				const rawKey = getKey(item);

				const key =
					caseInsensitive && typeof rawKey === 'string' ?
						rawKey.toLowerCase()
					:	String(rawKey);

				return this.#match(key, normalizedMatcher);
			});
		}

		if (cacheKey) {
			this.#cachedResult.set(cacheKey, {
				result: results,
				timestamp: Date.now(),
			});
		}

		return results;
	}

	/**
	 * @instance Finds first matching item that matches the provided matcher using optional caching or fuzzy logic.
	 * @param matcher The value to match.
	 * @param keySelector Property key or selector function.
	 * @param options Optional behavior flags and item source.
	 */
	findOne(
		matcher: string | number,
		keySelector: KeySelector<T>,
		options?: FindOptions<T>
	): T | undefined {
		const {
			fuzzy = false,
			needSorting = true,
			cacheKey = 'finder-cache',
			forceBinary = false,
			caseInsensitive = true,
			data,
		} = options ?? {};

		const source = typeof data === 'function' ? data() : (data ?? this.#items);

		if (!source?.length) return undefined;

		const rawGetKey =
			typeof keySelector === 'function' ? keySelector : (
				(item: T) => item[keySelector] as string | number
			);

		const getKey = Finder.#createMemoizedKeyGetter(rawGetKey);

		const normalizedMatcher =
			caseInsensitive && typeof matcher === 'string' ? matcher.toLowerCase() : matcher;

		if (cacheKey) {
			const entry = this.#cachedResult.get(cacheKey);

			if (entry && Date.now() - entry.timestamp < this.#ttl) {
				return entry.result[0];
			} else {
				this.#cachedResult.delete(cacheKey);
			}
		}

		let result: T | undefined;

		if (source?.length < 100 && !forceBinary) {
			result = source?.find((item) => {
				const key = getKey(item);
				const value =
					caseInsensitive && typeof key === 'string' ? key.toLowerCase() : key;
				return value === normalizedMatcher;
			});
		} else {
			result = this.binarySearch(
				needSorting ? this.#sortAndCache(source, getKey, cacheKey) : source,
				normalizedMatcher,
				getKey,
				caseInsensitive
			);
		}

		if (!result && fuzzy && typeof normalizedMatcher === 'string') {
			return this.fuzzySearch(source, normalizedMatcher, getKey, caseInsensitive);
		}

		if (cacheKey && result) {
			this.#cachedResult.set(cacheKey, {
				result: [result],
				timestamp: Date.now(),
			});
		}

		return result;
	}

	/**
	 * @instance Asynchronous variant of `findAll` that accepts a promise-based data supplier.
	 * @param supplier Async function resolving the items list.
	 * @param matcher The value to match.
	 * @param keySelector Property key or selector function.
	 * @param options Optional settings for search behavior and cache.
	 */
	async findAllAsync(
		supplier: () => Promise<T[]>,
		matcher: string | number,
		keySelector: KeySelector<T>,
		options?: Omit<FindOptions<T>, 'data'>
	): Promise<T[]> {
		const items = await supplier();

		return this.findAll(matcher, keySelector, { ...options, data: items });
	}

	/**
	 * @instance Asynchronous variant of `findOne`.
	 * @param supplier Async function resolving the items list.
	 * @param matcher The value to match.
	 * @param keySelector Property key or selector function.
	 * @param options Optional settings for behavior and cache.
	 */
	async findOneAsync(
		supplier: () => Promise<T[]>,
		matcher: string | number,
		keySelector: KeySelector<T>,
		options?: Omit<FindOptions<T>, 'data'>
	): Promise<T | undefined> {
		const items = await supplier();

		return this.findOne(matcher, keySelector, { ...options, data: items });
	}

	/**
	 * @instance Performs a binary search on a sorted array using a custom key selector.
	 *
	 * @param sorted - The sorted array of items to search.
	 * @param matcher - The value to search for.
	 * @param keySelector - A function that extracts the comparable key from each item.
	 * @param caseInsensitive - Whether to compare string keys ignoring case.
	 * @returns The first matching item if found; otherwise, undefined.
	 */
	binarySearch(
		sorted: T[],
		matcher: string | number,
		keySelector: (item: T) => string | number,
		caseInsensitive: boolean
	): T | undefined {
		let min = 0,
			max = sorted?.length - 1;

		while (min <= max) {
			const mid = Math.floor((min + max) / 2);
			const midKey = keySelector(sorted[mid]);
			const key =
				caseInsensitive && typeof midKey === 'string' ? midKey.toLowerCase() : midKey;

			if (key === matcher) return sorted[mid];
			if (key < matcher) min = mid + 1;
			else max = mid - 1;
		}

		return undefined;
	}

	/**
	 * @instance Performs a fuzzy search on an array by matching characters in sequence.
	 *
	 * @param array - The array of items to search.
	 * @param matcher - The fuzzy search string to match against.
	 * @param keySelector - A function that extracts the key to search from each item.
	 * @param caseInsensitive - Whether to compare ignoring case for string values.
	 * @returns The first fuzzy-matching item if found; otherwise, undefined.
	 */
	fuzzySearch(
		array: T[],
		matcher: string,
		keySelector: (item: T) => string | number,
		caseInsensitive: boolean
	): T | undefined {
		for (const item of array) {
			const rawKey = keySelector(item);
			const key =
				caseInsensitive && typeof rawKey === 'string' ?
					rawKey.toLowerCase()
				:	String(rawKey);
			if (this.#match(key, matcher)) return item;
		}

		return undefined;
	}

	/**
	 * @private Checks if the characters in the target string appear in order within the source string.
	 * @param source Source string to search within.
	 * @param target Target string to match against the source string.
	 * @returns True if the target string is a fuzzy match within the source string; otherwise, false.
	 */
	#match(source: string, target: string): boolean {
		let i = 0;

		for (const char of target) {
			i = source?.indexOf(char, i);
			if (i === -1) return false;
			i++;
		}

		return true;
	}

	/**
	 * @private Sorts an array and caches the result for a specified time-to-live (TTL).
	 * @param data Data to sort and cache.
	 * @param getKey Key extraction function.
	 * @param cacheKey Optional cache key for storing the result.
	 * @returns
	 */
	#sortAndCache(data: T[], getKey: (item: T) => string | number, cacheKey?: string) {
		if (cacheKey) {
			const entry = this.#sortedCache.get(cacheKey);

			if (entry && Date.now() - entry.timestamp < this.#ttl) {
				return entry.result;
			} else {
				this.#sortedCache.delete(cacheKey);
			}
		}

		const sorted = [...data].sort((a, b) => {
			const keyA = getKey(a);
			const keyB = getKey(b);
			return (
				keyA < keyB ? -1
				: keyA > keyB ? 1
				: 0
			);
		});

		if (cacheKey) {
			this.#sortedCache.set(cacheKey, {
				result: sorted,
				timestamp: Date.now(),
			});
		}

		return sorted;
	}

	/**
	 * @static @private Creates a memoized version of a key extractor.
	 * @param getKey Original key extraction function
	 */
	static #createMemoizedKeyGetter<T>(
		getKey: (item: T) => string | number
	): (item: T) => string | number {
		const cache = new Map<T, string | number>();

		return (item: T): string | number => {
			if (cache.has(item)) return cache.get(item)!;
			const key = getKey(item);
			cache.set(item, key);
			return key;
		};
	}
}
