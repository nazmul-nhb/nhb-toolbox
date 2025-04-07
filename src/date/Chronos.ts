import type { LocaleCode } from '../number/types';
import { DAYS, MONTHS, sortedFormats, TIME_ZONES } from './constants';
import { isValidUTCOffSet } from './guards';
import type {
	ChronosFormat,
	ChronosObject,
	FormatOptions,
	TimeUnit,
	TimeZone,
	UTCOffSet,
} from './types';
import { extractMinutesFromUTC } from './utils';

const ORIGIN = Symbol('origin');

export class Chronos {
	readonly #date: Date;
	[ORIGIN]?: string;

	/**
	 * * Creates a new immutable `Chronos` instance.
	 *
	 * @param value - A date value (`number`, `string`, `Date`, or `Chronos` object).
	 * - If a string is provided, it should be in a format that can be parsed by the Date constructor.
	 * - If a number is provided, it should be a timestamp (milliseconds since the Unix epoch).
	 * - If a Date object is provided, it will be used as is.
	 * - If a Chronos object is provided, it will be converted to a Date object.
	 */
	constructor(value?: number | string | Date | Chronos) {
		const date = this.#toNewDate(value);

		this.#date = date;
		this[ORIGIN] = 'root';
	}

	*[Symbol.iterator](): IterableIterator<[string, number]> {
		yield ['year', this.year];
		yield ['month', this.month];
		yield ['isoMonth', this.month + 1];
		yield ['date', this.date];
		yield ['day', this.day];
		yield ['isoDay', this.day + 1];
		yield ['hour', this.hour];
		yield ['minute', this.minute];
		yield ['second', this.second];
		yield ['millisecond', this.millisecond];
	}

	#withOrigin(origin: string): Chronos {
		const instance = new Chronos(this.#date);
		instance[ORIGIN] = origin;
		return instance;
	}

