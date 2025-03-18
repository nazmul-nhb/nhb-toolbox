import type { DotNotationKeyAny } from '../object/types';

export interface FormDataConfigs<T> {
	/** - Keys to exclude from processing. Ignored keys are ignored even if they're in other options */
	ignoreKeys?: DotNotationKeyAny<T>[];
	/** - Keys to preserve even if falsy. `*` to include all keys */
	requiredKeys?: '*' | DotNotationKeyAny<T>[];
	/**  - Keys to convert to lowercase. `*` to include all keys */
	lowerCaseKeys?: '*' | DotNotationKeyAny<T>[];
	/** - Dot-notation paths to preserve (e.g., 'user.settings.theme'). `*` to include all keys */
	preservePaths?: '*' | DotNotationKeyAny<T>[];
	/** - Whether to trim string values */
	trimStrings?: boolean;
}
