import { DAYS, MONTHS, sortedFormats } from './constants';
import type { ChronosFormat } from './types';

export class Chronos {
	private readonly _date: Date;

	/**
	 * * Creates a new immutable Chronos instance.
	 * @param value - A date value (`timestamp`, `string`, or `Date`).
	 */
	constructor(value?: number | string | Date) {
		const date = new Date(value ?? Date.now());

		// Check if the date is invalid
		if (isNaN(date.getTime())) {
			throw new Error('Invalid date provided!');
		}

		this._date = date;
	}

	/**
	 * * Formats the date into a custom string format.
	 * @param format - The desired format (e.g., "YYYY-MM-DD").
	 * @returns Formatted date string.
	 */
	format(format: string): string {
		const year = this._date.getFullYear();
		const month = this._date.getMonth();
		const day = this._date.getDay();
		const date = this._date.getDate();
		const hours = this._date.getHours();
		const minutes = this._date.getMinutes();
		const seconds = this._date.getSeconds();
		const milliseconds = this._date.getMilliseconds();

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
			dddd: DAYS[day],
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
	 * * Adds days and returns a new immutable instance.
	 * @param days - Number of days to add.
	 * @returns A new `Chronos` instance with the updated date.
	 */
	addDays(days: number): Chronos {
		const newDate = new Date(this._date);
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

	/** * Gets the native `Date` instance (read-only). */
	toDate(): Date {
		return new Date(this._date);
	}

	/**
	 * * Extracts matched date/time format tokens from a string.
	 * @param input The input string containing format tokens.
	 * @returns An array of matched format tokens from the known formats.
	 */
	// private _extractFormatTokens(input: string): ChronosFormat[] {
	// 	// Build regex pattern (escaped tokens joined by '|')
	// 	const pattern = sortedFormats
	// 		.map((f) => f.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1'))
	// 		.join('|');

	// 	// Use matchAll to avoid partial replacements
	// 	const regex = new RegExp(pattern, 'g');

	// 	const matches = [...input.matchAll(regex)].map(
	// 		(m) => m[0],
	// 	) as ChronosFormat[];

	// 	return matches;
	// }
}
