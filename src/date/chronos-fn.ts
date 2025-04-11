import { Chronos } from '..';
import type { Any } from '../types';
import type { ChronosStatics } from './types';

/**
 * * Converts a date into a Chronos object and access to all `Chronos` methods.
 *
 * @description
 * This function serves as a wrapper around the `Chronos` class constructor and allows you to create a new `Chronos` instance from various types of date representations.
 * The following types of input are supported:
 *
 * - **`string`**: A string representing a date, which can be parsed by the JavaScript `Date` constructor.
 *   Example: `"2023-12-31"`.
 * - **`number`**: A timestamp representing the number of milliseconds since the Unix epoch.
 *   Example: `1672531199000`.
 * - **`Date`**: A JavaScript `Date` object.
 * - **`Chronos`**: A `Chronos` instance created by the same constructor.
 *
 * This function also allows you to access static methods from the `Chronos` class, as it copies all static methods from `Chronos` to the `chronos` function itself.
 * Therefore, static methods can be called either through the `Chronos` class directly or through the `chronos` function.
 *
 * @example
 * Example usage:
 *
 * ```ts
 * const chronosInstanceFn = chronos("2023-12-31");
 * const chronosInstanceClass = new Chronos("2023-12-31");
 * const sameInstanceFn = chronos.parse("2023-12-31", "YYYY-MM-DD");
 * const sameInstanceClass = Chronos.parse("2023-12-31", "YYYY-MM-DD");
 * ```
 *
 * @param date - The date value to be converted into a `Chronos` object.
 * @returns new `Chronos` instance representing the provided date.
 *
 * @static
 * @remarks
 * Static methods can be accessed from both the `Chronos` class and the `chronos` function.
 * Static methods from the `Chronos` class are copied over to the `chronos` function, so you can call them like:
 * ```ts
 * chronos.parse("2023-12-31", "YYYY-MM-DD");
 * // Or
 * Chronos.parse("2023-12-31", "YYYY-MM-DD");
 * ```
 */
const chronos = ((date?: number | string | Date | Chronos) => {
	return new Chronos(date);
}) as ChronosStatics;

// ? Add static methods from Chronos class to the chronos function
Object.getOwnPropertyNames(Chronos).forEach((method) => {
	// Exclude non-method properties like `length`, `name`, `prototype`
	if (method !== 'prototype' && method !== 'name' && method !== 'length') {
		(chronos as Any)[method] = (Chronos as Any)[method];
	}
});

// ? Add instance methods from Chronos prototype to chronos function
// Object.getOwnPropertyNames(Chronos.prototype).forEach((method) => {
// 	// Skip the constructor method
// 	if (method !== 'constructor') {
// 		(chronos as Any)[method] = function (this: Chronos, ...args: Any[]) {
// 			return this instanceof Chronos ?
// 					(this as Any)[method](...args)
// 				:	(new Chronos() as Any)[method](...args); // Fallback to new Chronos instance
// 		};
// 	}
// });

export { chronos };
