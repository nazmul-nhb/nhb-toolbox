import { isValidEmptyArray } from '../array/basics';
import { isEmptyObject } from '../object/basics';
import type { LooseObject } from '../object/types';
import type { UncontrolledAny } from '../types';
import type { AnyDotNotationKey, FormDataConfigs } from './types';

/**
 * Utility to convert object into FormData in a controlled way.
 *
 * @param data - The source object to control and convert to FormData.
 * @param configs - Configuration options to control the formData.
 *
 * @returns FormData instance containing the sanitized and transformed data
 */
export const createControlledFormData = <T extends LooseObject>(
	data: T,
	configs?: FormDataConfigs<T>,
): FormData => {
	const formData = new FormData();

	const addToFormData = (key: string, value: UncontrolledAny) => {
		const transformedKey =
			(
				configs?.lowerCaseKeys === '*' ||
				configs?.lowerCaseKeys?.includes(key as AnyDotNotationKey<T>)
			) ?
				key.toLowerCase()
			:	key;

		if (!isValidEmptyArray(value) && value[0]?.originFileObj) {
			formData.append(transformedKey, value[0].originFileObj);
		} else if (Array.isArray(value)) {
			value.forEach((item, index) => {
				addToFormData(`${transformedKey}[${index}]`, item);
			});
		} else if (
			typeof value === 'object' &&
			value !== null &&
			!isEmptyObject(value)
		) {
			// Handle nested object by converting it into a string representation like 'name.first'
			Object.entries(value).forEach(([nestedKey, nestedValue]) => {
				addToFormData(`${key}.${nestedKey}`, nestedValue);
			});
		} else {
			const isRequired =
				configs?.requiredKeys === '*' ||
				configs?.requiredKeys?.includes(key as AnyDotNotationKey<T>);
			const isNotNullish = value != null && value !== '';

			if (isNotNullish || isRequired) {
				formData.append(transformedKey, value);
			}
		}
	};

	// Helper function to check if a key matches a preserved path
	const isPathPreserved = (fullKey: AnyDotNotationKey<T>) => {
		if (Array.isArray(configs?.preservePaths))
			return configs?.preservePaths?.some(
				(path) => fullKey === path || fullKey.startsWith(`${path}.`),
			);

		return configs?.preservePaths === '*';
	};

	const processObject = (obj: LooseObject, parentKey = '') => {
		Object.entries(obj).forEach(([key, value]) => {
			const fullKey = (
				parentKey ?
					`${parentKey}.${key}`
				:	key) as AnyDotNotationKey<T>;

			// Skip keys that are in ignoreKeys
			if (configs?.ignoreKeys?.includes(fullKey)) return;

			// Trim string values if trimStrings is enabled
			if (configs?.trimStrings && typeof value === 'string') {
				value = value.trim();
			}

			// Check if this key is preserved
			if (isPathPreserved(fullKey)) {
				// If it's a preserved path, we need to append the value directly as the key
				addToFormData(fullKey, value);
			} else if (
				typeof value === 'object' &&
				!Array.isArray(value) &&
				value != null
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
