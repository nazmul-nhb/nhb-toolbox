import { irregularRules, pluralRules, uncountableWords } from './rules';
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
		// Load irregular rules
		irregularRules.forEach(([single, plural]) => {
			this.addIrregular(single, plural);
		});

		// Load plural rules
		pluralRules.forEach(([rule, replacement]) => {
			this.addPluralRule(rule, replacement);
		});

		// Load uncountables
		uncountableWords.forEach((word) => {
			this.addUncountable(word);
		});
	}

	private restoreCase(word: string, token: string): string {
		if (word === word.toUpperCase()) return token.toUpperCase();
		if (word[0] === word[0].toUpperCase()) {
			return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
		}
		return token.toLowerCase();
	}

	private sanitizeWord(word: string, rules: PluralizeRule[]): string {
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

	public addPluralRule(rule: RegExp, replacement: string): void {
		this.#pluralRules.push([rule, replacement]);
	}

	public addSingularRule(rule: RegExp, replacement: string): void {
		this.#singularRules.push([rule, replacement]);
	}

	public addUncountable(word: string): void {
		this.#uncountables.add(word.toLowerCase());
	}

	public addIrregular(single: string, plural: string): void {
		const singleLower = single.toLowerCase();
		const pluralLower = plural.toLowerCase();
		this.#irregularSingles[singleLower] = pluralLower;
		this.#irregularPlurals[pluralLower] = singleLower;
	}

	public pluralize(word: string, options: PluralizeOptions = {}): string {
		const { count, inclusive } = options;

		if (typeof count === 'number') {
			const pluralized =
				count === 1 ? this.singular(word) : this.plural(word);
			return inclusive ? `${count} ${pluralized}` : pluralized;
		}

		return this.plural(word);
	}

	public plural(word: string): string {
		const lower = word.toLowerCase();

		// Check uncountables
		if (this.#uncountables.has(lower)) return word;

		// Check irregulars
		if (this.#irregularSingles[lower]) {
			return this.restoreCase(word, this.#irregularSingles[lower]);
		}

		// Apply rules
		return this.restoreCase(
			word,
			this.sanitizeWord(lower, this.#pluralRules)
		);
	}

	public singular(word: string): string {
		const lower = word.toLowerCase();

		// Check uncountables
		if (this.#uncountables.has(lower)) return word;

		// Check irregulars
		if (this.#irregularPlurals[lower]) {
			return this.restoreCase(word, this.#irregularPlurals[lower]);
		}

		// Apply rules
		return this.restoreCase(
			word,
			this.sanitizeWord(lower, this.#singularRules)
		);
	}

	public isPlural(word: string): boolean {
		const lower = word.toLowerCase();
		if (this.#uncountables.has(lower)) return false;
		if (this.#irregularPlurals[lower]) return true;
		return this.singular(lower) !== lower;
	}

	public isSingular(word: string): boolean {
		const lower = word.toLowerCase();
		if (this.#uncountables.has(lower)) return false;
		if (this.#irregularSingles[lower]) return true;
		return this.plural(lower) !== lower;
	}
}

export const pluralizer = new Pluralizer();
