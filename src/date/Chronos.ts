import { isValidArray } from '../guards/non-primitives';
import { isString } from '../guards/primitives';
import type { Enumerate, NumberRange } from '../number/types';
import type { LooseLiteral, TupleOf } from '../utils/types';
import { DAYS, INTERNALS, MONTHS } from './constants';
import { isLeapYear } from './guards';
import { _formatDateCore } from './helpers';
import type {
	$DateUnit,
	$PluginMethods,
	$TimeZoneIdentifier,
	$UTCOffset,
	ChronosInput,
	ChronosInternals,
	ChronosMethods,
	ChronosObject,
	ChronosPlugin,
	ChronosWithOptions,
	DateRangeOptions,
	DatesInRangeOptions,
	DateTimeFormatOptions,
	FormatOptions,
	LocalesArguments,
	Milliseconds,
	MonthName,
	Quarter,
	RangeWithDates,
	RelativeDateRange,
	RelativeRangeOptions,
	StrictFormat,
	TimeParts,
	TimeUnit,
	TimeUnitValue,
	TimeZone,
	TimeZoneId,
	TimeZoneIdNative,
	TimeZoneName,
	TimeZoneNameNative,
	UTCOffset,
	WeekDay,
	WeekdayOptions,
} from './types';
import { extractMinutesFromUTC } from './utils';

/** Date parts for `Chronos` as `Record<part, number>` */
type $DateParts = {
	year: number;
	month: number;
	date: number;
	hour: number;
	minute: number;
	second: number;
	millisecond: number;
};

