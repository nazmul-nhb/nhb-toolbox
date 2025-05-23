import type { Chronos } from './Chronos';
import type {
	DATE_FORMATS,
	DAY_FORMATS,
	HOUR_FORMATS,
	MILLISECOND_FORMATS,
	MINUTE_FORMATS,
	MONTH_FORMATS,
	ORIGIN,
	SECOND_FORMATS,
	TIME_FORMATS,
	TIME_ZONES,
	YEAR_FORMATS,
	ZODIAC_SIGNS,
} from './constants';

/** - Minute in numeric string from `00` to `23` */
export type Hours =
	| '00'
	| '01'
	| '02'
	| '03'
	| '04'
	| '05'
	| '06'
	| '07'
	| '08'
	| '09'
	| '10'
	| '11'
	| '12'
	| '13'
	| '14'
	| '15'
	| '16'
	| '17'
	| '18'
	| '19'
	| '20'
	| '21'
	| '22'
	| '23';

/** - Minute in numeric string from `00` to `59` */
export type Minutes =
	| '00'
	| '01'
	| '02'
	| '03'
	| '04'
	| '05'
	| '06'
	| '07'
	| '08'
	| '09'
	| '10'
	| '11'
	| '12'
	| '13'
	| '14'
	| '15'
	| '16'
	| '17'
	| '18'
	| '19'
	| '20'
	| '21'
	| '22'
	| '23'
	| '24'
	| '25'
	| '26'
	| '27'
	| '28'
	| '29'
	| '30'
	| '31'
	| '32'
	| '33'
	| '34'
	| '35'
	| '36'
	| '37'
	| '38'
	| '39'
	| '40'
	| '41'
	| '42'
	| '43'
	| '44'
	| '45'
	| '46'
	| '47'
	| '48'
	| '49'
	| '50'
	| '51'
	| '52'
	| '53'
	| '54'
	| '55'
	| '56'
	| '57'
	| '58'
	| '59';

/** - Second in numeric string from `00` to `59` */
export type Seconds = Minutes;

/** - Time in "HH:MM" format. */
export type Time = `${Hours}:${Minutes}`;

/** - Configuration options for greeting. */
export interface GreetingConfigs {
	/** Time when the morning period ends (HH:MM format). Defaults to `11:59` */
	morningEnds?: Time;

	/** Time when the noon period ends (HH:MM format). Defaults to `12:59` */
	noonEnds?: Time;

	/** Time when the afternoon period ends (HH:MM format). Defaults to `17:59` */
	afternoonEnds?: Time;

	/** Time when the evening period ends (HH:MM format). Defaults to `23:59` */
	eveningEnds?: Time;

	/** Time when the midnight period ends (HH:MM format). Defaults to `02:59` */
	midnightEnds?: Time;

	/** Current time in "HH:MM" format for some weird reason. Defaults to current time `new Date()` */
	currentTime?: Time;

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
	| TimeFormats;

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
export type StrictFormat =
	| DateParts
	| TimeParts
	| `${DateParts}${DateTimeConnector}${TimeParts}`;

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

/** @internal Helper type to assign instance origin when creating new Chronos instance. */
export type WithoutOrigin = Omit<Chronos, typeof ORIGIN>;

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
	  }[keyof typeof Chronos];

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
		ms?: number,
	): Chronos;

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
	 * @static Formats a time-only string into a formatted time string.
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
export type PositiveUTCHour =
	| '+00'
	| '+01'
	| '+02'
	| '+03'
	| '+04'
	| '+05'
	| '+06'
	| '+07'
	| '+08'
	| '+09'
	| '+10'
	| '+11'
	| '+12'
	| '+13'
	| '+14';

/** Negative UTC hours */
export type NegativeUTCHour =
	| '-00'
	| '-01'
	| '-02'
	| '-03'
	| '-04'
	| '-05'
	| '-06'
	| '-07'
	| '-08'
	| '-09'
	| '-10'
	| '-11'
	| '-12'
	| '-13'
	| '-14';

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
export type DayPartConfig = Record<DayPart, [Hours, Hours]>;

/** Quarters of the year */
export type Quarter = 1 | 2 | 3 | 4;

/** Names of Zodiac signs */
export type ZodiacSign = (typeof ZODIAC_SIGNS)[number][0];
