export interface FormDataConfigs<T> {
	/* - Keys to exclude from processing */
	ignoreKeys?: (keyof T)[];
	/* - Keys to preserve even if falsy */
	requiredKeys?: (keyof T)[];
	/*  - Keys to convert to lowercase */
	lowerCaseKeys?: (keyof T)[];
	/* - Dot-notation paths to preserve (e.g., 'user.settings.theme') */
	preservePaths?: string[];
	/* - Whether to trim string values */
	trimStrings?: boolean;
}
