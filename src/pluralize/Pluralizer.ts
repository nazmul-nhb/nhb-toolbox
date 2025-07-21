import { normalizeNumber } from '../number/utilities';
import { irregularRules, pluralRules, uncountables } from './rules';
import type { IrregularMap, PluralizeOptions, PluralizeRule } from './types';

export class Pluralizer {
	readonly #pluralRules: PluralizeRule[] = [];
	readonly #singularRules: PluralizeRule[] = [];
	readonly #uncountables = new Set<string>();
	readonly #irregularSingles: IrregularMap = {};
	readonly #irregularPlurals: IrregularMap = {};

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

		// ! Load uncountables
		uncountables.forEach((word) => {
			this.addUncountable(word);
		});
	}

	#restoreCase(word: string, token: string): string {
		if (word === word.toUpperCase()) return token.toUpperCase();
		if (word[0] === word[0].toUpperCase()) {
			return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
		}
		return token.toLowerCase();
	}

	#sanitizeWord(word: string, rules: PluralizeRule[]): string {
		if (!word.length || this.#uncountables.has(word.toLowerCase())) {
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

	addPluralRule(rule: RegExp, replacement: string): void {
		this.#pluralRules.push([rule, replacement]);
	}

	addSingularRule(rule: RegExp, replacement: string): void {
		this.#singularRules.push([rule, replacement]);
	}

	addUncountable(word: string): void {
		this.#uncountables.add(word.toLowerCase());
	}

	addIrregular(single: string, plural: string): void {
		const singleLower = single.toLowerCase();
		const pluralLower = plural.toLowerCase();
		this.#irregularSingles[singleLower] = pluralLower;
		this.#irregularPlurals[pluralLower] = singleLower;
	}

	pluralize(word: string, options: PluralizeOptions = {}): string {
		const count = normalizeNumber(options?.count);

		const inclusive = options.inclusive ?? false;

		if (typeof count === 'number') {
			const pluralized =
				count > 1 ? this.toPlural(word) : this.toSingular(word);
			return inclusive ? `${count} ${pluralized}` : pluralized;
		}

		return this.toPlural(word);
	}

	toPlural(word: string): string {
		const lower = word.toLowerCase();

		if (this.#uncountables.has(lower)) return word;

		if (this.#irregularSingles[lower]) {
			return this.#restoreCase(word, this.#irregularSingles[lower]);
		}

		return this.#restoreCase(
			word,
			this.#sanitizeWord(lower, this.#pluralRules)
		);
	}

	toSingular(word: string): string {
		const lower = word.toLowerCase();

		if (this.#uncountables.has(lower)) return word;

		if (this.#irregularPlurals[lower]) {
			return this.#restoreCase(word, this.#irregularPlurals[lower]);
		}

		return this.#restoreCase(
			word,
			this.#sanitizeWord(lower, this.#singularRules)
		);
	}

	isPlural(word: string): boolean {
		const lower = word.toLowerCase();
		if (this.#uncountables.has(lower)) return false;
		if (this.#irregularPlurals[lower]) return true;
		return this.toSingular(lower) !== lower;
	}

	isSingular(word: string): boolean {
		const lower = word.toLowerCase();
		if (this.#uncountables.has(lower)) return false;
		if (this.#irregularSingles[lower]) return true;
		return this.toPlural(lower) !== lower;
	}
}

export const pluralizer = new Pluralizer();
