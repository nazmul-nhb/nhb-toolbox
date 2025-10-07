import type { Enumerate, NumberRange } from '../number/types';
import type { LooseLiteral, RangeTuple } from '../utils/types';
import type { Chronos } from './Chronos';
import type { ChronosStatics } from './chronos-statics';
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

// ! Re-export `ChronosStatics`
export type { ChronosStatics };

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
	/** Full year (e.g., 2025). */
	year: number;
	/** Month index starting from 0 (January = 0). */
	month: Enumerate<12>;
	/** ISO month number starting from 1 (January = 1). */
	isoMonth: NumberRange<1, 12>;
	/** Day of the month (1–31). */
	date: NumberRange<1, 31>;
	/** Day of the week index (0–6, Sunday = 0). */
	weekDay: Enumerate<7>;
	/** ISO day of the week number (1–7, Monday = 1). */
	isoWeekDay: NumberRange<1, 7>;
	/** Hour of the day (0–23). */
	hour: Enumerate<24>;
	/** Minute of the hour (0–59). */
	minute: Enumerate<60>;
	/** Second of the minute (0–59). */
	second: Enumerate<60>;
	/** Milliseconds within the second. */
	millisecond: Milliseconds;
	/** Timestamp in milliseconds since the Unix epoch. */
	timestamp: number;
	/** Unix timestamp in seconds since the epoch. */
	unix: number;
}

/** Return object type of `duration` method of `Chronos`. */
export interface TimeDuration {
	/** Total number of years. */
	years: number;
	/** Number of months remaining after full years are counted. */
	months: number;
	/** Number of days remaining after full months are counted. */
	days: number;
	/** Number of hours remaining after full days are counted. */
	hours: number;
	/** Number of minutes remaining after full hours are counted. */
	minutes: number;
	/** Number of seconds remaining after full minutes are counted. */
	seconds: number;
	/** Number of milliseconds remaining after full seconds are counted. */
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
	withOrigin(instance: Chronos, method: ChronosMethods, label?: UTCOffSet): Chronos;

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

/** Alias for `typeof Chronos` */
export type $Chronos = typeof Chronos;

/** * Instance methods that return `Chronos` instance */
export type $InstanceMethods = {
	[Method in keyof WithoutOrigin]: Chronos extends {
		[Instance in Method]: (...args: any[]) => Chronos;
	} ?
		Method
	:	never;
}[keyof WithoutOrigin];

/** * Static methods that return `Chronos` instance */
export type $StaticMethods = {
	[Method in keyof $Chronos]: $Chronos extends {
		[Instance in Method]: (...args: any[]) => Chronos;
	} ?
		Method
	:	never;
}[keyof $Chronos];

/** * Plugin methods that return `Chronos` instance */
export type $PluginMethods = LooseLiteral<'timeZone'>;

/** Methods (both instance and static) in `Chronos` class that return `Chronos` instance. */
export type ChronosMethods = $InstanceMethods | $StaticMethods | $PluginMethods;

/**
 * * Accepted Input type for `Chronos`
 *
 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC
 * and convert it to the **equivalent local time** using the current environment's UTC offset.*
 *
 */
export type ChronosInput = number | string | Date | Chronos;

/** Represents key of `ChronosStatics` (each static method and property) */
export type ChronosStaticKey = keyof ChronosStatics;

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
export type DayPart = 'night' | 'midnight' | 'lateNight' | 'morning' | 'afternoon' | 'evening';

/** Object type for extracting day parts. */
export type DayPartConfig = Record<DayPart, [ClockHour, ClockHour]>;

/** Quarters of the year */
export type Quarter = 1 | 2 | 3 | 4;

/** Academic year, e.g. `2024-2025` */
export type AcademicYear = `${number}-${number}`;

/** Names of Zodiac signs */
export type ZodiacSign = (typeof WESTERN_ZODIAC_SIGNS)[number][0];

/** Presets for Zodiac Sign Configuration */
export type ZodiacPreset = keyof typeof ZODIAC_PRESETS;

/** Shape of Zodiac signs array */
export type ZodiacArray = Array<[ZodiacSign, [NumberRange<1, 12>, NumberRange<1, 31>]]>;

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
export type Milliseconds = Enumerate<999> | 999;

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
export type ChronosPlugin = (ChronosClass: $Chronos) => void;

export interface $BusinessHourBaseOptions {
	/** - Optional starting hour of business time (0–23). Defaults to `9` (9 AM). */
	businessStartHour?: Enumerate<24>;
	/** - Optional ending hour of business time (0–23). Defaults to `17` (5 PM). */
	businessEndHour?: Enumerate<24>;
}

/** Options for configuring business hour with `weekStartsOn` and `weekendLength` */
export interface BusinessOptionsBasic extends $BusinessHourBaseOptions {
	/** - Optional day the week starts on (0–6). Default is `0` (Sunday). */
	weekStartsOn?: Enumerate<7> | undefined;
	/** - Optional weekend length (1-4). Default is `2`.*/
	weekendLength?: NumberRange<1, 4> | undefined;
}

/** Options for configuring business hour with `weekendDays` tuple */
export interface BusinessOptionsWeekends extends $BusinessHourBaseOptions {
	/** - Tuple of indices (0-6) of weekend days. Can pass only 1-4 elements. Default is `undefined`. */
	weekendDays?: RangeTuple<Enumerate<7>, 1, 4> | undefined;
}

/** Options for configuring business hour */
export type $BusinessHourOptions = BusinessOptionsBasic | BusinessOptionsWeekends;

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

/**
 * * Options for `Chronos` _static_ method `with()`
 *
 * @remarks Should provide at least one property.
 */
export type ChronosWithOptions = Partial<{
	/** The full year (e.g., 2025). Years 0–99 are interpreted as 1900–1999. */
	year: number;
	/** Month number from 1 (January) to 12 (December). */
	month: NumberRange<1, 12>;
	/** Day of the month, from 1 to 31. */
	date: NumberRange<1, 31>;
	/** Hour of the day, from 0 (midnight) to 23 (11 PM). */
	hour: Enumerate<24>;
	/** Minutes of the hour, from 0 to 59. */
	minute: Enumerate<60>;
	/** Seconds of the minute, from 0 to 59. */
	second: Enumerate<60>;
	/** Milliseconds of the second, from 0 to 999. */
	millisecond: Milliseconds;
}>;
