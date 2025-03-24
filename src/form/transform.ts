import { isValidEmptyArray } from '../array/basics';
import { isEmptyObject } from '../object/basics';
import type { DotNotationKey, GenericObject } from '../object/types';
import type { UncontrolledAny } from '../types';
import type { FormDataConfigs } from './types';

/**
 * * Utility to convert object into FormData in a controlled way.
 *
 * @param data - The source object to control and convert to FormData.
 * @param configs - Configuration options to control the formData.
 *
 * @returns FormData instance containing the sanitized and transformed data
 */
export const createControlledFormData = <T extends GenericObject>(
	data: T,
	configs?: FormDataConfigs<T>,
): FormData => {
	const formData = new FormData();

	const { stringifyNested = '*' } = configs || {};

	/** Helper function to check if a key matches a dotNotation path to preserve. */
	const shouldDotNotate = (fullKey: string) => {
		if (Array.isArray(configs?.dotNotateNested)) {
			return configs?.dotNotateNested?.some(
				(path) => fullKey === path || fullKey.startsWith(`${path}.`),
			);
		}
		return configs?.dotNotateNested === '*';
	};

	/** - Helper function to check if a key matches a stringifyNested key. */
	const shouldStringifyNested = (fullKey: string) => {
		if (Array.isArray(stringifyNested)) {
			return stringifyNested?.some(
				(path) => fullKey === path || fullKey.startsWith(`${path}.`),
			);
		}
		return stringifyNested === '*';
	};

	/** - Helper function to check if a key matches a breakArray key. */
	const shouldBreakArray = (fullKey: string) => {
		if (Array.isArray(configs?.breakArray)) {
			return configs?.breakArray?.some(
				(path) => fullKey === path || fullKey.startsWith(`${path}.`),
			);
		}
		return configs?.breakArray === '*';
	};

	const addToFormData = (key: string, value: UncontrolledAny) => {
		const transformedKey =
			(
				configs?.lowerCaseKeys === '*' ||
				configs?.lowerCaseKeys?.includes(key as DotNotationKey<T>)
			) ?
				key.toLowerCase()
			:	key;

		if (!isValidEmptyArray(value) && value[0]?.originFileObj) {
			formData.append(transformedKey, value[0].originFileObj);
		} else if (Array.isArray(value)) {
			if (shouldBreakArray(key)) {
				value.forEach((item, index) => {
					addToFormData(`${transformedKey}[${index}]`, item);
				});
			} else {
				formData.append(transformedKey, JSON.stringify(value));
			}
		} else if (
			typeof value === 'object' &&
			value !== null &&
			!isEmptyObject(value)
		) {
			if (shouldStringifyNested(key) && !shouldDotNotate(key)) {
				formData.append(transformedKey, JSON.stringify(value));
			} else {
				Object.entries(value).forEach(([nestedKey, nestedValue]) => {
					addToFormData(`${key}.${nestedKey}`, nestedValue);
				});
			}
		} else {
			const isRequired =
				configs?.requiredKeys === '*' ||
				configs?.requiredKeys?.includes(key as DotNotationKey<T>);
			const isNotNullish = value != null && value !== '';

			if (isNotNullish || isRequired) {
				formData.append(transformedKey, value);
			}
		}
	};

	const processObject = (obj: GenericObject, parentKey = '') => {
		Object.entries(obj).forEach(([key, value]) => {
			const fullKey = (
				parentKey ?
					`${parentKey}.${key}`
				:	key) as DotNotationKey<T>;

			// Skip keys that are in ignoreKeys
			if (configs?.ignoreKeys?.includes(fullKey)) return;

			// Trim string values if trimStrings is enabled
			if (configs?.trimStrings && typeof value === 'string') {
				value = value.trim();
			}

			// Check if this key is preserved
			if (shouldDotNotate(fullKey)) {
				// If it's a preserved path, we need to append the value directly as the key
				addToFormData(fullKey, value);
			} else if (
				typeof value === 'object' &&
				!Array.isArray(value) &&
				value != null &&
				!stringifyNested
			) {
				// Process nested objects
				processObject(value, key);
			} else {
				// For other cases, just append as key-value
				addToFormData(key, value);
			}
		});
	};

	processObject(data);

	return formData;
};
