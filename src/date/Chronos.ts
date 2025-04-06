import { DAYS, MONTHS, sortedFormats, TIME_ZONES } from './constants';
import { isValidUTCOffSet } from './guards';
import type {
	ChronosFormat,
	FormatOptions,
	TimeUnit,
	TimeZone,
	UTCOffSet,
} from './types';
import { extractMinutesFromUTC } from './utils';

export class Chronos {
	readonly #date: Date;
	// readonly preview: string;

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
		// this.preview = this.toISOString();
	}

	get [Symbol.toStringTag](): string {
		return this.toISOString();
	}

	/**
	 * * Enables primitive coercion like `console.log`, `${chronos}`, etc.
	 * @param hint - The type hint provided by the JS engine.
	 * @returns The primitive value based on the hint.
	 */
	[Symbol.toPrimitive](hint: string): string | number {
		if (hint === 'number') return this.valueOf();
		return this.toString();
	}

	/** * Enables JSON.stringify and console logging to show readable output. */
	toJSON(): string {
		return this.toISOString();
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
		return this.#date.toString();
	}

	/** * Returns a date as a string value in ISO format. */
	toISOString(): string {
		return this.#date.toISOString();
	}

	/** * Returns the time value in milliseconds since midnight, January 1, 1970 UTC. */
	getTimeStamp(): number {
		return this.#date.getTime();
	}

	/** * Returns the date value as a `Date` object. */
	get date(): Date {
		return this.#date;
	}

	/** * Returns the time value in milliseconds since midnight, January 1, 1970 UTC. */
	get unix(): number {
		return this.#date.getTime();
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
	 * @param useUTC - Optional `useUTC` to get the formatted time using UTC Offset, defaults to `false`.
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
		return this.#format(format, true);
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
	 * * Returns full time difference from now (or specified time) in years, months, days, hours, minutes, and seconds.
	 * @param time An optional time value (`number`, `string`, `Date`, or `Chronos` object).
	 * @returns The difference as string, e.g., `2 years 1 month 9 days 18 hours 56 minutes 9 seconds ago`.
	 */
	fromNow(time?: string | number | Date | Chronos): string {
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

		const parts: string[] = [];
		if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
		if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
		if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
		if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
		if (minutes > 0)
			parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
		if (seconds > 0 || parts.length === 0)
			parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);

		return `${isFuture ? 'in ' : ''}${parts.join(' ')}${isFuture ? '' : ' ago'}`;
	}

	/**
	 * * Returns the number of full years between the input date and now.
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns The difference in number, negative is `Chronos` time is a past time else positive.
	 */
	getRelativeYear(time?: string | number | Date | Chronos): number {
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
	getRelativeMonth(time?: string | number | Date | Chronos): number {
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
	getRelativeDay(time?: string | number | Date | Chronos): number {
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
	getRelativeHour(time?: string | number | Date | Chronos): number {
		const diff = this.#date.getTime() - this.#toNewDate(time).getTime();
		return Math.floor(diff / (1000 * 60 * 60));
	}

	/**
	 * * Returns the number of full minutes between the input date and now.
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns The difference in number, negative is `Chronos` time is a past time else positive.
	 */
	getRelativeMinute(time?: string | number | Date | Chronos): number {
		const diff = this.#date.getTime() - this.#toNewDate(time).getTime();
		return Math.floor(diff / (1000 * 60));
	}

	/**
	 *  * Returns the number of full seconds between the input date and now.
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns The difference in number, negative is `Chronos` time is a past time else positive.
	 */
	getRelativeSecond(time?: string | number | Date | Chronos): number {
		const diff = this.#date.getTime() - this.#toNewDate(time).getTime();
		return Math.floor(diff / 1000);
	}

	/**
	 * * Returns the number of milliseconds between the input date and now.
	 * @param time Optional time to compare with the `Chronos` date/time.
	 * @returns The difference in number, negative is `Chronos` time is a past time else positive.
	 */
	getRelativeMilliSecond(time?: string | number | Date | Chronos): number {
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
		time?: string | number | Date | Chronos,
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
}
