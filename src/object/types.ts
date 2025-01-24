/** - Input object type for `sanitizeData`. */
export type ObjectToSanitize = Record<string, unknown>;

/** - Options for `sanitizeData` */
export interface SanitizeOptions<T extends ObjectToSanitize> {
	/** Keys to ignore */
	ignoreKeys?: (keyof T)[];
	/** Whether to trim string values */
	trimStrings?: boolean;
	/** Whether to exclude nullish (null or undefined) values */
	ignoreNullish?: boolean;
}
