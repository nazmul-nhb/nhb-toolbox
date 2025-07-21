/** A pair of RegExp and replacement for pluralization rules */
export type PluralizeRule = [RegExp, string];
export type IrregularMap = Record<string, string>;

export interface PluralizeOptions {
	count?: number;
	inclusive?: boolean;
}
