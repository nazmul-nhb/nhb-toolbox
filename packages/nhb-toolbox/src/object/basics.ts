import { isNotEmptyObject } from '../guards/non-primitives';
import { stableStringify } from '../utils/index';
import type { Tuple } from '../utils/types';
import type { DeepKeys, GenericObject } from './types';

/**
 * * Deep clone an object using `structuredClone` or deterministic *JSON serialization*.
 *
 * @param obj Object to clone.
 * @param serialize Whether to force deterministic JSON serialization instead of using `structuredClone`. Defaults to `false`.
 * @returns Deep cloned object.
 *
 * @remarks
 * **Primary behavior**
 * - By default (`serialize = false`), the function uses {@link https://developer.mozilla.org/docs/Web/API/Window/structuredClone structuredClone} when available. This supports:
 *   - Circular references
 *   - `Date` objects
 *   - `Map` / `Set`
 *   - `RegExp`
 *   - Typed arrays
 *   - Most built-in JavaScript types
 *   - Preserves `undefined` values
 *
 * - **Note:** `structuredClone` **does not preserve class prototypes**, even though it preserves data types like `Date`, `Map`, and `Set`.
 *
 * **Deterministic serialization mode**
 * - When `serialize = true`, or when `structuredClone` is unavailable, the function falls back to **stable JSON serialization** via `stableStringify`. This guarantees:
 *   - All object keys are sorted alphabetically.
 *   - Consistent output across environments (deterministic).
 *   - All `undefined` values are converted to `null`.
 *   - Converting date-like objects (`Date`, `Chronos`, `Moment.js`, `Day.js`, `Luxon`, `JS-Joda`, `Temporal`) **in the same way that {@link JSON.stringify} would serialize them**, ensuring predictable and JSON-compliant output.
 *
 * - This mode is ideal for:
 *   - Hashing
 *   - Signature generation
 *   - Deep equality checks
 *   - Anything requiring deterministic, environment-neutral output
 *
 * **Deterministic mode limitations**
 * - JSON serialization will:
 *   - Drop functions and `Symbol` values.
 *   - Lose prototype and class instance information.
 *   - Convert all date-like objects into strings.
 *   - Fail on circular references.
 *
 * **Final safety fallback**
 * - If JSON serialization fails (e.g., due to circular references), the function returns a **shallow clone** (`{ ...obj }`) to ensure the cloning never throws.
 */
export function cloneObject<T extends GenericObject>(obj: T, serialize = false): T {
	try {
		if (!serialize && typeof structuredClone === 'function') {
			return structuredClone(obj);
		}
		return JSON.parse(stableStringify(obj));
	} catch {
		return { ...obj };
	}
}

/**
 * * Count the number of fields in an object.
 *
 * @param obj Object to check.
 * @returns Number of fields in the object.
 */
export function countObjectFields<T extends GenericObject>(obj: T): number {
	if (obj != null) return Object.keys(obj)?.length;

	return 0;
}

/**
 * * Extracts all the top-level keys of an object as an array.
 *
 * @remarks
 * - Returns a normal array of keys (string literals).
 * - Safe for runtime iteration.
 * - Returns an empty array (`[]`) for empty or non-object values.
 *
 * @param obj The object from which to extract keys.
 * @returns Array of keys.
 *
 * @example
 * const keys = extractObjectKeys({ a: 1, b: 2 });
 * // keys: ["a", "b"]; typed as ("a" | "b")[]
 */
export function extractObjectKeys<T extends GenericObject>(obj: T): Array<keyof T>;

/**
 * * Extracts all the top-level keys of an object as a tuple.
 *
 * @remarks
 * - Returns a typed tuple based on the input type, not runtime values.
 * - **Caution:** The order of keys in the returned tuple is determined by TypeScript’s type system and **may not match the runtime order** returned by `Object.keys(obj)`.
 * - Use this tuple for strict type-level operations, not for runtime iteration that relies on key order.
 * - Useful when you want literal type information preserved.
 * - Returns an empty tuple (`[]`) for empty or non-object values.
 *
 * @param obj The object from which to extract keys.
 * @param tuple Pass `true` to return as tuple instead of an array type.
 * @returns Tuple of keys.
 *
 * @example
 * const keysTuple = extractObjectKeys({ a: 1, b: 2 }, true);
 * // keysTuple: ["a", "b"]; also typed as ["a", "b"]
 */
export function extractObjectKeys<T extends GenericObject>(obj: T, tuple: true): Tuple<keyof T>;

export function extractObjectKeys<T extends GenericObject>(
	obj: T,
	tuple?: true
): Array<keyof T> | Tuple<keyof T> {
	const keys = isNotEmptyObject(obj) ? Object.keys(obj) : [];

	return tuple ? (keys as Tuple<keyof T>) : (keys as Array<keyof T>);
}

/**
 * * Recursively extracts all nested keys from an object as an array.
 *
 * @remarks
 * - Returns an empty array (`[]`) for an empty object or a non-object value.
 * - For only top-level keys, use {@link extractObjectKeys}.
 *
 * @param obj The object from which to extract the keys.
 * @returns An array of all the nested keys (string literals) from the specified object.
 */
export function extractObjectKeysDeep<T extends GenericObject>(obj: T): Array<DeepKeys<T>> {
	function _getDeepKeys(candidate: GenericObject): string[] {
		let result: string[] = [];

		for (const key in candidate) {
			result.push(key);

			if (isNotEmptyObject(candidate[key])) {
				result = [...result, ..._getDeepKeys(candidate[key])];
			}
		}

		return result;
	}

	return (isNotEmptyObject(obj) ? _getDeepKeys(obj) : []) as Array<DeepKeys<T>>;
}
