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
	| 'hour'
	| 'minute'
	| 'second'
	| 'millisecond';

export type Year = (typeof YEAR_FORMATS)[number];
export type Month = (typeof MONTH_FORMATS)[number];
export type Day = (typeof DAY_FORMATS)[number];
export type Date = (typeof DATE_FORMATS)[number];
export type Hour = (typeof HOUR_FORMATS)[number];
export type Minute = (typeof MINUTE_FORMATS)[number];
export type Second = (typeof SECOND_FORMATS)[number];
export type Millisecond = (typeof MILLISECOND_FORMATS)[number];
export type TimeFormats = (typeof TIME_FORMATS)[number];

export type ChronosFormat =
	| Year
	| Month
	| Day
	| Date
	| Hour
	| Minute
	| Second
	| Millisecond
	| TimeFormats;

/** Standard date formats. */
export type DateParts =
	| `${Date} ${Exclude<Month, 'M' | 'MM'>}`
	| `${Exclude<Month, 'M' | 'MM'>} ${Date}`
	| `${Day}, ${Date} ${Exclude<Month, 'M' | 'MM'>}`
	| `${Day}, ${Exclude<Month, 'M' | 'MM'>} ${Date}`
	| `${Exclude<Month, 'M' | 'MM'>} ${Date}, ${Year}`
	| `${Date} ${Exclude<Month, 'M' | 'MM'>}, ${Year}`
	| `${Exclude<Month, 'M' | 'MM'>} ${Date} ${Year}`
	| `${Date} ${Exclude<Month, 'M' | 'MM'>} ${Year}`
	| `${Day}, ${Exclude<Month, 'M' | 'MM'>} ${Date}, ${Year}`
	| `${Day}, ${Date} ${Exclude<Month, 'M' | 'MM'>}, ${Year}`
	| `${Day}, ${Exclude<Month, 'M' | 'MM'>} ${Date} ${Year}`
	| `${Day}, ${Date} ${Exclude<Month, 'M' | 'MM'>} ${Year}`
	| `${Exclude<Date, 'Do'>}.${Exclude<Month, 'mmm' | 'mmmm'>}.${Year}`
	| `${Year}.${Exclude<Month, 'mmm' | 'mmmm'>}.${Exclude<Date, 'Do'>}`
	| `${Exclude<Date, 'Do'>}/${Exclude<Month, 'mmm' | 'mmmm'>}/${Year}`
	| `${Exclude<Date, 'Do'>}-${Exclude<Month, 'mmm' | 'mmmm'>}-${Year}`
	| `${Exclude<Month, 'mmm' | 'mmmm'>}/${Exclude<Date, 'Do'>}/${Year}`
	| `${Exclude<Month, 'mmm' | 'mmmm'>}-${Exclude<Date, 'Do'>}-${Year}`
	| `${Year}-${Exclude<Month, 'mmm' | 'mmmm'>}-${Exclude<Date, 'Do'>}`
	| `${Year}/${Exclude<Month, 'mmm' | 'mmmm'>}/${Exclude<Date, 'Do'>}`
	| `${Year}-${Exclude<Date, 'Do'>}-${Exclude<Month, 'mmm' | 'mmmm'>}`
	| `${Year}/${Exclude<Date, 'Do'>}/${Exclude<Month, 'mmm' | 'mmmm'>}`;

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
}

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

export interface ChronosStatics {
	(date?: number | string | Date | Chronos): Chronos;

	/**
	 * * Returns the current date and time in a specified format in local time.
	 * * Default format is dd, `MMM DD, YYYY HH:mm:ss` = `Sun, Apr 06, 2025 16:11:55:379`
	 * @param options - Configure format string and whether to format using utc offset.
	 * @returns Formatted date string in desired format.
	 */
	today(options?: FormatOptions): string;

	/**
	 * * Returns the number of milliseconds elapsed since midnight, January 1, 1970 Universal Coordinated Time (UTC).
	 * * It basically calls `Date.now()`.
	 * @returns The number of milliseconds elapsed since the Unix epoch.
	 */
	now(): number;

	/**
	 * @public @static Parses a date string with a given format (partial support)
	 *
	 * * **Supported format tokens**:
	 * - `YYYY`: Full year (e.g., 2023)
	 * - `YY`: Two-digit year (e.g., 23 for 2023, 99 for 1999)
	 * - `MM`: Month (01-12)
	 * - `DD`: Day of the month (01-31)
	 * - `HH`: Hour (00-23)
	 * - `mm`: Minute (00-59)
	 * - `ss`: Second (00-59)
	 *
	 * **Example**:
	 * ```ts
	 * Chronos.parse('23-12-31 15:30:45', 'YY-MM-DD HH:mm:ss');
	 * // returns Chronos instance with the parsed date 2023-12-31T15:30:45
	 * ```
	 *
	 * @param {string} dateStr - The date string to be parsed
	 * @param {string} format - The format of the date string. Tokens like `YYYY`, `MM`, `DD`, `HH`, `mm`, `ss` are used to specify the structure.
	 * @returns {Chronos} - A new `Chronos` instance representing the parsed date.
	 * @throws {Error} - If the date string does not match the format.
	 */
	parse(dateStr: string, format: string): Chronos;

	/**
	 * * Creates UTC Chronos
	 * @param dateLike Date input to create utc time.
	 */
	utc(dateLike: number | string | Date | Chronos): Chronos;

	/**
	 * * Returns earliest Chronos
	 * @param dates Date inputs.
	 */
	min(...dates: (number | string | Date | Chronos)[]): Chronos;

	/**
	 * * Returns latest Chronos
	 * @param dates Date inputs.
	 */
	max(...dates: (number | string | Date | Chronos)[]): Chronos;

	/**
	 * * Checks if the year in the date string is a leap year.
	 * - A year is a leap year if it is divisible by 4, but not divisible by 100, unless it is also divisible by 400.
	 * - For example, 2000 and 2400 are leap years, but 1900 and 2100 are not.
	 * @returns `true` if the year is a leap year, `false` otherwise.
	 */
	isLeapYear(date: number | string | Date | Chronos): boolean;

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

export type TimeZone = keyof typeof TIME_ZONES;

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

export type UTCMinute = '00' | '15' | '30' | '45';

export type UTCOffSet = `UTC${PositiveUTCHour | NegativeUTCHour}:${UTCMinute}`;

/** * Format options */
export interface FormatOptions {
	/** - The desired format (Default format is dd, `MMM DD, YYYY HH:mm:ss` = `Sun, Apr 06, 2025 16:11:55:379`). */
	format?: string;
	/** - Whether to use UTC time. Defaults to `false`. */
	useUTC?: boolean;
}
