import { isValidArray } from '../guards/non-primitives';
import { isString } from '../guards/primitives';
import type { Enumerate, LocaleCode, NumberRange } from '../number/types';
import { getOrdinal, roundToNearest } from '../number/utilities';
import type { LooseLiteral, TupleOf } from '../utils/types';
import { DAYS, INTERNALS, MONTHS, SORTED_TIME_FORMATS, TIME_ZONE_LABELS } from './constants';
import { isLeapYear } from './guards';
import type {
	$UTCOffset,
	ChronosFormat,
	ChronosInput,
	ChronosInternals,
	ChronosMethods,
	ChronosObject,
	ChronosPlugin,
	ChronosWithOptions,
	DateRangeOptions,
	DatesInRangeOptions,
	FormatOptions,
	Milliseconds,
	MonthName,
	Quarter,
	RangeWithDates,
	RelativeDateRange,
	RelativeRangeOptions,
	StrictFormat,
	TimeDuration,
	TimeParts,
	TimeUnit,
	UTCOffSet,
	WeekDay,
	WeekdayOptions,
} from './types';
import { extractMinutesFromUTC } from './utils';

/**
 * * Creates a new immutable `Chronos` instance.
 *
 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC
 * and convert it to the **equivalent local time** using the current environment's UTC offset.*
 *
 * @param value - A date value (`number`, `string`, `Date`, or `Chronos` object).
 * - If a string is provided, it should be in a format that can be parsed by the Date constructor.
 * - If a number is provided, it should be a timestamp (milliseconds since the Unix epoch).
 * - If a Date object is provided, it will be used as is.
 * - If a Chronos object is provided, it will be converted to a Date object.
 *
 * **It also accepts number values as following:**
 * - **`year, month, date, hours, minutes, seconds, milliseconds`**: Individual components of a date-time to construct a `Chronos` instance.
 *   - **`year`**: A number representing the year. If the year is between 0 and 99, it will be assumed to be the year 1900 + the provided year.
 *   - **`month`**: A number between 1 and 12 representing the month (1 for January, 12 for December). It is adjusted internally to a 0-based index (0 for January, 11 for December).
 *   - **`date`**: A number between 1 and 31 representing the day of the month.
 *   - **`hours`**: A number between 0 and 23 representing the hour of the day.
 *   - **`minutes`**: A number between 0 and 59 representing the minutes past the hour.
 *   - **`seconds`**: A number between 0 and 59 representing the seconds past the minute.
 *   - **`milliseconds`**: A number between 0 and 999 representing the milliseconds past the second.
 *
 * @returns Instance of `Chronos` with all methods and properties.
 */
export class Chronos {
	readonly #date: Date;
	#offset: UTCOffSet;
	#ORIGIN: ChronosMethods | 'root';

	static #plugins = new Set<ChronosPlugin>();

	/** Use `readonly and/or private` methods outside `Chronos`. Purpose: Plugin creation. */
	protected static [INTERNALS]: ChronosInternals = {
		internalDate(instance) {
			return instance.#date;
		},

		offset(instance) {
			return instance.#offset;
		},

		withOrigin(instance, method, label) {
			return instance.#withOrigin(method, label);
		},

		toNewDate(instance, value) {
			return instance.#toNewDate(value);
		},
	};

	/**
	 * * Chronos date/time in Native JS `Date` format.
	 *
	 * - **NOTE**: It is **HIGHLY** advised *not to rely* on this public property to access native JS `Date`. It's not reliable when timezone and/or UTC related operations are performed. If you really need to use native `Date`, use `toDate` method.  THis property is purely for developer convenience and sugar.
	 */
	native: Date;

	/** Origin of the `Chronos` instance (Method that created `new Chronos`), useful fo tracking instance. */
	origin: ChronosMethods | 'root';

	/**
	 * * Creates a new immutable `Chronos` instance.
	 *
	 * Accepts no arguments (defaults to now).
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	constructor();

	/**
	 * * Creates a new immutable `Chronos` instance.
	 *
	 * @param value - A date value in `number`, it should be a timestamp (milliseconds since the Unix epoch).
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	constructor(value: number);

	/**
	 * * Creates a new immutable `Chronos` instance.
	 *
	 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC
	 * and convert it to the **equivalent local time** using the current environment's UTC offset.*
	 *
	 * @param value - A date value in `string`, it should be in a format that can be parsed by the `Date` constructor.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	constructor(value: string);

	/**
	 * * Creates a new immutable `Chronos` instance.
	 *
	 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC
	 * and convert it to the **equivalent local time** using the current environment's UTC offset.*
	 *
	 * @param value - A date value as `Date` object, it will be used as is.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	constructor(value: Date);

	/**
	 * * Creates a new immutable `Chronos` instance.
	 *
	 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC
	 * and convert it to the **equivalent local time** using the current environment's UTC offset.*
	 *
	 * @param value - A date value as `Chronos` object.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	constructor(value: Chronos);

	/**
	 * * Creates a new immutable `Chronos` instance.
	 *
	 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC
	 * and convert it to the **equivalent local time** using the current environment's UTC offset.*
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
	constructor(
		year: number,
		month: number,
		date?: number,
		hours?: number,
		minutes?: number,
		seconds?: number,
		ms?: number
	);

	/**
	 * * Creates a new immutable `Chronos` instance.
	 *
	 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC
	 * and convert it to the **equivalent local time** using the current environment's UTC offset.*
	 *
	 * @param value - A date value (`number`, `string`, `Date`, or `Chronos` object).
	 * - If a string is provided, it should be in a format that can be parsed by the `Date` constructor.
	 * - If a number is provided, it should be a timestamp (milliseconds since the Unix epoch).
	 * - If a Date object is provided, it will be used as is.
	 * - If a Chronos object is provided, it will be used directly.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	constructor(value?: ChronosInput);

	/**
	 * * Creates a new immutable `Chronos` instance.
	 *
	 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC
	 * and convert it to the **equivalent local time** using the current environment's UTC offset.*
	 *
	 * @param valueOrYear The value in number, string, Date or Chronos format or the full year designation is required for cross-century date accuracy. If year is between 0 and 99, year is assumed to be 1900 + year.
	 * @param month The month as a number between 1 and 12 (January to December).
	 * @param date The date as a number between 1 and 31.
	 * @param hours Must be supplied if minutes is supplied. A number from 0 to 23 (midnight to 11pm) that specifies the hour.
	 * @param minutes Must be supplied if seconds is supplied. A number from 0 to 59 that specifies the minutes.
	 * @param seconds Must be supplied if milliseconds is supplied. A number from 0 to 59 that specifies the seconds.
	 * @param ms A number from 0 to 999 that specifies the milliseconds.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	constructor(
		valueOrYear?: ChronosInput,
		month?: number,
		date?: number,
		hours?: number,
		minutes?: number,
		seconds?: number,
		ms?: number
	) {
		if (typeof valueOrYear === 'number' && typeof month === 'number') {
			this.#date = new Date(
				valueOrYear,
				month - 1,
				date ?? 1,
				hours ?? 0,
				minutes ?? 0,
				seconds ?? 0,
				ms ?? 0
			);
			this.native = this.#date;
		} else {
			this.#date = this.#toNewDate(valueOrYear);
			this.native = this.#date;
		}

		this.#ORIGIN = 'root';
		this.origin = this.#ORIGIN;
		this.#offset = `UTC${this.getUTCOffset()}`;
	}

	*[Symbol.iterator](): IterableIterator<[string, number]> {
		yield ['year', this.year];
		yield ['month', this.month];
		yield ['isoMonth', this.isoMonth];
		yield ['date', this.date];
		yield ['weekDay', this.weekDay];
		yield ['isoWeekDay', this.isoWeekDay];
		yield ['hour', this.hour];
		yield ['minute', this.minute];
		yield ['second', this.second];
		yield ['millisecond', this.millisecond];
		yield ['timestamp', this.timestamp];
		yield ['unix', this.unix];
	}

	/**
	 * * Enables primitive coercion like `+chronos`, `Number(chronos)`, `String(chronos)`, `${chronos}`, etc.
	 * @param hint - The type hint provided by the JS engine.
	 * @returns The primitive value based on the hint.
	 */
	[Symbol.toPrimitive](hint: string): string | number {
		if (hint === 'number') return this.valueOf();
		switch (this.#ORIGIN) {
			case 'timeZone':
				return this.toISOString();
			case 'toUTC':
			case 'utc':
				return this.#toLocalISOString().replace(this.getUTCOffset(), 'Z');
			default:
				return this.toLocalISOString();
		}
	}

	[Symbol.replace](string: string, replacement: string): string {
		switch (this.#ORIGIN) {
			case 'timeZone':
			case 'toUTC':
			case 'utc':
				return string.replace(
					this.toISOString().replace(/\.\d+(Z|[+-]\d{2}:\d{2})?$/, ''),
					replacement
				);
			default:
				return string.replace(
					this.toLocalISOString().replace(/\.\d+(Z|[+-]\d{2}:\d{2})?$/, ''),
					replacement
				);
		}
	}

	[Symbol.search](string: string): number {
		switch (this.#ORIGIN) {
			case 'timeZone':
			case 'toUTC':
			case 'utc':
				return string.indexOf(
					this.toISOString().replace(/\.\d+(Z|[+-]\d{2}:\d{2})?$/, '')
				);
			default:
				return string.indexOf(
					this.toLocalISOString().replace(/\.\d+(Z|[+-]\d{2}:\d{2})?$/, '')
				);
		}
	}

