import { getOrdinal } from '../number/utilities';
import { DAYS, MONTHS, SORTED_TIME_FORMATS } from './constants';
import type { ChronosFormat } from './types';

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

/** Converts milliseconds to seconds */
export const _toSeconds = (ms: number) => Math.floor(ms / 1000);

/** Converts timestamp seconds to JS `Date` */
export const _secToDate = (sec: number) => new Date(sec * 1000);
