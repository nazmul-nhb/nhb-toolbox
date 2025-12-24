import { isString } from '../guards/primitives';
import type { Numeric } from '../types/index';
import { isValidUTCOffset } from './guards';
import {
	_formatDate,
	_gmtToUtcOffset,
	_normalizeOffset,
	_resolveNativeTzName,
} from './helpers';
import { NATIVE_TZ_IDS } from './timezone';
import type {
	$DateUnit,
	$TimeZoneIdentifier,
	ClockTime,
	DateFormatOptions,
	HourMinutes,
	TimeOnlyFormat,
	TimeZoneDetails,
	TimeZoneIdNative,
	UTCOffset,
} from './types';

/**
 * * Extracts the hour and minute from a time string in `HH:MM` or `-HH:MM` format.
 *
 * @param time - The time string to extract from.
 * @return The extracted hour and minute as number tuple.
 */
export function extractHourMinute(time: `-${ClockTime}` | ClockTime): [number, number] {
	const [hour, minute] = time.split(':').map(Number);

	return [hour, minute];
}

/**
 * * Converts a time string `HH:MM` or `-HH:MM` into total minutes from `00:00`.
 *
 * @param time - The time in `HH:MM` or `-HH:MM` format.
 * @returns The total minutes elapsed since `00:00`.
 */
export function getTotalMinutes(time: `-${ClockTime}` | ClockTime): number {
	const isNegative = time.startsWith('-');

	const [h, m] = extractHourMinute(isNegative ? (time.slice(1) as ClockTime) : time);

	const total = h * 60 + m;

	return isNegative ? -total : total;
}

/**
 * * Returns the current date and time as `Date` object.
 * - All the methods and properties of `new Date()` are accessible.
 *
 * @returns The current date and time as a `Date` object.
 */
export function getCurrentDateTime(): Date {
	return new Date();
}

/**
 * * Extract Time in `HH:MM` format from given UTC value.
 *
 * @param utc UTC value in `UTC-01:30` or `UTC+01:30` format.
 * @returns The UTC value in `HH:MM` format.
 */
export function extractTimeFromUTC(utc: UTCOffset): `-${ClockTime}` | ClockTime {
	return utc.replace(/^UTC[+]?/g, '') as `-${ClockTime}` | ClockTime;
}

/**
 * * Converts a UTC value in `UTC-01:30` or `UTC+01:30` format into total minutes in number.
 *
 * @param time - UTC value in `UTC-01:30` or `UTC+01:30` format.
 * @returns The total minutes elapsed since `00:00`.
 */
export function extractMinutesFromUTC(utc: UTCOffset): number {
	return getTotalMinutes(extractTimeFromUTC(utc));
}

/**
 * * Converts a number of minutes into a time string in "HH:MM" format.
 *
 * @param minutes - The number of minutes to convert. Can be a number or a numeric string.
 * @returns A string representing the time in "HH:MM" format.
 *
 * @remarks Always returns the absolute value of the minutes, ignoring the sign if they are negative.
 *
 * @example
 * convertMinutesToTime(75); // "1:15"
 * convertMinutesToTime(-45); // "0:45"
 */
export function convertMinutesToTime(minutes: Numeric): HourMinutes {
	const numMIn = Math.abs(typeof minutes === 'number' ? minutes : Number(minutes));

	return `${String(Math.floor(numMIn / 60))}:${String(numMIn % 60).padStart(2, '0')}` as HourMinutes;
}

/**
 * * Converts a minute-based offset to a UTC offset string in the format `UTC±HH:MM`.
 *
 * @param minutes - The offset in minutes (positive or negative).
 * @returns A formatted UTC offset string like `UTC+05:30` or `UTC-04:00`.
 */
export function formatUTCOffset(minutes: Numeric): UTCOffset {
	const numMIn = typeof minutes === 'number' ? minutes : Number(minutes);

	const sign = numMIn < 0 ? '-' : '+';
	const abs = Math.abs(numMIn);
	const hours = String(Math.floor(abs / 60)).padStart(2, '0');
	const mins = String(abs % 60).padStart(2, '0');

	return `UTC${sign}${hours}:${mins}` as UTCOffset;
}

/** Get the current system's time zone identifier using {@link Intl.DateTimeFormat} API. */
export function getNativeTimeZoneId() {
	return Intl.DateTimeFormat().resolvedOptions().timeZone as TimeZoneIdNative;
}

/**
 * * Retrieves comprehensive time zone details using the {@link Intl.DateTimeFormat} API.
 * @param tzId Optional timezone identifier. Defaults to the system timezone.
 * @param date Optional date for which to resolve the information.
 * @returns Object containing time zone identifier, names, and offset.
 */
