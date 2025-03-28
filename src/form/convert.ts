import { isInvalidOrEmptyArray } from '../array/basics';
import { isEmptyObject } from '../object/basics';
import type {
	DotNotationKey,
	GenericObject,
	KeyForObject,
} from '../object/types';
import { isCustomFile, isCustomFileArray, isFileUpload } from './guards';
import type { FormDataConfigs } from './types';

/**
 * * Utility to convert object into FormData in a controlled way.
 *
 * @param data - The source object to control and convert to FormData.
 * @param configs - Configuration options to control the formData.
 * @returns `FormData` instance containing the sanitized and transformed data.
 */
export const createControlledFormData = <T extends GenericObject>(
	data: T,
	configs?: FormDataConfigs<T>,
): FormData => {
	const formData = new FormData();

	const { stringifyNested = '*' } = configs || {};

	/** Helper to check if a key should be lowercase */
	const shouldLowercaseKeys = (key: string) => {
		return Array.isArray(configs?.lowerCaseKeys) ?
				configs.lowerCaseKeys.some(
					(path) => key === path || key.startsWith(`${path}.`),
				)
			:	configs?.lowerCaseKeys === '*';
	};

	/** Helper to check if a key should be lowercase */
	const shouldLowercaseValue = (key: string) => {
		return Array.isArray(configs?.lowerCaseValues) ?
				configs.lowerCaseValues.some(
					(path) => key === path || key.startsWith(`${path}.`),
				)
			:	configs?.lowerCaseValues === '*';
	};

	/** Transforms key to lowercase if needed */
	const transformKey = (key: string) => {
		return shouldLowercaseKeys(key) ? key.toLowerCase() : key;
	};

	/** - Helper function to check if a key matches a breakArray key. */
	const isRequiredKey = (key: string) => {
		const transformedKey = transformKey(key);

		return Array.isArray(configs?.requiredKeys) ?
				configs.requiredKeys.some(
					(path) =>
						transformedKey === path ||
						transformedKey.startsWith(`${path}.`),
				)
			:	configs?.requiredKeys === '*';
	};

	/** - Helper function to check if a key matches a dotNotation path to preserve. */
	const shouldDotNotate = (key: string) => {
		const transformedKey = transformKey(key);

		return Array.isArray(configs?.dotNotateNested) ?
				configs.dotNotateNested.includes(
					transformedKey as KeyForObject<T>,
				)
			:	configs?.dotNotateNested === '*';
	};

	/** - Helper function to check if a key matches a stringifyNested key. */
	const shouldStringify = (key: string) => {
		const transformedKey = transformKey(key);

		return Array.isArray(stringifyNested) ?
				stringifyNested.includes(transformedKey as KeyForObject<T>)
			:	stringifyNested === '*';
	};

	/** - Helper function to check if a key matches a breakArray key. */
	const shouldBreakArray = (key: string) => {
		const transformedKey = transformKey(key);
		return Array.isArray(configs?.breakArray) ?
				configs.breakArray.includes(transformedKey as KeyForObject<T>)
			:	configs?.breakArray === '*';
	};

	/** - Helper to clean object by removing null/undefined/empty values while respecting required keys */
	const _cleanObject = (
		obj: GenericObject,
		parentKey = '',
	): GenericObject => {
		return Object.entries(obj).reduce((acc, [key, value]) => {
			const transformedKey = transformKey(key);

			const fullKey =
				parentKey ? `${parentKey}.${transformedKey}` : transformedKey;

			// * Skip ignored keys (don't include them in the cleaned object)
			if (configs?.ignoreKeys?.includes(fullKey as DotNotationKey<T>)) {
				return acc;
			}

			// * Keep value if:
			// * 1. It's required OR
			// * 2. It's not null/undefined AND not empty string/object
			const shouldKeep =
				isRequiredKey(fullKey) ||
				(value != null &&
					(typeof value !== 'string' || value !== '') &&
					(typeof value !== 'object' || !isEmptyObject(value)));

			if (shouldKeep) {
				if (
					typeof value === 'object' &&
					value !== null &&
					!Array.isArray(value)
				) {
					// Recursively clean nested objects
					const cleaned = _cleanObject(value, fullKey);
					if (isRequiredKey(fullKey) || !isEmptyObject(cleaned)) {
						acc[transformKey(key)] = cleaned;
					}
				} else {
					if (typeof value === 'string') {
						acc[transformKey(key)] = value.toLowerCase();
					} else {
						acc[transformKey(key)] = value;
					}
				}
			}
			return acc;
		}, {} as GenericObject);
	};

	/** * Helper function to add values to formData */
	const _addToFormData = (key: string, value: unknown) => {
		const transformedKey = transformKey(key);

		if (isCustomFileArray(value)) {
			value.forEach((file) =>
				formData.append(transformedKey, file.originFileObj),
			);
		} else if (isFileUpload(value)) {
			if (value.fileList) {
				value.fileList.forEach((file) =>
					formData.append(transformedKey, file.originFileObj),
				);
			} else if (value.file) {
				if (isCustomFile(value.file)) {
					formData.append(transformedKey, value.file.originFileObj);
				} else {
					formData.append(transformedKey, value.file);
				}
			}
		} else if (value instanceof Blob || value instanceof File) {
			formData.append(transformedKey, value);
		} else if (Array.isArray(value) && !isInvalidOrEmptyArray(value)) {
			if (shouldBreakArray(key)) {
				value.forEach((item, index) => {
					_addToFormData(`${transformedKey}[${index}]`, item);
				});
			} else {
				formData.append(transformedKey, JSON.stringify(value));
			}
		} else if (
			typeof value === 'object' &&
			value !== null &&
			!isEmptyObject(value)
		) {
			if (shouldStringify(key) && !shouldDotNotate(key)) {
				// Clean object before stringifying, preserving required keys
				const cleanedValue = _cleanObject(value, key);
				if (!isEmptyObject(cleanedValue) || isRequiredKey(key)) {
					formData.append(
						transformedKey,
						JSON.stringify(cleanedValue),
					);
				}
			} else {
				Object.entries(value).forEach(([nestedKey, nestedValue]) => {
					_addToFormData(`${key}.${nestedKey}`, nestedValue);
				});
			}
		} else {
			const isNotNullish = value != null && value !== '';
			if (isNotNullish || isRequiredKey(key)) {
				if (typeof value === 'string' && shouldLowercaseValue(key)) {
					formData.append(transformedKey, value.toLowerCase());
				} else {
					formData.append(
						transformedKey,
						value as string | Blob | File,
					);
				}
			}
		}
	};

	/** - Helper to process object */
	const _processObject = (obj: GenericObject, parentKey = '') => {
		Object.entries(obj).forEach(([key, value]) => {
			const transformedKey = transformKey(key);
			const fullKey =
				parentKey ? `${parentKey}.${transformedKey}` : transformedKey;

			// Skip keys that are in ignoreKeys
			if (configs?.ignoreKeys?.includes(fullKey as DotNotationKey<T>))
				return;

			// Trim string values if trimStrings is enabled
			if (configs?.trimStrings && typeof value === 'string') {
				value = value.trim();
			}

			// Check if this key is preserved
			if (shouldDotNotate(fullKey)) {
				// If it's a preserved path, append the value directly
				_addToFormData(fullKey, value);
			} else if (
				typeof value === 'object' &&
				!Array.isArray(value) &&
				value !== null &&
				!shouldStringify(fullKey)
			) {
				// Process nested objects
				_processObject(value, key);
			} else {
				// For other cases, just append as key-value
				_addToFormData(key, value);
			}
		});
	};

	_processObject(data);

	return formData;
};
