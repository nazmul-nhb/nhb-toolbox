import type { Enumerate, NumberRange } from '../number/types';
import type { LooseLiteral } from '../utils/types';
import type { Chronos } from './Chronos';
import type {
	DATE_FORMATS,
	DAY_FORMATS,
	DAYS,
	HOUR_FORMATS,
	MILLISECOND_FORMATS,
	MINUTE_FORMATS,
	MONTH_FORMATS,
	MONTHS,
	SECOND_FORMATS,
	TIME_FORMATS,
	TIME_ZONES,
	WESTERN_ZODIAC_SIGNS,
	YEAR_FORMATS,
	ZODIAC_PRESETS,
} from './constants';
import type { SEASON_PRESETS } from './seasons';

/** - Minute in numeric string from `00` to `23` */
export type ClockHour = `0${Enumerate<10>}` | `${NumberRange<10, 23>}`;

/** - Minute in numeric string from `00` to `59` */
export type ClockMinute = `0${Enumerate<10>}` | `${NumberRange<10, 59>}`;

/** - Second in numeric string from `00` to `59` */
export type ClockSecond = `0${Enumerate<10>}` | `${NumberRange<10, 59>}`;

/** - Time in "HH:MM" format. */
export type ClockTime = `${ClockHour}:${ClockMinute}`;

/** Normal time in `H:m`m format which does not follow the strict limit up to 23 hours, hour can be any number and minute can be numeric string from `00` to `59` */
export type HourMinutes = `${number}:${ClockMinute}`;

/** - Configuration options for greeting. */
export interface GreetingConfigs {
	/** Time when the morning period ends (HH:MM format). Defaults to `11:59` */
	morningEnds?: ClockTime;

	/** Time when the noon period ends (HH:MM format). Defaults to `12:59` */
	noonEnds?: ClockTime;

	/** Time when the afternoon period ends (HH:MM format). Defaults to `17:59` */
	afternoonEnds?: ClockTime;

	/** Time when the evening period ends (HH:MM format). Defaults to `23:59` */
	eveningEnds?: ClockTime;

	/** Time when the midnight period ends (HH:MM format). Defaults to `02:59` */
	midnightEnds?: ClockTime;

	/** Current time in "HH:MM" format for some weird reason. Defaults to current time `new Date()` */
	currentTime?: ClockTime;

	/** Optional string to append after each message */
	appendToMsg?: string;

	/** Optional string to prepend before each message */
	prependToMsg?: string;

	/** Custom greeting message for the morning period. */
	morningMessage?: string;

	/** Custom greeting message for the noon period. */
	noonMessage?: string;

	/** Custom greeting message for the afternoon period. */
	afternoonMessage?: string;

	/** Custom greeting message for the evening period. */
	eveningMessage?: string;

	/** Custom greeting message for the midnight period. */
	midnightMessage?: string;

	/** Default greeting message if no period matches. */
	defaultMessage?: string;
}

export type TimeUnit =
	| 'year'
	| 'month'
	| 'day'
	| 'week'
	| 'hour'
	| 'minute'
	| 'second'
	| 'millisecond';

/** Year in either 4 or 2 digits format */
export type Year = (typeof YEAR_FORMATS)[number];
/** Month in either 1 or 2 digits or 3 letters or full word format */
export type Month = (typeof MONTH_FORMATS)[number];
/** Day in either 2 letters or full word format */
export type Day = (typeof DAY_FORMATS)[number];
/** Date in either 1 or 2 digits format */
export type MonthDate = (typeof DATE_FORMATS)[number];
/** Second in either 1 or 2 digits format */
export type Hour = (typeof HOUR_FORMATS)[number];
/** Second in either 1 or 2 digits format */
export type Minute = (typeof MINUTE_FORMATS)[number];
/** Second in either 1 or 2 digits format */
export type Second = (typeof SECOND_FORMATS)[number];
/** Millisecond in either 1 or 2 digits format */
export type Millisecond = (typeof MILLISECOND_FORMATS)[number];
/** Time formats in either capital or lowercase `am/pm` format */
export type TimeFormats = (typeof TIME_FORMATS)[number];

/** Standard union formats for `Chronos`. */
export type ChronosFormat =
	| Year
	| Month
	| Day
	| MonthDate
	| Hour
	| Minute
	| Second
	| Millisecond
	| TimeFormats
	| 'ZZ';