/**
 * * Creates a new immutable local-aware `Chronos` instance.
 *
 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC
 * and convert it to the **equivalent local time** using the current environment's UTC offset.*
 *
 * @param value - A date value (`number`, `string`, `Date`, or `Chronos` object).
 * - If a string is provided, it should be in a format that can be parsed by the `Date` constructor.
 * - If a number is provided, it should be a timestamp (milliseconds since the Unix epoch).
 * - If a `Date` object is provided, it will be used as is.
 * - If a `Chronos` object is provided, it will be converted to a `Date` object.
 *
 * **It also accepts number values as following:**
 * - **`year, month, date, hours, minutes, seconds, milliseconds`**: Individual components of a date-time to construct a `Chronos` instance.
 *   - **`year`**: A number representing the year. If the year is between 0 and 99, it will be assumed to be the year 1900 + the provided year.
 *   - **`month`**: A number between 1 and 12 representing the month (1 for January, 12 for December).
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
	#offset: UTCOffset;
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

		withOrigin(instance, method, offset, tzName, tzId, tzTracker) {
			return instance.#withOrigin(
				method as $PluginMethods,
				offset,
				tzName,
				tzId,
				tzTracker
			);
		},

		toNewDate(instance, value) {
			return instance.#toNewDate(value);
		},
	};

	/** Origin of the `Chronos` instance (Method that created `new Chronos`), useful for tracking instance. */
	origin: ChronosMethods | 'root';

	/**
	 * * `Chronos` date/time as Native JS `Date` object.
	 *
	 * - Also accessible via {@link toDate} instance method.
	 */
	native: Date;

	/**
	 * * Current (time zone) UTC offset in `UTC±HH:mm` format.
	 *
	 * - Also accessible via {@link getTimeZoneOffset} instance method without `UTC` prefix (returns in `±HH:mm` format).
	 */
	utcOffset: UTCOffset;

	/**
	 * Represents the current timezone name (e.g., `"Bangladesh Standard Time"`), or falls back to the corresponding timezone identifier (e.g., `"Asia/Dhaka"`) if no name can be resolved.
	 *
	 * @remarks
	 * - Invoking the {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/conversion#timezone timeZone} method sets the timezone name that corresponds to the specified UTC offset, or the UTC offset itself if no name exists. For more details on this behavior, see {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/names#gettimezonename getTimeZoneName}.
	 * - To retrieve the local system's native timezone name (or its identifier if the name is unavailable), use the {@link $getNativeTimeZoneName} instance method.
	 */
	timeZoneName: LooseLiteral<TimeZoneName>;

	/**
	 * Represents the current timezone context, which can be a single identifier, an array of equivalent identifiers, or a UTC offset.
	 *
	 * - **{@link $TimeZoneIdentifier}** — e.g., `"Asia/Dhaka"`. Returned when the {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/conversion#timezone timeZone} method has not been invoked. It is default behaviour.
	 * - **Array of {@link $TimeZoneIdentifier}** — e.g., `[ 'Asia/Calcutta', 'Asia/Colombo' ]`, used when multiple timezones share the same UTC offset such as `"UTC+05:30"`.
	 * - **{@link UTCOffset}** — e.g., `"UTC+06:45"` or `"UTC+02:15"`, returned when no named timezone corresponds to a given offset.
	 *
	 * @remarks
	 * - By default, when {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/conversion#timezone timeZone} is not applied, a single {@link $TimeZoneIdentifier} string is provided.
	 * - When applied, it may instead return a single identifier string, an array of equivalent identifiers or a UTC offset string.
	 * - To retrieve the local system's native timezone identifier, use the {@link $getNativeTimeZoneId} instance method.
	 */
	timeZoneId: TimeZoneId;

	/** Tracker to identify the instance created by {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/conversion#timezone timeZone} method */
	protected $tzTracker?: $TimeZoneIdentifier | TimeZone | UTCOffset;

	/**
	 * * Creates a new immutable local-aware `Chronos` instance.
	 *
	 * Accepts no arguments (defaults to now).
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	constructor();

	/**
	 * * Creates a new immutable local-aware `Chronos` instance.
	 *
	 * @param value - A date value in `number`, it should be a timestamp (milliseconds since the Unix epoch).
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	constructor(value: number);

	/**
	 * * Creates a new immutable local-aware `Chronos` instance.
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
	 * * Creates a new immutable local-aware `Chronos` instance.
	 *
	 * @param value - A date value as `Date` object, it will be used as is.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	constructor(value: Date);

	/**
	 * * Creates a new immutable local-aware `Chronos` instance.
	 *
	 * @param value - A date value as `Chronos` object.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	constructor(value: Chronos);

	/**
	 * * Creates a new immutable local-aware `Chronos` instance.
	 *
	 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC
	 * and convert it to the **equivalent local time** using the current environment's UTC offset.*
	 *
	 * @param year The full year designation is required for cross-century date accuracy. If year is between 0 and 99, year is assumed to be 1900 + year.
	 * @param month The month as a `number` between 1 and 12 (January to December).
	 * @param date The date as a `number` between 1 and 31.
	 * @param hours Must be supplied if minutes is supplied. A `number` from 0 to 23 (midnight to 11pm) that specifies the hour.
	 * @param minutes Must be supplied if seconds is supplied. A `number` from 0 to 59 that specifies the minutes.
	 * @param seconds Must be supplied if milliseconds is supplied. A `number` from 0 to 59 that specifies the seconds.
	 * @param ms A `number` from 0 to 999 that specifies the milliseconds.
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
	 * * Creates a new immutable local-aware `Chronos` instance.
	 *
	 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC
	 * and convert it to the **equivalent local time** using the current environment's UTC offset.*
	 *
	 * @param value - A date value (`number`, `string`, `Date`, or `Chronos` object).
	 * - If a `string` is provided, it should be in a format that can be parsed by the `Date` constructor.
	 * - If a `number` is provided, it should be a timestamp (milliseconds since the Unix epoch).
	 * - If a `Date` object is provided, it will be used as is.
	 * - If a `Chronos` object is provided, it will be used directly.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 */
	constructor(value?: ChronosInput);

	/**
	 * * Creates a new immutable local-aware `Chronos` instance.
	 *
	 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC
	 * and convert it to the **equivalent local time** using the current environment's UTC offset.*
	 *
	 * @param valueOrYear The value in `number`, `string`, `Date` or `Chronos` format or the full year designation is required for cross-century date accuracy. If year is between 0 and 99, year is assumed to be 1900 + year.
	 * @param month The month as a `number` between 1 and 12 (1: January to 12: December).
	 * @param date The date as a `number` between 1 and 31.
	 * @param hours Must be supplied if minutes is supplied. A `number` from 0 to 23 (midnight to 11pm) that specifies the hour.
	 * @param minutes Must be supplied if seconds is supplied. A `number` from 0 to 59 that specifies the minutes.
	 * @param seconds Must be supplied if milliseconds is supplied. A `number` from 0 to 59 that specifies the seconds.
	 * @param ms A `number` from 0 to 999 that specifies the milliseconds.
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
		this.utcOffset = this.#offset;
		this.timeZoneName = this.$getNativeTimeZoneName();
		this.timeZoneId = this.$getNativeTimeZoneId();
	}

	// ! ======= Symbol Methods ======= //

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
		yield ['timestamp', this.getTimeStamp()];
		yield ['unix', this.unix];
	}

	[Symbol.toPrimitive](hint: string): string | number {
		if (hint === 'number') return this.getTimeStamp();
		return this.toLocalISOString();
	}

	[Symbol.replace](string: string, replacement: string): string {
		return string.replace(this.#removeUTCFromISO(), replacement);
	}

	[Symbol.search](string: string): number {
		return string.indexOf(this.#removeUTCFromISO());
	}

	[Symbol.split](string: string): string[] {
		return string.split(this.#removeUTCFromISO());
	}

	[Symbol.match](string: string): RegExpMatchArray | null {
		const [datePart, timePart] = this.toLocalISOString().split('.')[0].split('T');

		const fuzzyDate = datePart.replace(/-/g, '[-/]?'); // Allow 2025-09-01, 2025/09/01, or 20250901
		const fuzzyTime = timePart?.replace(/:/g, '[:.]?'); // Allow 13:26:00, 13.26.00, or 132600

		const pattern = timePart ? `${fuzzyDate}(?:[T ]?${fuzzyTime})?` : fuzzyDate;

		return string.match(new RegExp(pattern));
	}

	get [Symbol.toStringTag](): string {
		return this.toLocalISOString();
	}

	get [Symbol.isConcatSpreadable](): boolean {
		return true;
	}

	// ! ======= Special Public Methods ======= //

	/**
	 * @instance Retrieves the local system's current time zone name (e.g., `"Bangladesh Standard Time"`), or falls back to its corresponding IANA time zone identifier (e.g., `"Asia/Dhaka"`) if the name cannot be determined.
	 *
	 * @remarks
	 * - This method always reflects the local machine's time zone if `tzId` is parameter is omitted.
	 * - {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/conversion#timezone timeZone}, {@link utc}, or {@link toUTC} methods have no effects on this method.
	 * - To access the time zone name of a modified or converted instance, use the {@link timeZoneName} public property instead.
	 *
	 * @param tzId Optional time zone identifier to get time zone name for that specific identifier if available.
	 *
	 * @returns The resolved time zone name or its IANA identifier as a fallback.
	 */
	$getNativeTimeZoneName(
		tzId?: $TimeZoneIdentifier
	): LooseLiteral<TimeZoneNameNative | $TimeZoneIdentifier> {
		const $tzId = tzId || this.$getNativeTimeZoneId();

		return this.#getNativeTzName($tzId) ?? $tzId;
	}

	/**
	 * @instance Retrieves the IANA time zone identifier (e.g., `"Asia/Dhaka"`, `"Africa/Harare"`) for the local system's current time zone.
	 *
	 * @remarks
	 * - This method always returns the identifier of the local machine's time zone.
	 * - {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/conversion#timezone timeZone}, {@link utc}, or {@link toUTC} methods have no effects on this method.
	 * - To obtain the identifier(s) of a modified or converted instance, use the {@link timeZoneId} public property instead.
	 *
	 * @returns The local system's IANA time zone identifier.
	 */
	$getNativeTimeZoneId(): TimeZoneIdNative {
		return Intl.DateTimeFormat().resolvedOptions().timeZone as TimeZoneIdNative;
	}

	// ! ======= Private Methods ======= //

	/** Get timestamp (milliseconds since midnight, January 1, 1970 UTC) of the current instance, not the true `Date`. */
	get #timestamp(): number {
		return this.#date.getTime();
	}

	/**
	 * @private Method to create native `Date` instance from date-like data types.
	 * @param value The value to convert into `Date`.
	 * @returns Instance of native `Date` object.
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
	 * @private Method to tag origin and other properties to the `Chronos` instance.
	 *
	 * @param origin Origin of the instance, the method name from where it was created.
	 * @param offset Optional UTC offset in `UTC±HH:mm` format.
	 * @param tzName Optional time zone name to set.
	 * @param tzId Optional time zone identifier(s) to set.
	 * @param tzTracker Optional tracker to identify the instance created by {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/conversion#timezone timeZone} method.
	 * @returns The `Chronos` instance with the specified origin and other properties.
	 */
	#withOrigin(
		origin: ChronosMethods,
		offset?: UTCOffset,
		tzName?: LooseLiteral<TimeZoneName>,
		tzId?: TimeZoneId,
		tzTracker?: $TimeZoneIdentifier | TimeZone | UTCOffset
	): Chronos {
		const instance = new Chronos(this.#date);
		instance.#ORIGIN = origin;
		instance.origin = origin;

		if (offset) {
			instance.#offset = offset;
			instance.utcOffset = offset;
		}

		if (tzName) instance.timeZoneName = tzName;
		if (tzId) instance.timeZoneId = tzId;
		if (tzTracker) instance.$tzTracker = tzTracker;

		instance.native = instance.toDate();

		return instance;
	}

	/**
	 * @private Method to pass all the current states to the provided `Chronos` instance.
	 * @param instance States to pass to the `Chronos` instance.
	 * @param origin Origin of the instates (which method created the instance).
	 * @returns The provided instance with all the current states.
	 */
	#cloneStates(instance: Chronos, origin: ChronosMethods): Chronos {
		return instance.#withOrigin(
			origin,
			this.#offset,
			this.timeZoneName,
			this.timeZoneId,
			this.$tzTracker
		);
	}

	/**
	 * @private Resolves the native long timezone name (e.g. `"Bangladesh Standard Time"`, `"Eastern Daylight Time"`) for a given timezone identifier.
	 *
	 * @param tzId The IANA timezone identifier (e.g. `"Asia/Dhaka"`, `"America/New_York"`). Defaults to the system timezone if not provided.
	 * @returns The resolved native timezone name or `undefined` if unavailable.
	 */
	#getNativeTzName(tzId?: $TimeZoneIdentifier) {
		try {
			const tzDetails = new Intl.DateTimeFormat('en', {
				timeZone: tzId,
				timeZoneName: 'long',
			}).formatToParts(this.#date);

			const tzPart = tzDetails.find((p) => p.type === 'timeZoneName');

			return tzPart?.value as LooseLiteral<TimeZoneNameNative>;
		} catch {
			return undefined;
		}
	}

	/**
	 * @private Formats the current `Chronos` date using the specified template.
	 *
	 * @param format - The desired date format.
	 * @param useUTC - Whether to use UTC or local time.
	 * @returns Formatted date string.
	 */
	#format(format: string, useUTC = false): string {
		const $date = this.#date;
		const $utcDate = this.toDate();

		/** Get unit value for {@link $date} or {@link $utcDate} for specific unit */
		const _getUnitValue = (suffix: $DateUnit): number => {
			return useUTC ? $utcDate[`getUTC${suffix}`]() : $date[`get${suffix}`]();
		};

		const y = _getUnitValue('FullYear'),
			mo = _getUnitValue('Month'),
			d = _getUnitValue('Day'),
			dt = _getUnitValue('Date'),
			h = _getUnitValue('Hours'),
			m = _getUnitValue('Minutes'),
			s = _getUnitValue('Seconds'),
			ms = _getUnitValue('Milliseconds');

		const offset = useUTC ? 'Z' : this.getTimeZoneOffset();

		return _formatDateCore(format, y, mo, d, dt, h, m, s, ms, offset);
	}

	/**
	 * @private Returns ISO string for the current date with removed timezone/utc part.
	 * @param local Whether to use {@link toLocalISOString()} method or not. Defaults to `true`.
	 * @returns Modified ISO string for the current date with removed timezone/utc part.
	 */
	#removeUTCFromISO(local = true): string {
		const search = /\.\d+(Z|[+-]\d{2}:\d{2})?$/;

		return local ?
				this.toLocalISOString().replace(search, '')
			:	this.toISOString().replace(search, '');
	}

	// ! ======= Getter Methods ======= //

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
		return Math.floor(this.getTimeStamp() / 1000);
	}

	/** Gets the time value in milliseconds since midnight, January 1, 1970 UTC. */
	get timestamp(): number {
		return this.getTimeStamp();
	}

	/** * Gets the last date (number) of the current month `(28, 29, 30 or 31)`. */
	get lastDateOfMonth(): NumberRange<28, 31> {
		return this.daysInMonth();
	}

	// ! ======= Protocol Methods ======= //

	/** @instance Returns a debug-friendly string for `console.log` or `util.inspect`. */
	inspect(): string {
		return `[Chronos ${this.toLocalISOString()}]`;
	}

	/** @instance Enables `JSON.stringify` to show readable output. Calls {@link toLocalISOString} method. */
	toJSON(): string {
		return this.toLocalISOString();
	}

	/** @instance Enables arithmetic and comparison operations (e.g., `+new Chronos()`). Calls {@link getTimeStamp} method. */
	valueOf(): number {
		return this.getTimeStamp();
	}

	// ! ======= Instance Methods ======= //

	/** @instance Clones and returns exactly same `Chronos` instance. */
	clone(): Chronos {
		return new Chronos(this.#date).#withOrigin(
			this.#ORIGIN as ChronosMethods,
			this.#offset,
			this.timeZoneName,
			this.timeZoneId,
			this.$tzTracker
		);
	}

	/** @instance Gets the native `Date` instance of the current `Chronos`. */
	toDate(): Date {
		const targetOffset = extractMinutesFromUTC(this.#offset); // e.g. +120 for Helsinki
		const systemOffset = this.getUTCOffsetMinutes(); // e.g. +360 for Dhaka
		const adjustmentMs = (targetOffset - systemOffset) * 60_000; // how many ms added before
		return new Date(this.#timestamp - adjustmentMs);
	}

	/** @instance Returns a string representation of a date. */
	toString(): string {
		return this.#format('dd mmm DD YYYY HH:mm:ss ')
			.concat(this.#offset.replace('UTC', 'GMT').replace(':', ''))
			.concat(` (${this.timeZoneName})`);
	}

	/** @instance Returns ISO time string in appropriate time zone with offset. */
	toLocalISOString(): string {
		return this.#format('YYYY-MM-DDTHH:mm:ss.mssZZ');
	}

	/** @instance Returns a date as a string value in ISO format (UTC). */
	toISOString(): string {
		return this.toDate().toISOString();
	}

	/**
	 * @instance Wrapper over native `toLocaleString` with improved type system.
	 * @description Converts a date and time to a string by using the current or specified locale.
	 *
	 * @param locales A locale string, array of locale strings, `Intl.Locale` object, or array of `Intl.Locale` objects that contain one or more language or locale tags (see: {@link LocalesArguments}). If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used.
	 * @param options An object that contains one or more properties that specify comparison options (see: {@link DateTimeFormatOptions}).
	 */
	toLocaleString(locales?: LocalesArguments, options?: DateTimeFormatOptions): string {
		return this.toUTC().toDate().toLocaleString(locales, options);
	}

	/** @instance Returns the time value in milliseconds since midnight, January 1, 1970 UTC. */
	getTimeStamp(): number {
		return this.toDate().getTime();
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
	 * - Please refer to {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/format#format-tokens format tokens} for details.
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
	 * @remarks Offers `over 21,300` predefined formats with full IntelliSense support.
	 *
	 * @param format - The desired format string. Defaults to `'dd, mmm DD, YYYY HH:mm:ss'`
	 *                 (e.g., `'Sun, Apr 06, 2025 16:11:55'`).
	 *	- Please refer to {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/format#format-tokens format tokens} for details.
	 *
	 * @param useUTC - If `true`, formats the date in UTC (equivalent to `formatUTC()`).
	 *                 Defaults to `false` (local time).
	 * @returns A formatted date string in the specified format.
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
	 * - Please refer to {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/format#format-tokens format tokens} for details.
	 *
	 * @returns Formatted date string in desired format (UTC time).
	 */
	formatUTC(format: string = 'dd, mmm DD, YYYY HH:mm:ss:mss'): string {
		return this.#format(format, true);
	}

	/**
	 * @instance Adds seconds and returns a new immutable instance.
	 * @param seconds - Number of seconds to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addSeconds(seconds: number): Chronos {
		return this.#cloneStates(this.add(seconds, 'second'), 'addSeconds');
	}

	/**
	 * @instance Adds minutes and returns a new immutable instance.
	 * @param minutes - Number of minutes to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addMinutes(minutes: number): Chronos {
		return this.#cloneStates(this.add(minutes, 'minute'), 'addMinutes');
	}

	/**
	 * @instance Adds hours and returns a new immutable instance.
	 * @param hours - Number of hours to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addHours(hours: number): Chronos {
		return this.#cloneStates(this.add(hours, 'hour'), 'addHours');
	}

	/**
	 * @instance Adds days and returns a new immutable instance.
	 * @param days - Number of days to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addDays(days: number): Chronos {
		return this.#cloneStates(this.add(days, 'day'), 'addDays');
	}

	/**
	 * @instance Adds weeks and returns a new immutable instance.
	 * @param weeks - Number of weeks to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addWeeks(weeks: number): Chronos {
		return this.#cloneStates(this.add(weeks, 'week'), 'addWeeks');
	}

	/**
	 * @instance Adds months and returns a new immutable instance.
	 * @param months - Number of months to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addMonths(months: number): Chronos {
		return this.#cloneStates(this.add(months, 'month'), 'addMonths');
	}

	/**
	 * @instance Adds years and returns a new immutable instance.
	 * @param years - Number of years to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addYears(years: number): Chronos {
		return this.#cloneStates(this.add(years, 'year'), 'addYears');
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

	/** @instance Checks if another date is exactly equal to this one. */
	isEqual(other: ChronosInput): boolean {
		return this.#timestamp === Chronos.#cast(other).#timestamp;
	}

	/** @instance Checks if another date is exactly equal to or before this one. */
	isEqualOrBefore(other: ChronosInput): boolean {
		return this.#timestamp <= Chronos.#cast(other).#timestamp;
	}

	/** @instance Checks if another date is exactly equal to or after this one. */
	isEqualOrAfter(other: ChronosInput): boolean {
		return this.#timestamp >= Chronos.#cast(other).#timestamp;
	}

	/**
	 * @instance Checks if another date is the same as this one in a specific unit.
	 * @param other The other date to compare.
	 * @param unit The unit to compare.
	 * @param weekStartsOn Optional: Day the week starts on (0 = Sunday, 1 = Monday). Applicable if week day is required. Default is `0`.
	 */
	isSame(other: ChronosInput, unit: TimeUnit, weekStartsOn: Enumerate<7> = 0): boolean {
		return (
			this.startOf(unit, weekStartsOn).#timestamp ===
			Chronos.#cast(other).startOf(unit, weekStartsOn).#timestamp
		);
	}

	/**
	 * @instance Checks if this date is before another date in a specific unit.
	 * @param other The other date to compare.
	 * @param unit The unit to compare.
	 * @param weekStartsOn Optional: Day the week starts on (0 = Sunday, 1 = Monday). Applicable if week day is required. Default is `0`.
	 */
	isBefore(other: ChronosInput, unit: TimeUnit, weekStartsOn: Enumerate<7> = 0): boolean {
		return (
			this.startOf(unit, weekStartsOn).#timestamp <
			Chronos.#cast(other).startOf(unit, weekStartsOn).#timestamp
		);
	}

	/**
	 * @instance Checks if this date is after another date in a specific unit.
	 * @param other The other date to compare.
	 * @param unit The unit to compare.
	 * @param weekStartsOn Optional: Day the week starts on (0 = Sunday, 1 = Monday). Applicable if week day is required. Default is `0`.
	 */
	isAfter(other: ChronosInput, unit: TimeUnit, weekStartsOn: Enumerate<7> = 0): boolean {
		return (
			this.startOf(unit, weekStartsOn).#timestamp >
			Chronos.#cast(other).startOf(unit, weekStartsOn).#timestamp
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
		const s = Chronos.#cast(start).getTimeStamp();
		const e = Chronos.#cast(end).getTimeStamp();
		const t = this.getTimeStamp();

		switch (inclusive) {
			case '[]':
				return t >= s && t <= e;
			case '[)':
				return t >= s && t < e;
			case '(]':
				return t > s && t <= e;
			case '()':
				return t > s && t < e;
			default:
				return false;
		}
	}

	/**
	 * @instance Checks if the date is within daylight saving time (DST).
	 * @returns Whether the date is in DST (`true` or `false`).
	 */
	isDST(): boolean {
		const year = this.year;

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

	/** @instance Returns a new `Chronos` instance set to the first day of the current month. */
	firstDayOfMonth(): Chronos {
		const firstDate = new Date(this.year, this.month, 1);
		return this.#cloneStates(new Chronos(firstDate), 'firstDayOfMonth');
	}

	/** @instance Returns a new `Chronos` instance set to the last day of the current month. */
	lastDayOfMonth(): Chronos {
		const lastDate = new Date(this.year, this.month + 1, 0);
		return this.#cloneStates(new Chronos(lastDate), 'lastDayOfMonth');
	}

	/**
	 * @instance Returns a new `Chronos` instance at the start of a given unit.
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

		return this.#cloneStates(new Chronos(d), 'startOf');
	}

	/**
	 * @instance Returns a new `Chronos` instance at the end of a given unit.
	 * @param unit The unit to adjust (e.g., year, month, day).
	 * @param weekStartsOn Optional: Day the week starts on (0 = Sunday, 1 = Monday). Applicable if week day is required. Default is `0`.
	 */
	endOf(unit: TimeUnit, weekStartsOn: Enumerate<7> = 0): Chronos {
		const instance = this.startOf(unit, weekStartsOn).add(1, unit).add(-1, 'millisecond');

		return this.#cloneStates(instance, 'endOf');
	}

	/**
	 * @instance Returns a new `Chronos` instance with the specified unit added.
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

		return this.#cloneStates(new Chronos(d), 'add');
	}

	/**
	 * @instance Returns a new `Chronos` instance with the specified unit subtracted.
	 * @param number The number of time unit to subtract (can be negative).
	 * @param unit The time unit to add.
	 */
	subtract(number: number, unit: TimeUnit): Chronos {
		return this.#cloneStates(this.add(-number, unit), 'subtract');
	}

	/**
	 * @instance Gets the value of a specific time unit from the date.
	 * @param unit The unit to retrieve. Type of return value is determined by `unit`.
	 */
	get<Unit extends TimeUnit>(unit: Unit): TimeUnitValue<Unit> {
		switch (unit) {
			case 'year':
				return this.year as TimeUnitValue<Unit>;
			case 'month':
				return this.isoMonth as TimeUnitValue<Unit>;
			case 'day':
				return this.date as TimeUnitValue<Unit>;
			case 'week':
				return this.getWeek() as TimeUnitValue<Unit>;
			case 'hour':
				return this.hour as TimeUnitValue<Unit>;
			case 'minute':
				return this.minute as TimeUnitValue<Unit>;
			case 'second':
				return this.second as TimeUnitValue<Unit>;
			case 'millisecond':
				return this.millisecond as TimeUnitValue<Unit>;
		}
	}

	/**
	 * @instance Returns a new `Chronos` instance with the specified unit set to the given value.
	 * @param unit The unit to modify. Type of `value` is determined by `unit`.
	 * @param value The value to set for the unit. Type of `value` is determined by `unit`.
	 */
	set<Unit extends TimeUnit>(unit: Unit, value: TimeUnitValue<Unit>): Chronos {
		const d = new Date(this.#date);

		switch (unit) {
			case 'year':
				d.setFullYear(value);
				break;
			case 'month':
				d.setMonth(value - 1);
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

		return this.#cloneStates(new Chronos(d), 'set');
	}

	/**
	 * @instance Returns the difference between current and another date in the given unit.
	 * @param other The other date to compare.
	 * @param unit The unit in which to return the difference.
	 * @returns Difference in number (either `integer` or `float`).
	 */
	diff(other: ChronosInput, unit: TimeUnit): number {
		const time = Chronos.#cast(other);

		const msDiff = this.#timestamp - time.#timestamp;

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
			case 'month': {
				const yearDiff = this.year - time.year;
				const monthDiff = this.month - time.month;

				const totalMonthDiff = yearDiff * 12 + monthDiff;
				const dayDiff = this.date - time.date;

				return totalMonthDiff + dayDiff / this.daysInMonth();
			}
			case 'year':
				return this.diff(time, 'month') / 12;
		}
	}

	/**
	 * @instance Returns a human-readable relative calendar time like "Today at 3:00 PM"
	 * @param baseDate Optional base date to compare with.
	 */
	calendar(baseDate?: ChronosInput): string {
		const base = baseDate ? Chronos.#cast(baseDate) : new Chronos();
		const input = this.startOf('day');

		const comparison = base.startOf('day');
		const diff = input.diff(comparison, 'day');

		const timeStr = this.toDate().toLocaleString('en', {
			hour: 'numeric',
			minute: '2-digit',
		});

		if (diff === 0) return `Today at ${timeStr}`;
		if (diff === 1) return `Tomorrow at ${timeStr}`;
		if (diff === -1) return `Yesterday at ${timeStr}`;

		return this.toDate().toLocaleString('en', {
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

		const prefix = diffInSeconds >= 0 ? 'in ' : '';
		const suffix = diffInSeconds < 0 ? ' ago' : '';

		if (abs < 60) {
			return `${prefix}${Math.floor(abs)}s${suffix}`;
		} else if (abs < 3600) {
			return `${prefix}${Math.floor(abs / 60)}m${suffix}`;
		} else if (abs < 86400) {
			return `${prefix}${Math.floor(abs / 3600)}h${suffix}`;
		} else if (abs < 2592000) {
			return `${prefix}${Math.floor(abs / 86400)}d${suffix}`;
		} else if (abs < 31536000) {
			return `${prefix}${Math.floor(abs / 2592000)}mo${suffix}`;
		} else {
			return `${prefix}${Math.floor(abs / 31536000)}y${suffix}`;
		}
	}

	/**
	 * @instance Sets the date to the Monday of the specified ISO week number within the current year.
	 * This method assumes ISO week logic, where week 1 is the week containing January 4th.
	 *
	 * @param week The ISO week number (1–53) to set the date to.
	 * @returns A new `Chronos` instance set to the start (Monday) of the specified week.
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

		return this.#cloneStates(new Chronos(d), 'setWeek');
	}

	/**
	 * @instance Calculates the ISO 8601 week number of the year.
	 *
	 * @Remarks ISO weeks start on Monday, and the first week of the year is the one containing January 4th.
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
		const startOfFirstWeek = this.startOf('year').startOf('week', weekStartsOn);

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
	 *                     Defaults to `0` (Sunday). Use 1 for strict ISO 8601.
	 * @returns The ISO week-numbering year.
	 */
	getWeekYear(weekStartsOn: Enumerate<7> = 0): number {
		const d = this.startOf('week', weekStartsOn).add(3, 'day'); // Thursday of current ISO week
		return d.year;
	}

	/** @instance Returns day of year (1 - 366) */
	getDayOfYear(): NumberRange<1, 366> {
		const diff = this.startOf('day').diff(this.startOf('year'), 'day');
		return (diff + 1) as NumberRange<1, 366>;
	}

	/** @instance Returns number of days in current month */
	daysInMonth(): NumberRange<28, 31> {
		return new Date(this.year, this.month + 1, 0).getDate() as NumberRange<28, 31>;
	}

	/** @instance Converts to object with all date unit parts */
	toObject(): ChronosObject {
		return Object.fromEntries([...this]) as {} as ChronosObject;
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
	 * This method strictly uses the **calendar year**. For fiscal quarters, use {@link toFiscalQuarter} instead.
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
	 * @instance Returns the system's current UTC offset formatted as `±HH:mm` (`+06:00` or `-07:00`).
	 *
	 * - *Unlike JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset `Date.prototype.getTimezoneOffset()`}, which returns the offset in minutes **behind** UTC (positive for locations west of UTC and negative for east), this method returns the more intuitive sign format used in timezone representations (e.g., `+06:00` means 6 hours **ahead** of UTC).*
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
	 * @instance Returns the timezone offset of this `Chronos` instance in `±HH:mm` format maintaining current timezone.
	 *
	 * - *Unlike JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset `Date.prototype.getTimezoneOffset()`}, which returns the offset in minutes **behind** UTC (positive for locations west of UTC and negative for east), this method returns the more intuitive sign format used in timezone representations (e.g., `+06:00` means 6 hours **ahead** of UTC).*
	 *
	 * @returns The timezone offset string in `±HH:mm` format maintaining the current timezone regardless of system having different one.
	 */
	getTimeZoneOffset(): $UTCOffset {
		return this.#offset.replace('UTC', '') as $UTCOffset;
	}

	/**
	 * @instance Gets the difference in minutes between Universal Coordinated Time (UTC) and the time on the local computer.
	 *
	 * - *Unlike JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset `Date.prototype.getTimezoneOffset()`}, this method returns a positive value if the local time is ahead of UTC, and negative if behind UTC.*
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
	 * This reflects the parsed or stored offset used internally by `Chronos` and follows the same
	 * sign convention: positive for timezones ahead of UTC, negative for behind.
	 *
	 * @returns The UTC offset in minutes maintaining the current timezone regardless of system having different one.
	 */
	getTimeZoneOffsetMinutes(): number {
		return extractMinutesFromUTC(this.#offset);
	}

	/** @instance Returns new `Chronos` instance in UTC time */
	toUTC(): Chronos {
		const offset = this.getTimeZoneOffsetMinutes();

		const utc = new Date(this.#timestamp - offset * 60 * 1000);

		return new Chronos(utc).#withOrigin('toUTC', 'UTC+00:00', 'Greenwich Mean Time', 'UTC');
	}

	/** @instance Returns new `Chronos` instance in local time */
	toLocal(): Chronos {
		const offset = this.getTimeZoneOffsetMinutes() - this.getUTCOffsetMinutes();

		const localTime = new Date(this.#timestamp - offset * 60 * 1000);

		return new Chronos(localTime).#withOrigin('toLocal');
	}

	/**
	 * @instance Returns the name of the current day or optional day index.
	 * @param index Optional day index (`0–6`, where `0` is `Sunday`) to override current day.
	 * @returns Name of the weekday, e.g., `'Monday'`, `'Tuesday'` etc.
	 */
	day(index?: Enumerate<7>): WeekDay {
		return DAYS[index ?? this.weekDay];
	}

	/**
	 * @instance Returns the name of the current month or optional month index.
	 * @param index Optional month index (`0–11`, where `0` is `January`) to override current month.
	 * @returns Name of the month, e.g., `'January'`, `'February'` etc.
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
	 * - Please refer to {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/calculation#getdatesinrange the documentation site} for details.
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
	 * - Please refer to {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/calculation#getdatesinrange the documentation site} for details.
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
	 * - Please refer to {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/calculation#getdatesinrange the documentation site} for details.
	 */
	getDatesInRange(options?: DatesInRangeOptions): string[] {
		let startDate = this.clone(),
			endDate = startDate.addWeeks(4);

		const { format = 'local', onlyDays, skipDays, roundDate = false } = options ?? {};

		if (options) {
			if ('from' in options || 'to' in options) {
				if (options?.from) {
					startDate = Chronos.#cast(options?.from);
				}
				if (options?.to) {
					endDate = Chronos.#cast(options?.to);
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

	// ! ======= Static Methods ======= //

	/**
	 * @static Parses a date string with a given format (limited support only).
	 *
	 * **Supported format tokens**:
	 * - `YYYY`: Full year (e.g., 2023)
	 * - `YY`: Two-digit year (e.g., 23 for 2023, 99 for 1999)
	 * - `MM`: Month (01-12)
	 * - `M`: Month (1-12)
	 * - `DD`: Day of the month (01-31)
	 * - `D`: Day of the month (1-31)
	 * - `HH`: Hour (00-23)
	 * - `H`: Hour (0-23)
	 * - `mm`: Minute (00-59)
	 * - `m`: Minute (0-59)
	 * - `ss`: Second (00-59)
	 * - `s`: Second (0-59)
	 * - `mss`: Millisecond (000-999)
	 * - `ms`: Millisecond (0-999)
	 *
	 * **Example**:
	 * ```ts
	 * Chronos.parse('23-12-31 15:30:45', 'YY-MM-DD HH:mm:ss');
	 * // returns `Chronos` instance with the parsed date 2023-12-31T15:30:45
	 * ```
	 *
	 * @param dateStr - The date string to be parsed
	 * @param format - The format of the date string. Supported tokens `YYYY`, `YY` `MM`, `M`, `DD`, `D`, `HH`, `H`, `mm`, `m`, `ss`, `s`, `mss`, `ms` are used to specify the structure.
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
			mss: '(?<mss>\\d{3})',
			ms: '(?<ms>\\d{1,3})',
		};

		const tokenToComponent: Record<string, keyof $DateParts> = {
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
			mss: 'millisecond',
			ms: 'millisecond',
		};

		const tokenRegExp = new RegExp(
			Object.keys(tokenPatterns)
				.sort((a, b) => b.length - a.length)
				.join('|'),
			'g'
		);

		const regexStr = format
			?.trim()
			?.replace(tokenRegExp, (token) => tokenPatterns[token] ?? token)
			?.replace(/\s+/g, '\\s*');

		const match = new RegExp(`^${regexStr}\\s*$`).exec(dateStr.trim());

		if (!match?.groups) {
			throw new Error('Invalid date format!');
		}

		const parts: Partial<$DateParts> = {};

		for (const [token, value] of Object.entries(match.groups)) {
			const key = tokenToComponent[token];

			if (key) {
				let num = Number(value);

				if (token === 'YY') {
					num += num < 100 ? 2000 : 0;
				}

				parts[key] = num;
			}
		}

		return new Chronos(
			parts?.year ?? 1970,
			parts?.month ?? 1,
			parts?.date ?? 1,
			parts?.hour ?? 0,
			parts?.minute ?? 0,
			parts?.second ?? 0,
			parts?.millisecond ?? 0
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
				.set('month', month ?? now.isoMonth).lastDateOfMonth;
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
		return new Chronos().#format(format, useUTC);
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
	 * * It basically calls {@link Date.now()}.
	 * @returns The number of milliseconds elapsed since the Unix epoch.
	 */
	static now(): number {
		return Date.now();
	}

	/**
	 * @static Creates a UTC-based `Chronos` instance.
	 * If no date is provided, it uses the current date and time.
	 *
	 * **This is the base time, meaning conversion in other timezone will consider UTC time as the base time.**
	 *
	 * @param dateLike Optional input date to base the UTC time on.
	 * If omitted, the current system date/time is used.
	 * @returns A new `Chronos` instance representing the UTC equivalent of the input.
	 */
	static utc(dateLike?: ChronosInput): Chronos {
		const chronos = new Chronos(dateLike);

		const offset = chronos.getTimeZoneOffsetMinutes();

		const utc = new Date(chronos.#timestamp - offset * 60 * 1000);

		return new Chronos(utc).#withOrigin('utc', 'UTC+00:00', 'Greenwich Mean Time', 'UTC');
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
	 * - Please refer to {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/statics#getdatesforday the documentation site} for details.
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
	 * - Please refer to {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/statics#getdatesforday the documentation site} for details.
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
	 * - Please refer to {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/statics#getdatesforday the documentation site} for details.
	 */
	static getDatesForDay(day: WeekDay, options?: WeekdayOptions): string[] {
		let startDate = new Chronos(),
			endDate = startDate.addWeeks(4);

		const { format = 'local', roundDate = false } = options ?? {};

		if (options) {
			if ('from' in options || 'to' in options) {
				if (options?.from) {
					startDate = Chronos.#cast(options?.from);
				}
				if (options?.to) {
					endDate = Chronos.#cast(options?.to);
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
	 * @static Returns the earliest `Chronos` instance based on the underlying universal {@link timestamp}.
	 *
	 * @remarks
	 * - All inputs are normalized to `Chronos` instances before comparison.
	 * - Comparison is always performed using each instance's **UTC timestamp**, ensuring a consistent and timezone-agnostic result.
	 * - When exactly two values are provided, the first value becomes the initial candidate; if the second value represents an earlier moment in time, it replaces the candidate.
	 * - The returned value is **not** one of the input objects. A new immutable `Chronos` instance is always created. Its internal timezone, offset, name, and tracking information are cloned from the winning input instance.
	 *
	 * @param dates A list of Chronos-compatible inputs (`string`, `number`, `Date` or `Chronos`).
	 * @returns A new `Chronos` instance representing the earliest moment.
	 */
	static min(...dates: ChronosInput[]): Chronos {
		let winner = Chronos.#cast(dates[0]);

		for (const d of dates) {
			const c = Chronos.#cast(d);

			if (c.getTimeStamp() < winner.getTimeStamp()) {
				winner = c;
			}
		}

		return winner.#cloneStates(winner, winner.#ORIGIN !== 'root' ? winner.#ORIGIN : 'min');
	}

	/**
	 * @static Returns the latest `Chronos` instance based on the underlying universal {@link timestamp}.
	 *
	 * @remarks
	 * - All inputs are normalized to `Chronos` instances before comparison.
	 * - Comparison is always performed using each instance's **UTC timestamp**, ensuring a consistent and timezone-agnostic result.
	 * - When exactly two values are provided, the first value becomes the initial candidate; if the second value represents a later moment in time, it replaces the candidate.
	 * - The returned value is **not** one of the input objects. A new immutable `Chronos` instance is always created. Its internal timezone, offset, name, and tracking information are cloned from the winning input instance.
	 *
	 * @param dates A list of Chronos-compatible inputs (`string`, `number`, `Date` or `Chronos`).
	 * @returns A new `Chronos` instance representing the latest moment.
	 */
	static max(...dates: ChronosInput[]): Chronos {
		let winner = Chronos.#cast(dates[0]);

		for (const d of dates) {
			const c = Chronos.#cast(d);

			if (c.getTimeStamp() > winner.getTimeStamp()) {
				winner = c;
			}
		}

		return winner.#cloneStates(winner, winner.#ORIGIN !== 'root' ? winner.#ORIGIN : 'max');
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
			year = Chronos.#cast(date).year;
		}

		return isLeapYear(year);
	}

	/**
	 * @static Checks if the given value is a valid `Date` object.
	 * - A value is considered valid if it is an instance of the built-in `Date` class.
	 * - This does not check whether the date itself is valid (e.g., `new Date('invalid')`).
	 * @param value - The value to test.
	 * @returns `true` if the value is a valid `Date` object, otherwise `false`.
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
	 * - Useful for verifying `Chronos` objects in type guards or validations.
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
	 * @remarks
	 * - Using this (`use`) method in `React` projects may trigger *linter error* like `"React Hooks must be called in a React function component or a custom React Hook function."`
	 * 	- To prevent this incorrect *linter error* in `React` projects, prefer using {@link register} method (alias `use` method).
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
	static register(plugin: ChronosPlugin): void {
		Chronos.use(plugin);
	}

	/** @static Ensures the input is a `Chronos` instance, creating one if necessary. */
	static #cast(date: ChronosInput): Chronos {
		return date instanceof Chronos ? date : new Chronos(date);
	}
}

export { chronos } from './chronos-fn';
