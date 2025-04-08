import type { UncontrolledAny } from '../types';
import type {
	DotNotationKey,
	FieldMap,
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

/**
 * * Pick specific fields from an object and create a new object with specified fields.
 *
 * @description This function creates a new object containing only the specified fields from the source object.
 * It is useful for creating a new object with a subset of properties from an existing object.
 *
 * @param T The type of the source object.
 * @param U The type of the keys to pick from the source object.
 *
 * @param source The source object from which to pick fields.
 * @param keys	The keys of the fields to pick from the source object.
 *
 * @returns An object containing only the picked fields.
 */
export function pickFields<T extends GenericObject, U extends keyof T>(
	source: T,
	keys: U[],
): { [K in U]: T[K] } {
	const result = {} as { [K in U]: T[K] };

	keys.forEach((key) => {
		result[key] = source[key];
	});

	return result;
}

/**
 * * Remap fields from one object to another.
 * @description This function creates a new object with fields remapped from the source object to the target object based on the provided field map.
 *
 * @param source The source object from which to remap fields.
 * @param fieldMap  An object that maps target keys to source keys.
 * @returns An object with fields remapped according to the field map.
 */
export function remapFields<
	Source extends GenericObject,
	Target extends GenericObject,
>(source: Source, fieldMap: FieldMap<Source, Target>): Target {
	const result = {} as GenericObject;

	for (const targetKey in fieldMap) {
		const sourceKey = fieldMap[targetKey];
		result[targetKey] = source[sourceKey as keyof Source];
	}

	return result as Target;
}