/** Standard date formats. */
export type DateParts =
	| `${MonthDate} ${Exclude<Month, 'M' | 'MM'>}`
	| `${Exclude<Month, 'M' | 'MM'>} ${MonthDate}`
	| `${Day}, ${MonthDate} ${Exclude<Month, 'M' | 'MM'>}`
	| `${Day}, ${Exclude<Month, 'M' | 'MM'>} ${MonthDate}`
	| `${Exclude<Month, 'M' | 'MM'>} ${MonthDate}, ${Year}`
	| `${MonthDate} ${Exclude<Month, 'M' | 'MM'>}, ${Year}`
	| `${Exclude<Month, 'M' | 'MM'>} ${MonthDate} ${Year}`
	| `${MonthDate} ${Exclude<Month, 'M' | 'MM'>} ${Year}`
	| `${Day}, ${Exclude<Month, 'M' | 'MM'>} ${MonthDate}, ${Year}`
	| `${Day}, ${MonthDate} ${Exclude<Month, 'M' | 'MM'>}, ${Year}`
	| `${Day}, ${Exclude<Month, 'M' | 'MM'>} ${MonthDate} ${Year}`
	| `${Day}, ${MonthDate} ${Exclude<Month, 'M' | 'MM'>} ${Year}`
	| `${Exclude<MonthDate, 'Do'>}.${Exclude<Month, 'mmm' | 'mmmm'>}.${Year}`
	| `${Year}.${Exclude<Month, 'mmm' | 'mmmm'>}.${Exclude<MonthDate, 'Do'>}`
	| `${Exclude<MonthDate, 'Do'>}/${Exclude<Month, 'mmm' | 'mmmm'>}/${Year}`
	| `${Exclude<MonthDate, 'Do'>}-${Exclude<Month, 'mmm' | 'mmmm'>}-${Year}`
	| `${Exclude<Month, 'mmm' | 'mmmm'>}/${Exclude<MonthDate, 'Do'>}/${Year}`
	| `${Exclude<Month, 'mmm' | 'mmmm'>}-${Exclude<MonthDate, 'Do'>}-${Year}`
	| `${Year}-${Exclude<Month, 'mmm' | 'mmmm'>}-${Exclude<MonthDate, 'Do'>}`
	| `${Year}/${Exclude<Month, 'mmm' | 'mmmm'>}/${Exclude<MonthDate, 'Do'>}`
	| `${Year}-${Exclude<MonthDate, 'Do'>}-${Exclude<Month, 'mmm' | 'mmmm'>}`
	| `${Year}/${Exclude<MonthDate, 'Do'>}/${Exclude<Month, 'mmm' | 'mmmm'>}`;

/** Standard Time Formats */
export type TimeParts =
	| `${Exclude<Hour, 'h' | 'hh' | 'H'>}:${Exclude<Minute, 'm'>}`
	| `${Exclude<Hour, 'H' | 'HH' | 'h'>}:${Exclude<Minute, 'm'>} ${TimeFormats}`
	| `${Exclude<Hour, 'h' | 'hh' | 'H'>}:${Exclude<Minute, 'm'>}:${Exclude<Second, 's'>}`
	| `${Exclude<Hour, 'H' | 'HH' | 'h'>}:${Exclude<Minute, 'm'>}:${Exclude<Second, 's'>} ${TimeFormats}`
	| `${Exclude<Hour, 'h' | 'hh' | 'H'>}:${Exclude<Minute, 'm'>}:${Exclude<Second, 's'>}:${Exclude<Millisecond, 'ms'>}`
	| `${Exclude<Hour, 'H' | 'HH' | 'h'>}:${Exclude<Minute, 'm'>}:${Exclude<Second, 's'>}:${Exclude<Millisecond, 'ms'>} ${TimeFormats}`;

type DateTimeConnector = ' ' | ', ' | '; ' | ' - ';

/** Strict pre-defined types for formatting date and time. */
export type StrictFormat = LooseLiteral<
	DateParts | TimeParts | `${DateParts}${DateTimeConnector}${TimeParts}`
>;

/** Iterable `Chronos` object properties */
export interface ChronosObject {
	year: number;
	month: number;
	isoMonth: number;
	date: number;
	weekDay: number;
	isoWeekDay: number;
	hour: number;
	minute: number;
	second: number;
	millisecond: number;
	timestamp: number;
	unix: number;
}

/** Return object type of `duration` method of `Chronos`. */
export interface TimeDuration {
	years: number;
	months: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	milliseconds: number;
}

