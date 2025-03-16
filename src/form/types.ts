import type { LooseObject } from '../object/types';

/** - Dot-notation keys for nested objects */
export type AnyDotNotationKey<T> =
	T extends LooseObject ?
		{
			[K in keyof T & string]: T[K] extends LooseObject ?
				`${K}` | `${K}.${AnyDotNotationKey<T[K]>}`
			:	`${K}`;
		}[keyof T & string]
	:	never;

export interface FormDataConfigs<T> {
	/** - Keys to exclude from processing. Ignored keys are ignored even if they're in other options */
	ignoreKeys?: AnyDotNotationKey<T>[];
	/** - Keys to preserve even if falsy. `*` to include all keys */
	requiredKeys?: '*' | AnyDotNotationKey<T>[];
	/**  - Keys to convert to lowercase. `*` to include all keys */
	lowerCaseKeys?: '*' | AnyDotNotationKey<T>[];
	/** - Dot-notation paths to preserve (e.g., 'user.settings.theme'). `*` to include all keys */
	preservePaths?: '*' | AnyDotNotationKey<T>[];
	/** - Whether to trim string values */
	trimStrings?: boolean;
}
