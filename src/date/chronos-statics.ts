import type { Chronos } from './Chronos';
import type {
	ChronosInput,
	ChronosPlugin,
	ChronosWithOptions,
	DateRangeOptions,
	FormatOptions,
	RelativeRangeOptions,
	TimeParts,
	WeekDay,
	WeekdayOptions,
} from './types';

/** All the statics methods in `Chronos` class */
export interface ChronosStatics {
	/**
	 * * Converts a date into a `Chronos` object and access to all `Chronos` methods and properties.
	 *
	 * @description
	 * This function serves as a wrapper around the `Chronos` class constructor and allows you to create a new `Chronos` instance from various types of date representations.
	 *
	 * Accepts no arguments (defaults to now).
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	(): Chronos;

	/**
	 * * Converts a date into a `Chronos` object and access to all `Chronos` methods and properties.
	 *
	 * @description
	 * This function serves as a wrapper around the `Chronos` class constructor and allows you to create a new `Chronos` instance from various types of date representations.
	 *
	 * @param value - A date value in `number`, it should be a timestamp (milliseconds since the Unix epoch).
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	(value: number): Chronos;

	/**
	 * * Converts a date into a `Chronos` object and access to all `Chronos` methods and properties.
	 *
	 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC
	 * and convert it to the **equivalent local time** using the current environment's UTC offset.*
	 *
	 * @description
	 * This function serves as a wrapper around the `Chronos` class constructor and allows you to create a new `Chronos` instance from various types of date representations.
	 *
	 * @param value - A date value in `string`, it should be in a format that can be parsed by the `Date` constructor.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	(value: string): Chronos;

	/**
	 * * Converts a date into a `Chronos` object and access to all `Chronos` methods and properties.
	 *
	 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC
	 * and convert it to the **equivalent local time** using the current environment's UTC offset.*
	 *
	 * @description
	 * This function serves as a wrapper around the `Chronos` class constructor and allows you to create a new `Chronos` instance from various types of date representations.
	 *
	 * @param value - A date value as `Date` object, it will be used as is.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	(value: Date): Chronos;

	/**
	 * * Converts a date into a `Chronos` object and access to all `Chronos` methods and properties.
	 *
	 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC
	 * and convert it to the **equivalent local time** using the current environment's UTC offset.*
	 *
	 * @description
	 * This function serves as a wrapper around the `Chronos` class constructor and allows you to create a new `Chronos` instance from various types of date representations.
	 *
	 * @param value - A date value as `Chronos` object.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	(value: Chronos): Chronos;

	/**
	 * * Converts a date into a `Chronos` object and access to all `Chronos` methods and properties.
	 *
	 * @description
	 * This function serves as a wrapper around the `Chronos` class constructor and allows you to create a new `Chronos` instance from various types of date representations.
	 *
	 * @param year The full year designation is required for cross-century date accuracy. If year is between 0 and 99, year is assumed to be 1900 + year.
	 * @param month The month as a number between 1 and 12 (January to December).
	 * @param date The date as a number between 1 and 31.
	 * @param hours Must be supplied if minutes is supplied. A number from 0 to 23 (midnight to 11pm) that specifies the hour.
	 * @param minutes Must be supplied if seconds is supplied. A number from 0 to 59 that specifies the minutes.
	 * @param seconds Must be supplied if milliseconds is supplied. A number from 0 to 59 that specifies the seconds.
	 * @param ms A number from 0 to 999 that specifies the milliseconds.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	(
		year: number,
		month: number,
		date?: number,
		hours?: number,
		minutes?: number,
		seconds?: number,
		ms?: number
	): Chronos;

	/**
	 * @static Injects a plugin into the `Chronos` system.
	 * @param plugin The plugin to inject.
	 *
	 * @remarks
	 * - Using this (`use`) method in `React` projects may trigger *linter error* like `"React Hooks must be called in a React function component or a custom React Hook function."`
	 * 	- To prevent this incorrect *linter error* in `React` projects, prefer using {@link register} method (alias `use` method).
	 *
	 * - **NOTE:** *Once a plugin is injected, all the registered methods for that plugin will be available for the whole project.*
	 * - See {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/plugins#-official-plugins full list of plugins and the methods they register}.
	 */
	use(plugin: ChronosPlugin): void;

	/**
	 * @static Registers a plugin into the `Chronos` system.
	 * @param plugin The plugin to register.
	 *
	 * @remarks
	 * - This is just an alias for {@link use} method.
	 * - Using {@link use} method in `React` projects may trigger *linter error* like `"React Hooks must be called in a React function component or a custom React Hook function."`
	 * 	- To prevent this incorrect *linter error* in `React` projects, prefer using this (`register`) method over {@link use} method.
	 *
	 * - **NOTE:** *Once a plugin is injected, all the registered methods for that plugin will be available for the whole project.*
	 * - See {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/plugins#-official-plugins full list of plugins and the methods they register}.
	 */
	register(plugin: ChronosPlugin): void;

