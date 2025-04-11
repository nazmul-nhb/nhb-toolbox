import { isString } from '../guards/primitives';
import type { LocaleCode } from '../number/types';
import { getOrdinal } from '../number/utilities';
import { formatUnitWithPlural } from '../string/convert';
import {
	DAYS,
	DEFAULT_RANGES,
	MONTHS,
	ORIGIN,
	sortedFormats,
	TIME_ZONE_LABELS,
	TIME_ZONES,
} from './constants';
import { isLeapYear, isValidUTCOffSet } from './guards';
import type {
	ChronosFormat,
	ChronosInput,
	ChronosMethods,
	ChronosObject,
	DayPart,
	DayPartConfig,
	FormatOptions,
	StrictFormat,
	TimeUnit,
	TimeZone,
	UTCOffSet,
} from './types';
import { extractMinutesFromUTC, formatUTCOffset } from './utils';

/**
 * * Creates a new immutable `Chronos` instance.
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
	#date: Date;
	#offset: UTCOffSet;
	[ORIGIN]?: ChronosMethods | 'root';

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
	 * @param value - A date value in `string`, it should be in a format that can be parsed by the `Date` constructor.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	constructor(value: string);

	/**
	 * * Creates a new immutable `Chronos` instance.
	 *
	 * @param value - A date value as `Date` object, it will be used as is.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	constructor(value: Date);

	/**
	 * * Creates a new immutable `Chronos` instance.
	 *
	 * @param value - A date value as `Chronos` object.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	constructor(value: Chronos);

	/**
	 * * Creates a new immutable `Chronos` instance.
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
	constructor(
		year: number,
		month: number,
		date?: number,
		hours?: number,
		minutes?: number,
		seconds?: number,
		ms?: number,
	);

	/**
	 * * Creates a new immutable `Chronos` instance.
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
	 * @param valueOrYear The value in number, string, Date or Chronos format or the full year designation is required for cross-century date accuracy. If year is between 0 and 99 is used, then year is assumed to be 1900 + year.
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
		ms?: number,
	) {
		let newDate: Date;

		if (typeof valueOrYear === 'number' && typeof month === 'number') {
			newDate = new Date(
				valueOrYear,
				month - 1,
				date ?? 1,
				hours ?? 0,
				minutes ?? 0,
				seconds ?? 0,
				ms ?? 0,
			);
		} else {
			newDate = this.#toNewDate(valueOrYear);
		}

		this.#date = newDate;
		this[ORIGIN] = 'root';
		this.#offset = `UTC${this.getUTCOffset()}` as UTCOffSet;
	}

	*[Symbol.iterator](): IterableIterator<[string, number]> {
		yield ['year', this.year];
		yield ['month', this.month];
		yield ['isoMonth', this.month + 1];
		yield ['date', this.date];
		yield ['weekDay', this.weekDay];
		yield ['isoWeekDay', this.weekDay + 1];
		yield ['hour', this.hour];
		yield ['minute', this.minute];
		yield ['second', this.second];
		yield ['millisecond', this.millisecond];
	}

	/**
	 * * Enables primitive coercion like `console.log`, `${chronos}`, etc.
	 * @param hint - The type hint provided by the JS engine.
	 * @returns The primitive value based on the hint.
	 */
	[Symbol.toPrimitive](hint: string): string | number {
		if (hint === 'number') return this.valueOf();
		return this.toLocalISOString();
	}

	[Symbol.replace](string: string, replacement: string): string {
		switch (this[ORIGIN]) {
			case 'timeZone':
			case 'toUTC':
			case 'utc':
				return string.replace(
					this.toISOString().replace(
						/\.\d+(Z|[+-]\d{2}:\d{2})?$/,
						'',
					),
					replacement,
				);
			default:
				return string.replace(
					this.toLocalISOString().replace(
						/\.\d+(Z|[+-]\d{2}:\d{2})?$/,
						'',
					),
					replacement,
				);
		}
	}

	[Symbol.search](string: string): number {
		switch (this[ORIGIN]) {
			case 'timeZone':
			case 'toUTC':
			case 'utc':
				return string.indexOf(
					this.toISOString().replace(
						/\.\d+(Z|[+-]\d{2}:\d{2})?$/,
						'',
					),
				);
			default:
				return string.indexOf(
					this.toLocalISOString().replace(
						/\.\d+(Z|[+-]\d{2}:\d{2})?$/,
						'',
					),
				);
		}
	}

	[Symbol.split](string: string): string[] {
		switch (this[ORIGIN]) {
			case 'timeZone':
			case 'toUTC':
			case 'utc':
				return string.split(
					this.toISOString().replace(
						/\.\d+(Z|[+-]\d{2}:\d{2})?$/,
						'',
					),
				);
			default:
				return string.split(
					this.toLocalISOString().replace(
						/\.\d+(Z|[+-]\d{2}:\d{2})?$/,
						'',
					),
				);
		}
	}

	get [Symbol.toStringTag](): string {
		switch (this[ORIGIN]) {
			case 'timeZone':
				return this.toISOString().replace('Z', this.#offset.slice(3));
			case 'toUTC':
			case 'utc':
				return this.#toLocalISOString().replace(
					this.getUTCOffset(),
					'Z',
				);
			default:
				return this.#toLocalISOString();
		}
	}

	/**
	 * @private @instance Method to create native `Date` instance from date-like data types.
	 * @param value The value to convert into `Date`.
	 * @returns Instance of native Date object.
	 */
	#toNewDate(value?: ChronosInput): Date {
		const date =
			value instanceof Chronos ?
				value.toDate()
			:	new Date(value ?? Date.now());

		// Check if the date is invalid
		if (isNaN(date.getTime())) {
			throw new Error('Provided date is invalid!');
		}

		return date;
	}

	/**
	 * @private @instance Method to tag origin of the `Chronos` instance.
	 *
	 * @param origin Origin of the instance, the method name from where it was created.
	 * @param offset Optional UTC offset in `UTC+12:00` format.
	 * @returns The `Chronos` instance with the specified origin.
	 */
	#withOrigin(origin: ChronosMethods, offset?: UTCOffSet): Chronos {
		const instance = new Chronos(this.#date);
		instance[ORIGIN] = origin;
		if (offset) instance.#offset = offset;
		return instance;
	}

	/**
	 * @private @instance Formats the current `Chronos` date using the specified template.
	 *
	 * @param format - The desired date format.
	 * @param useUTC - Whether to use UTC or local time.
	 * @returns Formatted date string.
	 */
	#format(format: string, useUTC = false): string {
		const year =
			useUTC ? this.#date.getUTCFullYear() : this.#date.getFullYear();
		const month = useUTC ? this.#date.getUTCMonth() : this.#date.getMonth();
		const day = useUTC ? this.#date.getUTCDay() : this.#date.getDay();
		const date = useUTC ? this.#date.getUTCDate() : this.#date.getDate();
		const hours = useUTC ? this.#date.getUTCHours() : this.#date.getHours();
		const minutes =
			useUTC ? this.#date.getUTCMinutes() : this.#date.getMinutes();
		const seconds =
			useUTC ? this.#date.getUTCSeconds() : this.#date.getSeconds();
		const milliseconds =
			useUTC ?
				this.#date.getUTCMilliseconds()
			:	this.#date.getMilliseconds();

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
		};

		let result = '';
		let i = 0;

		while (i < format.length) {
			let matched = false;

			for (const token of sortedFormats) {
				const ahead = format.slice(i, i + token.length);
				const prev = i === 0 ? '' : format[i - 1];
				const next = format[i + token.length] ?? '';

				// Check non-alphanumeric boundaries
				const prevOk = i === 0 || /[^a-zA-Z0-9]/.test(prev);
				const nextOk =
					i + token.length >= format.length ||
					/[^a-zA-Z0-9]/.test(next);

				if (ahead === token && prevOk && nextOk) {
					result += dateComponents[token];
					i += token.length;
					matched = true;
					break;
				}
			}

			if (!matched) {
				result += format[i];
				i++;
			}
		}

		return result;
	}

	/** @private @instance Returns ISO string with local time zone offset */
	#toLocalISOString(): string {
		const pad = (n: number, p = 2) => String(n).padStart(p, '0');

		return `${this.year}-${pad(this.month + 1)}-${pad(this.date)}T${pad(this.hour)}:${pad(this.minute)}:${pad(this.second)}.${pad(this.millisecond, 3)}${this.getUTCOffset()}`;
	}

	/** Gets the full year of the date. */
	get year(): number {
		return this.#date.getFullYear();
	}

	/** Gets the month (0-11) of the date. */
	get month(): number {
		return this.#date.getMonth();
	}

	/** Gets the day of the month (1-31). */
	get date(): number {
		return this.#date.getDate();
	}

	/** Gets the day of the week (0-6, where 0 is Sunday). */
	get weekDay(): number {
		return this.#date.getDay();
	}

	/** Gets the hour (0-23) of the date. */
	get hour(): number {
		return this.#date.getHours();
	}

	/** Gets the minute (0-59) of the date. */
	get minute(): number {
		return this.#date.getMinutes();
	}

	/** Gets the second (0-59) of the date. */
	get second(): number {
		return this.#date.getSeconds();
	}

	/** Gets the millisecond (0-999) of the date. */
	get millisecond(): number {
		return this.#date.getMilliseconds();
	}

	/** Gets ISO weekday: 1 = Monday, 7 = Sunday */
	get isoWeekday(): number {
		const day = this.weekDay;

		return day === 0 ? 7 : day;
	}

	/** Gets ISO month (1–12 instead of 0–11) */
	get isoMonth(): number {
		return this.month + 1;
	}

	/** Gets the time value in milliseconds since midnight, January 1, 1970 UTC. */
	get unix(): number {
		return this.#date.getTime();
	}

	/** Gets the time value in milliseconds since midnight, January 1, 1970 UTC. */
	get timestamp(): number {
		return this.#date.getTime();
	}

	/** @instance Returns a debug-friendly string for `console.log` or `util.inspect`. */
	inspect(): string {
		return `[Chronos ${this.toLocalISOString()}]`;
	}

	/** @instance Clones and returns a new Chronos instance with the same date. */
	clone(): Chronos {
		return new Chronos(this.#date).#withOrigin(
			this[ORIGIN] as ChronosMethods,
		);
	}

	/** @instance Enables JSON.stringify and console logging to show readable output. */
	toJSON(): string {
		return this.toLocalISOString();
	}

	/** @instance Enables arithmetic and comparison operations (e.g., +new Chronos()). */
	valueOf(): number {
		return this.getTimeStamp();
	}

	/** @instance Gets the native `Date` instance (read-only). */
	toDate(): Date {
		switch (this[ORIGIN]) {
			case 'toUTC':
			case 'utc': {
				const mins = extractMinutesFromUTC(
					`UTC${this.getUTCOffset()}` as UTCOffSet,
				);

				const date = this.addMinutes(mins);

				return date.toDate();
			}
			default:
				return new Date(this.#date);
		}
	}

	/** @instance Returns a string representation of a date. The format of the string depends on the locale. */
	toString(): string {
		switch (this[ORIGIN]) {
			case 'timeZone': {
				const gmt = this.#offset.replace('UTC', 'GMT').replace(':', '');
				const label = TIME_ZONE_LABELS[this.#offset] ?? this.#offset;

				return this.#date
					.toString()
					.replace(/GMT[+-]\d{4} \([^)]+\)/, `${gmt} (${label})`);
			}
			case 'toUTC':
			case 'utc': {
				const mins = extractMinutesFromUTC(
					`UTC${this.getUTCOffset()}` as UTCOffSet,
				);

				const date = this.addMinutes(mins);

				return date.toString();
			}
			default:
				return this.#date.toString();
		}
	}

	/** @instance Returns ISO string with local time zone offset */
	toLocalISOString(): string {
		switch (this[ORIGIN]) {
			case 'timeZone':
			case 'toUTC':
			case 'utc': {
				const mins = extractMinutesFromUTC(
					`UTC${this.getUTCOffset()}` as UTCOffSet,
				);

				const date = this.addMinutes(mins);

				return date.#toLocalISOString();
			}
			default:
				return this.#toLocalISOString();
		}
	}

	/** @instance Returns a date as a string value in ISO format. */
	toISOString(): string {
		switch (this[ORIGIN]) {
			case 'timeZone':
				return this.#toLocalISOString().replace(
					this.getUTCOffset(),
					this.#offset.slice(3),
				);
			case 'toUTC':
			case 'utc':
				return this.#toLocalISOString().replace(
					this.getUTCOffset(),
					'Z',
				);
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
		locale?: LocaleCode | Intl.Locale | (LocaleCode | Intl.Locale)[],
		options?: Intl.DateTimeFormatOptions,
	): string {
		return this.#date.toLocaleString(locale, options);
	}

	/** @instance Returns the time value in milliseconds since midnight, January 1, 1970 UTC. */
	getTimeStamp(): number {
		return this.#date.getTime();
	}

	/**
	 * @instance Formats the date into a custom string format (local time).
	 *
	 * @param format - The desired format (Default format is `dd, mmm DD, YYYY HH:mm:ss:mss` = `Sun, Apr 06, 2025 16:11:55:379`).
	 * @param useUTC - Optional `useUTC` to get the formatted time using UTC Offset, defaults to `false`. Equivalent to `formatUTC()` method if set to `true`.
	 * @returns Formatted date string in desired format (in local time unless `useUTC` passed as `true`).
	 */
	format(
		format: string = 'dd, mmm DD, YYYY HH:mm:ss:mss',
		useUTC = false,
	): string {
		return this.#format(format, useUTC);
	}

	/**
	 * @instance Formats the date into a strict custom string format (local time).
	 * @description Select from `21,000+` pre-defined formats.
	 *
	 * @param format - The desired format (Default format is `dd, mmm DD, YYYY HH:mm:ss` = `Sun, Apr 06, 2025 16:11:55`).
	 * @param useUTC - Optional `useUTC` to get the formatted time using UTC Offset, defaults to `false`. Equivalent to `formatUTC()` method if set to `true`.
	 * @returns Formatted date string in desired strict format (in local time unless `useUTC` passed as `true`).
	 */
	formatStrict(
		format: StrictFormat = 'dd, mmm DD, YYYY HH:mm:ss',
		useUTC = false,
	): string {
		return this.#format(format, useUTC);
	}

	/**
	 * @instance Formats the date into a custom string format (UTC time).
	 *
	 * @param format - The desired format (Default format is `dd, mmm DD, YYYY HH:mm:ss:mss` = `Sun, Apr 06, 2025 16:11:55:379`).
	 * @returns Formatted date string in desired format (UTC time).
	 */
	formatUTC(format: string = 'dd, mmm DD, YYYY HH:mm:ss:mss'): string {
		switch (this[ORIGIN]) {
			case 'toUTC':
			case 'utc':
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
	 * @instance Create a new instance of `Chronos` in the specified timezone.
	 *
	 * @param zone - Standard timezone abbreviation (e.g., 'IST', 'UTC', 'EST') or UTC Offset in `UTC-01:30` format.
	 * @returns A new instance of `Chronos` with time in the given timezone. Invalid input sets time-zone to `UTC`.
	 */
	timeZone(zone: TimeZone | UTCOffSet): Chronos {
		let offset: number;
		let stringOffset: UTCOffSet;

		if (isValidUTCOffSet(zone)) {
			offset = extractMinutesFromUTC(zone);
			stringOffset = zone;
		} else {
			offset = TIME_ZONES[zone] ?? TIME_ZONES['UTC'];
			stringOffset = formatUTCOffset(offset);
		}

		const utc =
			this.#date.getTime() + this.#date.getTimezoneOffset() * 60 * 1000;

		const adjusted = new Date(utc + offset * 60 * 1000);

		return new Chronos(adjusted).#withOrigin('timeZone', stringOffset);
	}

	/**
	 * @instance Checks if the year is a leap year.
	 * - A year is a leap year if it is divisible by 4, but not divisible by 100, unless it is also divisible by 400.
	 * - For example, 2000 and 2400 are leap years, but 1900 and 2100 are not.
	 * @returns `true` if the year is a leap year, `false` otherwise.
	 */
	isLeapYear(): boolean {
		const year = this.#date.getFullYear();

		return isLeapYear(year);
	}

	/** @instance Checks if the current date is today. */
	isToday(): boolean {
		return this.getRelativeDay() === 0;
	}

	/** @instance Checks if the current date is tomorrow. */
	isTomorrow(): boolean {
		return this.getRelativeDay() === 1;
	}

	/** @instance Checks if the current date is yesterday. */
	isYesterday(): boolean {
		return this.getRelativeDay() === -1;
	}

	/**
	 * @instance Checks if another date is the same as this one in a specific unit.
	 * @param other The other date to compare.
	 * @param unit The unit to compare.
	 */
	isSame(other: ChronosInput, unit: TimeUnit): boolean {
		const time = new Chronos(other);

		return (
			this.startOf(unit).toDate().getTime() ===
			time.startOf(unit).toDate().getTime()
		);
	}

	/**
	 * @instance Checks if this date is before another date in a specific unit.
	 * @param other The other date to compare.
	 * @param unit The unit to compare.
	 */
	isBefore(other: ChronosInput, unit: TimeUnit): boolean {
		const time = new Chronos(other);

		return (
			this.startOf(unit).toDate().getTime() <
			time.startOf(unit).toDate().getTime()
		);
	}

	/**
	 * @instance Checks if this date is after another date in a specific unit.
	 * @param other The other date to compare.
	 * @param unit The unit to compare.
	 */
	isAfter(other: ChronosInput, unit: TimeUnit): boolean {
		const time = new Chronos(other);

		return (
			this.startOf(unit).toDate().getTime() >
			time.startOf(unit).toDate().getTime()
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
		inclusive: '[]' | '[)' | '(]' | '()' = '()',
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

	/** @instance Checks if currently in DST */
	isDST(): boolean {
		const jan = new Date(this.year, 0, 1);
		const jul = new Date(this.year, 6, 1);

		return (
			Math.min(jan.getTimezoneOffset(), jul.getTimezoneOffset()) !==
			this.#date.getTimezoneOffset()
		);
	}

	/**
	 * @instance Returns full time difference from now (or a specified time) down to a given level.
	 *
	 * @param level Determines the smallest unit to include in the output (e.g., 'minute' will show up to minutes, ignoring seconds). Defaults to `minute`.
	 * @param withSuffixPrefix If `true`, adds `"in"` or `"ago"` depending on whether the time is in the future or past. Defaults to `true`.
	 * @param time An optional time value to compare with (`string`, `number`, `Date`, or `Chronos` instance). Defaults to `now`.
	 * @returns The difference as a human-readable string, e.g., `2 years 1 month 9 days 18 hours 56 minutes ago`.
	 */
	fromNow(
		level: Exclude<TimeUnit, 'millisecond'> = 'minute',
		withSuffixPrefix: boolean = true,
		time?: ChronosInput,
	): string {
		const now = this.#toNewDate(time);

		const target = this.#date;

		const isFuture = target > now;

		const from = isFuture ? now : target;
		const to = isFuture ? target : now;

		let years = to.getFullYear() - from.getFullYear();
		let months = to.getMonth() - from.getMonth();
		let days = to.getDate() - from.getDate();
		let weeks = 0;
		let hours = to.getHours() - from.getHours();
		let minutes = to.getMinutes() - from.getMinutes();
		let seconds = to.getSeconds() - from.getSeconds();

		// Adjust negative values
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

		if (level === 'week' || level === 'day') {
			weeks = Math.floor(days / 7);
			days = days % 7;
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

		const unitOrder = [
			'year',
			'month',
			'week',
			'day',
			'hour',
			'minute',
			'second',
		] as const;

		const lvlIdx = unitOrder.indexOf(level);

		const parts: string[] = [];

		if (lvlIdx >= 0 && years > 0 && lvlIdx >= unitOrder.indexOf('year')) {
			parts.push(formatUnitWithPlural(years, 'year'));
		}
		if (lvlIdx >= unitOrder.indexOf('month') && months > 0) {
			parts.push(formatUnitWithPlural(months, 'month'));
		}
		if (lvlIdx >= unitOrder.indexOf('week') && weeks > 0) {
			parts.push(formatUnitWithPlural(weeks, 'week'));
		}
		if (lvlIdx >= unitOrder.indexOf('day') && days > 0) {
			parts.push(formatUnitWithPlural(days, 'day'));
		}
		if (lvlIdx >= unitOrder.indexOf('hour') && hours > 0) {
			parts.push(formatUnitWithPlural(hours, 'hour'));
		}
		if (lvlIdx >= unitOrder.indexOf('minute') && minutes > 0) {
			parts.push(formatUnitWithPlural(minutes, 'minute'));
		}
		if (
			lvlIdx >= unitOrder.indexOf('second') &&
			(seconds > 0 || parts.length === 0)
		) {
			parts.push(formatUnitWithPlural(seconds, 'second'));
		}

		let prefix = '';
		let suffix = '';

		if (withSuffixPrefix) {
			if (isFuture) {
				prefix = 'in ';
			} else {
				suffix = ' ago';
			}
		}

		return `${prefix}${parts.join(' ')}${suffix}`;
	}

	/**
	 * * Returns the part of day (`'midnight', 'lateNight', 'night', 'morning', 'afternoon', 'evening'`) based on the current hour.
	 *
	 * *Supports both normal and wraparound (overnight) ranges.*
	 *
	 * @param config - Optional custom hour ranges for each part of day.
	 *                 Each range must be a tuple of strings as `[startHour, endHour]` in 24-hour format (e.g., `['06', '11']`).
	 *                 Supports wraparound ranges like `['22', '04']` that cross midnight.
	 *
	 *                 **Default Ranges:**
	 *                 - night: ['21', '23']
	 *                 - midnight: ['00', '01']
	 *                 - lateNight: ['02', '04']
	 *                 - morning: ['05', '11']
	 *                 - afternoon: ['12', '16']
	 *                 - evening: ['17', '20']
	 *
	 * @returns The current part of the day as a string.
	 *
	 * @example
	 * chronosInstance.getPartOfDay(); // e.g., 'morning'
	 *
	 * @example
	 * // Example with custom ranges
	 * chronosInstance.getPartOfDay({
	 *   night: ['22', '04'],
	 *   morning: ['05', '11'],
	 *   afternoon: ['12', '16'],
	 *   evening: ['17', '21'],
	 *   lateNight: ['01', '03'],
	 *   midnight: ['00', '00'],
	 * });
	 */
	getPartOfDay(config?: Partial<DayPartConfig>): DayPart {
		const hour = this.#date.getHours();

		const ranges: DayPartConfig = {
			...DEFAULT_RANGES,
			...config,
		};

		for (const [part, [start, end]] of Object.entries(ranges)) {
			const from = Number(start);
			const to = Number(end);

			if (from <= to) {
				if (hour >= from && hour <= to) {
					return part as DayPart;
				}
			} else {
				// Wraparound logic (e.g., 20 to 04 means 20–23 OR 00–04)
				if (hour >= from || hour <= to) {
					return part as DayPart;
				}
			}
		}

		return 'night';
	}

	/**
	 * @instance Returns the number of full years between the input date and now.
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns The difference in number, negative is `Chronos` time is a past time else positive.
	 */
	getRelativeYear(time?: ChronosInput): number {
		const now = this.#toNewDate(time);

		let years = this.#date.getFullYear() - now.getFullYear();

		const noYearMonthDay =
			now.getMonth() < this.#date.getMonth() ||
			(now.getMonth() === this.#date.getMonth() &&
				now.getDate() < this.#date.getDate());

		if (noYearMonthDay) {
			years--;
		}

		return years;
	}

	/**
	 * @instance Returns the number of full months between the input date and now.
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns The difference in number, negative is `Chronos` time is a past time else positive.
	 */
	getRelativeMonth(time?: ChronosInput): number {
		const now = this.#toNewDate(time);

		let months =
			(this.#date.getFullYear() - now.getFullYear()) * 12 +
			(this.#date.getMonth() - now.getMonth());

		const hasNotHadMonthDay = now.getDate() < this.#date.getDate();

		if (hasNotHadMonthDay) {
			months--;
		}

		return months;
	}

	/**
	 * @instance Determines if the given date is today, tomorrow, yesterday or any relative day.
	 * @param date - The date to compare (Date object).
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns
	 *  - `-1` if the date is yesterday.
	 *  - `0` if the date is today.
	 *  - `1` if the date is tomorrow.
	 *  - Other positive or negative numbers for other relative days (e.g., `-2` for two days ago, `2` for two days ahead).
	 */
	getRelativeDay(time?: ChronosInput): number {
		const today = this.#toNewDate(time);
		// Set the time of today to 00:00:00 for comparison purposes
		today.setHours(0, 0, 0, 0);

		// Normalize the input date to 00:00:00
		const inputDate = this.#date;
		inputDate.setHours(0, 0, 0, 0);

		const diffTime = inputDate.getTime() - today.getTime();
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

		return diffDays;
	}

	/**
	 * @instance Determines how many full weeks apart the input date is from the `Chronos` instance.
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns Difference in weeks; negative if past, positive if future.
	 */
	getRelativeWeek(time?: ChronosInput): number {
		const relativeDays = this.getRelativeDay(time);
		return Math.floor(relativeDays / 7);
	}

	/**
	 * @instance Returns the number of full hours between the input date and now.
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns The difference in number, negative is `Chronos` time is a past time else positive.
	 */
	getRelativeHour(time?: ChronosInput): number {
		const diff = this.#date.getTime() - this.#toNewDate(time).getTime();
		return Math.floor(diff / (1000 * 60 * 60));
	}

	/**
	 * @instance Returns the number of full minutes between the input date and now.
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns The difference in number, negative is `Chronos` time is a past time else positive.
	 */
	getRelativeMinute(time?: ChronosInput): number {
		const diff = this.#date.getTime() - this.#toNewDate(time).getTime();
		return Math.floor(diff / (1000 * 60));
	}

	/**
	 * @instance Returns the number of full seconds between the input date and now.
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns The difference in number, negative is `Chronos` time is a past time else positive.
	 */
	getRelativeSecond(time?: ChronosInput): number {
		const diff = this.#date.getTime() - this.#toNewDate(time).getTime();
		return Math.floor(diff / 1000);
	}

	/**
	 * @instance Returns the number of milliseconds between the input date and now.
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns The difference in number, negative is `Chronos` time is a past time else positive.
	 */
	getRelativeMilliSecond(time?: ChronosInput): number {
		return this.#date.getTime() - this.#toNewDate(time).getTime();
	}

	/**
	 * @instance Compares the stored date with now, returning the difference in the specified unit.
	 *
	 * @param unit The time unit to compare by. Defaults to 'minute'.
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns The difference in number, negative is `Chronos` time is a past time else positive.
	 */
	compare(unit: TimeUnit = 'minute', time?: ChronosInput): number {
		switch (unit) {
			case 'year':
				return this.getRelativeYear(time);
			case 'month':
				return this.getRelativeMonth(time);
			case 'day':
				return this.getRelativeDay(time);
			case 'week':
				return this.getRelativeWeek(time);
			case 'hour':
				return this.getRelativeHour(time);
			case 'minute':
				return this.getRelativeMinute(time);
			case 'second':
				return this.getRelativeSecond(time);
			case 'millisecond':
				return this.getRelativeMilliSecond(time);
			default:
				throw new Error(`Unsupported time unit: ${unit}`);
		}
	}

	/**
	 * @instance Returns a new Chronos instance at the start of a given unit.
	 * @param unit The unit to reset (e.g., year, month, day).
	 */
	startOf(unit: TimeUnit): Chronos {
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
				const day = d.getDay(); // 0 (Sun) - 6 (Sat)
				const diff = (day + 6) % 7; // convert Sunday=0 to 6, Monday=1 to 0, etc.

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
	 */
	endOf(unit: TimeUnit): Chronos {
		return this.startOf(unit)
			.add(1, unit)
			.add(-1, 'millisecond')
			.#withOrigin('endOf');
	}

	/**
	 * @instance Returns a new Chronos instance with the specified unit added.
	 * @param amount The amount to add (can be negative).
	 * @param unit The time unit to add.
	 */
	add(amount: number, unit: TimeUnit): Chronos {
		const d = new Date(this.#date);

		switch (unit) {
			case 'millisecond':
				d.setMilliseconds(d.getMilliseconds() + amount);
				break;
			case 'second':
				d.setSeconds(d.getSeconds() + amount);
				break;
			case 'minute':
				d.setMinutes(d.getMinutes() + amount);
				break;
			case 'hour':
				d.setHours(d.getHours() + amount);
				break;
			case 'day':
				d.setDate(d.getDate() + amount);
				break;
			case 'week':
				d.setDate(d.getDate() + amount * 7);
				break;
			case 'month':
				d.setMonth(d.getMonth() + amount);
				break;
			case 'year':
				d.setFullYear(d.getFullYear() + amount);
				break;
		}

		return new Chronos(d).#withOrigin('add');
	}

	/**
	 * @instance Returns a new Chronos instance with the specified unit subtracted.
	 * @param amount The amount to subtract (can be negative).
	 * @param unit The time unit to add.
	 */
	subtract(amount: number, unit: TimeUnit): Chronos {
		return this.add(-amount, unit).#withOrigin('subtract');
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
				return this.setWeek(value);
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
		const time = new Chronos(other);

		const msDiff = this.#date.getTime() - time.toDate().getTime();

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

	/** @instance Returns a short human-readable string like "2h ago", "in 5m" */
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
	setWeek(week: number): Chronos {
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
	 * @instance Calculates the ISO week number of the year.
	 * @returns Week number (1-53).
	 */
	getWeek(): number {
		// ISO week starts on Monday
		const target = this.startOf('week').add(3, 'day');

		const firstThursday = new Chronos(new Date(target.year, 0, 4))
			.startOf('week')
			.add(3, 'day');

		const week = target.diff(firstThursday, 'week');

		return week;
	}

	/** @instance Returns ISO week year */
	getWeekYear(): number {
		const d = this.startOf('week').add(3, 'day'); // Thursday of current ISO week
		return d.year;
	}

	/** @instance Returns day of year (1 - 366) */
	getDayOfYear(): number {
		const start = new Date(this.year, 0, 1);
		const diff = this.#date.getTime() - start.getTime();
		return Math.floor(diff / 86400000) + 1;
	}

	/** @instance Returns number of days in current month */
	daysInMonth(): number {
		return new Date(this.year, this.month + 1, 0).getDate();
	}

	/** @instance Converts to object with all date unit parts */
	toObject(): ChronosObject {
		return Object.fromEntries([...this]) as unknown as ChronosObject;
	}

	/** @instance Converts to array with all date unit parts */
	toArray() {
		return Object.values(this.toObject());
	}

	/** @instance Returns offset like +06:00 */
	getUTCOffset(): string {
		const offset = -this.#date.getTimezoneOffset();
		const sign = offset >= 0 ? '+' : '-';

		const pad = (n: number) =>
			String(Math.floor(Math.abs(n))).padStart(2, '0');

		return `${sign}${pad(offset / 60)}:${pad(offset % 60)}`;
	}

	/** @instance Returns new Chronos instance in UTC */
	toUTC(): Chronos {
		const date = this.#date;
		const utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
		return new Chronos(utc).#withOrigin('toUTC');
	}

	/** @instance Returns new Chronos instance in local time */
	toLocal(): Chronos {
		const date = this.#date;
		const utc = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
		return new Chronos(utc).#withOrigin('toLocal');
	}

	/**
	 * @static Parses a date string with a given format (partial support)
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
	 * @param dateStr - The date string to be parsed
	 * @param format - The format of the date string. Tokens like `YYYY`, `MM`, `DD`, `HH`, `mm`, `ss` are used to specify the structure.
	 * @returns A new `Chronos` instance representing the parsed date.
	 * @throws `Error` If the date string does not match the format.
	 */
	static parse(dateStr: string, format: string): Chronos {
		const formatMap = {
			YYYY: 'year',
			YY: 'year',
			MM: 'month',
			DD: 'date',
			HH: 'hour',
			mm: 'minute',
			ss: 'second',
		} as const;

		const regex = format.replace(/YYYY|YY|MM|DD|HH|mm|ss/g, (match) => {
			return `(?<${match}>\\d{${match.length}})`; // Adjust regex for each format token
		});

		const match = new RegExp(`^${regex}$`).exec(dateStr);

		if (!match?.groups) {
			throw new Error('Invalid date format');
		}

		const values = Object.entries(match.groups).reduce(
			(acc, [key, val]) => {
				const map = formatMap[key as keyof typeof formatMap];

				if (map) {
					acc[map] = Number(val);
				}

				return acc;
			},
			{} as Record<string, number>,
		);

		// Adjust for 2-digit year (YY) by assuming the year is in the 1900s or 2000s
		if (values.year && values.year < 100) {
			// Assuming 21st century for years < 100 (00-99 becomes 2000-2099)
			values.year += 2000;
		}

		return new Chronos(
			new Date(
				values.year ?? 1970,
				(values.month ?? 1) - 1,
				values.date ?? 1,
				values.hour ?? 0,
				values.minute ?? 0,
				values.second ?? 0,
			),
		).#withOrigin('parse');
	}

	/**
	 * @static Returns the current date and time in a specified format in local time.
	 * * Default format is dd, `mmm DD, YYYY HH:mm:ss` = `Sun, Apr 06, 2025 16:11:55`
	 * @param options - Configure format string and whether to format using utc offset.
	 * @returns Formatted date string in desired format.
	 */
	static today(options?: FormatOptions): string {
		const { format = 'dd, mmm DD, YYYY HH:mm:ss', useUTC = false } =
			options || {};
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
	 * @static Creates UTC Chronos
	 * @param dateLike Date input to create utc time.
	 */
	static utc(dateLike: ChronosInput): Chronos {
		const date = new Chronos(dateLike).#date;
		const utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
		return new Chronos(utc).#withOrigin('utc');
	}

	/**
	 * @static Returns earliest Chronos
	 * @param dates Date inputs.
	 */
	static min(...dates: ChronosInput[]): Chronos {
		return new Chronos(
			Math.min(...dates.map((d) => new Chronos(d).valueOf())),
		).#withOrigin('min');
	}

	/**
	 * @static Returns latest Chronos
	 * @param dates Date inputs.
	 */
	static max(...dates: ChronosInput[]): Chronos {
		return new Chronos(
			Math.max(...dates.map((d) => new Chronos(d).valueOf())),
		).#withOrigin('max');
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
}
