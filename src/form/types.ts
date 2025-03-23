import type { DotNotationKey } from '../object/types';

export interface FormDataConfigs<T> {
	/** - Keys to exclude from processing. Ignored keys are ignored even if they're in other options */
	ignoreKeys?: DotNotationKey<T>[];
	/** - Keys to preserve even if falsy. `*` to include all keys */
	requiredKeys?: '*' | DotNotationKey<T>[];
	/**  - Keys to convert to lowercase. `*` to include all keys */
	lowerCaseKeys?: '*' | DotNotationKey<T>[];
	/** - Dot-notation paths to preserve (e.g., 'user.settings'). `*` to include all keys. In this case `user` is an object and `settings` should also be an object. If `dotNotateNested` and `stringifyNested` both have the same key(s) or `*` it will prioritize `dotNotateNested`. */
	dotNotateNested?: '*' | DotNotationKey<T>[];
	/** - Dot-notation paths to stringify nested objects instead of flattening or dot-notate them. Defaults to `*`, use `*` to stringify every nested object. In this case the value of the last part of the key should also be an object. If `dotNotateNested` and `stringifyNested` both have the same key(s) or `*` it will prioritize `dotNotateNested`. */
	stringifyNested?: '*' | DotNotationKey<T>[];
	/** - Whether to trim string values */
	trimStrings?: boolean;
}
