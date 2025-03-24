import { isValidEmptyArray } from '../array/basics';
import { isEmptyObject } from '../object/basics';
import type { DotNotationKey, GenericObject } from '../object/types';
import type { UncontrolledAny } from '../types';
import { isCustomFileArray, isFileUpload } from './guards';
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

	/** - Helper function to check if a key matches a dotNotation path to preserve. */
	const shouldDotNotate = (key: string) => {
		return Array.isArray(configs?.dotNotateNested) ?
				configs.dotNotateNested.some(
					(path) => key === path || key.startsWith(`${path}.`),
				)
			:	configs?.dotNotateNested === '*';
	};

	/** - Helper function to check if a key matches a stringifyNested key. */
	const shouldStringify = (key: string) => {
		return Array.isArray(stringifyNested) ?
				stringifyNested.some(
					(path) => key === path || key.startsWith(`${path}.`),
				)
			:	stringifyNested === '*';
	};

	/** - Helper function to check if a key matches a breakArray key. */
	const shouldBreakArray = (key: string) => {
		return Array.isArray(configs?.breakArray) ?
				configs.breakArray.some(
					(path) => key === path || key.startsWith(`${path}.`),
				)
			:	configs?.breakArray === '*';
	};

	/** * Helper function to add values to formData */
	const _addToFormData = (key: string, value: UncontrolledAny) => {
		const transformedKey =
			(
				configs?.lowerCaseKeys === '*' ||
				configs?.lowerCaseKeys?.includes(key as DotNotationKey<T>)
			) ?
				key.toLowerCase()
			:	key;

		if (isCustomFileArray(value)) {
			formData.append(
				transformedKey,
				value[0].originFileObj as UncontrolledAny,
			);
		} else if (isFileUpload(value)) {
			if (value.file) {
				formData.append(
					transformedKey,
					value.file.originFileObj as UncontrolledAny,
				);
			} else if (value.fileList) {
				formData.append(
					transformedKey,
					value.fileList[0].originFileObj as UncontrolledAny,
				);
			}
		} else if (value instanceof Blob || value instanceof File) {
			formData.append(transformedKey, value);
		} else if (Array.isArray(value) && !isValidEmptyArray(value)) {
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
				formData.append(transformedKey, JSON.stringify(value));
			} else {
				Object.entries(value).forEach(([nestedKey, nestedValue]) => {
					_addToFormData(`${key}.${nestedKey}`, nestedValue);
				});
			}
		} else {
			const isRequired =
				configs?.requiredKeys === '*' ||
				configs?.requiredKeys?.includes(key as DotNotationKey<T>);
			const isNotNullish = value != null && value !== '';

			if (isNotNullish || isRequired) {
				formData.append(
					transformedKey,
					typeof value === 'boolean' ?
						String(value)
					:	String(value ?? ''),
				);
			}
		}
	};

	/** - Helper to process object */
	const _processObject = (obj: GenericObject, parentKey = '') => {
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
				// If it's a preserved path, append the value directly
				_addToFormData(fullKey, value);
			} else if (
				typeof value === 'object' &&
				!Array.isArray(value) &&
				value != null &&
				!stringifyNested
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
