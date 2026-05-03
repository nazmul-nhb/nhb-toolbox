import { isNonEmptyString } from '../guards/primitives';
import { baseRules, irregularVerbs, pastParticipleRules, pastRules } from './rules';
import type { IrregularEntry, VerbRule } from './types';

/**
 * @class Handles English verb conjugation between base, past tense, and past participle forms.
 *
 *      - Provides methods to convert verbs between base, past, and past participle forms, check verb forms, and manage custom conjugation rules.
 *      - Supports adding custom conjugation rules and irregular verbs.
 *      - Automatically handles common irregular verbs like "go" to "went" (past) and "gone" (past participle).
 *      - Automatically loads common irregular verbs and conjugation rules.
 *      - Preserves case sensitivity of input verbs.
 *      - This class is useful for natural language processing tasks, such as chatbots, text analysis, or content generation systems requiring accurate verb conjugation.
 *
 * @remarks
 * For ready to use instance, please refer to {@link https://toolbox.nazmul-nhb.dev/docs/utilities/string/verbalizer verbalizer} instead.
 *
 * @example
 * const myVerbalizer = new Verbalizer();
 * myVerbalizer.toPast('run'); // "ran"
 * myVerbalizer.toParticiple('go'); // "gone"
 * myVerbalizer.toBase('went'); // "go"
 */
export class Verbalizer {
	readonly #baseRules: VerbRule[] = [];
	readonly #pastRules: VerbRule[] = [];
	readonly #participleRules: VerbRule[] = [];
	readonly #irregularVerbs: Record<string, IrregularEntry> = {};
	readonly #reverseIrregular: Record<string, string> = {};

	/**
	 * Initializes `Verbalizer` with default rules and irregular verbs.
	 * Automatically loads irregular verbs and conjugation rules for base, past and past participle forms.
	 */
	constructor() {
		this.#loadRules();
	}

	#loadRules(): void {
		// ! Load irregular verbs
		irregularVerbs.forEach(([base, past, pastParticiple]) => {
			this.addIrregular(base, past, pastParticiple);
		});

		// ! Load base reverse rules
		baseRules.forEach(([rule, replacement]) => {
			this.addBaseRule(rule, replacement);
		});

		// ! Load past tense rules
		pastRules.forEach(([rule, replacement]) => {
			this.addPastRule(rule, replacement);
		});

