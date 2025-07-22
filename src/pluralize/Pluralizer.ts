import { isNonEmptyString } from '../guards/primitives';
import { normalizeNumber } from '../number/utilities';
import {
	irregularRules,
	pluralRules,
	singularRules,
	uncountables,
} from './rules';
import type { IrregularMap, PluralizeOptions, PluralizeRule } from './types';

/**
 * * Handles English word pluralization and singularization with support for irregular forms and uncountable nouns.
 *
 * - Provides methods to convert words between singular and plural forms, check if a word is plural or singular, and manage custom pluralization rules.
 * - Supports adding custom pluralization and singularization rules, as well as uncountable nouns.
 * - Automatically handles common irregular forms like "child" to "children"
 * - Automatically loads common irregular forms and uncountable nouns.
 * - Supports options for count-based pluralization, allowing for inclusive formatting.
 * - This class is useful for applications that need to handle natural language processing, such as chatbots, content management systems, or any text processing tasks that require accurate pluralization.
 * @example
 * const pluralizer = new Pluralizer();
 * pluralizer.pluralize('child'); // "children"
 * pluralizer.toSingular('geese'); // "goose"
 * pluralizer.isPlural('fish'); // false (uncountable)
 */
export class Pluralizer {
	readonly #pluralRules: PluralizeRule[] = [];
	readonly #singularRules: PluralizeRule[] = [];
	readonly #uncountables = new Set<string | RegExp>();
	readonly #irregularSingles: IrregularMap = {};
	readonly #irregularPlurals: IrregularMap = {};

	/**
	 * Initializes the Pluralizer with default rules and exceptions.
	 * Automatically loads irregular, pluralization and singular rules along with pre-defined uncountable nouns.
	 */
	constructor() {
		this.#loadRules();
	}

	#loadRules(): void {
		// ! Load irregular rules
		irregularRules.forEach(([single, plural]) => {
			this.addIrregular(single, plural);
		});

		// ! Load plural rules
		pluralRules.forEach(([rule, replacement]) => {
			this.addPluralRule(rule, replacement);
		});

		// ! Load singular rules
		singularRules.forEach(([rule, replacement]) => {
			this.addSingularRule(rule, replacement);
		});

