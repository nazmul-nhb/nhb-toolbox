import type { RequireExactly } from '../utils/types';

/** A pair of RegExp and replacement for Verbalizer rules */
export type VerbRule = [RegExp, string];

/**
 * * A map of irregular verb forms.
 * - Used for handling exceptions in `Verbalizer` class.
 * - Only any 2 fields can be used at a time. No more, no less.
 */
export type IrregularVerbMap = {
	[key: string]: RequireExactly<
		{
			base?: string;
			past?: string;
			participle?: string;
		},
		2
	>;
};
