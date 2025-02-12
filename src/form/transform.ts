import { isEmptyObject } from '../object/basics';
import type { LooseObject } from '../object/types';
import type { UncontrolledAny } from '../types';
import type { FormDataConfigs } from './types';

/**
 * * Utility to  convert object into FormData in a controlled way.
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
		if (value instanceof File) {
			formData.append(key, value);
		} else if (Array.isArray(value)) {
			value.forEach((item, index) => {
				addToFormData(`${key}[${index}]`, item);
			});
		} else if (typeof value === 'object' && !isEmptyObject(value)) {
			Object.entries(value).forEach(([nestedKey, nestedValue]) => {
				addToFormData(`${key}.${nestedKey}`, nestedValue);
			});
		} else {
			formData.append(key, value);
		}
	};

	const isPathPreserved = (key: string) => {
		return configs?.preservePaths?.some((path) => key.startsWith(path));
	};

	Object.entries(data).forEach(([key, value]) => {
		// 1. Skip keys that are in ignoreKeys
		if (configs?.ignoreKeys?.includes(key as keyof T)) return;

		// 2. Trim string values if trimStrings is enabled
		if (configs?.trimStrings && typeof value === 'string') {
			value = value.trim();
		}

		// 3. Ensure requiredKeys are included even if falsy
		if (configs?.requiredKeys?.includes(key as keyof T) && value == null) {
			value = ''; // Make sure it's an empty string for falsy values
		}

		// 4. Check preservePaths, if true, preserve values for nested paths
		if (isPathPreserved(key)) {
			addToFormData(key, value);
		} else {
			const transformedKey =
				configs?.lowerCaseKeys?.includes(key as keyof T) ?
					key.toLowerCase()
				:	key;
			addToFormData(transformedKey, value);
		}
	});

	return formData;
};
