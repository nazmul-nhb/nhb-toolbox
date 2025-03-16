import type { DotNotationKey } from '../object/types';

export interface FormDataConfigs<T> {
	/** - Keys to exclude from processing. Ignored keys are ignored even if they're in other options */
	ignoreKeys?: DotNotationKey<T>[];
	/** - Keys to preserve even if falsy. `*` to include all keys */
	requiredKeys?: '*' | DotNotationKey<T>[];
	/**  - Keys to convert to lowercase. `*` to include all keys */
	lowerCaseKeys?: '*' | DotNotationKey<T>[];
	/** - Dot-notation paths to preserve (e.g., 'user.settings.theme'). `*` to include all keys */
	preservePaths?: '*' | DotNotationKey<T>[];
	/** - Whether to trim string values */
	trimStrings?: boolean;
}