		// ! Load past participle rules
		pastParticipleRules.forEach(([rule, replacement]) => {
			this.addParticipleRule(rule, replacement);
		});
	}

	/** Restore case order(s) */
	#restoreCase(original: string, transformed: string): string {
		original = original?.trim();

		// Exact match
		if (original === transformed) return transformed;

		// Entire original is lowercase
		if (original === original.toLowerCase()) return transformed.toLowerCase();

		// Entire original is uppercase
		if (original === original.toUpperCase()) return transformed.toUpperCase();

		// Sentence case (first letter uppercase, rest lowercase)
		if (
			original[0] === original[0].toUpperCase() &&
			original.slice(1) === original.slice(1).toLowerCase()
		) {
			return transformed.charAt(0).toUpperCase() + transformed.slice(1).toLowerCase();
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

	/** Apply base rule to already trimmed and lowercased verb */
	#applyBaseRule(verb: string) {
		return this.#applyRules(verb, this.#baseRules);
	}

	/** Apply corresponding rules */
	#applyRules(verb: string, rules: VerbRule[]): string {
		if (!isNonEmptyString(verb)) return '';

		for (let i = 0; i < rules.length; i++) {
			const [rule, replacement] = rules[i];
			if (rule.test(verb)) {
				return verb.replace(rule, replacement);
			}
		}

		return verb;
	}

	/** Find irregular verb entry */
	#findIrregularEntry(verb: string) {
		const base = this.#irregularVerbs[verb] ? verb : this.#reverseIrregular[verb];

		return base ? this.#irregularVerbs[base] : undefined;
	}

	/**
	 * * Add a new base tense conjugation rule.
	 * @param rule Pattern to match past/participle form of verbs.
	 * @param replacement Replacement pattern for base tense form.
	 * @example
	 * verbalizer.addBaseRule(/ied$/i, 'y');
	 */
	addBaseRule(rule: RegExp, replacement: string): void {
		this.#baseRules.push([rule, replacement]);
	}

	/**
	 * * Add a new past tense conjugation rule.
	 * @param rule Pattern to match base verbs.
	 * @param replacement Replacement pattern for past tense form.
	 * @example
	 * verbalizer.addPastRule(/e$/i, 'ed');
	 */
	addPastRule(rule: RegExp, replacement: string): void {
		this.#pastRules.push([rule, replacement]);
	}

	/**
	 * * Add a new past participle conjugation rule.
	 * @param rule Pattern to match base verbs.
	 * @param replacement Replacement pattern for past participle form.
	 * @example
	 * verbalizer.addParticipleRule(/e$/i, 'ed');
	 */
	addParticipleRule(rule: RegExp, replacement: string): void {
		this.#participleRules.push([rule, replacement]);
	}

	/**
	 * * Add a custom irregular verb.
	 * @param base Base form of the verb.
	 * @param past Past tense form.
	 * @param participle Past participle form.
	 * @example
	 * verbalizer.addIrregular('swim', 'swam', 'swum');
	 */
	addIrregular(base: string, past: string, participle: string): void {
		const baseLower = base?.toLowerCase();
		const pastLower = past?.toLowerCase();
		const participleLower = participle?.toLowerCase();

		this.#irregularVerbs[baseLower] = {
			base: baseLower,
			past: pastLower,
			participle: participleLower,
		};

		// reverse map
		this.#reverseIrregular[pastLower] = baseLower;
		this.#reverseIrregular[participleLower] = baseLower;
	}

	/**
	 * * Convert a verb to its past tense form.
	 * @param verb Base form of the verb.
	 * @returns Past tense form of the verb.
	 * @example
	 * verbalizer.toPast('walk'); // "walked"
	 * verbalizer.toPast('run'); // "ran"
	 */
	toPast(verb: string): string {
		if (!isNonEmptyString(verb)) return '';

		const lower = verb?.trim()?.toLowerCase();

		const irregularEntry = this.#findIrregularEntry(lower);

		if (irregularEntry) {
			return this.#restoreCase(verb, irregularEntry.past);
		}

		return this.#restoreCase(
			verb,
			this.#applyRules(this.#applyBaseRule(lower), this.#pastRules)
		);
	}

	/**
	 * * Convert a verb to its past participle form.
	 * @param verb Base form of the verb.
	 * @returns Past participle form of the verb.
	 * @example
	 * verbalizer.toParticiple('walk'); // "walked"
	 * verbalizer.toParticiple('go'); // "gone"
	 */
	toParticiple(verb: string): string {
		if (!isNonEmptyString(verb)) return '';

		const lower = verb?.trim()?.toLowerCase();

		const irregularEntry = this.#findIrregularEntry(lower);

		if (irregularEntry) {
			return this.#restoreCase(verb, irregularEntry.participle);
		}

		return this.#restoreCase(
			verb,
			this.#applyRules(this.#applyBaseRule(lower), this.#participleRules)
		);
	}

	/**
	 * * Convert a verb to its base form.
	 * @param verb Past or past participle form of the verb.
	 * @returns Base form of the verb.
	 * @example
	 * verbalizer.toBase('went'); // "go"
	 * verbalizer.toBase('walked'); // "walk"
	 */
	toBase(verb: string): string {
		if (!isNonEmptyString(verb)) return '';

		const lower = verb?.trim()?.toLowerCase();

		const irregularEntry = this.#findIrregularEntry(lower);

		if (irregularEntry) {
			return this.#restoreCase(verb, irregularEntry.base);
		}

		// Use base reverse rules if not irregular verb
		return this.#restoreCase(verb, this.#applyBaseRule(lower));
	}

	/**
	 * * Check if a given verb is in its past tense form.
	 * @param verb Verb to check.
	 * @returns True if the verb is in past tense, otherwise false.
	 * @example
	 * verbalizer.isPast('ran'); // true
	 * verbalizer.isPast('run'); // false
	 */
	isPast(verb: string): boolean {
		if (!isNonEmptyString(verb)) return false;

		const lower = verb?.trim()?.toLowerCase();

		return this.toPast(lower) === lower;
	}

	/**
	 * * Check if a given verb is in its past participle form.
	 * @param verb Verb to check.
	 * @returns True if the verb is in past participle form, otherwise false.
	 * @example
	 * verbalizer.isParticiple('gone'); // true
	 * verbalizer.isParticiple('go'); // false
	 */
	isParticiple(verb: string): boolean {
		if (!isNonEmptyString(verb)) return false;

		const lower = verb?.trim()?.toLowerCase();

		return this.toParticiple(lower) === lower;
	}

	/**
	 * * Check if a given verb is in its base form.
	 * @param verb Verb to check.
	 * @returns True if the verb is in base form, otherwise false.
	 * @example
	 * verbalizer.isBase('run'); // true
	 * verbalizer.isBase('ran'); // false
	 */
	isBase(verb: string): boolean {
		if (!isNonEmptyString(verb)) return false;

		const lower = verb?.trim()?.toLowerCase();

		return this.toBase(lower) === lower;
	}
}

/**
 * Default shared instance of {@link https://toolbox.nazmul-nhb.dev/docs/classes/Verbalizer Verbalizer}.
 *
 * - Use this when you don’t need multiple configurations.
 * - It comes preloaded with standard conjugation rules and irregular verbs.
 * -
 *
 * @example
 * import { verbalizer } from 'nhb-toolbox';
 *
 * verbalizer.toPast('run'); // "ran"
 * verbalizer.toParticiple('go'); // "gone"
 * verbalizer.toBase('went'); // "go"
 */
export const verbalizer = new Verbalizer();
