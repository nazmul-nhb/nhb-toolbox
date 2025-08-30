import { isDateLike } from '../date/guards';
import { isEmptyObject, isNotEmptyObject, isValidArray } from '../guards/non-primitives';
import { isNonEmptyString } from '../guards/primitives';
import type { DotNotationKey, GenericObject, KeyForObject } from '../object/types';
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
	const formData = new FormData();

	const { stringifyNested = '*' } = configs || {};

	/** - Helper to check if a key should be lowercase */
	const _shouldLowercaseKeys = (key: string) => {
		return Array.isArray(configs?.lowerCaseKeys) ?
				configs?.lowerCaseKeys?.some(
					(path) => key === path || key.startsWith(`${path}.`)
				)
			:	configs?.lowerCaseKeys === '*';
	};

	/** - Helper to check if a key should be lowercase */
	const _shouldLowercaseValue = (key: string) => {
		return Array.isArray(configs?.lowerCaseValues) ?
				configs.lowerCaseValues?.some(
					(path) => key === path || key?.startsWith(`${path}.`)
				)
			:	configs?.lowerCaseValues === '*';
	};

	/** - Transforms key to lowercase if needed */
	const _transformKey = (key: string) => {
		return _shouldLowercaseKeys(key) ? key.toLowerCase() : key;
	};

	/** - Helper function to check if a key matches a breakArray key. */
	const _isRequiredKey = (key: string) => {
		const transformedKey = _transformKey(key);

		return Array.isArray(configs?.requiredKeys) ?
				configs?.requiredKeys?.some(
					(path) => transformedKey === path || transformedKey?.startsWith(`${path}.`)
				)
			:	configs?.requiredKeys === '*';
	};

	/** - Helper function to check if a key matches a dotNotation path to preserve. */
	const _shouldDotNotate = (key: string) => {
		const transformedKey = _transformKey(key);

		return Array.isArray(configs?.dotNotateNested) ?
				configs.dotNotateNested.includes(transformedKey as KeyForObject<T>)
			:	configs?.dotNotateNested === '*';
	};

	/** - Helper function to check if a key matches a stringifyNested key. */
	const _shouldStringify = (key: string) => {
		const transformedKey = _transformKey(key);

		return Array.isArray(stringifyNested) ?
				stringifyNested.includes(transformedKey as KeyForObject<T>)
			:	stringifyNested === '*';
	};

	/** - Helper function to check if a key matches a breakArray key. */
	const _shouldBreakArray = (key: string) => {
		const transformedKey = _transformKey(key);

		return Array.isArray(configs?.breakArray) ?
				configs.breakArray.includes(transformedKey as KeyForObject<T>)
			:	configs?.breakArray === '*';
	};

	/** - Helper to clean object by removing null/undefined/empty values while respecting required keys */
	const _cleanObject = (obj: GenericObject, parentKey = ''): GenericObject => {
		return Object.entries(obj).reduce((acc, [key, value]) => {
			const transformedKey = _transformKey(key);

			const fullKey = parentKey ? `${parentKey}.${transformedKey}` : transformedKey;

			// * Skip ignored keys (don't include them in the cleaned object)
			if (configs?.ignoreKeys?.includes(fullKey as DotNotationKey<T>)) {
				return acc;
			}

			const shouldKeep =
				(value != null && value !== '') ||
				_isRequiredKey(fullKey) ||
				isNonEmptyString(value) ||
				isValidArray(value) ||
				isNotEmptyObject(value);

			if (shouldKeep) {
				if (isNotEmptyObject(value)) {
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
					if (typeof value === 'string') {
						if (isNonEmptyString(value)) {
							let cleanString = value;

							if (configs?.trimStrings) {
								cleanString = cleanString?.trim();
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

		if (isCustomFileArray(value)) {
			value?.forEach((file) => formData.append(transformedKey, file?.originFileObj));
		} else if (isFileUpload(value)) {
			if (value?.fileList) {
				value?.fileList.forEach((file) =>
					formData.append(transformedKey, file?.originFileObj)
				);
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
				formData.append(transformedKey, value.item(i)!);
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
			formData.append(transformedKey, JSON.parse(JSON.stringify(value)));
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
				if (typeof value === 'string' && _shouldLowercaseValue(key)) {
					formData.append(transformedKey, value?.toLowerCase());
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
			if (configs?.ignoreKeys?.includes(fullKey as DotNotationKey<T>)) {
				return;
			}

			// * Trim string values if trimStrings is enabled
			if (configs?.trimStrings && isNonEmptyString(value)) {
				value = value?.trim();
			}

			// * Check if this key is preserved as dot-notation
			if (_shouldDotNotate(fullKey)) {
				_addToFormData(fullKey, value);
			} else if (isNotEmptyObject(value) && !_shouldStringify(fullKey)) {
				if (isDateLike(value)) {
					_addToFormData(key, JSON.parse(JSON.stringify(value)));
				} else {
					// * Process nested objects
					_processObject(value, key);
				}
			} else if (isFileOrBlob(value)) {
				_addToFormData(key, value);
			} else if (isDateLike(value)) {
				_addToFormData(key, JSON.parse(JSON.stringify(value)));
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
