import { formatUnitWithPlural } from '../../string/convert';
import { INTERNALS } from '../constants';
import type { $Chronos, $DateUnit, ChronosInput, FromNowUnit } from '../types';

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Returns full time difference from now (or a specified time) down to a given level.
		 *
		 * @param level Determines the smallest unit to include in the output (e.g., 'minute' will show up to minutes, ignoring seconds). Defaults to `second`.
		 * @param withSuffixPrefix If `true`, adds `"in"` or `"ago"` depending on whether the time is in the future or past. Defaults to `true`.
		 * @param time An optional time value to compare with (`string`, `number`, `Date`, or `Chronos` instance). Defaults to `now`.
		 * @returns The difference as a human-readable string, e.g., `2 years 1 month 9 days 18 hours 56 minutes ago`.
		 *
		 *  @remarks
		 * - This method calculates the **elapsed time difference** (exclusive of the end day), consistent with libraries like `Day.js` and `Luxon`.
		 * - If you need an *inclusive calendar-style* difference (counting both start and end days), adjust one day manually before calling `fromNow()`.
		 */
		fromNow(level?: FromNowUnit, withSuffixPrefix?: boolean, time?: ChronosInput): string;
	}
}

/** * Plugin to inject `fromNow` method */
export const fromNowPlugin = ($Chronos: $Chronos): void => {
	const { toNewDate } = $Chronos[INTERNALS];

	$Chronos.prototype.fromNow = function (level = 'second', wSP = true, time) {
		const now = toNewDate(this, time);
		const target = this.toDate();

		const isFuture = target > now;

		const from = isFuture ? now : target;
		const to = isFuture ? target : now;

		/** Get difference between `to` and `from` for specific unit */
		const _getDiff = (suffix: Exclude<$DateUnit, 'Day'>): number => {
			return to[`get${suffix}`]() - from[`get${suffix}`]();
		};

		let y = _getDiff('FullYear'),
			mo = _getDiff('Month'),
			d = _getDiff('Date'),
			h = _getDiff('Hours'),
			m = _getDiff('Minutes'),
			s = _getDiff('Seconds'),
			ms = _getDiff('Milliseconds');

		// Adjust negative values
		if (ms < 0) {
			ms += 1000;
			s--;
		}

		if (s < 0) {
			s += 60;
			m--;
		}

		if (m < 0) {
			m += 60;
			h--;
		}

		if (h < 0) {
			h += 24;
			d--;
		}

		if (d < 0) {
			const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);

			d += prevMonth.getDate();
			mo--;
		}

		if (mo < 0) {
			mo += 12;
			y--;
		}

		const unitOrder: Array<FromNowUnit> = [
			'year',
			'month',
			'day',
			'hour',
			'minute',
			'second',
			'millisecond',
		];

		const lvlIdx = unitOrder.indexOf(level);

		const parts: string[] = [];

		/** Push value-unit string to `parts` array */
		const _pushToParts = (value: number, unit: FromNowUnit) => {
			parts.push(formatUnitWithPlural(value, unit));
		};

		/** Check if a unit level is required */
		const _isLevelRequired = (unit: FromNowUnit) => {
			return lvlIdx >= unitOrder.indexOf(unit);
		};

		if (y > 0) {
			_pushToParts(y, 'year');
		}
		if (_isLevelRequired('month') && mo > 0) {
			_pushToParts(mo, 'month');
		}
		if (_isLevelRequired('day') && d > 0) {
			_pushToParts(d, 'day');
		}
		if (_isLevelRequired('hour') && h > 0) {
			_pushToParts(h, 'hour');
		}
		if (_isLevelRequired('minute') && m > 0) {
			_pushToParts(m, 'minute');
		}
		if (_isLevelRequired('second') && s > 0) {
			_pushToParts(s, 'second');
		}
		if (_isLevelRequired('millisecond') && (ms > 0 || parts?.length === 0)) {
			_pushToParts(ms, 'millisecond');
		}

		let prefix = '';
		let suffix = '';

		if (wSP) {
			if (isFuture) {
				prefix = 'in ';
			} else {
				suffix = ' ago';
			}
		}

		return `${prefix}${parts.length ? parts?.join(' ') : `0 ${level}s`}${suffix}`;
	};
};
