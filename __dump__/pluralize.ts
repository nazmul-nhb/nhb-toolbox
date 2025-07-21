// import type { PluralRule } from '../src/string/types';

// const pluralRules: PluralRule[] = [];
// const singularRules: PluralRule[] = [];
// const uncountables = new Set<string>();
// const irregularSingles: Record<string, string> = {};
// const irregularPlurals: Record<string, string> = {};

// /**
//  * @description Add a pluralization rule
//  */
// export function addPluralRule(rule: RegExp, replacement: string): void {
// 	pluralRules.push([rule, replacement]);
// }

// /**
//  * @description Add a singularization rule
//  */
// export function addSingularRule(rule: RegExp, replacement: string): void {
// 	singularRules.push([rule, replacement]);
// }

// /**
//  * @description Add an uncountable word (never pluralizes)
//  */
// export function addUncountable(word: string): void {
// 	uncountables.add(word.toLowerCase());
// }

// /**
//  * @description Add an irregular pair (single -> plural)
//  */
// export function addIrregular(singular: string, plural: string): void {
// 	irregularSingles[singular.toLowerCase()] = plural.toLowerCase();
// 	irregularPlurals[plural.toLowerCase()] = singular.toLowerCase();
// }

// /**
//  * @description Restore the original word's casing
//  */
// function restoreCase(original: string, transformed: string): string {
// 	if (original === original.toUpperCase()) return transformed.toUpperCase();
// 	if (original[0] === original[0].toUpperCase())
// 		return (
// 			transformed.charAt(0).toUpperCase() +
// 			transformed.slice(1).toLowerCase()
// 		);
// 	return transformed.toLowerCase();
// }

// /**
//  * @description Replace using rules
//  */
// function sanitizeWord(word: string, rules: PluralRule[]): string {
// 	if (!word.length || uncountables.has(word)) return word;

// 	for (let i = rules.length - 1; i >= 0; i--) {
// 		const [rule, replacement] = rules[i];
// 		if (rule.test(word)) return word.replace(rule, replacement);
// 	}

// 	return word;
// }

// /**
//  * @description Pluralizes a word
//  */
// export function pluralize(word: string | undefined): string {
// 	if (!word) return '';

// 	const lower = word.toLowerCase();
// 	if (uncountables.has(lower)) return word;

// 	// irregular
// 	if (irregularSingles[lower]) {
// 		return restoreCase(word, irregularSingles[lower]);
// 	}

// 	return restoreCase(word, sanitizeWord(lower, pluralRules));
// }

// /**
//  * @description Singularizes a word
//  */
// export function singularize(word: string | undefined): string {
// 	if (!word) return '';

// 	const lower = word.toLowerCase();
// 	if (uncountables.has(lower)) return word;

// 	// irregular
// 	if (irregularPlurals[lower]) {
// 		return restoreCase(word, irregularPlurals[lower]);
// 	}

// 	return restoreCase(word, sanitizeWord(lower, singularRules));
// }

// /**
//  * @description Check if a word is plural
//  */
// export function isPlural(word: string): boolean {
// 	const lower = word.toLowerCase();
// 	if (uncountables.has(lower)) return false; // uncountables are neither
// 	if (irregularPlurals[lower]) return true;
// 	if (irregularSingles[lower]) return false;
// 	return singularize(lower) !== lower;
// }

// /**
//  * @description Check if a word is singular
//  */
// export function isSingular(word: string): boolean {
// 	const lower = word.toLowerCase();
// 	if (uncountables.has(lower)) return false;
// 	if (irregularPlurals[lower]) return false;
// 	if (irregularSingles[lower]) return true;
// 	return pluralize(lower) !== lower;
// }

// /* --------------------------------------------------
//    Load rules adapted from the original pluralize
// -------------------------------------------------- */

// // Irregulars
// [
// 	['canvas', 'canvases'],
// 	['quiz', 'quizzes'],
// 	['child', 'children'],
// 	['man', 'men'],
// 	['woman', 'women'],
// 	['mouse', 'mice'],
// 	['goose', 'geese'],
// 	['foot', 'feet'],
// 	['tooth', 'teeth'],
// 	['person', 'people'],
// 	['ox', 'oxen'],
// 	['index', 'indices'],
// ].forEach(([s, p]) => addIrregular(s, p));

// // Some key plural rules
// [
// 	[/(quiz)$/i, '$1zes'],
// 	[/(matr|vert|ind)(ix|ex)$/i, '$1ices'],
// 	[/(x|ch|ss|sh)$/i, '$1es'],
// 	[/([^aeiouy]|qu)y$/i, '$1ies'],
// 	[/(?:([^f])fe|([lr])f)$/i, '$1$2ves'],
// 	[/(?:([sxz]))$/i, '$1es'],
// 	[/(?:([^ch])sh)$/i, '$1shes'],
// 	[/$/, 's'],
// ].forEach(([r, rep]) => addPluralRule(r as RegExp, rep as string));

// // Some key singular rules
// [
// 	[/(quiz)zes$/i, '$1'],
// 	[/(matr|vert|ind)ices$/i, '$1ex'],
// 	[/(x|ch|ss|sh)es$/i, '$1'],
// 	[/([^aeiouy]|qu)ies$/i, '$1y'],
// 	[/(?:([^f])ves)$/i, '$1fe'],
// 	[/(s)es$/i, '$1'],
// 	[/s$/i, ''],
// ].forEach(([r, rep]) => addSingularRule(r as RegExp, rep as string));

// // Uncountables
// [
// 	'sheep',
// 	'fish',
// 	'deer',
// 	'series',
// 	'species',
// 	'news',
// 	'information',
// 	'equipment',
// ].forEach(addUncountable);
