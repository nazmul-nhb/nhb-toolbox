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

/** Core formatting logic shared by `formatDate` and `Chronos` class */
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
	const paddedYear = String(year).padStart(4, '0');

	const dateComponents: Record<FormatToken, string> = {
		YYYY: paddedYear,
		YY: paddedYear.slice(-2),
		yyyy: paddedYear,
		yy: paddedYear.slice(-2),
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
		Z: offset,
		ZZ: offset,
	};

	return _formatDateCore(format, dateComponents);
}

/** Normalize a time string with by adding offset at the end */
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

export function _getBnSeason<L extends $BnEn = 'bn'>(month: number, locale?: L | $BnEn) {
	const season = BN_SEASONS[Math.floor(month / 2)];

	return (locale === 'en' ? season.en : season.bn) as BanglaSeasonName<L>;
}

export function _isBnLeapYear(by: number, gy: number, v?: BnCalendarVariant) {
	return v === 'revised-1966' ? by % 4 === 2 : isLeapYear(gy);
}

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

export function _getGregBaseYear(date: Date): number {
	const { gy, gm, gd } = _extractDateUnits(date);

	return gm < 4 || (gm === 4 && gd < 14) ? gy - 1 : gy;
}

export function _getBnYear(date: Date): number {
	return _getGregBaseYear(date) - BN_YEAR_OFFSET;
}

export function _getUtcTs(date: Date): number {
	const { gy, $gm, gd } = _extractDateUnits(date);

	return Date.UTC(gy, $gm, gd);
}

export function _getElapsedDays(date: Date): number {
	return Math.floor((_getUtcTs(date) - Date.UTC(_getGregBaseYear(date), 3, 14)) / MS_PER_DAY);
}

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