/** Interface for accessing internal private properties in extended `Chronos` class */
export interface ChronosInternals {
	/**
	 * * Access to `#withOrigin` private method
	 * * Creates a new Chronos instance with origin tracking
	 * @param instance - Chronos instance to operate on
	 * @param method - Name of the method creating this instance
	 * @param label - Optional UTC offset label
	 * @returns A new Chronos instance
	 */
	withOrigin(
		instance: Chronos,
		method: ChronosMethods,
		label?: UTCOffSet
	): Chronos;

	/**
	 * * Access to `#toNewDate` private method
	 * * Creates a new `Date` object from a Chronos input
	 * @param instance - Chronos instance to operate on
	 * @param value - Input value to convert (optional, uses current date if omitted)
	 * @returns A new JavaScript `Date` object
	 */
	toNewDate(instance: Chronos, value?: ChronosInput): Date;

	/**
	 * * Gets the internal `#date`, a readonly private property (core `Date` object)
	 * @param instance - Chronos instance to access
	 * @returns The core internal `Date` object
	 */
	internalDate(instance: Chronos): Date;

	/**
	 * * Gets current UTC Offset internally stored as `#offset` private property
	 * @param instance - Chronos instance to access
	 * @returns The stored formatted UTC offset
	 */
	offset(instance: Chronos): UTCOffSet;
}

/** @internal Helper type to assign instance origin when creating new Chronos instance. */
export type WithoutOrigin = Omit<Chronos, '#ORIGIN' | 'origin'>;

type PluginMethods = 'timeZone';

/** Methods (both instance and static) in `Chronos` class that return `Chronos` instance. */
export type ChronosMethods =
	| {
			// Instance methods that return `Chronos`
			[K in keyof WithoutOrigin]: Chronos extends {
				[key in K]: (...args: any[]) => Chronos;
			} ?
				K
			:	never;
	  }[keyof WithoutOrigin]
	| {
			// Static methods that return `Chronos`
			[K in keyof typeof Chronos]: typeof Chronos extends {
				[key in K]: (...args: any[]) => Chronos;
			} ?
				K
			:	never;
	  }[keyof typeof Chronos]
	| PluginMethods;

/**
 * * Accepted Input type for `Chronos`
 *
 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC
 * and convert it to the **equivalent local time** using the current environment's UTC offset.*
 *
 */
