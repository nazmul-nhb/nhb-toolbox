import { getOrdinal } from '../number/utilities';
import type { Numeric } from '../types/index';
import { DAYS, MONTHS, SORTED_TIME_FORMATS } from './constants';
import type {
	$DateUnit,
	$TimeZoneIdentifier,
	ChronosFormat,
	ClockTime,
	DateFormatOptions,
	HourMinutes,
	TimeZoneDetails,
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

/**
 * * Retrieves comprehensive time zone details using the {@link Intl.DateTimeFormat} API.
 * @param tzId Optional timezone identifier. Defaults to the system timezone.
 * @param date Optional date for which to resolve the information.
 * @returns Object containing time zone identifier, names, and offset.
 */
export function getTimeZoneDetails(tzId?: $TimeZoneIdentifier, date?: Date) {
	const TZ_NAME_TYPES = ['long', 'longGeneric', 'longOffset'] as const;
	type TZNameKey = `tzName${Capitalize<(typeof TZ_NAME_TYPES)[number]>}`;

	const $tzId =
		tzId || (Intl.DateTimeFormat().resolvedOptions().timeZone as $TimeZoneIdentifier);

	const obj = { tzIdentifier: $tzId } as TimeZoneDetails;

	for (const type of TZ_NAME_TYPES) {
		const key = `tzName${type[0].toUpperCase()}${type.slice(1)}` as TZNameKey;

		try {
			const parts = new Intl.DateTimeFormat('en', {
				timeZone: $tzId,
				timeZoneName: type,
			}).formatToParts(date);

			const tzPart = parts.find((p) => p.type === 'timeZoneName');

			obj[key] = tzPart?.value;
		} catch {
			obj[key] = undefined;
		}
	}

	return obj;
}

/** Core formatting logic shared by {@link formatDate} and `Chronos` class */
export function _formatDateCore(
	format: string,
	year: number,
	month: number,
	day: number,
	date: number,
	hours: number,
	minutes: number,
	seconds: number,
	milliseconds: number,
	offset: string
) {
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
		ZZ: offset,
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

	const $date = date instanceof Date ? date : new Date(date);

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

	return _formatDateCore(format, y, mo, d, dt, h, m, s, ms, offset);
}