	[Symbol.split](string: string): string[] {
		switch (this.#ORIGIN) {
			case 'timeZone':
			case 'toUTC':
			case 'utc':
				return string.split(
					this.toISOString().replace(/\.\d+(Z|[+-]\d{2}:\d{2})?$/, '')
				);
			default:
				return string.split(
					this.toLocalISOString().replace(/\.\d+(Z|[+-]\d{2}:\d{2})?$/, '')
				);
		}
	}

	get [Symbol.toStringTag](): string {
		switch (this.#ORIGIN) {
			case 'timeZone':
				return this.toISOString().replace('Z', this.#offset.slice(3));
			case 'toUTC':
			case 'utc':
				return this.#toLocalISOString().replace(this.getUTCOffset(), 'Z');
			default:
				return this.#toLocalISOString();
		}
	}

	get [Symbol.isConcatSpreadable](): boolean {
		return true;
	}

	[Symbol.match](string: string): RegExpMatchArray | null {
		const [datePart, timePart] = this.toLocalISOString().split('.')[0].split('T');

		const fuzzyDate = datePart.replace(/-/g, '[-/]?'); // Allow 2025-09-01, 2025/09/01, or 20250901
		const fuzzyTime = timePart?.replace(/:/g, '[:.]?'); // Allow 13:26:00, 13.26.00, or 132600

		const pattern = timePart ? `${fuzzyDate}(?:[T ]?${fuzzyTime})?` : fuzzyDate;

		return string.match(new RegExp(pattern));
	}

	/**
	 * @private Method to create native `Date` instance from date-like data types.
	 * @param value The value to convert into `Date`.
	 * @returns Instance of native Date object.
	 */
	#toNewDate(value?: ChronosInput): Date {
		const date = value instanceof Chronos ? value.toDate() : new Date(value ?? Date.now());

		// Check if the date is invalid
		if (isNaN(date.getTime())) {
			throw new Error('Provided date is invalid!');
		}

		return date;
	}

	/**
	 * @private Method to tag origin of the `Chronos` instance.
	 *
	 * @param origin Origin of the instance, the method name from where it was created.
	 * @param offset Optional UTC offset in `UTC+12:00` format.
	 * @returns The `Chronos` instance with the specified origin.
	 */
	#withOrigin(origin: ChronosMethods, offset?: UTCOffSet): Chronos {
		const instance = new Chronos(this.#date);
		instance.#ORIGIN = origin;
		instance.origin = origin;
		instance.native = instance.#date;
		if (offset) instance.#offset = offset;
		return instance;
	}

	/**
	 * @private Formats the current `Chronos` date using the specified template.
	 *
	 * @param format - The desired date format.
	 * @param useUTC - Whether to use UTC or local time.
	 * @returns Formatted date string.
	 */
	#format(format: string, useUTC = false): string {
		const year = useUTC ? this.#date.getUTCFullYear() : this.#date.getFullYear();
		const month = useUTC ? this.#date.getUTCMonth() : this.#date.getMonth();
		const day = useUTC ? this.#date.getUTCDay() : this.#date.getDay();
		const date = useUTC ? this.#date.getUTCDate() : this.#date.getDate();
		const hours = useUTC ? this.#date.getUTCHours() : this.#date.getHours();
		const minutes = useUTC ? this.#date.getUTCMinutes() : this.#date.getMinutes();
		const seconds = useUTC ? this.#date.getUTCSeconds() : this.#date.getSeconds();
		const milliseconds =
			useUTC ? this.#date.getUTCMilliseconds() : this.#date.getMilliseconds();
		const timeZone = useUTC ? 'Z' : this.getTimeZoneOffset();

		const dateComponents: Record<ChronosFormat, string> = {
			YYYY: String(year),
			YY: String(year).slice(-2),
			yyyy: String(year),
			yy: String(year).slice(-2),
			M: String(month + 1),
			MM: String(month + 1).padStart(2, '0'),
			mmm: MONTHS[month].slice(0, 3),
			mmmm: MONTHS[month],
			d: DAYS[day].slice(0, 2),
			dd: DAYS[day].slice(0, 3),
			ddd: DAYS[day],
			D: String(date),
			DD: String(date).padStart(2, '0'),
			Do: getOrdinal(date),
			H: String(hours),
			HH: String(hours).padStart(2, '0'),
			h: String(hours % 12 || 12),
			hh: String(hours % 12 || 12).padStart(2, '0'),
			m: String(minutes),
			mm: String(minutes).padStart(2, '0'),
			s: String(seconds),
			ss: String(seconds).padStart(2, '0'),
			ms: String(milliseconds),
			mss: String(milliseconds).padStart(3, '0'),
			a: hours < 12 ? 'am' : 'pm',
			A: hours < 12 ? 'AM' : 'PM',
			ZZ: timeZone,
		};

		const tokenRegex = new RegExp(`^(${SORTED_TIME_FORMATS.join('|')})`);

		let result = '';
		let i = 0;

		while (i < format.length) {
			// Handle [escaped literal]
			if (format[i] === '[') {
				const end = format.indexOf(']', i);
				if (end !== -1) {
					result += format.slice(i + 1, end);
					i = end + 1;
					continue;
				}
			}

			// Try to match a format token
			const match = tokenRegex.exec(format.slice(i));

			if (match) {
				result += dateComponents[match[0] as ChronosFormat];
				i += match[0].length;
			} else {
				result += format[i];
				i++;
			}
		}