	/**
	 * * Returns the current date and time in a specified format in local time.
	 * * Default format is dd, `MMM DD, YYYY HH:mm:ss` = `Sun, Apr 06, 2025 16:11:55`
	 * @param options - Configure format string and whether to format using utc offset.
	 * @returns Formatted date string in desired format.
	 */
	today(options?: FormatOptions): string;

	/**
	 * * Returns a new `Chronos` instance representing yesterday's date.
	 *
	 * @returns A `Chronos` instance for the next calendar day.
	 */
	yesterday(): Chronos;

	/**
	 * * Returns a new `Chronos` instance representing tomorrow's date.
	 *
	 * @returns A `Chronos` instance for the next calendar day.
	 */
	tomorrow(): Chronos;

	/**
	 * * Returns the number of milliseconds elapsed since midnight, January 1, 1970 Universal Coordinated Time (UTC).
	 * * It basically calls `Date.now()`.
	 * @returns The number of milliseconds elapsed since the Unix epoch.
	 */
	now(): number;

	/**
	 * * Parses a date string with a given format (limited support only).
	 *
	 * * **Supported format tokens**:
	 * - `YYYY`: Full year (e.g., 2023)
	 * - `YY`: Two-digit year (e.g., 23 for 2023, 99 for 1999)
	 * - `MM`: Month (01-12)
	 * - `M`: 1-Digit Month (1-9)
	 * - `DD`: Day of the month (01-31)
	 * - `D`: 1-Digit Day of the month (1-9)
	 * - `HH`: Hour (00-23)
	 * - `H`: 1-Digit Hour (0-9)
	 * - `mm`: Minute (00-59)
	 * - `m`: 1-Digit Minute (0-9)
	 * - `ss`: Second (00-59)
	 * - `s`: 1-Digit Second (0-9)
	 *
	 * **Example**:
	 * ```ts
	 * Chronos.parse('23-12-31 15:30:45', 'YY-MM-DD HH:mm:ss');
	 * // returns Chronos instance with the parsed date 2023-12-31T15:30:45
	 * ```
	 *
	 * @param dateStr - The date string to be parsed
	 * @param format - The format of the date string. Tokens like `YYYY`, `MM`, `DD`, `HH`, `mm`, `ss` are used to specify the structure.
	 * @returns A new `Chronos` instance representing the parsed date.
	 * @throws `Error` If the date string does not match the format.
	 */
	parse(dateStr: string, format: string): Chronos;

	/**
	 * * Creates a new `Chronos` instance with the provided time component(s).
	 *
	 * @param options - One or more time components to override.
	 * @returns A new `Chronos` instance with the provided time components applied.
	 *
	 * @remarks
	 * - Unspecified components are filled with the current time's (`Chronos`) respective values.
	 * - For option `month`, value should be number from `1` (January) to `12` (December).
	 * - If the `date` component is omitted and the current day is the last day of its month,
	 *   the resulting instance will also use the last day of the target month.
	 *   - _This rule does **not** apply if the `date` component is explicitly provided,
	 *     even if that value exceeds the last day of the target month._
	 *
	 * @example
	 * // Override only the year and month
	 * const c = Chronos.with({ year: 2025, month: 12 });
	 */
	with(options: ChronosWithOptions): Chronos;

	/**
	 * * Creates a UTC-based Chronos instance.
	 * If no date is provided, it uses the current date and time.
	 *
	 * **This is the base time, meaning conversion in other timezone will consider UTC time as the base time.**
	 *
	 * @param dateLike Optional input date to base the UTC time on.
	 * If omitted, the current system date/time is used.
	 * @returns A new Chronos instance representing the UTC equivalent of the input.
	 */
	utc(dateLike?: ChronosInput): Chronos;

	/**
	 * * Formats a time-only string into a formatted time string.
	 *
	 * @param time - Time string to be formatted. Supported formats include:
	 * - `HH:mm` → e.g., `'14:50'`
	 * - `HH:mm:ss` → e.g., `'14:50:00'`
	 * - `HH:mm:ss.SSS` → e.g., `'14:50:00.800'`
	 * - `HH:mm+TimeZoneOffset(HH)` → e.g., `'14:50+06'`
	 * - `HH:mm:ss+TimeZoneOffset(HH)` → e.g., `'14:50:00+06'`
	 * - `HH:mm:ss+TimeZoneOffset(HH:mm)` → e.g., `'14:50:00+05:30'`
	 * - `HH:mm:ss.SSS+TimeZoneOffset(HH)` → e.g., `'14:50:00.800+06'`
	 * - `HH:mm:ss.SSS+TimeZoneOffset(HH:mm)` → e.g., `'14:50:00.800+06:30'`
	 *
	 * * *Input will default to today's date and assume local timezone if no offset is provided.*
	 *
	 * @param format - Format string accepted by `formatStrict()` method (`TimeParts`). Default: `hh:mm:ss a` → 02:33:36 pm.
	 * @returns Formatted time string in local (System) time.
	 */
	formatTimePart(time: string, format?: TimeParts): string;

