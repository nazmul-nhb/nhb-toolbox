import type { Numeric } from '../types/index';

/** A pair of RegExp and replacement for pluralization rules */
export type PluralizeRule = [RegExp, string];

/**
 * A map of irregular singular to plural forms.
 * Used for handling exceptions in pluralization.
 */
export type IrregularMap = Record<string, string>;

/**
 * Options for pluralization.
 */
export interface PluralizeOptions {
	/**
	 * The count to determine singular or plural form.
	 * If not provided, defaults to 1 (singular).
	 */
	count?: Numeric;
	inclusive?: boolean;
}