export function getTimeZoneDetails(tzId?: $TimeZoneIdentifier, date?: Date) {
	const TZ_NAME_TYPES = ['long', 'longGeneric', 'longOffset'] as const;
	type TZNameKey = `tzName${Capitalize<(typeof TZ_NAME_TYPES)[number]>}`;

	const $tzId = tzId || getNativeTimeZoneId();

	const obj = { tzIdentifier: $tzId } as TimeZoneDetails;

	for (const type of TZ_NAME_TYPES) {
		const key = `tzName${type[0].toUpperCase()}${type.slice(1)}` as TZNameKey;

		obj[key] = _resolveNativeTzName($tzId, type, date);
	}

	return obj;
}

/** Cache for offset to time zone */
const TZ_MAP = new Map<UTCOffset, TimeZoneIdNative[]>();

/**
 * * Resolves all IANA time-zone identifiers that match a given UTC offset.
 *
 * @remarks
 * - Uses an internal in-memory cache that persists for the lifetime of the running application.
 * - The cache is lazily populated so the `offset`-to-`time-zone` mapping is computed only once per offset.
 * - Offset and time-zone identifier detection uses the {@link Intl.DateTimeFormat} API.
 *
 * @param offset The UTC offset in `"UTC±HH:MM"` format.
 * @returns An array of matching IANA time-zone identifiers, or an empty array if the offset is invalid.
 */
export function getTimeZoneIds(offset: UTCOffset): TimeZoneIdNative[] {
	if (!isValidUTCOffset(offset)) return [];

	if (TZ_MAP.has(offset)) return TZ_MAP.get(offset) ?? [];

	for (const zone of NATIVE_TZ_IDS) {
		const partValue = _resolveNativeTzName(zone, 'longOffset');

		const off = _gmtToUtcOffset(partValue);

		if (off) TZ_MAP.set(off, [...(TZ_MAP.get(off) ?? []), zone]);
	}

	return TZ_MAP.get(offset) ?? [];
}

/**
 * * Formats a date into a specified string format.
 *
 * @param options Options to control date and time formatting.
 *
 * @remarks
 * - If no date is provided, the current date and time will be used.
 * - If the provided date is invalid, the function will return `"Invalid Date!"`.
 * - The default format is `'dd, mmm DD, YYYY HH:mm:ss'` (e.g., `'Sun, Apr 06, 2025 16:11:55'`).
 * - By default, local time is used; set `useUTC` to `true` to format in UTC.
 * - The format string supports various tokens for date and time components, as well as literal text enclosed in square brackets.
 * - See {@link https://toolbox.nazmul-nhb.dev/docs/utilities/date/formatDate#format-tokens format tokens} for details on supported tokens.
 * - For more complex date/time manipulations, consider using the {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos Chronos} class.
 *
 * @returns Date/time string in specified format.
 */
export function formatDate(options?: DateFormatOptions): string {
	const {
		date = new Date(),
		format = 'dd, mmm DD, YYYY HH:mm:ss',
		useUTC = false,
	} = options ?? {};

	const $date =
		date instanceof Date ? date : (
			new Date(isString(date) ? date.replace(/['"]/g, '') : date)
		);

	if (isNaN($date.getTime())) {
		return 'Invalid Date!';
	}

	/** Get unit value for {@link $date} for specific unit in local or UTC time */
	const _getUnitValue = (suffix: $DateUnit): number => {
		return useUTC ? $date[`getUTC${suffix}`]() : $date[`get${suffix}`]();
	};

	const y = _getUnitValue('FullYear'),
		mo = _getUnitValue('Month'),
		d = _getUnitValue('Day'),
		dt = _getUnitValue('Date'),
		h = _getUnitValue('Hours'),
		m = _getUnitValue('Minutes'),
		s = _getUnitValue('Seconds'),
		ms = _getUnitValue('Milliseconds');

	const offset = useUTC ? 'Z' : formatUTCOffset(-$date.getTimezoneOffset()).slice(3);

	return _formatDate(format, y, mo, d, dt, h, m, s, ms, offset);
}

/**
 * * Formats a time-only string into a formatted time string.
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
 * - *Input will default to today's date and assume local timezone if no offset is provided.*
 *
 * @param format - Format tokens accepted by {@link formatDate} method ({@link TimeOnlyFormat}) for time part only.
 *                 Default: `hh:mm:ss a` → 02:33:36 pm.
 * @returns Formatted time string in local (System) time.
 */
export function formatTimePart(time: string, format?: TimeOnlyFormat): string {
	const timeWithDate = `${formatDate({ format: 'YYYY-MM-DD' })}T${_normalizeOffset(time)}`;

	return formatDate({ date: timeWithDate, format: format || 'hh:mm:ss a' });
}