	/**
	 * * Returns ISO date strings for each occurrence of a weekday from today, spanning a relative time range.
	 *
	 * @param day - The weekday to match (e.g., `'Wednesday'`, `'Sunday'`).
	 * @param options - Relative range (e.g., 7 days, 4 weeks) and output format (local with timezone or utc).
	 * @returns Array of ISO date strings in the specified format. Returns empty array if no matches in the time span.
	 *
	 * @example
	 * Chronos.getDatesForDay('Wednesday', { span: 7, unit: 'day' });
	 * //=> [ '2025-05-28T21:16:06.198+06:00', '2025-06-04T21:16:06.198+06:00' ]
	 *
	 * @example
	 * Chronos.getDatesForDay('Wednesday', {
	 *   span: 7,
	 *   unit: 'day',
	 *   format: 'utc'
	 * });
	 * //=> [ '2025-05-28T15:17:10.812Z', '2025-06-04T15:17:10.812Z' ]
	 */
	getDatesForDay(day: WeekDay, options?: RelativeRangeOptions): string[];

	/**
	 * * Returns ISO date strings for each occurrence of a weekday between two fixed dates.
	 *
	 * @param day - The weekday to match (e.g., `'Monday'`, `'Friday'`).
	 * @param options - Absolute date range (e.g. `'2025-06-30'`, ` new Date()`, `new Chronos()` etc.) and output format (local with timezone or utc).
	 * @returns Array of ISO date strings in the specified format. Returns empty array if no matches in the range.
	 *
	 * @example
	 * Chronos.getDatesForDay('Monday', {
	 *   from: '2025-05-28',
	 *   to: '2025-06-30',
	 *   format: 'local'
	 * });
	 * //=> [ '2025-01-06T...', '2025-01-13T...', ... ]
	 */
	getDatesForDay(day: WeekDay, options?: DateRangeOptions): string[];

	/**
	 * * Returns ISO date strings for each occurrence of a weekday.
	 *
	 * @param day - The weekday to match (e.g., `'Wednesday'`, `'Sunday'`).
	 * @param options - Relative range (e.g., 7 days, 4 weeks) or Absolute date range and output format.
	 * @returns Array of ISO date strings in the specified format.
	 */
	getDatesForDay(day: WeekDay, options?: WeekdayOptions): string[];

	/**
	 * * Returns earliest Chronos
	 * @param dates Date inputs.
	 */
	min(...dates: ChronosInput[]): Chronos;

	/**
	 * * Returns latest Chronos
	 * @param dates Date inputs.
	 */
	max(...dates: ChronosInput[]): Chronos;

	/**
	 * * Checks if the year in the date string or year (from 0 - 9999) is a leap year.
	 * - A year is a leap year if it is divisible by 4, but not divisible by 100, unless it is also divisible by 400.
	 * - For example, 2000 and 2400 are leap years, but 1900 and 2100 are not.
	 *
	 * @description
	 * This method accepts different types of date inputs and extracts the year to check if it's a leap year.
	 * If the provided date is a `number`, it will be treated as a year (must be a valid year from 0 to 9999).
	 * If the year is out of this range (negative or larger than 9999), it will be treated as a Unix timestamp.
	 * If the provided date is a string or a `Date` object, it will be parsed and the year will be extracted.
	 * If a `Chronos` instance is passed, the year will be directly accessed from the instance.
	 *
	 * @param date - A `number` (year or Unix timestamp), `string`, `Date`, or `Chronos` instance representing a date.
	 * @returns `true` if the year is a leap year, `false` otherwise.
	 */
	isLeapYear(date: ChronosInput): boolean;

	/**
	 * * Checks if the given value is a valid `Date` object.
	 * - A value is considered valid if it is an instance of the built-in `Date` class.
	 * - This does not check whether the date itself is valid (e.g., `new Date('invalid')`).
	 * @param value - The value to test.
	 * @returns `true` if the value is a valid Date object, otherwise `false`.
	 */
	isValidDate(value: unknown): value is Date;

	/**
	 * * Checks if the given value is a valid date string.
	 * - A value is considered a valid date string if it is a string and can be parsed by `Date.parse()`.
	 * - This uses the native JavaScript date parser internally.
	 * @param value - The value to test.
	 * @returns `true` if the value is a valid date string, otherwise `false`.
	 */
	isDateString(value: unknown): value is string;

	/**
	 * * Checks if the given value is an instance of `Chronos`.
	 * - Useful for verifying Chronos objects in type guards or validations.
	 * @param value - The value to test.
	 * @returns `true` if the value is an instance of `Chronos`, otherwise `false`.
	 */
	isValidChronos(value: unknown): value is Chronos;
}