		// ! Load uncountables
		uncountables.forEach((word) => {
			this.addUncountable(word);
		});
	}

	#restoreCase(original: string, transformed: string): string {
		let result = '';

		for (let i = 0; i < transformed.length; i++) {
			const origChar = original[i];

			if (origChar) {
				if (
					origChar.toUpperCase() === origChar &&
					origChar.toLowerCase() !== origChar
				) {
					result += transformed[i].toUpperCase();
				} else {
					result += transformed[i].toLowerCase();
				}
			} else {
				result += transformed[i].toLowerCase();
			}
		}

		return result;
	}

	#sanitizeWord(word: string, rules: PluralizeRule[]): string {
		if (!isNonEmptyString(word)) return '';

		if (this.#isUncountable(word)) {
			return word;
		}

		for (let i = rules.length - 1; i >= 0; i--) {
			const [rule, replacement] = rules[i];
			if (rule.test(word)) {
				return word.replace(rule, replacement);
			}
		}

		return word;
	}

	/**
	 * Check if a word is uncountable.
	 * Supports both string and RegExp entries.
	 */
	#isUncountable(word: string): boolean {
		const lower = word?.toLowerCase();

		for (const entry of this.#uncountables) {
			if (typeof entry === 'string') {
				if (entry === lower) return true;
			} else {
				if (entry.test(word)) return true;
			}
		}
		return false;
	}

	/**
	 * * Add a new pluralization rule.
	 * @param rule Pattern to match singular words.
	 * @param replacement Replacement pattern for plural form.
	 * @example
	 * pluralizer.addPluralRule(/(quiz)$/i, '$1zes');
	 */
	addPluralRule(rule: RegExp, replacement: string): void {
		this.#pluralRules.push([rule, replacement]);
	}

	/**
	 * * Add a new singularization rule.
	 * @param rule Pattern to match plural words.
	 * @param replacement Replacement pattern for singular form.
	 * @example
	 * pluralizer.addSingularRule(/(matr)ices$/i, '$1ix');
	 */
	addSingularRule(rule: RegExp, replacement: string): void {
		this.#singularRules.push([rule, replacement]);
	}

	addUncountable(word: string | RegExp): void {
		this.#uncountables.add(
			typeof word === 'string' ? word?.toLowerCase() : word
		);
	}

	/**
	 * * Add a word or pattern that should never change between singular and plural.
	 * @param word A word or regex pattern.
	 * @example
	 * pluralizer.addUncountable('fish');
	 * pluralizer.addUncountable(/pok[eé]mon$/i);
	 */
	addIrregular(single: string, plural: string): void {
		const singleLower = single?.toLowerCase();
		const pluralLower = plural?.toLowerCase();
		this.#irregularSingles[singleLower] = pluralLower;
		this.#irregularPlurals[pluralLower] = singleLower;
	}

	/**
	 * * Get the proper singular or plural form based on optional count.
	 * @param word Target word to pluralize or singularize.
	 * @param options Optional count and inclusive formatting.
	 * @returns The transformed word.
	 * @example
	 * pluralizer.pluralize('category', { count: 3 }); // "categories"
	 * pluralizer.pluralize('child', { count: 1, inclusive: true }); // "1 child"
	 */
	pluralize(word: string, options: PluralizeOptions = {}): string {
		const count = normalizeNumber(options?.count);

		if (typeof count === 'number') {
			const pluralized =
				count > 1 ? this.toPlural(word) : this.toSingular(word);
			return options.inclusive ? `${count} ${pluralized}` : pluralized;
		}

		return this.toPlural(word);
	}

	/**
	 * * Convert a word to its plural form.
	 * @param word Singular form of the word.
	 * @returns Plural form of the word.
	 * @example
	 * pluralizer.toPlural('analysis'); // "analyses"
	 */
	toPlural(word: string): string {
		if (!isNonEmptyString(word)) return '';

		const lower = word.toLowerCase();

		if (this.#isUncountable(word)) return word;

		if (this.#irregularSingles[lower]) {
			return this.#restoreCase(word, this.#irregularSingles[lower]);
		}

		return this.#restoreCase(
			word,
			this.#sanitizeWord(lower, this.#pluralRules)
		);
	}

	/**
	 * * Convert a word to its singular form.
	 * @param word Plural form of the word.
	 * @returns Singular form of the word.
	 * @example
	 * pluralizer.toSingular('geese'); // "goose"
	 */
	toSingular(word: string): string {
		if (!isNonEmptyString(word)) return '';

		const lower = word.toLowerCase();

		if (this.#isUncountable(word)) return word;

		if (this.#irregularPlurals[lower]) {
			return this.#restoreCase(word, this.#irregularPlurals[lower]);
		}

		return this.#restoreCase(
			word,
			this.#sanitizeWord(lower, this.#singularRules)
		);
	}

	/**
	 * * Check if a given word is plural.
	 * @param word Word to check.
	 * @returns True if the word is plural, otherwise false.
	 * @example
	 * pluralizer.isPlural('children'); // true
	 */
	isPlural(word: string): boolean {
		const lower = word?.toLowerCase();
		if (this.#isUncountable(word)) return false;
		if (this.#irregularPlurals?.[lower]) return true;
		return this.toSingular(lower) !== lower;
	}

	/**
	 * * Check if a given word is singular.
	 * @param word Word to check.
	 * @returns True if the word is singular, otherwise false.
	 * @example
	 * pluralizer.isSingular('child'); // true
	 */
	isSingular(word: string): boolean {
		const lower = word?.toLowerCase();
		if (this.#isUncountable(word)) return false;
		if (this.#irregularSingles?.[lower]) return true;
		return this.toPlural(lower) !== lower;
	}
}

/**
 * Default shared instance of {@link Pluralizer}.
 *
 * - _Use this when you don’t need multiple configurations._
 * - _It comes preloaded with standard pluralization rules, irregular forms, and uncountable nouns._
 *
 * * Handles English word pluralization and singularization with support for irregular forms and uncountable nouns.
 *
 * - Provides methods to convert words between singular and plural forms, check if a word is plural or singular, and manage custom pluralization rules.
 * - Supports adding custom pluralization and singularization rules, as well as uncountable nouns.
 * - Automatically handles common irregular forms like "child" to "children"
 * - Automatically loads common irregular forms and uncountable nouns.
 * - Supports options for count-based pluralization, allowing for inclusive formatting.
 * - This is useful for applications that need to handle natural language processing, such as chatbots, content management systems, or any text processing tasks that require accurate pluralization.
 * @example
 * import { pluralizer } from 'nhb-toolbox';
 *
 * pluralizer.pluralize('child'); // "children"
 * pluralizer.toSingular('geese'); // "goose"
 * pluralizer.isPlural('fish'); // false (uncountable)
 */
export const pluralizer = new Pluralizer();
