import { Chronos } from './Chronos';
import type { ChronosInput, ChronosStaticKey, ChronosStatics } from './types';

/**
 * * Converts a date into a Chronos object and access to all `Chronos` methods and properties.
 *
 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC
 * and convert it to the **equivalent local time** using the current environment's UTC offset.*
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
 * - **`year, month, date, hours, minutes, seconds, milliseconds`**: Individual components of a date-time to construct a `Chronos` instance.
 *   - **`year`**: A number representing the year. If the year is between 0 and 99, it will be assumed to be the year 1900 + the provided year.
 *   - **`month`**: A number between 1 and 12 representing the month (1 for January, 12 for December). It is adjusted internally to a 0-based index (0 for January, 11 for December).
 *   - **`date`**: A number between 1 and 31 representing the day of the month.
 *   - **`hours`**: A number between 0 and 23 representing the hour of the day.
 *   - **`minutes`**: A number between 0 and 59 representing the minutes past the hour.
 *   - **`seconds`**: A number between 0 and 59 representing the seconds past the minute.
 *   - **`milliseconds`**: A number between 0 and 999 representing the milliseconds past the second.
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
 * @param valueOrYear The value in number, string, Date or Chronos format or the full year designation is required for cross-century date accuracy. If year is between 0 and 99 is used, then year is assumed to be 1900 + year.
 * @param month The month as a number between 1 and 12 (January to December).
 * @param date The date as a number between 1 and 31.
 * @param hours Must be supplied if minutes is supplied. A number from 0 to 23 (midnight to 11pm) that specifies the hour.
 * @param minutes Must be supplied if seconds is supplied. A number from 0 to 59 that specifies the minutes.
 * @param seconds Must be supplied if milliseconds is supplied. A number from 0 to 59 that specifies the seconds.
 * @param ms A number from 0 to 999 that specifies the milliseconds.
 *
 * @returns new `Chronos` instance representing the provided date with all `Chronos` methods and properties.
 *
 * @remarks
 * - Static methods can be accessed from both the `Chronos` class and the `chronos` function.
 * - Static methods from the `Chronos` class are copied over to the `chronos` wrapper function, so you can call them like:
 * ```ts
 * chronos.parse("2023-12-31", "YYYY-MM-DD");
 * // Or
 * Chronos.parse("2023-12-31", "YYYY-MM-DD");
 * ```
 */
const $chronos = (
	valueOrYear?: ChronosInput,
	month?: number,
	date?: number,
	hours?: number,
	minutes?: number,
	seconds?: number,
	ms?: number
) => {
	if (typeof valueOrYear === 'number' && typeof month === 'number') {
		return new Chronos(
			valueOrYear,
			month,
			date ?? 1,
			hours ?? 0,
			minutes ?? 0,
			seconds ?? 0,
			ms ?? 0
		);
	} else {
		return new Chronos(valueOrYear);
	}
};

/**
 * @internal Type guard to check if a property is a static method of the `Chronos` class.
 *
 * @param prop - The property name to check.
 * @returns `true` if the property is a static method of `Chronos`, `false` otherwise.
 */
function _isChronosStaticKey(prop: string): prop is ChronosStaticKey {
	return (
		prop in Chronos &&
		prop !== 'prototype' &&
		prop !== 'name' &&
		prop !== 'length' &&
		typeof Chronos[prop as ChronosStaticKey] === 'function'
	);
}

/**
 * * Use `chronos` with all static methods from the `Chronos` class.
 *
 * @description
 * It serves as both a constructor for creating `Chronos` instances and a namespace for accessing all static methods from the `Chronos` class.
 *
 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC and convert it to the **equivalent local time** using the current environment's UTC offset.*
 *
 * @example
 * Example usage as constructor:
 * ```ts
 * const instance = chronos("2023-12-31");
 * const instanceWithTime = chronos(2023, 12, 31, 15, 30, 0);
 * ```
 *
 * @example
 * Example usage of static methods:
 * ```ts
 * // Both work identically - thanks to automatic Proxy delegation
 * chronos.parse("2023-12-31", "YYYY-MM-DD");
 * Chronos.parse("2023-12-31", "YYYY-MM-DD");
 *
 * chronos.today();
 * chronos.isLeapYear(2024);
 * chronos.min(date1, date2, date3);
 * ```
 *
 * @remarks
 * - _No need to call `chronos` for accessing the static methods. Simply call the static methods._
 *
 * **Available Static Methods:**
 *
 * ```ts
 * chronos.now(): number;
 * chronos.tomorrow(): Chronos;
 * chronos.yesterday(): Chronos;
 * chronos.today(options?: FormatOptions): string;
 * chronos.with(options: ChronosWithOptions): Chronos;
 * chronos.parse(dateStr: string, format: string): Chronos;
 * chronos.utc(dateLike: ChronosInput): Chronos;
 * chronos.min(...dates: ChronosInput[]): Chronos;
 * chronos.max(...dates: ChronosInput[]): Chronos;
 * chronos.isLeapYear(date: ChronosInput): boolean;
 * chronos.isValidDate(value: unknown): boolean;
 * chronos.isDateString(value: unknown): boolean;
 * chronos.isValidChronos(value: unknown): boolean;
 * chronos.formatTimePart(time: string, format?: TimeParts): string;
 * chronos.getDatesForDay(day: WeekDay, options?: WeekdayOptions): string[];
 * chronos.use(plugin: ChronosPlugin): void;
 * chronos.register(plugin: ChronosPlugin): void;
 * ```
 */
const chronosStatics = new Proxy($chronos, {
	get(target, prop: string, receiver) {
		// If the property exists on the function itself, return it
		if (prop in target) {
			return Reflect.get(target, prop, receiver);
		}

		// If the property exists on Chronos (and it's not a reserved property), return it
		if (_isChronosStaticKey(prop)) {
			return Chronos[prop];
		}

		// Fall back to default behavior
		return Reflect.get(target, prop, receiver);
	},

	// Handle checking if a property exists
	has(target, prop: string) {
		return prop in target || _isChronosStaticKey(prop);
	},
}) as ChronosStatics;

export { chronosStatics as chronos };
