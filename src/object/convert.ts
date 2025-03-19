import type { UncontrolledAny } from '../types';
import type {
	DotNotationKey,
	GenericObject,
	Numberified,
	Stringified,
} from './types';

/**
 * * Converts the values of specified keys in an object to numbers.
 * * Supports nested objects using dot-notation keys.
 *
 * @param data The object to convert.
 * @param options Options object specifying the conversion mapping.
 *   - `keys`: The keys in the objects to be converted (dot-notation supported).
 *   - `convertTo`: The target type, either `"string"` or `"number"`.
 * @returns The modified object with the converted values as `"string"` or `"number"`.
 */
export function convertObjectValues<
	T extends GenericObject,
	C extends 'string' | 'number',
>(
	data: T,
	options: { keys: DotNotationKey<T>[]; convertTo: C },
): C extends 'string' ? Stringified<T>
: C extends 'number' ? Numberified<T>
: never;

/**
 * * Converts the values of specified keys in an array of objects to numbers or strings.
 * * Supports nested objects using dot-notation keys.
 *
 * @param data The array of objects to convert.
 * @param options Options object specifying the conversion mapping.
 *   - `keys`: The keys in the objects to be converted (dot-notation supported).
 *   - `convertTo`: The target type, either `"string"` or `"number"`.
 * @returns The modified array of objects with the converted values as `"string"` or `"number"`.
 */
export function convertObjectValues<
	T extends GenericObject,
	C extends 'string' | 'number',
>(
	data: T[],
	options: { keys: DotNotationKey<T>[]; convertTo: C },
): C extends 'string' ? Stringified<T>[]
: C extends 'number' ? Numberified<T>[]
: never;

/**
 * * Converts the values of specified keys in an object or array of objects to either string or number.
 * * Supports nested objects using dot-notation keys.
 *
 * @param data The object or array of objects to convert.
 * @param options Options object specifying the conversion mapping.
 *   - `keys`: The keys in the object to be converted (dot-notation supported).
 *   - `convertTo`: The target type, either "string" or "number".
 * @returns The modified object or array of objects with the converted values, with updated types.
 */
export function convertObjectValues<
	T extends GenericObject,
	C extends 'string' | 'number',
>(
	data: T | T[],
	options: { keys: DotNotationKey<T>[]; convertTo: C },
): C extends 'string' ? Stringified<T> | Stringified<T>[]
: C extends 'number' ? Numberified<T> | Numberified<T>[]
: never {
	const { keys, convertTo } = options;

	/** * Helper function to determine if value should be preserved. */
	const _shouldPreserveValue = (value: unknown): boolean =>
		convertTo === 'number' &&
		(typeof value !== 'string' || isNaN(Number(value)));

	/** * Helper function to resolve a dot-notation key path and modify the corresponding value in the object. */
	const _setValueAtPath = (
		obj: T,
		path: string,
		convertTo: 'string' | 'number',
	): T => {
		const segments = path.split('.');

		let current: UncontrolledAny = obj;

		segments.forEach((key, index) => {
			if (index === segments.length - 1) {
				const value = current[key];

				if (_shouldPreserveValue(value)) {
					return;
				}

				if (convertTo === 'string' && typeof value !== 'string') {
					current[key] = String(value);
				} else if (
					convertTo === 'number' &&
					typeof value !== 'number' &&
					!isNaN(Number(value))
				) {
					current[key] = Number(value);
				}
			} else {
				if (typeof current[key] === 'object' && current[key] !== null) {
					current = current[key];
				} else {
					current[key] = {};
					current = current[key];
				}
			}
		});

		return obj;
	};

	/** * Recursively process a single object. */
	const _convertValue = (obj: T): T => {
		let newObj = structuredClone(obj);

		keys.forEach((key) => {
			newObj = _setValueAtPath(newObj, key, convertTo);
		});

		return newObj;
	};

	if (Array.isArray(data)) {
		return data.map((d) => _convertValue(d)) as C extends 'string' ?
			Stringified<T>[]
		: C extends 'number' ? Numberified<T>[]
		: never;
	}

	return _convertValue(data) as C extends 'string' ?
		Stringified<T> | Stringified<T>[]
	: C extends 'number' ? Numberified<T> | Numberified<T>[]
	: never;
}
