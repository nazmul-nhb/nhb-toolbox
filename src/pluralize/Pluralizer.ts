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
 *
 * @remarks
 * - For simpler pluralization (plural with only 's'), please refer to {@link https://nhb-toolbox.vercel.app/docs/utilities/string/formatUnitWithPlural formatUnitWithPlural} instead.
 *
 * - For ready to use instance, please refer to {@link https://nhb-toolbox.vercel.app/docs/utilities/string/pluralizer pluralizer} instead.
 *
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
		// Exact match
		if (original === transformed) return transformed;

		// Entire original is lowercase
		if (original === original.toLowerCase()) {
			return transformed.toLowerCase();
		}

		// Entire original is uppercase
		if (original === original.toUpperCase()) {
			return transformed.toUpperCase();
		}

		// Title case (first letter uppercase, rest lowercase)
		if (
			original[0] === original[0].toUpperCase() &&
			original.slice(1) === original.slice(1).toLowerCase()
		) {
			return (
				transformed.charAt(0).toUpperCase() +
				transformed.slice(1).toLowerCase()
			);
		}

		// Mixed case: per-character casing
		let result = '';
		for (let i = 0; i < transformed.length; i++) {
			const origChar = original[i];
			if (
				origChar &&
				origChar === origChar.toUpperCase() &&
				origChar !== origChar.toLowerCase()
			) {
				result += transformed[i].toUpperCase();
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

	/**
	 * * Add a word or pattern that should never change between singular and plural.
	 * @param word A word or regex pattern.
	 * @example
	 * pluralizer.addUncountable('fish');
	 * pluralizer.addUncountable(/pok[eé]mon$/i);
	 */
	addUncountable(word: string | RegExp): void {
		this.#uncountables.add(
			typeof word === 'string' ? word?.toLowerCase() : word
		);
	}

	/**
	 * * Add a custom irregular form.
	 * @param single Singular word.
	 * @param plural Plural word.
	 * @example
	 * pluralizer.addIrregular('person', 'people');
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
	 * @returns `true` if the word is plural, otherwise `false`.
	 * @remarks Always returns `true` for uncountable nouns.
	 * @example
	 * pluralizer.isPlural('children'); // true
	 * pluralizer.isPlural('water'); // true
	 */
	isPlural(word: string): boolean {
		if (!isNonEmptyString(word)) return false;
		const lower = word.toLowerCase();

		// if uncountable return true
		if (this.#isUncountable(lower)) return true;
		// directly known as plural
		if (this.#irregularPlurals[lower]) return true;
		// directly known as singular
		if (this.#irregularSingles[lower]) return false;

		return this.toSingular(lower) !== lower;
	}

	/**
	 * * Check if a given word is singular.
	 * @param word Word to check.
	 * @returns True if the word is singular, otherwise false.
	 * @remarks Always returns `true` for uncountable nouns.
	 * @example
	 * pluralizer.isSingular('child'); // true
	 * pluralizer.isPlural('water'); // true
	 */
	isSingular(word: string): boolean {
		if (!isNonEmptyString(word)) return false;
		const lower = word.toLowerCase();

		// if uncountable return true
		if (this.#isUncountable(lower)) return true;
		// directly known as singular
		if (this.#irregularSingles[lower]) return true;
		// directly known as plural
		if (this.#irregularPlurals[lower]) return false;

		return this.toSingular(lower) === lower;
	}
}

/**
 * Default shared instance of {@link https://nhb-toolbox.vercel.app/docs/classes/Pluralizer Pluralizer}.
 *
 * - _Use this when you don’t need multiple configurations._
 * - _It comes preloaded with standard pluralization rules, irregular forms, and uncountable nouns._
 *
 * @remarks For simpler pluralization (plural with only 's'), please refer to {@link https://nhb-toolbox.vercel.app/docs/utilities/string/formatUnitWithPlural formatUnitWithPlural} instead.
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