export type ChronosInput = number | string | Date | Chronos;

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
	 * @param year The full year designation is required for cross-century date accuracy. If year is between 0 and 99 is used, then year is assumed to be 1900 + year.
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
	 * - **NOTE:** *Once a plugin is injected, all the registered methods for that plugin will be available for the whole project.*
	 * - See full list of plugins and the methods they register {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/plugins#-official-plugins here}.
	 */
	use(plugin: ChronosPlugin): void;

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

/** Names of time-zones */
export type TimeZone = keyof typeof TIME_ZONES;

/** Positive UTC hours */
export type PositiveUTCHour = `+0${Enumerate<10>}` | `+${NumberRange<10, 14>}`;

/** Negative UTC hours */
export type NegativeUTCHour = `-0${Enumerate<10>}` | `-${NumberRange<10, 14>}`;

/** UTC Minutes as quarters */
export type UTCMinute = '00' | '15' | '30' | '45';

/** UTC offset as `UTC-HH:MM` format */
export type UTCOffSet = `UTC${PositiveUTCHour | NegativeUTCHour}:${UTCMinute}`;

/** Chronos Date Format options */
export interface FormatOptions {
	/** - The desired format (Default format is dd, `MMM DD, YYYY HH:mm:ss` = `Sun, Apr 06, 2025 16:11:55). */
	format?: string;
	/** - Whether to use UTC time. Defaults to `false`. */
	useUTC?: boolean;
}

/** Definition of day part names. */
export type DayPart =
	| 'night'
	| 'midnight'
	| 'lateNight'
	| 'morning'
	| 'afternoon'
	| 'evening';

/** Object type for extracting day parts. */
export type DayPartConfig = Record<DayPart, [ClockHour, ClockHour]>;

/** Quarters of the year */
export type Quarter = 1 | 2 | 3 | 4;

/** Names of Zodiac signs */
export type ZodiacSign = (typeof WESTERN_ZODIAC_SIGNS)[number][0];

/** Presets for Zodiac Sign Configuration */
export type ZodiacPreset = keyof typeof ZODIAC_PRESETS;

/** Shape of Zodiac signs array */
export type ZodiacArray = Array<
	[ZodiacSign, [NumberRange<1, 12>, NumberRange<1, 31>]]
>;

/** Options for configuring Zodiac sign getter */
export interface ZodiacOptions {
	/** - Optional birthdate in `MM-DD` format (1-based month). */
	birthDate?: MonthDateString;
	/** Optional Zodiac preset to use. Default is `western`. `western` and `tropical`, `vedic` and `sidereal` are same. */
	preset?: ZodiacPreset;
	/** Custom Zodiac date ranges. */
	custom?: ZodiacArray;
}

/** - Represents the full name of a weekday, e.g., 'Monday', 'Tuesday' etc. */
export type WeekDay = (typeof DAYS)[number];

/** - Represents the full name of a month, e.g., 'January', 'February' etc. */
export type MonthName = (typeof MONTHS)[number];

/** - Options to define a **fixed date range** using explicit `from` and `to` dates. */
export interface DateRangeOptions {
	/** - Start date of the range (inclusive). Defaults to **now** if not provided. */
	from?: ChronosInput;

	/** - End date of the range (inclusive). Defaults to **4 weeks from now** if not provided. */
	to?: ChronosInput;

	/** - Output format: return ISO strings in `'local'` or `'utc'` format. Defaults to `'local'`. */
	format?: 'local' | 'utc';

	/** Whether to round the dates in the range to the start of the day. Default is `false`. */
	roundDate?: boolean;
}

/** - Options to define a **relative date range** starting from the current date. */
export interface RelativeRangeOptions {
	/** - Number of time units forward from now. Defaults to `4`.  Controlled by the `unit` option. */
	span?: number;

	/** - Unit of time to advance the date range. Defaults to `'week'`.  Controlled by the `span` option. */
	unit?: 'year' | 'month' | 'week' | 'day';

	/** - Output format — return as local ISO string or UTC ISO string. Defaults to `'local'`. */
	format?: 'local' | 'utc';

	/** Whether to round the dates in the range to the start of the day. Default is `false`. */
	roundDate?: boolean;
}

/** - Unified type that supports either a fixed or relative date range configuration. */
export type WeekdayOptions = RelativeRangeOptions | DateRangeOptions;

/** - Options to define a **fixed date range** using explicit `from` and `to` dates. */
export interface RangeWithDates {
	/** - Start date of the range (inclusive). Defaults to **now** if not provided. */
	from?: ChronosInput;

	/** - End date of the range (inclusive). Defaults to **4 weeks from now** if not provided. */
	to?: ChronosInput;

	/** - Output format: return ISO strings in `'local'` or `'utc'` format. Defaults to `'local'`. */
	format?: 'local' | 'utc';

	/**
	 * An array of weekdays to exclude from the date range.
	 * - Accepts either weekday names (e.g., `'Saturday'`, `'Sunday'`) or numeric indices (0 for Sunday to 6 for Saturday).
	 * - Ignored if `onlyDays` is provided.
	 *
	 * @example
	 * skipDays: ['Saturday', 'Sunday']
	 * skipDays: [0, 6] // Sunday and Saturday
	 */
	skipDays?: Array<WeekDay> | Array<Enumerate<7>>;

	/**
	 * An array of weekdays to explicitly include in the date range.
	 * - Accepts either weekday names (e.g., `'Monday'`, `'Wednesday'`) or numeric indices (0 for Sunday to 6 for Saturday).
	 * - When provided, this overrides `skipDays` and includes only the specified days.
	 *
	 * @example
	 * onlyDays: ['Monday', 'Wednesday']
	 * onlyDays: [1, 3] // Monday and Wednesday
	 */
	onlyDays?: Array<WeekDay> | Array<Enumerate<7>>;

	/** Whether to round the dates in the range to the start of the day. Default is `false`. */
	roundDate?: boolean;
}

/** - Options to define a **relative date range** starting from the current date. */
export interface RelativeDateRange {
	/** - Number of time units forward from now. Defaults to `4`.  Controlled by the `unit` option. */
	span?: number;

	/** - Unit of time to advance the date range. Defaults to `'week'`.  Controlled by the `span` option. */
	unit?: 'year' | 'month' | 'week' | 'day';

	/** - Output format — return as local ISO string or UTC ISO string. Defaults to `'local'`. */
	format?: 'local' | 'utc';

	/**
	 * An array of weekdays to exclude from the date range.
	 * - Accepts either weekday names (e.g., `'Saturday'`, `'Sunday'`) or numeric indices (0 for Sunday to 6 for Saturday).
	 * - Ignored if `onlyDays` is provided.
	 *
	 * @example
	 * skipDays: ['Saturday', 'Sunday']
	 * skipDays: [0, 6] // Sunday and Saturday
	 */
	skipDays?: Array<WeekDay> | Array<Enumerate<7>>;

	/**
	 * An array of weekdays to explicitly include in the date range.
	 * - Accepts either weekday names (e.g., `'Monday'`, `'Wednesday'`) or numeric indices (0 for Sunday to 6 for Saturday).
	 * - When provided, this overrides `skipDays` and includes only the specified days.
	 *
	 * @example
	 * onlyDays: ['Monday', 'Wednesday']
	 * onlyDays: [1, 3] // Monday and Wednesday
	 */
	onlyDays?: Array<WeekDay> | Array<Enumerate<7>>;

	/** Whether to round the dates in the range to the start of the day. Default is `false`. */
	roundDate?: boolean;
}

/** - Unified type that supports either a fixed or relative date range configuration. */
export type DatesInRangeOptions = RangeWithDates | RelativeDateRange;

/** Millisecond from `0-999` */
export type MilliSecond = Enumerate<999> | 999;

/** Date of the month as `0` padded numeric string e.g. `01`, `18` */
export type DateString = `0${NumberRange<1, 9>}` | `${NumberRange<10, 31>}`;

/** Month as `0` padded numeric string, e.g. `02`, `01` etc. */
export type MonthString = `0${NumberRange<1, 9>}` | `${NumberRange<10, 12>}`;

/** Date and month in `MM-DD` format, e.g. `01-12` means 'January 18' */
export type MonthDateString = Exclude<
	`${MonthString}-${DateString}`,
	'02-30' | '02-31' | '04-31' | '06-31' | '09-31' | '11-31'
>;

// ! ======== SEASON CONFIG TYPES ======== //

/** ISO date-based range (format: `MM-DD`) e.g. `01-14` for 'January 14' */
export type DateBoundary = {
	/** Start date in `MM-DD` format, e.g. `01-18` means 'January 18' */
	startDate: MonthDateString;
	/** End date in `MM-DD` format, e.g. `03-17` means 'March 17' */
	endDate: MonthDateString;
};

/** Inclusive month index-based range `0-11` (0 = January) */
export type MonthBoundary = {
	startMonth: Enumerate<12>;
	endMonth: Enumerate<12>;
};

/** Season definition for season configuration */
export interface SeasonDefinition {
	/** Name of the season */
	name: string;
	/** Inclusive date/month boundary of the season */
	boundary: MonthBoundary | DateBoundary;
}

/** Name of a predefined season preset */
export type SeasonPreset = keyof typeof SEASON_PRESETS;

/** Options for configuring seasons */
export interface SeasonOptions {
	/** Custom season list to override or define seasons manually */
	seasons?: SeasonDefinition[];
	/** Predefined preset to use for season calculation */
	preset?: SeasonPreset;
}

// ! ======= SEASON CONFIG TYPES END ======== //

/** * A plugin that augments the Chronos class with methods or properties. */
export type ChronosPlugin = (ChronosClass: typeof Chronos) => void;

/** Options for configuring business hour */
export interface BusinessHourOptions {
	/** - Optional starting hour of business time (0–23). Defaults to `9` (9 AM). */
	businessStartHour?: Enumerate<24>;
	/** - Optional ending hour of business time (0–23). Defaults to `17` (5 PM). */
	businessEndHour?: Enumerate<24>;
	/** - Optional day the week starts on (0–6). Default is `0` (Sunday). */
	weekStartsOn?: Enumerate<7>;
	/** - Optional weekend length (1 or 2). Default is `2`.*/
	weekendLength?: 1 | 2;
}

/** Interface representing a date-like object. */
export interface DateLike {
	toJSON?(): string;
	toISOString?(): string;
	toString?(): string;

	// Moment/Dayjs/Chronos
	format?(): string;

	// Luxon
	toISO?(): string;
	toFormat?(format: string): string;

	// JS-Joda
	plus?(...args: unknown[]): unknown;
	minus?(...args: unknown[]): unknown;
	equals?(...args: unknown[]): boolean;
	getClass?(): unknown;

	// For Temporal or unknown types
	constructor?: {
		name: string;
	};
}
