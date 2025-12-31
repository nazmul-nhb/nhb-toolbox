import type { Enumerate, NumberRange } from '../number/types';
import { getOrdinal } from '../number/utilities';
import type { Maybe } from '../types/index';
import {
	BN_MONTH_TABLES,
	BN_SEASONS,
	BN_YEAR_OFFSET,
	DAYS,
	MONTHS,
	MS_PER_DAY,
	SORTED_TIME_FORMATS,
} from './constants';
import { isLeapYear } from './guards';
import type {
	$BnEn,
	$GMTOffset,
	$TimeZoneIdentifier,
	BanglaSeasonName,
	BnCalendarVariant,
	FormatToken,
	TimeZoneNameNative,
	UTCOffset,
} from './types';

/** Core formatting logic shared by `formatDate` and `Chronos`, `BanglaCalendar` classes */
export function _formatDateCore(format: string, dateComponents: Record<string, string>) {
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
			result += dateComponents[match[0]] ?? match[0];
			i += match[0].length;
		} else {
			result += format[i];
			i++;
		}
	}

	return result;
}

/** Core formatting logic shared by `formatDate` and `Chronos` class */
export function _formatDate(
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
	const paddedYear = _padZero(year, 4);

	const dateComponents: Record<FormatToken, string> = {
		YYYY: paddedYear,
		YY: paddedYear.slice(-2),
		yyyy: paddedYear,
		yy: paddedYear.slice(-2),
		M: String(month + 1),
		MM: _padZero(month + 1),
		mmm: MONTHS[month].slice(0, 3),
		mmmm: MONTHS[month],
		d: DAYS[day].slice(0, 2),
		dd: DAYS[day].slice(0, 3),
		ddd: DAYS[day],
		D: String(date),
		DD: _padZero(date),
		Do: getOrdinal(date),
		H: String(hours),
		HH: _padZero(hours),
		h: String(hours % 12 || 12),
		hh: _padZero(hours % 12 || 12),
		m: String(minutes),
		mm: _padZero(minutes),
		s: String(seconds),
		ss: _padZero(seconds),
		ms: String(milliseconds),
		mss: _padZero(milliseconds, 3),
		a: hours < 12 ? 'am' : 'pm',
		A: hours < 12 ? 'AM' : 'PM',
		Z: offset,
		ZZ: offset,
	};

	return _formatDateCore(format, dateComponents);
}

/** Normalize a time string by adding offset at the end */
export function _normalizeOffset(timeStr: string): string {
	return timeStr.replace(/([+-]\d{2})(?!:)/, '$1:00');
}

/** Converts milliseconds to seconds */
export const _toSeconds = (ms: number) => Math.floor(ms / 1000);

/** Converts timestamp seconds to JS `Date` */
export const _secToDate = (sec: number) => new Date(sec * 1000);

type $TzNameType = Intl.DateTimeFormatOptions['timeZoneName'];
type $TzId = Maybe<$TimeZoneIdentifier>;
type $ResolvedTzName<T extends $TzNameType> = Maybe<
	T extends 'long' ? TimeZoneNameNative
	: T extends 'longOffset' ? $GMTOffset
	: string
>;

/** Resolve `timeZoneName` value from `Intl.DateTimeFormat` */
export function _resolveNativeTzName<T extends $TzNameType>(tzId: $TzId, type: T, date?: Date) {
	try {
		const parts = new Intl.DateTimeFormat('en', {
			timeZone: tzId,
			timeZoneName: type,
		}).formatToParts(date);

		return parts.find((p) => p.type === 'timeZoneName')?.value as $ResolvedTzName<T>;
	} catch {
		return undefined;
	}
}

/** Convert `GMT±HH:mm` string to `UTC±HH:mm` format*/
export function _gmtToUtcOffset(gmt: Maybe<string>) {
	return gmt === 'GMT' ? 'UTC+00:00' : (gmt?.replace(/^GMT/, 'UTC') as Maybe<UTCOffset>);
}

/** Get Bangla season name by month index (`0-11`) */
export function _getBnSeason<L extends $BnEn = 'bn'>(month: number, locale?: L | $BnEn) {
	const season = BN_SEASONS[Math.floor(month / 2)];

	return (locale === 'en' ? season.en : season.bn) as BanglaSeasonName<L>;
}

/** Check whether a Bangla year is leap by Gregorian and Bangla years and calendar variant */
export function _isBnLeapYear(by: number, gy: number, v?: BnCalendarVariant) {
	return v === 'revised-1966' ? by % 4 === 2 : isLeapYear(gy);
}

/** Extract selective unit values from {@link Date} object */
export function _extractDateUnits(date: Date) {
	const month = date.getMonth();

	return {
		gy: date.getFullYear(),
		$gm: month as Enumerate<12>,
		gm: (month + 1) as NumberRange<1, 12>,
		gd: date.getDate() as NumberRange<1, 31>,
		wd: date.getDay() as Enumerate<7>,
	};
}

/** Get Gregorian base year from {@link Date} object for Bangla year */
export function _getGregBaseYear(date: Date): number {
	const { gy, gm, gd } = _extractDateUnits(date);

	return gm < 4 || (gm === 4 && gd < 14) ? gy - 1 : gy;
}

/** Get Bangla year from {@link Date} object */
export function _getBnYear(date: Date): number {
	return _getGregBaseYear(date) - BN_YEAR_OFFSET;
}

/** Get timestamp in milliseconds between midnight, January 1, 1970 (UTC) and the specified {@link Date} object */
export function _getUtcTs(date: Date): number {
	const { gy, $gm, gd } = _extractDateUnits(date);

	return Date.UTC(gy, $gm, gd);
}

/** Get number of days elapsed since midnight April 14, 1970 (UTC) for specific {@link Date} */
export function _getElapsedDays(date: Date): number {
	return Math.floor((_getUtcTs(date) - Date.UTC(_getGregBaseYear(date), 3, 14)) / MS_PER_DAY);
}

/** Get number of days elapsed since midnight April 14, 1970 (UTC) and month index for specific `Date` and Bangla calendar variant */
export function _bnDaysMonthIdx(date: Date, variant?: BnCalendarVariant) {
	const v = variant ?? 'revised-2019';

	const table =
		_isBnLeapYear(_getBnYear(date), date.getFullYear(), v) ?
			BN_MONTH_TABLES?.[v].leap
		:	BN_MONTH_TABLES?.[v].normal;

	let days = _getElapsedDays(date);
	let monthIdx = 0;

	while (days >= table[monthIdx]) {
		days -= table[monthIdx];
		monthIdx++;
	}

	return { days, monthIdx };
}

/**
 * Convert number to string and pad at the start with zero (`'0'`)
 * @param value Value to convert and pad with
 * @param length Maximum length to pad, default is `2`
 * @returns The padded string
 */
export function _padZero(value: number, length = 2) {
	return String(value).padStart(length, '0');
}

/**
 * Pad at the start of a string with Bangla zero (`'০'`)
 * @param str String to pad with
 * @param length Maximum length to pad, default is `2`
 * @returns The padded string
 */
export function _padShunno(str: string, length = 2) {
	return str.padStart(length, '০');
}
