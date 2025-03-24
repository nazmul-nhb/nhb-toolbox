import type { DotNotationKey } from '../object/types';

/** - Configuration options to control the formData. */
export interface FormDataConfigs<T> {
	/** - Keys to exclude from processing. Ignored keys are ignored even if they're in other options. */
	ignoreKeys?: DotNotationKey<T>[];
	/** - Keys to preserve even if falsy. `*` to include all keys. */
	requiredKeys?: '*' | DotNotationKey<T>[];
	/**  - Keys to convert to lowercase. `*` to include all keys. */
	lowerCaseKeys?: '*' | DotNotationKey<T>[];
	/** - Dot-notation paths to preserve (e.g., 'user.settings'). `*` to include all keys. In this case `user` is an object and `settings` should also be an object. If `dotNotateNested` and `stringifyNested` both have the same key(s) or `*` it will prioritize `dotNotateNested`. */
	dotNotateNested?: '*' | DotNotationKey<T>[];
	/** - Dot-notation paths to stringify nested objects instead of flattening or dot-notate them. Defaults to `*`, use `*` to stringify every nested object. In this case the value of the last part of the key should also be an object. If `dotNotateNested` and `stringifyNested` both have the same key(s) or `*` it will prioritize `dotNotateNested`. */
	stringifyNested?: '*' | DotNotationKey<T>[];
	/** - Break arrays in the format `{key[0]: value, key[0]: value,}` for specific key(s) or for all (`*`). `*` to include all keys. */
	breakArray?: '*' | DotNotationKey<T>[];
	/** - Whether to trim string values */
	trimStrings?: boolean;
}

/** - Interface for file-type in some upload libraries like `FilePond` or `Ant-Design's Upload` */
export interface FileUpload {
	file: CustomFile;
	fileList: CustomFile[];
}

export interface CustomFile {
	uid: string;
	lastModified: number;
	lastModifiedDate: string;
	name: string;
	size: number;
	type: string;
	percent: number;
	originFileObj: OriginFileObj;
	thumbUrl: string;
	error?: FileError;
	response?: string;
	status?: string;
}

export interface OriginFileObj {
	uid: string;
}

export interface FileError {
	status: number;
	method: string;
	url: string;
}
