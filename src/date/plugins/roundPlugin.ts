import { roundToNearest } from '../../number/utilities';
import { INTERNALS } from '../constants';
import type { TimeUnit } from '../types';

type ChronosConstructor = import('../Chronos').Chronos;
type MainChronos = typeof import('../Chronos').Chronos;

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Rounds the current date-time to the nearest specified unit and interval.
		 *
		 * - *Rounding is based on proximity to the start or end of the specified unit.*
		 * - *For example, rounding `2025-05-23` by 'day' returns either midnight of May 23 or May 24, depending on the time of day.*
		 *
		 * @param unit - The time unit to round to (`year`, `month`, `week`, `day`, `hour`, `minute`, `second`, `millisecond`).
		 * @param nearest - Optional granularity of rounding. (Defaults to `1`).
		 *
		 * @returns A new `Chronos` instance at the nearest rounded point in time. For wrong unit returns current instance.
		 *
		 * @remarks
		 * - Rounding for `'month'` is based on how far into the month the date is. If past the midpoint, it rounds to the next month.
		 *   - Month indices are 0-based internally (January = 0), but the resulting date reflects the correct calendar month.
		 * - For `'week'` unit, rounding is performed by comparing proximity to the start and end of the ISO week (Monday to Sunday).
		 *   - If the date is closer to the next Monday, it rounds forward; otherwise, it rounds back to the previous Monday.
		 */
		round(unit: TimeUnit, nearest?: number): ChronosConstructor;
	}
}

/** * Plugin to inject `round` method */
export const roundPlugin = (ChronosClass: MainChronos): void => {
	const { internalDate, withOrigin } = ChronosClass[INTERNALS];

	ChronosClass.prototype.round = function (
		this: ChronosConstructor,
		unit: TimeUnit,
		nearest = 1
	): ChronosConstructor {
		const date = internalDate(this);

		switch (unit) {
			case 'millisecond': {
				const rounded = roundToNearest(date.getMilliseconds(), nearest);

				date.setMilliseconds(rounded);
				break;
			}

			case 'second': {
				const fullSecond = date.getSeconds() + date.getMilliseconds() / 1000;

				const rounded = roundToNearest(fullSecond, nearest);
				date.setSeconds(rounded, 0);
				break;
			}

			case 'minute': {
				const fullMinute =
					date.getMinutes() + date.getSeconds() / 60 + date.getMilliseconds() / 60000;

				const rounded = roundToNearest(fullMinute, nearest);
				date.setMinutes(rounded, 0, 0);
				break;
			}

			case 'hour': {
				const fullHour =
					date.getHours() +
					date.getMinutes() / 60 +
					date.getSeconds() / 3600 +
					date.getMilliseconds() / 3600000;

				const rounded = roundToNearest(fullHour, nearest);
				date.setHours(rounded, 0, 0, 0);
				break;
			}

			case 'day': {
				const fullDay =
					date.getDate() +
					(date.getHours() / 24 +
						date.getMinutes() / 1440 +
						date.getSeconds() / 86400 +
						date.getMilliseconds() / 86400000);

				const rounded = roundToNearest(fullDay, nearest);
				date.setDate(rounded);
				date.setHours(0, 0, 0, 0);
				break;
			}

			case 'week': {
				const weekday = date.getDay(); // 0 (Sun) to 6 (Sat)
				const offsetToMonday = (weekday + 6) % 7; // 0 for Mon, 1 for Tue, ..., 6 for Sun

				const startOfWeek = new Date(date);
				startOfWeek.setDate(startOfWeek.getDate() - offsetToMonday);
				startOfWeek.setHours(0, 0, 0, 0);

				const endOfWeek = new Date(startOfWeek);
				endOfWeek.setDate(endOfWeek.getDate() + 7);

				const diffToStart = Math.abs(date.getTime() - startOfWeek.getTime());

				const diffToEnd = Math.abs(endOfWeek.getTime() - date.getTime());

				const rounded = diffToEnd < diffToStart ? endOfWeek : startOfWeek;

				return withOrigin(new ChronosClass(rounded), 'round');
			}

			case 'month': {
				const fullMonth = date.getMonth() + date.getDate() / this.lastDateOfMonth;

				const roundedMonth = roundToNearest(fullMonth, nearest);
				date.setMonth(roundedMonth, 1);
				date.setHours(0, 0, 0, 0);
				break;
			}

			case 'year': {
				const dayOfYear = Math.floor(
					(date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / 86400000
				);

				const isLeap = new Date(date.getFullYear(), 1, 29).getDate() === 29;

				const totalDays = isLeap ? 366 : 365;
				const fullYear = date.getFullYear() + dayOfYear / totalDays;
				const roundedYear = roundToNearest(fullYear, nearest);
				date.setFullYear(roundedYear, 0, 1);
				date.setHours(0, 0, 0, 0);
				break;
			}

			default:
				return this;
		}

		return withOrigin(new ChronosClass(date), 'round');
	};
};
