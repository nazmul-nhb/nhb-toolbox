/** A pair of RegExp and replacement for Verbalizer rules */
export type VerbRule = [RegExp, string];

/** * Type interface for Irregular Verb Entry */
export interface IrregularEntry {
	/** Base form of a verb */
	base: string;
	/** Past form of a verb */
	past: string;
	/** Past participle form of a verb */
	participle: string;
}
