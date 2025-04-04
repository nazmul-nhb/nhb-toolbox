import { DAYS, MONTHS, sortedFormats } from './constants';
import type { ChronosFormat } from './types';

export class Chronos {
	private readonly _date: Date;

	/**
	 * * Creates a new immutable Chronos instance.
	 * @param value - A date value (`timestamp`, `string`, or `Date`).
	 */
	constructor(value?: number | string | Date | Chronos) {
		const date =
			value instanceof Chronos ?
				value.toDate()
			:	new Date(value ?? Date.now());

		// Check if the date is invalid
		if (isNaN(date.getTime())) {
			throw new Error('Invalid date provided!');
		}

		this._date = date;
	}

	/**
	 * * Formats the date into a custom string format.
	 * @param format - The desired format (Default format is `DD-MM-YYYY` = `30-06-1995`).
	 * @returns Formatted date string in desired format.
	 */
	format(format: string = 'DD-MM-YYYY'): string {
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

	/**
	 * * Determines if the given date is today, tomorrow, yesterday or any relative day.
	 * @param date - The date to compare (Date object).
	 * @returns
	 *  - `-1` if the date is yesterday.
	 *  - `0` if the date is today.
	 *  - `1` if the date is tomorrow.
	 *  - Other positive or negative numbers for other relative days (e.g., `-2` for two days ago, `2` for two days ahead).
	 */
	getRelativeDay(): number {
		const today = new Date();
		// Set the time of today to 00:00:00 for comparison purposes
		today.setHours(0, 0, 0, 0);

		// Normalize the input date to 00:00:00
		const inputDate = new Date(this._date);
		inputDate.setHours(0, 0, 0, 0);

		const diffTime = inputDate.getTime() - today.getTime();
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

		return diffDays;
	}

	/** * Gets the native `Date` instance (read-only). */
	toDate(): Date {
		return new Date(this._date);
	}
}