	get [Symbol.toStringTag](): string {
		switch (this[ORIGIN]) {
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
	 * * Enables primitive coercion like `console.log`, `${chronos}`, etc.
	 * @param hint - The type hint provided by the JS engine.
	 * @returns The primitive value based on the hint.
	 */
	[Symbol.toPrimitive](hint: string): string | number {
		if (hint === 'number') return this.valueOf();
		return this.toLocalISOString();
	}

	/** Returns a debug-friendly string for console.log or util.inspect */
	public inspect(): string {
		return `[Chronos ${this.toLocalISOString()}]`;
	}

	/** * Clones and returns a new Chronos instance with the same date. */
	public clone(): Chronos {
		return new Chronos(this.#date);
	}

	/** * Enables JSON.stringify and console logging to show readable output. */
	toJSON(): string {
		return this.toLocalISOString();
	}

	/** * Enables arithmetic and comparison operations (e.g., +new Chronos()). */
	valueOf(): number {
		return this.getTimeStamp();
	}

	/** * Gets the native `Date` instance (read-only). */
	toDate(): Date {
		return new Date(this.#date);
	}

	/** * Returns a string representation of a date. The format of the string depends on the locale. */
	toString(): string {
		switch (this[ORIGIN]) {
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

	/** * Returns ISO string with local time zone offset */
	#toLocalISOString(): string {
		const pad = (n: number, p = 2) => String(n).padStart(p, '0');

		return `${this.year}-${pad(this.month + 1)}-${pad(this.date)}T${pad(this.hour)}:${pad(this.minute)}:${pad(this.second)}.${pad(this.millisecond, 3)}${this.getUTCOffset()}`;
	}

	/** * Returns ISO string with local time zone offset */
	toLocalISOString(): string {
		switch (this[ORIGIN]) {
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

	/** * Returns a date as a string value in ISO format. */
	toISOString(): string {
		switch (this[ORIGIN]) {
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
	 *  * Wrapper over native `toLocaleString`
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

	/** * Returns the time value in milliseconds since midnight, January 1, 1970 UTC. */
	getTimeStamp(): number {
		return this.#date.getTime();
	}

	/** * Returns the time value in milliseconds since midnight, January 1, 1970 UTC. */
	get unix(): number {
		return this.#date.getTime();
	}

	get year(): number {
		return this.#date.getFullYear();
	}
	get month(): number {
		return this.#date.getMonth();
	}
	get date(): number {
		return this.#date.getDate();
	}
	get day(): number {
		return this.#date.getDay();
	}
	get hour(): number {
		return this.#date.getHours();
	}
	get minute(): number {
		return this.#date.getMinutes();
	}
	get second(): number {
		return this.#date.getSeconds();
	}
	get millisecond(): number {
		return this.#date.getMilliseconds();
	}

	/** * ISO weekday: 1 = Monday, 7 = Sunday */
	get isoWeekday(): number {
		const day = this.day;

		return day === 0 ? 7 : day;
	}

	/**
	 * @instance Returns the current date and time in a specified format in local time.
	 * * Default format is dd, `MMM DD, YYYY HH:mm:ss` = `Sun, Apr 06, 2025 16:11:55:379`
	 * @param options - Configure format string and whether to format using utc offset.
	 * @returns Formatted date string in desired format.
	 */
	today(options?: FormatOptions): string {
		const { format = 'dd, MMM DD, YYYY HH:mm:ss', useUTC = false } =
			options || {};
		const today = new Date();
		return new Chronos(today).#format(format, useUTC);
	}

	/**
	 * @static Returns the current date and time in a specified format in local time.
	 * * Default format is dd, `MMM DD, YYYY HH:mm:ss` = `Sun, Apr 06, 2025 16:11:55:379`
	 * @param options - Configure format string and whether to format using utc offset.
	 * @returns Formatted date string in desired format.
	 */
	static today(options?: FormatOptions): string {
		const { format = 'dd, MMM DD, YYYY HH:mm:ss', useUTC = false } =
			options || {};
		const today = new Date();
		return new Chronos(today).#format(format, useUTC);
	}

	/**
	 * * Returns the number of milliseconds elapsed since midnight, January 1, 1970 Universal Coordinated Time (UTC).
	 * * It basically calls `Date.now()`.
	 * @returns The number of milliseconds elapsed since the Unix epoch.
	 */
	static now(): number {
		return Date.now();
	}

	#toNewDate(value?: number | string | Date | Chronos): Date {
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
	 * @private Formats the current `Chronos` date using the specified template.
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
			MMM: MONTHS[month].slice(0, 3),
			MMMM: MONTHS[month],
			mmm: MONTHS[month].slice(0, 3),
			mmmm: MONTHS[month],
			d: DAYS[day].slice(0, 3),
			dd: DAYS[day].slice(0, 3),
			ddd: DAYS[day],
			D: String(date),
			DD: String(date).padStart(2, '0'),
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

	/**
	 * * Formats the date into a custom string format (local time).
	 *
	 * @param format - The desired format (Default format is `dd, MMM DD, YYYY HH:mm:ss:mss` = `Sun, Apr 06, 2025 16:11:55:379`).
	 * @param useUTC - Optional `useUTC` to get the formatted time using UTC Offset, defaults to `false`. Equivalent to `formatUTC()` method if set to `true`.
	 * @returns Formatted date string in desired format (in local time unless `useUTC` passed as `true`).
	 */
	format(
		format: string = 'dd, MMM DD, YYYY HH:mm:ss:mss',
		useUTC = false,
	): string {
		return this.#format(format, useUTC);
	}

	/**
	 * * Formats the date into a custom string format (UTC time).
	 *
	 * @param format - The desired format (Default format is `dd, MMM DD, YYYY HH:mm:ss:mss` = `Sun, Apr 06, 2025 16:11:55:379`).
	 * @returns Formatted date string in desired format (UTC time).
	 */
	formatUTC(format: string = 'dd, MMM DD, YYYY HH:mm:ss:mss'): string {
		switch (this[ORIGIN]) {
			case 'toUTC':
			case 'utc':
				return this.#format(format, false);
			default:
				return this.#format(format, true);
		}
	}

	/**
	 * * Adds seconds and returns a new immutable instance.
	 * @param seconds - Number of seconds to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addSeconds(seconds: number): Chronos {
		const newDate = new Date(this.#date);
		newDate.setSeconds(newDate.getSeconds() + seconds);
		return new Chronos(newDate);
	}

	/**
	 * * Adds minutes and returns a new immutable instance.
	 * @param minutes - Number of minutes to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addMinutes(minutes: number): Chronos {
		const newDate = new Date(this.#date);
		newDate.setMinutes(newDate.getMinutes() + minutes);
		return new Chronos(newDate);
	}

	/**
	 * * Adds hours and returns a new immutable instance.
	 * @param hours - Number of hours to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addHours(hours: number): Chronos {
		const newDate = new Date(this.#date);
		newDate.setHours(newDate.getHours() + hours);
		return new Chronos(newDate);
	}

	/**
	 * * Adds days and returns a new immutable instance.
	 * @param days - Number of days to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addDays(days: number): Chronos {
		const newDate = new Date(this.#date);
		newDate.setDate(newDate.getDate() + days);
		return new Chronos(newDate);
	}

	/**
	 * * Adds months and returns a new immutable instance.
	 * @param months - Number of months to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addMonths(months: number): Chronos {
		const newDate = new Date(this.#date);
		newDate.setMonth(newDate.getMonth() + months);
		return new Chronos(newDate);
	}

	/**
	 * * Adds years and returns a new immutable instance.
	 * @param years - Number of years to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addYears(years: number): Chronos {
		const newDate = new Date(this.#date);
		newDate.setFullYear(newDate.getFullYear() + years);
		return new Chronos(newDate);
	}

	/**
	 * * Subtracts days and returns a new immutable instance.
	 * @param days - Number of days to subtract.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	subtractDays(days: number): Chronos {
		return this.addDays(-days);
	}

	/**
	 * * Checks if the year is a leap year.
	 * - A year is a leap year if it is divisible by 4, but not divisible by 100, unless it is also divisible by 400.
	 * - For example, 2000 and 2400 are leap years, but 1900 and 2100 are not.
	 * @returns `true` if the year is a leap year, `false` otherwise.
	 */
	isLeapYear(): boolean {
		const year = this.#date.getFullYear();

		return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	}

	/**
	 * * Create a new instance of `Chronos` in the specified timezone.
	 *
	 * @param zone - Standard timezone abbreviation (e.g., 'IST', 'UTC', 'EST') or UTC Offset in `UTC-01:30` format.
	 * @returns A new instance of `Chronos` with time in the given timezone. Invalid input sets time-zone to `UTC`.
	 */
	timeZone(zone: TimeZone | UTCOffSet): Chronos {
		let offset: number;

		if (isValidUTCOffSet(zone)) {
			offset = extractMinutesFromUTC(zone);
		} else {
			offset = TIME_ZONES[zone] ?? TIME_ZONES['UTC'];
		}

		const utc =
			this.#date.getTime() + this.#date.getTimezoneOffset() * 60 * 1000;

		const adjusted = new Date(utc + offset * 60 * 1000);

		return new Chronos(adjusted);
	}

	/** - Checks if the current date is today. */
	isToday(): boolean {
		return this.getRelativeDay() === 0;
	}

	/** - Checks if the current date is tomorrow. */
	isTomorrow(): boolean {
		return this.getRelativeDay() === 1;
	}

	/** - Checks if the current date is yesterday. */
	isYesterday(): boolean {
		return this.getRelativeDay() === -1;
	}

	/**
	 * * Returns full time difference from now (or a specified time) down to a given level.
	 *
	 * @param level Determines the smallest unit to include in the output (e.g., 'minute' will show up to minutes, ignoring seconds). Defaults to `minute`.
	 * @param withSuffixPrefix If `true`, adds `"in"` or `"ago"` depending on whether the time is in the future or past. Defaults to `true`.
	 * @param time An optional time value to compare with (`string`, `number`, `Date`, or `Chronos` instance). Defaults to `now`.
	 * @returns The difference as a human-readable string, e.g., `2 years 1 month 9 days 18 hours 56 minutes ago`.
	 */
	fromNow(
		level: Exclude<TimeUnit, 'millisecond'> = 'minute',
		withSuffixPrefix: boolean = true,
		time?: number | string | Date | Chronos,
	): string {
		const now = this.#toNewDate(time);

		const target = this.#date;

		const isFuture = target > now;

		const from = isFuture ? now : target;
		const to = isFuture ? target : now;

		let years = to.getFullYear() - from.getFullYear();
		let months = to.getMonth() - from.getMonth();
		let days = to.getDate() - from.getDate();
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
			'day',
			'hour',
			'minute',
			'second',
		] as const;

		const lvlIdx = unitOrder.indexOf(level);

		const parts: string[] = [];

		if (lvlIdx >= 0 && years > 0 && lvlIdx >= unitOrder.indexOf('year')) {
			parts.push(`${years} year${years > 1 ? 's' : ''}`);
		}
		if (lvlIdx >= unitOrder.indexOf('month') && months > 0) {
			parts.push(`${months} month${months > 1 ? 's' : ''}`);
		}
		if (lvlIdx >= unitOrder.indexOf('day') && days > 0) {
			parts.push(`${days} day${days > 1 ? 's' : ''}`);
		}
		if (lvlIdx >= unitOrder.indexOf('hour') && hours > 0) {
			parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
		}
		if (lvlIdx >= unitOrder.indexOf('minute') && minutes > 0) {
			parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
		}
		if (
			lvlIdx >= unitOrder.indexOf('second') &&
			(seconds > 0 || parts.length === 0)
		) {
			parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
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
	 * * Returns the number of full years between the input date and now.
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns The difference in number, negative is `Chronos` time is a past time else positive.
	 */
	getRelativeYear(time?: number | string | Date | Chronos): number {
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
	 * * Returns the number of full months between the input date and now.
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns The difference in number, negative is `Chronos` time is a past time else positive.
	 */
	getRelativeMonth(time?: number | string | Date | Chronos): number {
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
	 * * Determines if the given date is today, tomorrow, yesterday or any relative day.
	 * @param date - The date to compare (Date object).
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns
	 *  - `-1` if the date is yesterday.
	 *  - `0` if the date is today.
	 *  - `1` if the date is tomorrow.
	 *  - Other positive or negative numbers for other relative days (e.g., `-2` for two days ago, `2` for two days ahead).
	 */
	getRelativeDay(time?: number | string | Date | Chronos): number {
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
	 * * Returns the number of full hours between the input date and now.
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns The difference in number, negative is `Chronos` time is a past time else positive.
	 */
	getRelativeHour(time?: number | string | Date | Chronos): number {
		const diff = this.#date.getTime() - this.#toNewDate(time).getTime();
		return Math.floor(diff / (1000 * 60 * 60));
	}

	/**
	 * * Returns the number of full minutes between the input date and now.
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns The difference in number, negative is `Chronos` time is a past time else positive.
	 */
	getRelativeMinute(time?: number | string | Date | Chronos): number {
		const diff = this.#date.getTime() - this.#toNewDate(time).getTime();
		return Math.floor(diff / (1000 * 60));
	}

	/**
	 *  * Returns the number of full seconds between the input date and now.
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns The difference in number, negative is `Chronos` time is a past time else positive.
	 */
	getRelativeSecond(time?: number | string | Date | Chronos): number {
		const diff = this.#date.getTime() - this.#toNewDate(time).getTime();
		return Math.floor(diff / 1000);
	}

	/**
	 * * Returns the number of milliseconds between the input date and now.
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns The difference in number, negative is `Chronos` time is a past time else positive.
	 */
	getRelativeMilliSecond(time?: number | string | Date | Chronos): number {
		return this.#date.getTime() - this.#toNewDate(time).getTime();
	}

	/**
	 * * Compares the stored date with now, returning the difference in the specified unit.
	 *
	 * @param unit The time unit to compare by. Defaults to 'minute'.
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns The difference in number, negative is `Chronos` time is a past time else positive.
	 */
	compare(
		unit: TimeUnit = 'minute',
		time?: number | string | Date | Chronos,
	): number {
		switch (unit) {
			case 'year':
				return this.getRelativeYear(time);
			case 'month':
				return this.getRelativeMonth(time);
			case 'day':
				return this.getRelativeDay(time);
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
	 * * Returns a new Chronos instance at the start of a given unit.
	 * @param unit The unit to reset (e.g., year, month, day).
	 */
	public startOf(unit: TimeUnit | 'week'): Chronos {
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
		return new Chronos(d);
	}

	/**
	 * * Returns a new Chronos instance at the end of a given unit.
	 * @param unit The unit to adjust (e.g., year, month, day).
	 */
	public endOf(unit: TimeUnit): Chronos {
		return this.startOf(unit).add(1, unit).add(-1, 'millisecond');
	}

	/**
	 * * Returns a new Chronos instance with the specified unit added.
	 * @param amount The amount to add (can be negative).
	 * @param unit The time unit to add.
	 */
	public add(amount: number, unit: TimeUnit): Chronos {
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
			case 'month':
				d.setMonth(d.getMonth() + amount);
				break;
			case 'year':
				d.setFullYear(d.getFullYear() + amount);
				break;
		}

		return new Chronos(d);
	}

	/**
	 * * Gets the value of a specific time unit from the date.
	 * @param unit The unit to retrieve.
	 */
	public get(unit: TimeUnit): number {
		switch (unit) {
			case 'year':
				return this.#date.getFullYear();
			case 'month':
				return this.#date.getMonth();
			case 'day':
				return this.#date.getDate();
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
	 * Returns a new Chronos instance with the specified unit set to the given value.
	 * @param unit The unit to modify.
	 * @param value The value to set for the unit.
	 */
	public set(unit: TimeUnit, value: number): Chronos {
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
		return new Chronos(d);
	}

	/**
	 * * Returns the difference between this and another date in the given unit.
	 * @param other The other date to compare.
	 * @param unit The unit in which to return the difference.
	 */
	public diff(
		other: number | string | Date | Chronos,
		unit: TimeUnit,
	): number {
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
	 * * Checks if another date is the same as this one in a specific unit.
	 * @param other The other date to compare.
	 * @param unit The unit to compare.
	 */
	public isSame(
		other: number | string | Date | Chronos,
		unit: TimeUnit,
	): boolean {
		const time = new Chronos(other);

		return (
			this.startOf(unit).toDate().getTime() ===
			time.startOf(unit).toDate().getTime()
		);
	}

	/**
	 * * Checks if this date is before another date in a specific unit.
	 * @param other The other date to compare.
	 * @param unit The unit to compare.
	 */
	public isBefore(
		other: number | string | Date | Chronos,
		unit: TimeUnit,
	): boolean {
		const time = new Chronos(other);

		return (
			this.startOf(unit).toDate().getTime() <
			time.startOf(unit).toDate().getTime()
		);
	}

	/**
	 * * Checks if this date is after another date in a specific unit.
	 * @param other The other date to compare.
	 * @param unit The unit to compare.
	 */
	public isAfter(
		other: number | string | Date | Chronos,
		unit: TimeUnit,
	): boolean {
		const time = new Chronos(other);

		return (
			this.startOf(unit).toDate().getTime() >
			time.startOf(unit).toDate().getTime()
		);
	}

	/**
	 * * Returns a human-readable relative calendar time like "Today at 3:00 PM"
	 * @param baseDate Optional base date to compare with.
	 */
	calendar(baseDate?: number | string | Date | Chronos): string {
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

	/** * Returns a short human-readable string like "2h ago", "in 5m" */
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

	/** * Returns ISO week number */
	getWeek(): number {
		// ISO week starts on Monday
		const target = this.startOf('week').add(3, 'day');

		const firstThursday = new Chronos(new Date(target.year, 0, 4))
			.startOf('week')
			.add(3, 'day');

		const daysDiff = target.diff(firstThursday, 'day');
		const week = Math.floor(daysDiff / 7) + 1;

		return week;
	}

	/** * Returns ISO week year */
	getWeekYear(): number {
		const d = this.startOf('week').add(3, 'day'); // Thursday of current ISO week
		return d.year;
	}

	/** * Returns day of year (1 - 366) */
	getDayOfYear(): number {
		const start = new Date(this.year, 0, 1);
		const diff = this.#date.getTime() - start.getTime();
		return Math.floor(diff / 86400000) + 1;
	}

	/**
	 * * Checks if the current date is between the given start and end dates.
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
		start: number | string | Date | Chronos,
		end: number | string | Date | Chronos,
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

	/** * Returns number of days in current month */
	daysInMonth(): number {
		return new Date(this.year, this.month + 1, 0).getDate();
	}

	/** * Converts to object with all date unit parts */
	toObject(): ChronosObject {
		return Object.fromEntries([...this]) as unknown as ChronosObject;
	}

	/** * Converts to array with all date unit parts */
	toArray() {
		return Object.values(this.toObject());
	}

	/** * Returns offset like +06:00 */
	getUTCOffset(): string {
		const offset = -this.#date.getTimezoneOffset();
		const sign = offset >= 0 ? '+' : '-';

		const pad = (n: number) =>
			String(Math.floor(Math.abs(n))).padStart(2, '0');

		return `${sign}${pad(offset / 60)}:${pad(offset % 60)}`;
	}

	/** * Checks if currently in DST */
	isDST(): boolean {
		const jan = new Date(this.year, 0, 1);
		const jul = new Date(this.year, 6, 1);

		return (
			Math.min(jan.getTimezoneOffset(), jul.getTimezoneOffset()) !==
			this.#date.getTimezoneOffset()
		);
	}

	/** * Returns new Chronos instance in UTC */
	toUTC(): Chronos {
		const date = this.#date;
		const utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
		return new Chronos(utc).#withOrigin('toUTC');
	}

	/** * Returns new Chronos instance in local time */
	toLocal(): Chronos {
		const date = this.#date;
		const utc = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
		return new Chronos(utc).#withOrigin('toLocal');
	}

	/** @static Parses a date string with a given format (partial support) */
	static parse(dateStr: string, format: string): Chronos {
		const formatMap = {
			YYYY: 'year',
			MM: 'month',
			DD: 'date',
			HH: 'hour',
			mm: 'minute',
			ss: 'second',
		} as const;

		const regex = format.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => {
			return `(?<${match}>\\d{${match.length}})`;
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

		return new Chronos(
			new Date(
				values.year ?? 1970,
				(values.month ?? 1) - 1,
				values.date ?? 1,
				values.hour ?? 0,
				values.minute ?? 0,
				values.second ?? 0,
			),
		);
	}

	/**
	 * @static Creates UTC Chronos
	 * @param dateLike Date input to create utc time.
	 */
	static utc(dateLike: number | string | Date | Chronos): Chronos {
		const date = new Chronos(dateLike).#date;
		const utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
		return new Chronos(utc).#withOrigin('utc');
	}

	/**
	 * @static Returns earliest Chronos
	 * @param dates Date inputs.
	 */
	static min(...dates: (number | string | Date | Chronos)[]): Chronos {
		return new Chronos(
			Math.min(...dates.map((d) => new Chronos(d).valueOf())),
		);
	}

	/**
	 * @static Returns latest Chronos
	 * @param dates Date inputs.
	 */
	static max(...dates: (number | string | Date | Chronos)[]): Chronos {
		return new Chronos(
			Math.max(...dates.map((d) => new Chronos(d).valueOf())),
		);
	}
}
