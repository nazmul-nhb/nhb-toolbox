import { getOrdinal } from '../number/utilities';
import type { Maybe } from '../types/index';
import { DAYS, MONTHS, SORTED_TIME_FORMATS } from './constants';
import type {
	$GMTOffset,
	$TimeZoneIdentifier,
	ChronosFormat,
	TimeZoneNameNative,
	UTCOffset,
} from './types';

type $DateComponents = Record<ChronosFormat, string>;

/** Core formatting logic shared by `formatDate` and `Chronos` class */
export function _formatDateCore(format: string, dateComponents: $DateComponents) {
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
	const dateComponents: $DateComponents = {
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

	return _formatDateCore(format, dateComponents);
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
