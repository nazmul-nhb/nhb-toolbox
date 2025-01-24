/** - Generic object type */
export type GenericObject = Record<string, unknown>;

/** - Recursive type to generate dot-notation keys for nested objects. */
export type DotNotationKey<T> = T extends object
	? {
			[K in keyof T & string]: T[K] extends object
				? K | `${K}.${DotNotationKey<T[K]>}`
				: K;
		}[keyof T & string]
	: never;

/** - Options for `sanitizeData` */
export interface SanitizeOptions<T extends GenericObject> {
	/** Keys to ignore */
	ignoreKeys?: DotNotationKey<T>[];
	/** Whether to trim string values. Defaults to `true` */
	trimStrings?: boolean;
	/** Whether to exclude nullish (null or undefined) values. Defaults to `false` */
	ignoreNullish?: boolean;
}
