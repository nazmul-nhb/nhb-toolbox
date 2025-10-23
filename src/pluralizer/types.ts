import type { Numeric } from '../types/index';

/** A pair of RegExp and replacement for pluralization rules */
export type PluralizeRule = [RegExp, string];

/**
 * A map of irregular singular to plural forms.
 * Used for handling exceptions in pluralization.
 */
export type IrregularMap = Record<string, string>;

/** * Options for pluralize method. */
export interface PluralizeOptions {
	/**
	 * The count to determine singular or plural form. Either number or numeric string.
	 * If not provided, bypass the check and pluralize the word anyways.
	 */
	count?: Numeric;
	/**
	 * Whether to include the count in the output. Depends on the `count` value.
	 * If true, the output will be in the format "2 Categories".
	 * If false, it will just return the pluralized word.
	 */
	inclusive?: boolean;
}