		return result;
	}

	/** @private Returns ISO string with local time zone offset */
	#toLocalISOString(): string {
		const pad = (n: number, p = 2) => String(n).padStart(p, '0');

		return `${this.year}-${pad(this.month + 1)}-${pad(this.date)}T${pad(this.hour)}:${pad(this.minute)}:${pad(this.second)}.${pad(this.millisecond, 3)}${this.getUTCOffset()}`;
	}

	/**
	 * @private Normalizes duration values based on sign and `absolute` flag.
	 * @param result The raw time breakdown to normalize.
	 * @param absolute If true, ensures all values are positive.
	 * @param isFuture Whether the duration was forward (true) or backward (false).
	 * @returns The normalized duration object.
	 */
	#normalizeDuration(
		result: TimeDuration,
		absolute: boolean,
		isFuture: boolean
	): TimeDuration {
		const entries = Object.entries(result) as [keyof TimeDuration, number][];

		const updated = {} as TimeDuration;

		if (!absolute && !isFuture) {
			for (const [key, value] of entries) {
				if (value !== 0) {
					updated[key] = value * -1;
				}
			}
		} else if (absolute) {
			for (const [key, value] of entries) {
				updated[key] = Math.abs(value);
			}
		}

		return updated;
	}

	/** Gets the full year of the date. */
	get year(): number {
		return this.#date.getFullYear();
	}

	/** Gets the month (0-11) of the date. */
	get month(): Enumerate<12> {
		return this.#date.getMonth() as Enumerate<12>;
	}

	/** Gets the day of the month (1-31). */
	get date(): NumberRange<1, 31> {
		return this.#date.getDate() as NumberRange<1, 31>;
	}

	/** Gets the day of the week (0-6, where 0 is Sunday). */
	get weekDay(): Enumerate<7> {
		return this.#date.getDay() as Enumerate<7>;
	}

	/** Gets the hour (0-23) of the date. */
	get hour(): Enumerate<24> {
		return this.#date.getHours() as Enumerate<24>;
	}

	/** Gets the minute (0-59) of the date. */
	get minute(): Enumerate<60> {
		return this.#date.getMinutes() as Enumerate<60>;
	}

	/** Gets the second (0-59) of the date. */
	get second(): Enumerate<60> {
		return this.#date.getSeconds() as Enumerate<60>;
	}

	/** Gets the millisecond (0-999) of the date. */
	get millisecond(): Milliseconds {
		return this.#date.getMilliseconds() as Milliseconds;
	}

	/** Gets ISO weekday: 1 = Monday, 7 = Sunday */
	get isoWeekDay(): NumberRange<1, 7> {
		const day = this.weekDay;

		return day === 0 ? 7 : day;
	}

	/** Gets ISO month (1–12 instead of 0–11) */
	get isoMonth(): NumberRange<1, 12> {
		return (this.month + 1) as NumberRange<1, 12>;
	}

	/** Returns the Unix timestamp (seconds since the Unix epoch: January 1, 1970, UTC). */
	get unix(): number {
		return Math.floor(this.#date.getTime() / 1000);
	}

	/** Gets the time value in milliseconds since midnight, January 1, 1970 UTC. */
	get timestamp(): number {
		return this.#date.getTime();
	}

	/** * Gets the last date (number) of the current month `(28, 29, 30 or 31)`. */
	get lastDateOfMonth(): NumberRange<28, 31> {
		return this.lastDayOfMonth().#date.getDate() as NumberRange<28, 31>;
	}

	/** @instance Returns a debug-friendly string for `console.log` or `util.inspect`. */
	inspect(): string {
		return `[Chronos ${this.toLocalISOString()}]`;
	}

	/** @instance Enables JSON.stringify and logging in the console (in Browser environment) to show readable output. */
	toJSON(): string {
		return this.toLocalISOString();
	}

	/** @instance Enables arithmetic and comparison operations (e.g., +new Chronos()). */
	valueOf(): number {
		return this.getTimeStamp();
	}

	/** @instance Clones and returns a new Chronos instance with the same date. */
	clone(): Chronos {
		return new Chronos(this.#date).#withOrigin(this.#ORIGIN as ChronosMethods);
	}

	/** @instance Gets the native `Date` instance (read-only). */
	toDate(): Date {
		switch (this.#ORIGIN) {
			case 'toUTC':
			case 'utc': {
				const mins = this.getUTCOffsetMinutes();

				const date = this.addMinutes(mins);

				return date.toDate();
			}
			default:
				return new Date(this.#date);
		}
	}

	/** @instance Returns a string representation of a date. The format of the string depends on the locale. */
	toString(): string {
		switch (this.#ORIGIN) {
			case 'timeZone': {
				const gmt = this.#offset.replace('UTC', 'GMT').replace(':', '');
				const label = TIME_ZONE_LABELS[this.#offset] ?? this.#offset;

				return this.#date
					.toString()
					.replace(/GMT[+-]\d{4} \([^)]+\)/, `${gmt} (${label})`);
			}
			case 'toUTC':
			case 'utc': {
				const mins = this.getUTCOffsetMinutes();

				const date = this.addMinutes(mins);

				return date.toString();
			}
			default:
				return this.#date.toString();
		}
	}

	/** @instance Returns ISO string with local time zone offset */
	toLocalISOString(): string {
		switch (this.#ORIGIN) {
			case 'timeZone':
			case 'toUTC':
			case 'utc': {
				const previousOffset = this.getTimeZoneOffsetMinutes();
				const currentOffset = this.getUTCOffsetMinutes();

				const date = this.addMinutes(-previousOffset - currentOffset);

				return date.#toLocalISOString();
			}
			default:
				return this.#toLocalISOString();
		}
	}

	/** @instance Returns a date as a string value in ISO format. */
	toISOString(): string {
		switch (this.#ORIGIN) {
			case 'timeZone':
				return this.#toLocalISOString().replace(
					this.getUTCOffset(),
					this.#offset.slice(3)
				);
			case 'toUTC':
			case 'utc':
				return this.#toLocalISOString().replace(this.getUTCOffset(), 'Z');
			default:
				return this.#date.toISOString();
		}
	}

	/**
	 * @instance Wrapper over native `toLocaleString`
	 * @description Converts a date and time to a string by using the current or specified locale.
	 *
	 * @param locales A locale string, array of locale strings, Intl.Locale object, or array of Intl.Locale objects that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used.
	 * @param options An object that contains one or more properties that specify comparison options.
	 */
	toLocaleString(
		locale?: LocaleCode | Intl.Locale | Array<LocaleCode | Intl.Locale>,
		options?: Intl.DateTimeFormatOptions
	): string {
		return this.#date.toLocaleString(locale, options);
	}

	/** @instance Returns the time value in milliseconds since midnight, January 1, 1970 UTC. */
	getTimeStamp(): number {
		return this.#date.getTime();
	}

	/**
	 * @instance Formats the current date into a custom string format (local time by default).
	 *
	 * @param format - The desired format string (Default: `dd, mmm DD, YYYY HH:mm:ss` → e.g., `Sun, Apr 06, 2025 16:11:55`).
	 *
	 * - To output raw text (i.e., not interpreted as a date token), wrap it in square brackets.
	 * - For example, `[Today is] ddd` results in `Today is Sunday`, and `YYYY[ year]` results in `2025 year`.
	 *
	 * - Supported format tokens include: `YYYY`, `YY`, `mmmm`, `mmm`, `MM`, `M`, `DD`, `D`, `dd`, `ddd`, `Do`, `HH`, `H`, `hh`, `h`, `mm`, `m`, `ss`, `s`, `ms`, `mss`, `a`, `A`, and `ZZ`.
	 * - *Any token not wrapped in brackets will be parsed and replaced with its corresponding date component.*
	 * - Please refer to {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/format#format-tokens format tokens} for detailed usage.
	 *
	 * @param useUTC - Optional boolean to format the date using UTC time.
	 * When `true`, it behaves like `formatUTC()` and outputs time based on UTC offset. Defaults to `false`.
	 *
	 * @returns Formatted date string using the specified format.
	 * Uses local time by default unless `useUTC` is set to `true`.
	 */

	format(format?: string, useUTC = false): string {
		return this.#format(format ?? 'dd, mmm DD, YYYY HH:mm:ss', useUTC);
	}

	/**
	 * @instance Formats the date into a predefined strict string format using local time or UTC.
	 *
	 * @remarks Offers over 21,000 predefined formats with full IntelliSense support.
	 *
	 * @param format - The desired format string. Defaults to `'dd, mmm DD, YYYY HH:mm:ss'`
	 *                 (e.g., `'Sun, Apr 06, 2025 16:11:55'`).
	 *	 - Please refer to {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/format#format-tokens format tokens} for detailed usage.
	 *
	 * @param useUTC - If `true`, formats the date in UTC (equivalent to `formatUTC()`);
	 *                 Defaults to `false` (local time).
	 * @returns A formatted date string in the specified format
	 */
	formatStrict(format?: StrictFormat, useUTC = false): string {
		return this.#format(format ?? 'dd, mmm DD, YYYY HH:mm:ss', useUTC);
	}

	/**
	 * @instance Formats the date into a custom string format (UTC time).
	 *
	 * @param format - The desired format (Default format is `dd, mmm DD, YYYY HH:mm:ss:mss` = `Sun, Apr 06, 2025 16:11:55:379`).
	 *
	 * - To output raw text (i.e., not interpreted as a date token), wrap it in square brackets.
	 * - For example, `[Today is] ddd` results in `Today is Sunday`, and `YYYY[ year]` results in `2025 year`.
	 *
	 * - Supported format tokens include: `YYYY`, `YY`, `mmmm`, `mmm`, `MM`, `M`, `DD`, `D`, `dd`, `ddd`, `Do`, `HH`, `H`, `hh`, `h`, `mm`, `m`, `ss`, `s`, `ms`, `mss`, `a`, `A`, and `ZZ`.
	 * - *Any token not wrapped in brackets will be parsed and replaced with its corresponding date component.*
	 * - Please refer to {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/format#format-tokens format tokens} for detailed usage.
	 *
	 * @returns Formatted date string in desired format (UTC time).
	 */
	formatUTC(format: string = 'dd, mmm DD, YYYY HH:mm:ss:mss'): string {
		switch (this.#offset) {
			case 'UTC+00:00':
				return this.#format(format, false);
			default:
				return this.#format(format, true);
		}
	}

	/**
	 * @instance Adds seconds and returns a new immutable instance.
	 * @param seconds - Number of seconds to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addSeconds(seconds: number): Chronos {
		const newDate = new Date(this.#date);
		newDate.setSeconds(newDate.getSeconds() + seconds);
		return new Chronos(newDate).#withOrigin('addSeconds');
	}

	/**
	 * @instance Adds minutes and returns a new immutable instance.
	 * @param minutes - Number of minutes to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addMinutes(minutes: number): Chronos {
		const newDate = new Date(this.#date);
		newDate.setMinutes(newDate.getMinutes() + minutes);
		return new Chronos(newDate).#withOrigin('addMinutes');
	}

	/**
	 * @instance Adds hours and returns a new immutable instance.
	 * @param hours - Number of hours to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addHours(hours: number): Chronos {
		const newDate = new Date(this.#date);
		newDate.setHours(newDate.getHours() + hours);
		return new Chronos(newDate).#withOrigin('addHours');
	}

	/**
	 * @instance Adds days and returns a new immutable instance.
	 * @param days - Number of days to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addDays(days: number): Chronos {
		const newDate = new Date(this.#date);
		newDate.setDate(newDate.getDate() + days);
		return new Chronos(newDate).#withOrigin('addDays');
	}

	/**
	 * @instance Adds weeks and returns a new immutable instance.
	 * @param weeks - Number of weeks to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addWeeks(weeks: number): Chronos {
		const newDate = new Date(this.#date);
		newDate.setDate(newDate.getDate() + weeks * 7);
		return new Chronos(newDate).#withOrigin('addWeeks');
	}

	/**
	 * @instance Adds months and returns a new immutable instance.
	 * @param months - Number of months to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addMonths(months: number): Chronos {
		const newDate = new Date(this.#date);
		newDate.setMonth(newDate.getMonth() + months);
		return new Chronos(newDate).#withOrigin('addMonths');
	}

	/**
	 * @instance Adds years and returns a new immutable instance.
	 * @param years - Number of years to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addYears(years: number): Chronos {
		const newDate = new Date(this.#date);
		newDate.setFullYear(newDate.getFullYear() + years);
		return new Chronos(newDate).#withOrigin('addYears');
	}

	/**
	 * @instance Checks if the current year is a leap year.
	 * - A year is a leap year if it is divisible by 4, but not divisible by 100, unless it is also divisible by 400.
	 * - For example, 2000 and 2400 are leap years, but 1900 and 2100 are not.
	 * @param year - Optional year to check. Default is the year from current `Chronos` instance.
	 * @returns `true` if the year is a leap year, `false` otherwise.
	 */
	isLeapYear(year?: number): boolean {
		return isLeapYear(year ?? this.year);
	}

	/** @instance Checks if another date is exactly equal to this one */
	isEqual(other: ChronosInput): boolean {
		const time = other instanceof Chronos ? other : new Chronos(other);

		return this.timestamp === time.timestamp;
	}

	/** @instance Checks if another date is exactly equal to or before this one */
	isEqualOrBefore(other: ChronosInput): boolean {
		const time = other instanceof Chronos ? other : new Chronos(other);

		return this.timestamp <= time.timestamp;
	}

	/** @instance Checks if another date is exactly equal to or after this one */
	isEqualOrAfter(other: ChronosInput): boolean {
		const time = other instanceof Chronos ? other : new Chronos(other);

		return this.timestamp >= time.timestamp;
	}

	/**
	 * @instance Checks if another date is the same as this one in a specific unit.
	 * @param other The other date to compare.
	 * @param unit The unit to compare.
	 * @param weekStartsOn Optional: Day the week starts on (0 = Sunday, 1 = Monday). Applicable if week day is required. Default is `0`.
	 */
	isSame(other: ChronosInput, unit: TimeUnit, weekStartsOn: Enumerate<7> = 0): boolean {
		const time = other instanceof Chronos ? other : new Chronos(other);

		return (
			this.startOf(unit, weekStartsOn).toDate().getTime() ===
			time.startOf(unit, weekStartsOn).toDate().getTime()
		);
	}

	/**
	 * @instance Checks if this date is before another date in a specific unit.
	 * @param other The other date to compare.
	 * @param unit The unit to compare.
	 * @param weekStartsOn Optional: Day the week starts on (0 = Sunday, 1 = Monday). Applicable if week day is required. Default is `0`.
	 */
	isBefore(other: ChronosInput, unit: TimeUnit, weekStartsOn: Enumerate<7> = 0): boolean {
		const time = other instanceof Chronos ? other : new Chronos(other);

		return (
			this.startOf(unit, weekStartsOn).toDate().getTime() <
			time.startOf(unit, weekStartsOn).toDate().getTime()
		);
	}

	/**
	 * @instance Checks if this date is after another date in a specific unit.
	 * @param other The other date to compare.
	 * @param unit The unit to compare.
	 * @param weekStartsOn Optional: Day the week starts on (0 = Sunday, 1 = Monday). Applicable if week day is required. Default is `0`.
	 */
	isAfter(other: ChronosInput, unit: TimeUnit, weekStartsOn: Enumerate<7> = 0): boolean {
		const time = other instanceof Chronos ? other : new Chronos(other);

		return (
			this.startOf(unit, weekStartsOn).toDate().getTime() >
			time.startOf(unit, weekStartsOn).toDate().getTime()
		);
	}

	/**
	 * @instance Checks if this date is the same or before another date in a specific unit.
	 * @param other The other date to compare.
	 * @param unit The unit to compare.
	 * @param weekStartsOn Optional: Day the week starts on (0 = Sunday, 1 = Monday). Applicable if week day is required. Default is `0`.
	 */
	isSameOrBefore(
		other: ChronosInput,
		unit: TimeUnit,
		weekStartsOn: Enumerate<7> = 0
	): boolean {
		return (
			this.isSame(other, unit, weekStartsOn) || this.isBefore(other, unit, weekStartsOn)
		);
	}

	/**
	 * @instance Checks if this date is the same or after another date in a specific unit.
	 * @param other The other date to compare.
	 * @param unit The unit to compare.
	 * @param weekStartsOn Optional: Day the week starts on (0 = Sunday, 1 = Monday). Applicable if week day is required. Default is `0`.
	 */
	isSameOrAfter(
		other: ChronosInput,
		unit: TimeUnit,
		weekStartsOn: Enumerate<7> = 0
	): boolean {
		return (
			this.isSame(other, unit, weekStartsOn) || this.isAfter(other, unit, weekStartsOn)
		);
	}

	/**
	 * @instance Checks if the current date is between the given start and end dates.
	 *
	 * @param start - The start of the range.
	 * @param end - The end of the range.
	 * @param inclusive - Specifies whether the comparison is inclusive or exclusive:
	 * - `'[]'`: inclusive of both start and end (≥ start and ≤ end)
	 * - `'[)'`: inclusive of start, exclusive of end (≥ start and < end)
	 * - `'(]'`: exclusive of start, inclusive of end (> start and ≤ end)
	 * - `'()'`: exclusive of both start and end (> start and < end)
	 *
	 * @returns `true` if the current date is within the specified range based on the `inclusive` mode.
	 */
	isBetween(
		start: ChronosInput,
		end: ChronosInput,
		inclusive: '[]' | '[)' | '(]' | '()' = '()'
	): boolean {
		const s = new Chronos(start).valueOf();
		const e = new Chronos(end).valueOf();
		const t = this.valueOf();

		switch (inclusive) {
			case '[]':
				return t >= s && t <= e;
			case '[)':
				return t >= s && t < e;
			case '(]':
				return t > s && t <= e;
			case '()':
				return t > s && t < e;
		}
	}

	/**
	 * @instance Checks if the date is within daylight saving time (DST).
	 * @returns Whether the date is in DST.
	 */
	isDST(): boolean {
		const year = this.#date.getFullYear();

		const jan = new Date(year, 0, 1).getTimezoneOffset();

		const jul = new Date(year, 6, 1).getTimezoneOffset();

		return this.#date.getTimezoneOffset() < Math.max(jan, jul);
	}

	/** @instance Checks if current day is the first day of the current month. */
	isFirstDayOfMonth(): boolean {
		return this.isSame(this.firstDayOfMonth(), 'day');
	}

	/** @instance Checks if current day is the last day of the current month. */
	isLastDayOfMonth(): boolean {
		return this.isSame(this.lastDayOfMonth(), 'day');
	}

	/** @instance Returns a new Chronos instance set to the first day of the current month. */
	firstDayOfMonth(): Chronos {
		const year = this.#date.getFullYear();
		const month = this.#date.getMonth();
		const lastDate = new Date(year, month, 1);
		return new Chronos(lastDate).#withOrigin('firstDayOfMonth');
	}

	/** @instance Returns a new Chronos instance set to the last day of the current month. */
	lastDayOfMonth(): Chronos {
		const year = this.#date.getFullYear();
		const month = this.#date.getMonth() + 1;
		const lastDate = new Date(year, month, 0);
		return new Chronos(lastDate).#withOrigin('lastDayOfMonth');
	}

	/**
	 * @instance Returns a new Chronos instance at the start of a given unit.
	 * @param unit The unit to reset (e.g., year, month, day).
	 * @param weekStartsOn Optional: Day the week starts on (0 = Sunday, 1 = Monday). Applicable if week day is required. Default is `0`.
	 */
	startOf(unit: TimeUnit, weekStartsOn: Enumerate<7> = 0): Chronos {
		const d = new Date(this.#date);

		switch (unit) {
			case 'year':
				d.setMonth(0, 1);
				d.setHours(0, 0, 0, 0);
				break;
			case 'month':
				d.setDate(1);
				d.setHours(0, 0, 0, 0);
				break;
			case 'week': {
				const day = d.getDay();
				const diff = (day - weekStartsOn + 7) % 7;
				d.setDate(d.getDate() - diff);
				d.setHours(0, 0, 0, 0);
				break;
			}
			case 'day':
				d.setHours(0, 0, 0, 0);
				break;
			case 'hour':
				d.setMinutes(0, 0, 0);
				break;
			case 'minute':
				d.setSeconds(0, 0);
				break;
			case 'second':
				d.setMilliseconds(0);
				break;
			case 'millisecond':
				break;
		}

		return new Chronos(d).#withOrigin('startOf');
	}

	/**
	 * @instance Returns a new Chronos instance at the end of a given unit.
	 * @param unit The unit to adjust (e.g., year, month, day).
	 * @param weekStartsOn Optional: Day the week starts on (0 = Sunday, 1 = Monday). Applicable if week day is required. Default is `0`.
	 */
	endOf(unit: TimeUnit, weekStartsOn: Enumerate<7> = 0): Chronos {
		return this.startOf(unit, weekStartsOn)
			.add(1, unit)
			.add(-1, 'millisecond')
			.#withOrigin('endOf');
	}

	/**
	 * @instance Returns a new Chronos instance with the specified unit added.
	 * @param number The number of time unit to add (can be negative).
	 * @param unit The time unit to add.
	 */
	add(number: number, unit: TimeUnit): Chronos {
		const d = new Date(this.#date);

		switch (unit) {
			case 'millisecond':
				d.setMilliseconds(d.getMilliseconds() + number);
				break;
			case 'second':
				d.setSeconds(d.getSeconds() + number);
				break;
			case 'minute':
				d.setMinutes(d.getMinutes() + number);
				break;
			case 'hour':
				d.setHours(d.getHours() + number);
				break;
			case 'day':
				d.setDate(d.getDate() + number);
				break;
			case 'week':
				d.setDate(d.getDate() + number * 7);
				break;
			case 'month':
				d.setMonth(d.getMonth() + number);
				break;
			case 'year':
				d.setFullYear(d.getFullYear() + number);
				break;
		}

		return new Chronos(d).#withOrigin('add');
	}

	/**
	 * @instance Returns a new Chronos instance with the specified unit subtracted.
	 * @param number The number of time unit to subtract (can be negative).
	 * @param unit The time unit to add.
	 */
	subtract(number: number, unit: TimeUnit): Chronos {
		return this.add(-number, unit).#withOrigin('subtract');
	}

	/**
	 * @instance Gets the value of a specific time unit from the date.
	 * @param unit The unit to retrieve.
	 */
	get(unit: TimeUnit): number {
		switch (unit) {
			case 'year':
				return this.#date.getFullYear();
			case 'month':
				return this.#date.getMonth();
			case 'day':
				return this.#date.getDate();
			case 'week':
				return this.getWeek();
			case 'hour':
				return this.#date.getHours();
			case 'minute':
				return this.#date.getMinutes();
			case 'second':
				return this.#date.getSeconds();
			case 'millisecond':
				return this.#date.getMilliseconds();
		}
	}

	/**
	 * @instance Returns a new Chronos instance with the specified unit set to the given value.
	 * @param unit The unit to modify.
	 * @param value The value to set for the unit.
	 */
	set(unit: TimeUnit, value: number): Chronos {
		const d = new Date(this.#date);

		switch (unit) {
			case 'year':
				d.setFullYear(value);
				break;
			case 'month':
				d.setMonth(value);
				break;
			case 'day':
				d.setDate(value);
				break;
			case 'week':
				return this.setWeek(value as NumberRange<1, 53>);
			case 'hour':
				d.setHours(value);
				break;
			case 'minute':
				d.setMinutes(value);
				break;
			case 'second':
				d.setSeconds(value);
				break;
			case 'millisecond':
				d.setMilliseconds(value);
				break;
		}

		return new Chronos(d).#withOrigin('set');
	}

	/**
	 * @instance Returns the difference between this and another date in the given unit.
	 * @param other The other date to compare.
	 * @param unit The unit in which to return the difference.
	 */
	diff(other: ChronosInput, unit: TimeUnit): number {
		const time = other instanceof Chronos ? other : new Chronos(other);

		const msDiff = this.#date.getTime() - time.#date.getTime();

		switch (unit) {
			case 'millisecond':
				return msDiff;
			case 'second':
				return msDiff / 1e3;
			case 'minute':
				return msDiff / 6e4;
			case 'hour':
				return msDiff / 3.6e6;
			case 'day':
				return msDiff / 8.64e7;
			case 'week':
				return msDiff / 6.048e8;
			case 'month':
				return (
					(this.get('year') - time.get('year')) * 12 +
					(this.get('month') - time.get('month'))
				);
			case 'year':
				return this.get('year') - time.get('year');
		}
	}

	/**
	 * @instance Returns a human-readable relative calendar time like "Today at 3:00 PM"
	 * @param baseDate Optional base date to compare with.
	 */
	calendar(baseDate?: ChronosInput): string {
		const base = baseDate ? new Chronos(baseDate) : new Chronos();
		const input = this.startOf('day');

		const comparison = base.startOf('day');
		const diff = input.diff(comparison, 'day');

		const timeStr = this.toDate().toLocaleString(undefined, {
			hour: 'numeric',
			minute: '2-digit',
		});

		if (diff === 0) return `Today at ${timeStr}`;
		if (diff === 1) return `Tomorrow at ${timeStr}`;
		if (diff === -1) return `Yesterday at ${timeStr}`;

		return this.toDate().toLocaleString(undefined, {
			month: 'long',
			day: '2-digit',
			year: 'numeric',
			weekday: 'long',
			hour: 'numeric',
			minute: '2-digit',
		});
	}

	/** @instance Returns a short human-readable string like "2h ago", "in 5m". From `year` to `second`. */
	fromNowShort(): string {
		const now = new Chronos();
		const diffInSeconds = this.diff(now, 'second');

		const abs = Math.abs(diffInSeconds);

		const suffix = diffInSeconds >= 0 ? 'in ' : '';
		const postfix = diffInSeconds < 0 ? ' ago' : '';

		if (abs < 60) {
			return `${suffix}${Math.floor(abs)}s${postfix}`;
		} else if (abs < 3600) {
			return `${suffix}${Math.floor(abs / 60)}m${postfix}`;
		} else if (abs < 86400) {
			return `${suffix}${Math.floor(abs / 3600)}h${postfix}`;
		} else if (abs < 2592000) {
			return `${suffix}${Math.floor(abs / 86400)}d${postfix}`;
		} else if (abs < 31536000) {
			return `${suffix}${Math.floor(abs / 2592000)}mo${postfix}`;
		} else {
			return `${suffix}${Math.floor(abs / 31536000)}y${postfix}`;
		}
	}

	/**
	 * @instance Sets the date to the Monday of the specified ISO week number within the current year.
	 * This method assumes ISO week logic, where week 1 is the week containing January 4th.
	 *
	 * @param week The ISO week number (1–53) to set the date to.
	 * @returns A new Chronos instance set to the start (Monday) of the specified week.
	 */
	setWeek(week: NumberRange<1, 53>): Chronos {
		const d = new Date(this.#date);

		const year = d.getFullYear();
		const jan4 = new Date(year, 0, 4);
		const dayOfWeek = jan4.getDay() || 7; // Make Sunday (0) into 7
		const weekStart = new Date(jan4);
		weekStart.setDate(jan4.getDate() - (dayOfWeek - 1)); // Move to Monday

		weekStart.setDate(weekStart.getDate() + (week - 1) * 7); // Move to target week
		d.setFullYear(weekStart.getFullYear());
		d.setMonth(weekStart.getMonth());
		d.setDate(weekStart.getDate());

		return new Chronos(d).#withOrigin('setWeek');
	}

	/**
	 * @instance Calculates the ISO 8601 week number of the year.
	 *
	 * ISO weeks start on Monday, and the first week of the year is the one containing January 4th.
	 *
	 * @returns Week number (1–53).
	 */
	getWeek(): NumberRange<1, 53> {
		const target = this.startOf('week', 1).add(3, 'day'); // Thursday of current ISO week

		const firstThursday = new Chronos(target.year, 1, 4) // January 4
			.startOf('week', 1)
			.add(3, 'day'); // Thursday of first ISO week

		return (target.diff(firstThursday, 'week') + 1) as NumberRange<1, 53>;
	}

	/**
	 * @instance Calculates the week number of the year based on custom week start.
	 * @param weekStartsOn Optional: Day the week starts on (0 = Sunday, 1 = Monday). Applicable if week day is required. Default is `0`.
	 * @returns Week number (1-53).
	 */
	getWeekOfYear(weekStartsOn: Enumerate<7> = 0): NumberRange<1, 53> {
		const startOfYear = new Chronos(this.year, 1, 1);
		const startOfFirstWeek = startOfYear.startOf('week', weekStartsOn);

		const week = this.startOf('week', weekStartsOn).diff(startOfFirstWeek, 'week');

		return (week + 1) as NumberRange<1, 53>;
	}

	/**
	 * @instance Returns the ISO week-numbering year for the current date.
	 *
	 * The ISO week-numbering year may differ from the calendar year.
	 * For example, January 1st may fall in the last ISO week of the previous year.
	 *
	 * @param weekStartsOn Optional: Defines the start day of the week (0 = Sunday, 1 = Monday).
	 *                     Defaults to 0 (Sunday). Use 1 for strict ISO 8601.
	 * @returns The ISO week-numbering year.
	 */
	getWeekYear(weekStartsOn: Enumerate<7> = 0): number {
		const d = this.startOf('week', weekStartsOn).add(3, 'day'); // Thursday of current ISO week
		return d.year;
	}

	/** @instance Returns day of year (1 - 366) */
	getDayOfYear(): NumberRange<1, 366> {
		const start = new Date(this.year, 0, 1);
		const diff = this.#date.getTime() - start.getTime();
		return (Math.floor(diff / 86400000) + 1) as NumberRange<1, 366>;
	}

	/** @instance Returns number of days in current month */
	daysInMonth(): NumberRange<28, 31> {
		return new Date(this.year, this.month + 1, 0).getDate() as NumberRange<28, 31>;
	}

	/** @instance Converts to object with all date unit parts */
	toObject(): ChronosObject {
		return Object.fromEntries([...this]) as unknown as ChronosObject;
	}

	/** @instance Converts to array with all date unit parts */
	toArray(): TupleOf<number, 12> {
		return Object.values(this.toObject()) as TupleOf<number, 12>;
	}

	/**
	 * @instance Returns the **calendar quarter** (1 to 4) of the current date.
	 *
	 * @remarks
	 * A calendar year is divided into four quarters:
	 *
	 * - `Q1`: January to March
	 * - `Q2`: April to June
	 * - `Q3`: July to September
	 * - `Q4`: October to December
	 *
	 * This method strictly uses the **calendar year**. For fiscal quarters, use `toFiscalQuarter()` instead.
	 *
	 * @example
	 * new Chronos('2025-02-14').toQuarter(); // 1
	 * new Chronos('2025-08-09').toQuarter(); // 3
	 *
	 * @returns The calendar quarter number (1–4).
	 */
	toQuarter(): Quarter {
		const month = this.#date.getMonth();
		return (Math.floor(month / 3) + 1) as Quarter;
	}

	/**
	 * @instance Returns the system's current UTC offset formatted as `+06:00` or `-07:00`.
	 *
	 * - *Unlike JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset `Date.prototype.getTimezoneOffset()`}, which returns the offset in minutes **behind** UTC (positive for locations west of UTC and negative for east), this method returns the more intuitive sign format used in time zone representations (e.g., `+06:00` means 6 hours **ahead** of UTC).*
	 *
	 * @returns The (local) system's UTC offset in `±HH:mm` format.
	 */
	getUTCOffset(): $UTCOffset {
		const offset = -this.#date.getTimezoneOffset();
		const sign = offset >= 0 ? '+' : '-';

		const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, '0');

		return `${sign}${pad(offset / 60)}:${pad(offset % 60)}` as $UTCOffset;
	}

	/**
	 * @instance Returns the timezone offset of this `Chronos` instance in `+06:00` or `-07:00` format maintaining current timezone.
	 *
	 * - *Unlike JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset Date.prototype.getTimezoneOffset()}, which returns the offset in minutes **behind** UTC (positive for locations west of UTC and negative for east), this method returns the more intuitive sign format used in time zone representations (e.g., `+06:00` means 6 hours **ahead** of UTC).*
	 *
	 * @returns The timezone offset string in `±HH:mm` format maintaining the current timezone regardless of system having different one.
	 */
	getTimeZoneOffset(): $UTCOffset {
		return this.#offset.replace('UTC', '') as $UTCOffset;
	}

	/**
	 * @instance Returns the system's UTC offset in minutes.
	 *
	 * - *Unlike JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset Date.prototype.getTimezoneOffset()}, this method returns a positive value if the local time is ahead of UTC, and negative if behind UTC.*
	 *
	 * For example, for `UTC+06:00`, this returns `360`; for `UTC-05:30`, this returns `-330`.
	 *
	 * @returns The system's UTC offset in minutes, matching the sign convention used in `±HH:mm`.
	 */
	getUTCOffsetMinutes(): number {
		return -this.#date.getTimezoneOffset();
	}

	/**
	 * @instance Returns the current `Chronos` instance's UTC offset in minutes.
	 *
	 * This reflects the parsed or stored offset used internally by Chronos and follows the same
	 * sign convention: positive for timezones ahead of UTC, negative for behind.
	 *
	 * @returns The UTC offset in minutes maintaining the current timezone regardless of system having different one.
	 */
	getTimeZoneOffsetMinutes(): number {
		return extractMinutesFromUTC(this.#offset);
	}

	/**
	 * @instance Returns the current time zone name as a full descriptive string (e.g. `"Bangladesh Standard Time"`).
	 * @param utc Optional UTC offset in `"UTC+06:00"` format. When passed, it bypasses the current time zone offset.
	 * @returns Time zone name in full descriptive string or UTC offset if it is not a valid time zone.
	 * @remarks
	 * - This method uses a predefined mapping of UTC offsets to time zone names.
	 * - If multiple time zones share the same UTC offset, it returns the **first match** from the predefined list.
	 * - If no match is found (which is rare), it falls back to returning the UTC offset (e.g. `"UTC+06:00"`).
	 */
	getTimeZoneName(utc?: UTCOffSet): LooseLiteral<UTCOffSet> {
		const UTC = utc ?? `UTC${this.getTimeZoneOffset()}`;

		return TIME_ZONE_LABELS?.[UTC] ?? UTC;
	}

	/** @instance Returns new Chronos instance in UTC */
	toUTC(): Chronos {
		if (this.#offset === 'UTC+00:00') {
			return this.#withOrigin('toUTC');
		}

		const date = this.#date;

		const previousOffset = this.getTimeZoneOffsetMinutes();

		const utc = new Date(date.getTime() - previousOffset * 60 * 1000);

		return new Chronos(utc).#withOrigin('toUTC');
	}

	/** @instance Returns new Chronos instance in local time */
	toLocal(): Chronos {
		const previousOffset = this.getTimeZoneOffsetMinutes();

		const localOffset = -this.#date.getTimezoneOffset();

		const relativeOffset = previousOffset - localOffset;

		const localTime = new Date(this.#date.getTime() - relativeOffset * 60 * 1000);

		return new Chronos(localTime).#withOrigin('toLocal');
	}

	/**
	 * @instance Rounds the current date-time to the nearest specified unit and interval.
	 *
	 * - *Rounding is based on proximity to the start or end of the specified unit.*
	 * - *For example, rounding `2025-05-23` by 'day' returns either midnight of May 23 or May 24, depending on the time of day.*
	 *
	 * @param unit - The time unit to round to (`year`, `month`, `week`, `day`, `hour`, `minute`, `second`, `millisecond`).
	 * @param nearest - Optional granularity of rounding. (Defaults to `1`).
	 *
	 * @returns A new `Chronos` instance at the nearest rounded point in time. For wrong unit returns current instance.
	 *
	 * @remarks
	 * - Rounding for `'month'` is based on how far into the month the date is. If past the midpoint, it rounds to the next month.
	 *   - Month indices are 0-based internally (January = 0), but the resulting date reflects the correct calendar month.
	 * - For `'week'` unit, rounding is performed by comparing proximity to the start and end of the ISO week (Monday to Sunday).
	 *   - If the date is closer to the next Monday, it rounds forward; otherwise, it rounds back to the previous Monday.
	 */
	round(unit: TimeUnit, nearest = 1): Chronos {
		const date = new Date(this.#date);

		switch (unit) {
			case 'millisecond': {
				const rounded = roundToNearest(date.getMilliseconds(), nearest);

				date.setMilliseconds(rounded);
				break;
			}
			case 'second': {
				const fullSecond = date.getSeconds() + date.getMilliseconds() / 1000;

				const rounded = roundToNearest(fullSecond, nearest);
				date.setSeconds(rounded, 0);
				break;
			}
			case 'minute': {
				const fullMinute =
					date.getMinutes() + date.getSeconds() / 60 + date.getMilliseconds() / 60000;

				const rounded = roundToNearest(fullMinute, nearest);
				date.setMinutes(rounded, 0, 0);
				break;
			}
			case 'hour': {
				const fullHour =
					date.getHours() +
					date.getMinutes() / 60 +
					date.getSeconds() / 3600 +
					date.getMilliseconds() / 3600000;

				const rounded = roundToNearest(fullHour, nearest);
				date.setHours(rounded, 0, 0, 0);
				break;
			}
			case 'day': {
				const fullDay =
					date.getDate() +
					(date.getHours() / 24 +
						date.getMinutes() / 1440 +
						date.getSeconds() / 86400 +
						date.getMilliseconds() / 86400000);

				const rounded = roundToNearest(fullDay, nearest);
				date.setDate(rounded);
				date.setHours(0, 0, 0, 0);
				break;
			}
			case 'week': {
				const weekday = this.#date.getDay(); // 0 (Sun) to 6 (Sat)
				const offsetToMonday = (weekday + 6) % 7; // 0 for Mon, 1 for Tue, ..., 6 for Sun

				const startOfWeek = new Date(this.#date);
				startOfWeek.setDate(startOfWeek.getDate() - offsetToMonday);
				startOfWeek.setHours(0, 0, 0, 0);

				const endOfWeek = new Date(startOfWeek);
				endOfWeek.setDate(endOfWeek.getDate() + 7);

				const diffToStart = Math.abs(this.#date.getTime() - startOfWeek.getTime());

				const diffToEnd = Math.abs(endOfWeek.getTime() - this.#date.getTime());

				const rounded = diffToEnd < diffToStart ? endOfWeek : startOfWeek;

				return new Chronos(rounded).#withOrigin('round');
			}

			case 'month': {
				const fullMonth = date.getMonth() + date.getDate() / this.lastDateOfMonth;

				const roundedMonth = roundToNearest(fullMonth, nearest);
				date.setMonth(roundedMonth, 1);
				date.setHours(0, 0, 0, 0);
				break;
			}
			case 'year': {
				const dayOfYear = Math.floor(
					(date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / 86400000
				);

				const isLeap = new Date(date.getFullYear(), 1, 29).getDate() === 29;

				const totalDays = isLeap ? 366 : 365;
				const fullYear = date.getFullYear() + dayOfYear / totalDays;
				const roundedYear = roundToNearest(fullYear, nearest);
				date.setFullYear(roundedYear, 0, 1);
				date.setHours(0, 0, 0, 0);
				break;
			}
			default:
				return this;
		}

		return new Chronos(date).#withOrigin('round');
	}

	/**
	 * @instance Returns the full time duration breakdown between current input (start) and another time (to).
	 * @param toTime The time to compare with. Defaults to now.
	 * @param absolute If true, returns all values as positive numbers. Defaults to `true`.
	 * @returns An object of time units: years, months, days, hours, minutes, seconds, milliseconds.
	 */
	duration(toTime?: ChronosInput, absolute = true): TimeDuration {
		const now = this.#date;
		const target = this.#toNewDate(toTime);

		const isFuture = target > now;
		const from = isFuture ? now : target;
		const to = isFuture ? target : now;

		let years = to.getFullYear() - from.getFullYear();
		let months = to.getMonth() - from.getMonth();
		let days = to.getDate() - from.getDate();
		let hours = to.getHours() - from.getHours();
		let minutes = to.getMinutes() - from.getMinutes();
		let seconds = to.getSeconds() - from.getSeconds();
		let milliseconds = to.getMilliseconds() - from.getMilliseconds();

		if (milliseconds < 0) {
			milliseconds += 1000;
			seconds--;
		}

		if (seconds < 0) {
			seconds += 60;
			minutes--;
		}

		if (minutes < 0) {
			minutes += 60;
			hours--;
		}

		if (hours < 0) {
			hours += 24;
			days--;
		}

		if (days < 0) {
			const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
			days += prevMonth.getDate();
			months--;
		}

		if (months < 0) {
			months += 12;
			years--;
		}

		const result: TimeDuration = {
			years,
			months,
			days,
			hours,
			minutes,
			seconds,
			milliseconds,
		};

		return this.#normalizeDuration(result, absolute, isFuture);
	}

	/**
	 * @instance Returns the name of the current day or optional day index.
	 * @param index Optional day index (0–6, where 0 is Sunday) to override current day.
	 * @returns Name of the weekday.
	 */
	day(index?: Enumerate<7>): WeekDay {
		return DAYS[index ?? this.weekDay];
	}

	/**
	 * @instance Returns the name of the current month or optional month index.
	 * @param index Optional month index (0–11, where 0 is January) to override current month.
	 * @returns Name of the month.
	 */
	monthName(index?: Enumerate<12>): MonthName {
		return MONTHS[index ?? this.month];
	}

	/**
	 * @instance Returns an array of ISO date strings within a specific date range.
	 *
	 * - If the input is a fixed range (`from` and `to`), it includes all dates between them.
	 * - If the input is a relative range (`span` and `unit`), it starts from current date and goes forward.
	 * - If `skipDays` are provided, matching weekdays are excluded from the result.
	 *
	 * @param options - Configuration for the date range. Accepts a fixed (`RangeWithDates`) format.
	 * @returns Array of ISO date strings in either local or UTC format, excluding any skipped weekdays if specified.
	 *
	 * - Please refer to {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/calculation#getdatesinrange the documentation site} for detailed usage.
	 *
	 * @example
	 * // Using a fixed date range:
	 * new Chronos().getDatesInRange({ from: '2025-01-01', to: '2025-01-03' });
	 * // → ['2025-01-01T00:00:00+06:00', '2025-01-02T00:00:00+06:00', '2025-01-03T00:00:00+06:00']
	 *
	 * @example
	 * // Using a relative date range with skipDays:
	 * new Chronos().getDatesInRange({ span: 7, unit: 'day', skipDays: ['Saturday', 'Sunday'] });
	 * // → Array of 7 dates excluding weekends
	 *
	 * @example
	 * // UTC format:
	 * new Chronos().getDatesInRange({ span: 2, unit: 'day', format: 'utc' });
	 * // → ['2025-06-16T00:00:00.000Z', '2025-06-17T00:00:00.000Z']
	 */
	getDatesInRange(options?: RangeWithDates): string[];

	/**
	 * @instance Returns an array of ISO date strings within a specific date range.
	 *
	 * - If the input is a fixed range (`from` and `to`), it includes all dates between them.
	 * - If the input is a relative range (`span` and `unit`), it starts from current date and goes forward.
	 * - If `skipDays` are provided, matching weekdays are excluded from the result.
	 *
	 * @param options - Configuration for the date range. Accepts a relative (`RelativeDateRange`) format.
	 * @returns Array of ISO date strings in either local or UTC format, excluding any skipped weekdays if specified.
	 *
	 * - Please refer to {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/calculation#getdatesinrange the documentation site} for detailed usage.
	 *
	 * @example
	 * // Using a relative date range with skipDays:
	 * new Chronos().getDatesInRange({ span: 7, unit: 'day', skipDays: ['Saturday', 'Sunday'] });
	 * // → Array of 7 dates excluding weekends
	 *
	 * @example
	 * // UTC format:
	 * new Chronos().getDatesInRange({ span: 2, unit: 'day', format: 'utc' });
	 * // → ['2025-06-16T00:00:00.000Z', '2025-06-17T00:00:00.000Z']
	 *
	 * @example
	 * // Using a fixed date range:
	 * new Chronos().getDatesInRange({ from: '2025-01-01', to: '2025-01-03' });
	 * // → ['2025-01-01T00:00:00+06:00', '2025-01-02T00:00:00+06:00', '2025-01-03T00:00:00+06:00']
	 */
	getDatesInRange(options?: RelativeDateRange): string[];

	/**
	 * @instance Generates a list of ISO date strings within a specified range.
	 *
	 * - Accepts either an explicit date range (`from` and `to`) or a relative range (`span` and `unit`).
	 * - If `skipDays` are provided, matching weekdays are excluded from the result.
	 *
	 * @param options - Optional configuration object defining either a fixed or relative date range.
	 * @returns An array of ISO date strings in local or UTC format, depending on the `format` option.
	 *
	 * - Please refer to {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/calculation#getdatesinrange the documentation site} for detailed usage.
	 */
	getDatesInRange(options?: DatesInRangeOptions): string[] {
		let startDate = this.clone(),
			endDate = startDate.addWeeks(4);

		const { format = 'local', onlyDays, skipDays, roundDate = false } = options ?? {};

		if (options) {
			if ('from' in options || 'to' in options) {
				if (options?.from) {
					startDate = new Chronos(options?.from);
				}
				if (options?.to) {
					endDate = new Chronos(options?.to);
				}
			} else if ('span' in options || 'unit' in options) {
				const { span = 4, unit = 'week' } = options ?? {};
				endDate = startDate.add(span, unit);
			}
		}

		const datesInRange: string[] = [];

		const filterSet = new Set<number>(
			(isValidArray(onlyDays) ? onlyDays
			: isValidArray(skipDays) ? skipDays
			: []
			).map((day) => (typeof day === 'number' ? day : DAYS.indexOf(day)))
		);

		const end = roundDate ? endDate.startOf('day') : endDate;
		let current = roundDate ? startDate.startOf('day') : startDate;

		while (current.isSameOrBefore(end, 'day')) {
			const shouldFilter =
				onlyDays?.length ?
					filterSet.has(current.weekDay)
				:	!filterSet.has(current.weekDay);

			if (shouldFilter) {
				datesInRange.push(
					format === 'local' ? current.toLocalISOString() : current.toISOString()
				);
			}

			current = current.add(1, 'day');
		}

		return datesInRange;
	}

	/**
	 * @static Parses a date string with a given format (limited support only).
	 *
	 * * **Supported format tokens**:
	 * - `YYYY`: Full year (e.g., 2023)
	 * - `YY`: Two-digit year (e.g., 23 for 2023, 99 for 1999)
	 * - `MM`: Month (01-12)
	 * - `M`: Month (1-9)
	 * - `DD`: Day of the month (01-31)
	 * - `D`: Day of the month (1-9)
	 * - `HH`: Hour (00-23)
	 * - `H`: Hour (0-9)
	 * - `mm`: Minute (00-59)
	 * - `m`: Minute (0-9)
	 * - `ss`: Second (00-59)
	 * - `s`: Second (0-9)
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
	static parse(dateStr: string, format: string): Chronos {
		const tokenPatterns: Record<string, string> = {
			YYYY: '(?<YYYY>\\d{4})',
			YY: '(?<YY>\\d{2})',
			MM: '(?<MM>\\d{2})',
			M: '(?<M>\\d{1,2})',
			DD: '(?<DD>\\d{2})',
			D: '(?<D>\\d{1,2})',
			HH: '(?<HH>\\d{2})',
			H: '(?<H>\\d{1,2})',
			mm: '(?<mm>\\d{2})',
			m: '(?<m>\\d{1,2})',
			ss: '(?<ss>\\d{2})',
			s: '(?<s>\\d{1,2})',
		};

		const tokenToComponent: Record<string, keyof ChronosDateParts> = {
			YYYY: 'year',
			YY: 'year',
			MM: 'month',
			M: 'month',
			DD: 'date',
			D: 'date',
			HH: 'hour',
			H: 'hour',
			mm: 'minute',
			m: 'minute',
			ss: 'second',
			s: 'second',
		};

		type ChronosDateParts = {
			year: number;
			month: number;
			date: number;
			hour: number;
			minute: number;
			second: number;
		};

		const tokenRegex = new RegExp(Object.keys(tokenPatterns).join('|'), 'g');

		const trimmedInput = dateStr.trim();

		const regexStr = format
			.trim()
			.replace(tokenRegex, (token) => tokenPatterns[token] ?? token)
			.replace(/\s+/g, '\\s*');

		const match = new RegExp(`^${regexStr}\\s*$`).exec(trimmedInput);

		if (!match?.groups) {
			throw new Error('Invalid date format');
		}

		const parts: Partial<ChronosDateParts> = {};

		for (const [token, value] of Object.entries(match.groups)) {
			const key = tokenToComponent[token];
			if (key) {
				let num = Number(value);
				if (token === 'YY') num += num < 100 ? 2000 : 0;
				parts[key] = num;
			}
		}

		return new Chronos(
			new Date(
				parts?.year ?? 1970,
				(parts?.month ?? 1) - 1,
				parts?.date ?? 1,
				parts?.hour ?? 0,
				parts?.minute ?? 0,
				parts?.second ?? 0
			)
		).#withOrigin('parse');
	}

	/**
	 * @static Creates a new `Chronos` instance with the provided time component(s).
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
	static with(options: ChronosWithOptions): Chronos {
		const now = new Chronos();

		const { year, month, date, hour, minute, second, millisecond } = options ?? {};

		const nextLDoM = () => {
			return now
				.startOf('month')
				.set('year', year ?? now.year)
				.set('month', month ? month - 1 : now.month).lastDateOfMonth;
		};

		return new Chronos(
			year ?? now.year,
			month ?? now.isoMonth,
			date ? date
			: now.isLastDayOfMonth() && now.date >= nextLDoM() ? nextLDoM()
			: now.date,
			hour ?? now.hour,
			minute ?? now.minute,
			second ?? now.second,
			millisecond ?? now.millisecond
		).#withOrigin('with');
	}

	/**
	 * @static Returns the current date and time in a specified format in local time.
	 * * Default format is dd, `mmm DD, YYYY HH:mm:ss` = `Sun, Apr 06, 2025 16:11:55`
	 * @param options - Configure format string and whether to format using utc offset.
	 * @returns Formatted date string in desired format.
	 */
	static today(options?: FormatOptions): string {
		const { format = 'dd, mmm DD, YYYY HH:mm:ss', useUTC = false } = options || {};
		const today = new Date();
		return new Chronos(today).#format(format, useUTC);
	}

	/**
	 * @static Returns a new `Chronos` instance representing yesterday's date.
	 *
	 * @returns A `Chronos` instance for the previous calendar day.
	 */
	static yesterday(): Chronos {
		const today = new Date();

		const yesterday = today.setDate(today.getDate() - 1);

		return new Chronos(yesterday).#withOrigin('yesterday');
	}

	/**
	 * @static Returns a new `Chronos` instance representing tomorrow's date.
	 *
	 * @returns A `Chronos` instance for the next calendar day.
	 */
	static tomorrow(): Chronos {
		const today = new Date();

		const yesterday = today.setDate(today.getDate() + 1);

		return new Chronos(yesterday).#withOrigin('tomorrow');
	}

	/**
	 * @static Returns the number of milliseconds elapsed since midnight, January 1, 1970 Universal Coordinated Time (UTC).
	 * * It basically calls `Date.now()`.
	 * @returns The number of milliseconds elapsed since the Unix epoch.
	 */
	static now(): number {
		return Date.now();
	}

	/**
	 * @static Creates a UTC-based Chronos instance.
	 * If no date is provided, it uses the current date and time.
	 *
	 * **This is the base time, meaning conversion in other timezone will consider UTC time as the base time.**
	 *
	 * @param dateLike Optional input date to base the UTC time on.
	 * If omitted, the current system date/time is used.
	 * @returns A new Chronos instance representing the UTC equivalent of the input.
	 */
	static utc(dateLike?: ChronosInput): Chronos {
		const chronos = new Chronos(dateLike);

		if (chronos.#offset === 'UTC+00:00') {
			return chronos.#withOrigin('utc');
		}

		const previousOffset = chronos.getTimeZoneOffsetMinutes();

		const date = chronos.#date;

		const utc = new Date(date.getTime() - previousOffset * 60 * 1000);

		return new Chronos(utc).#withOrigin('utc');
	}

	/**
	 * @static Formats a time-only string into a formatted time string.
	 *
	 * @param time - Time string to be formatted. Supported formats include:
	 * - `HH:mm` → e.g., `'14:50'`
	 * - `HH:mm:ss` → e.g., `'14:50:00'`
	 * - `HH:mm:ss.mss` → e.g., `'14:50:00.800'`
	 * - `HH:mm+TimeZoneOffset(HH)` → e.g., `'14:50+06'`
	 * - `HH:mm+TimeZoneOffset(HH:mm)` → e.g., `'14:50+06:00'`
	 * - `HH:mm:ss+TimeZoneOffset(HH)` → e.g., `'14:50:00+06'`
	 * - `HH:mm:ss+TimeZoneOffset(HH:mm)` → e.g., `'14:50:00+05:30'`
	 * - `HH:mm:ss.mss+TimeZoneOffset(HH)` → e.g., `'14:50:00.800+06'`
	 * - `HH:mm:ss.mss+TimeZoneOffset(HH:mm)` → e.g., `'14:50:00.800+06:30'`
	 *
	 * * *Input will default to today's date and assume local timezone if no offset is provided.*
	 *
	 * @param format - Format string accepted by `formatStrict()` method (`TimeParts`) for time part only. Default: `hh:mm:ss a` → 02:33:36 pm.
	 * @returns Formatted time string in local (System) time.
	 */
	static formatTimePart(time: string, format?: TimeParts): string {
		function normalizeOffset(timeStr: string): string {
			return timeStr.replace(/([+-]\d{2})(?!:)/, '$1:00');
		}

		const timeWithDate = `${new Chronos().#format('YYYY-MM-DD')}T${normalizeOffset(time)}`;

		return new Chronos(timeWithDate).formatStrict(format ?? 'hh:mm:ss a');
	}

	/**
	 * @static Returns ISO date strings for each occurrence of a weekday from today, spanning a relative time range.
	 *
	 * @param day - The weekday to match (e.g., `'Wednesday'`, `'Sunday'`).
	 * @param options - Relative range (e.g., 7 days, 4 weeks) and output format (local with timezone or utc).
	 * @returns Array of ISO date strings in the specified format. Returns empty array if no matches in the time span.
	 *
	 * - Please refer to {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/statics#getdatesforday the documentation site} for detailed usage.
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
	static getDatesForDay(day: WeekDay, options?: RelativeRangeOptions): string[];

	/**
	 * @static Returns ISO date strings for each occurrence of a weekday between two fixed dates.
	 *
	 * @param day - The weekday to match (e.g., `'Monday'`, `'Friday'`).
	 * @param options - Date range (from/to, e.g. `'2025-06-30'`, ` new Date()`, `new Chronos()` etc.) and output format (local with timezone or utc).
	 * @returns Array of ISO date strings in the specified format. Returns empty array if no matches in the range.
	 *
	 * - Please refer to {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/statics#getdatesforday the documentation site} for detailed usage.
	 *
	 * @example
	 * Chronos.getDatesForDay('Monday', {
	 *   from: '2025-05-28',
	 *   to: '2025-06-30',
	 *   format: 'local'
	 * });
	 * //=> [ '2025-01-06T...', '2025-01-13T...', ... ]
	 */
	static getDatesForDay(day: WeekDay, options?: DateRangeOptions): string[];

	/**
	 * @static Returns ISO date strings for each occurrence of a weekday.
	 *
	 * @param day - The weekday to match (e.g., `'Wednesday'`, `'Sunday'`).
	 * @param options - Relative range (e.g., 7 days, 4 weeks) or date range (from/to) and output format.
	 * @returns Array of ISO date strings in the specified format.
	 *
	 * - Please refer to {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/statics#getdatesforday the documentation site} for detailed usage.
	 */
	static getDatesForDay(day: WeekDay, options?: WeekdayOptions): string[] {
		let startDate = new Chronos(),
			endDate = startDate.addWeeks(4);

		const { format = 'local', roundDate = false } = options ?? {};

		if (options) {
			if ('from' in options || 'to' in options) {
				if (options?.from) {
					startDate = new Chronos(options?.from);
				}
				if (options?.to) {
					endDate = new Chronos(options?.to);
				}
			} else if ('span' in options || 'unit' in options) {
				const { span = 4, unit = 'week' } = options ?? {};
				endDate = startDate.add(span, unit);
			}
		}

		const dayIndex = DAYS.indexOf(day);

		const end = roundDate ? endDate.startOf('day') : endDate;
		let current = roundDate ? startDate.startOf('day') : startDate;
		while (current.weekDay !== dayIndex) {
			current = current.add(1, 'day');
		}

		const result: string[] = [];

		while (current.isSameOrBefore(end, 'day')) {
			result.push(
				format === 'local' ? current.toLocalISOString() : current.toISOString()
			);
			current = current.add(1, 'week');
		}

		return result;
	}

	/**
	 * @static Returns earliest Chronos
	 * @param dates Date inputs.
	 */
	static min(...dates: ChronosInput[]): Chronos {
		return new Chronos(Math.min(...dates.map((d) => new Chronos(d).valueOf()))).#withOrigin(
			'min'
		);
	}

	/**
	 * @static Returns latest Chronos
	 * @param dates Date inputs.
	 */
	static max(...dates: ChronosInput[]): Chronos {
		return new Chronos(Math.max(...dates.map((d) => new Chronos(d).valueOf()))).#withOrigin(
			'max'
		);
	}

	/**
	 * @static Checks if the year in the date string or year (from 0 - 9999) is a leap year.
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
	static isLeapYear(date: ChronosInput): boolean {
		let year: number;

		if (typeof date === 'number') {
			if (date > 0 && date <= 9999) {
				year = date;
			} else {
				year = new Chronos(date).year;
			}
		} else {
			year = date instanceof Chronos ? date.year : new Chronos(date).year;
		}

		return isLeapYear(year);
	}

	/**
	 * @static Checks if the given value is a valid `Date` object.
	 * - A value is considered valid if it is an instance of the built-in `Date` class.
	 * - This does not check whether the date itself is valid (e.g., `new Date('invalid')`).
	 * @param value - The value to test.
	 * @returns `true` if the value is a valid Date object, otherwise `false`.
	 */
	static isValidDate(value: unknown): value is Date {
		return value instanceof Date;
	}

	/**
	 * @static Checks if the given value is a valid date string.
	 * - A value is considered a valid date string if it is a string and can be parsed by `Date.parse()`.
	 * - This uses the native JavaScript date parser internally.
	 * @param value - The value to test.
	 * @returns `true` if the value is a valid date string, otherwise `false`.
	 */
	static isDateString(value: unknown): value is string {
		return isString(value) && !isNaN(Date.parse(value));
	}

	/**
	 * @static Checks if the given value is an instance of `Chronos`.
	 * - Useful for verifying Chronos objects in type guards or validations.
	 * @param value - The value to test.
	 * @returns `true` if the value is an instance of `Chronos`, otherwise `false`.
	 */
	static isValidChronos(value: unknown): value is Chronos {
		return value instanceof Chronos;
	}

	/**
	 * @static Injects a plugin into the `Chronos` system.
	 * @param plugin The plugin to inject.
	 *
	 * - **NOTE:** *Once a plugin is injected, all the registered methods for that plugin will be available for the whole project.*
	 * - See {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/plugins#-official-plugins full list of plugins and the methods they register}.
	 */
	static use(plugin: ChronosPlugin): void {
		if (!Chronos.#plugins.has(plugin)) {
			Chronos.#plugins.add(plugin);
			plugin(Chronos);
		}
	}
}
