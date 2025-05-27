import { Chronos } from './Chronos';
import type { ChronosInput, ChronosStatics } from './types';

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
 * @returns new `Chronos` instance representing the provided date with all methods and properties.
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
const chronos = (
	valueOrYear?: ChronosInput,
	month?: number,
	date?: number,
	hours?: number,
	minutes?: number,
	seconds?: number,
	ms?: number,
) => {
	let newChronos: Chronos;

	if (typeof valueOrYear === 'number' && typeof month === 'number') {
		newChronos = new Chronos(
			valueOrYear,
			month,
			date ?? 1,
			hours ?? 0,
			minutes ?? 0,
			seconds ?? 0,
			ms ?? 0,
		);
	} else {
		newChronos = /* @__PURE__ */ new Chronos(valueOrYear);
	}

	return newChronos;
};

/**
 * @remarks
 * Static methods from the `Chronos` class are copied over to the `chronos` function.
 * Therefore, you can access static methods from `Chronos` both through the `Chronos` class and the `chronos` function.
 *
 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC
 * and convert it to the **equivalent local time** using the current environment's UTC offset.*
 *
 * Example usage:
 * ```ts
 * chronos.parse("2023-12-31", "YYYY-MM-DD");
 * // Or
 * Chronos.parse("2023-12-31", "YYYY-MM-DD");
 * ```
 *
 * *No need to call `chronos` for accessing the static methods. Simply call the static methods.*
 *
 * **Available Static Methods:**
 *
 * ```ts
 * today(options?: FormatOptions): string
 * yesterday(): Chronos;
 * tomorrow(): Chronos
 * now(): number
 * parse(dateStr: string, format: string): Chronos
 * utc(dateLike: ChronosInput): Chronos
 * min(...dates: ChronosInput[]): Chronos
 * max(...dates: ChronosInput[]): Chronos
 * isLeapYear(date: ChronosInput): boolean
 * isValidDate(value: unknown): boolean
 * isDateString(value: unknown): boolean
 * isValidChronos(value: unknown): boolean
 * formatTimePart(time: string, format?: TimeParts): string
 * ```
 */
const typedChronos = /* @__PURE__ */ chronos as ChronosStatics;

// ? Add static methods from Chronos class to the chronos function
// Object.getOwnPropertyNames(Chronos).forEach((method) => {
// 	// Exclude non-method properties like `length`, `name`, `prototype`
// 	if (method !== 'prototype' && method !== 'name' && method !== 'length') {
// 		(chronos as Any)[method] = (Chronos as Any)[method];
// 	}
// });

typedChronos.now = Chronos.now;
typedChronos.min = Chronos.min;
typedChronos.max = Chronos.max;
typedChronos.utc = Chronos.utc;
typedChronos.parse = Chronos.parse;
typedChronos.today = Chronos.today;
typedChronos.tomorrow = Chronos.tomorrow;
typedChronos.yesterday = Chronos.yesterday;
typedChronos.isLeapYear = Chronos.isLeapYear;
typedChronos.isValidDate = Chronos.isValidDate;
typedChronos.isDateString = Chronos.isDateString;
typedChronos.isValidChronos = Chronos.isValidChronos;
typedChronos.formatTimePart = Chronos.formatTimePart;

export { typedChronos as chronos };
