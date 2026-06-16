import { isDateLike } from '../date/guards';
import type { DateLike } from '../date/types';
import { isEmptyObject, isNotEmptyObject, isValidArray } from '../guards/non-primitives';
import { isNonEmptyString, isString } from '../guards/primitives';
import type { GenericObject, KeyForObject } from '../object/types';
import { trimString } from '../string/basics';
import {
	isCustomFile,
	isCustomFileArray,
	isFileArray,
	isFileList,
	isFileOrBlob,
	isFileUpload,
} from './guards';
import type { FormDataConfigs } from './types';

/**
 * * Utility to convert object into FormData in a controlled way.
 * - **N.B.** Be cautious when using this in SSR (Server-Side Rendering) environments (such as `Next.js` Server Components), as it may not work as expected.
 *
 * @param data - The source object to control and convert to FormData.
 * @param configs - Configuration options to control the formData.
 * @returns `FormData` instance containing the sanitized and transformed data.
 */
export const createControlledFormData = <T extends GenericObject>(
	data: T,
	configs?: FormDataConfigs<T>
): FormData => {
	if (typeof FormData === 'undefined') {
		throw new Error(
			'FormData is not available! Please make sure your environment supports FormData.'
		);
	}

	const formData = new FormData();

	const {
		stringifyNested = '*',
		ignoreKeys = [],
		breakArray,
		lowerCaseKeys,
		dotNotateNested,
		lowerCaseValues,
		requiredKeys,
	} = configs || {};

	/** - Helper to check if a key (plain or dot-notated) matches a path */
	const _compareKeyPaths = (key: string, paths: string[]) => {
		return paths.some((path) => key === path || key.startsWith(`${path}.`));
	};

	/** - Helper to check if a key should be lowercase */
	const _shouldLowercaseKeys = (key: string) => {
		return Array.isArray(lowerCaseKeys)
			? _compareKeyPaths(key, lowerCaseKeys)
			: lowerCaseKeys === '*';
	};

	/** - Helper to check if a key should be lowercase */
	const _shouldLowercaseValue = (key: string) => {
		return Array.isArray(lowerCaseValues)
			? _compareKeyPaths(key, lowerCaseValues)
			: lowerCaseValues === '*';
	};

	/** - Transforms key to lowercase if needed */
	const _transformKey = (key: string) => {
		return (_shouldLowercaseKeys(key) ? key.toLowerCase() : key) as KeyForObject<T>;
	};

	/** - Helper function to parse {@link DateLike} value into string */
	const _parseDateLike = (value: DateLike) => {
		return String(JSON.parse(JSON.stringify(value)));
	};

	/** - Helper function to check if a key matches a breakArray key. */
	const _isRequiredKey = (key: string) => {
		const transformedKey = _transformKey(key);

		return Array.isArray(requiredKeys)
			? _compareKeyPaths(transformedKey, requiredKeys)
			: requiredKeys === '*';
	};

	/** - Helper function to check if a key matches a dotNotation path to preserve. */
	const _shouldDotNotate = (key: string) => {
		const transformedKey = _transformKey(key);

		return Array.isArray(dotNotateNested)
			? _compareKeyPaths(transformedKey, dotNotateNested)
			: dotNotateNested === '*';
	};

	/** - Helper function to check if a key matches a stringifyNested key. */
	const _shouldStringify = (key: string) => {
		const transformedKey = _transformKey(key);

		return Array.isArray(stringifyNested)
			? _compareKeyPaths(transformedKey, stringifyNested)
			: stringifyNested === '*';
	};

	/** - Helper function to check if a key matches a breakArray key. */
	const _shouldBreakArray = (key: string) => {
		const transformedKey = _transformKey(key);

		return Array.isArray(breakArray)
			? _compareKeyPaths(transformedKey, breakArray)
			: breakArray === '*';
	};

	/** - Helper to clean object by removing null/undefined/empty values while respecting required keys */
	const _cleanObject = (obj: GenericObject, parentKey = ''): GenericObject => {
		return Object.entries(obj).reduce((acc, [key, value]) => {
			const transformedKey = _transformKey(key);

			const fullKey = parentKey ? `${parentKey}.${transformedKey}` : transformedKey;

			// * Skip ignored keys (don't include them in the cleaned object)
			if (_compareKeyPaths(fullKey, ignoreKeys)) {
				return acc;
			}

			const shouldKeep =
				(value != null && value !== '') ||
				_isRequiredKey(fullKey) ||
				isNonEmptyString(value) ||
				isValidArray(value) ||
				isNotEmptyObject(value);

			if (shouldKeep) {
				if (isDateLike(value)) {
					acc[transformedKey] = value;
				} else if (isNotEmptyObject(value)) {
					if (isDateLike(value)) {
						acc[transformedKey] = value;
					} else {
						// * Recursively clean nested objects
						const cleaned = _cleanObject(value, fullKey);

						if (_isRequiredKey(fullKey) || isNotEmptyObject(cleaned)) {
							acc[transformedKey] = cleaned;
						}
					}
				} else {
					if (isString(value)) {
						if (isNonEmptyString(value)) {
							let cleanString = value;

							if (configs?.trimStrings) {
								cleanString = trimString(cleanString);
							}
							if (_shouldLowercaseValue(fullKey)) {
								cleanString = cleanString?.toLowerCase();
							}
							acc[transformedKey] = cleanString;
						} else {
							acc[transformedKey] = value;
						}
					} else if (Array.isArray(value)) {
						if (_isRequiredKey(fullKey) || isValidArray(value)) {
							acc[transformedKey] = value;
						}
					} else if (isEmptyObject(value)) {
						if (_isRequiredKey(fullKey)) {
							acc[transformedKey] = value;
						}
					} else {
						acc[transformedKey] = value;
					}
				}
			}
			return acc;
		}, {} as GenericObject);
	};

	/** * Helper function to add values to formData */
	const _addToFormData = (key: string, value: unknown) => {
		const transformedKey = _transformKey(key);

		if (_compareKeyPaths(transformedKey, ignoreKeys)) {
			return;
		}

		if (isCustomFileArray(value)) {
			for (const file of value) {
				formData.append(transformedKey, file?.originFileObj);
			}
		} else if (isFileUpload(value)) {
			if (value?.fileList) {
				for (const file of value.fileList) {
					formData.append(transformedKey, file?.originFileObj);
				}
			} else if (value?.file) {
				if (isCustomFile(value?.file)) {
					formData.append(transformedKey, value?.file?.originFileObj);
				} else {
					formData.append(transformedKey, value?.file);
				}
			}
		} else if (isFileOrBlob(value)) {
			formData.append(transformedKey, value);
		} else if (isFileList(value)) {
			for (let i = 0; i < value?.length; i++) {
				formData.append(transformedKey, value.item(i) as File);
			}
		} else if (Array.isArray(value)) {
			if (isFileArray(value)) {
				if (_shouldBreakArray(key)) {
					value?.forEach((item, index) => {
						_addToFormData(`${transformedKey}[${index}]`, item);
					});
				} else {
					value?.forEach((item) => {
						formData.append(transformedKey, item);
					});
				}
			} else if (isValidArray(value)) {
				if (_shouldBreakArray(key)) {
					value?.forEach((item, index) => {
						_addToFormData(`${transformedKey}[${index}]`, item);
					});
				} else {
					formData.append(transformedKey, JSON.stringify(value));
				}
			} else if (_isRequiredKey(key)) {
				formData.append(transformedKey, JSON.stringify(value));
			}
		} else if (isDateLike(value)) {
			formData.append(transformedKey, _parseDateLike(value));
		} else if (isNotEmptyObject(value)) {
			if (_shouldStringify(key) && !_shouldDotNotate(key)) {
				// * Clean object before stringifying, preserving required keys
				const cleanedValue = _cleanObject(value, key);

				if (isNotEmptyObject(cleanedValue) || _isRequiredKey(key)) {
					formData.append(transformedKey, JSON.stringify(cleanedValue));
				}
			} else {
				Object.entries(value).forEach(([nestedKey, nestedValue]) => {
					_addToFormData(`${key}.${nestedKey}`, nestedValue);
				});
			}
		} else {
			const isNotNullish = value != null && value !== '';

			if (isNotNullish || _isRequiredKey(key)) {
				if (isString(value)) {
					let processedValue = value;

					if (configs?.trimStrings) {
						processedValue = trimString(processedValue);
					}
					if (_shouldLowercaseValue(key)) {
						processedValue = processedValue.toLowerCase();
					}

					formData.append(transformedKey, processedValue);
				} else {
					formData.append(transformedKey, value as Blob);
				}
			}
		}
	};

	/** - Helper to process object */
	const _processObject = (obj: GenericObject, parentKey = '') => {
		Object.entries(obj).forEach(([key, value]) => {
			const transformedKey = _transformKey(key);

			const fullKey = parentKey ? `${parentKey}.${transformedKey}` : transformedKey;

			// * Skip keys that are in ignoreKeys
			if (_compareKeyPaths(fullKey, ignoreKeys)) {
				return;
			}

			// * Trim string values if trimStrings is enabled
			if (configs?.trimStrings && isNonEmptyString(value)) {
				value = trimString(value);
			}

			// * Check if this key is preserved as dot-notation
			if (_shouldDotNotate(fullKey)) {
				_addToFormData(fullKey, value);
			} else if (isNotEmptyObject(value) && !_shouldStringify(fullKey)) {
				if (isDateLike(value)) {
					_addToFormData(key, _parseDateLike(value));
				} else {
					// * Process nested objects
					_processObject(value, key);
				}
			} else if (isFileOrBlob(value)) {
				_addToFormData(key, value);
			} else if (isDateLike(value)) {
				_addToFormData(key, _parseDateLike(value));
			} else if (isEmptyObject(value)) {
				if (_isRequiredKey(fullKey)) {
					_addToFormData(key, JSON.stringify(value));
				}
			} else {
				// * For other cases, just append as key-value
				_addToFormData(key, value);
			}
		});
	};

	if (isNotEmptyObject(data)) {
		_processObject(data);
	}

	return formData;
};
