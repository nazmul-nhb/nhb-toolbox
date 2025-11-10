import type { $Record } from '../../object/types';
import { INTERNALS } from '../constants';
import type { ChronosInput, DurationKey, DurationOptions, TimeDuration } from '../types';

type ChronosConstructor = import('../Chronos').Chronos;
type MainChronos = typeof import('../Chronos').Chronos;

/** Suffix for `new Date().getUnit()` methods. Replaces `Unit`. */
type $Suffix = 'FullYear' | 'Month' | 'Date' | 'Hours' | 'Minutes' | 'Seconds' | 'Milliseconds';

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Returns the full time duration breakdown between current input (start) and another time (to) as {@link TimeDuration} object.
		 * @param toTime The time to compare with. Defaults to `now`.
		 * @param absolute If true, returns all values as positive numbers. Defaults to `true`.
		 * @returns An object of time units: `years`, `months`, `days`, `hours`, `minutes`, `seconds`, `milliseconds` ({@link TimeDuration}).
		 */
		duration(toTime?: ChronosInput, absolute?: boolean): TimeDuration;

		/**
		 * @instance Returns a human-readable formatted duration string between the current instance (start) and another time (to).
		 * @param options {@link DurationOptions} to format duration string, including the time to compare with.
		 * @returns A formatted duration string, e.g. `"2 hours, 5 minutes"` or `"2h 5m"`.
		 */
		durationString(options?: DurationOptions): string;
	}
}

/** * Plugin to inject `duration` related methods */
export const durationPlugin = (ChronosClass: MainChronos): void => {
	const { internalDate, toNewDate } = ChronosClass[INTERNALS];

	/**
	 * @private Normalizes duration values based on sign and `absolute` flag.
	 * @param result The raw time breakdown to normalize.
	 * @param absolute If true, ensures all values are positive.
	 * @param isFuture Whether the duration was forward (true) or backward (false).
	 * @returns The normalized duration object.
	 */
	const _normalizeDuration = (
		result: TimeDuration,
		absolute: boolean,
		isFuture: boolean
	): TimeDuration => {
		const entries = Object.entries(result) as Array<[DurationKey, number]>;

		const updated = { ...result };

		if (!absolute && !isFuture) {
			for (const [key, value] of entries) {
				if (value !== 0) {
					updated[key] = value * -1;
				}
			}
		} else if (absolute) {
			for (const [key, value] of entries) {
				updated[key] = Math.abs(value);
			}
		}

		return updated;
	};

	ChronosClass.prototype.duration = function (
		this: ChronosConstructor,
		toTime?: ChronosInput,
		absolute = true
	): TimeDuration {
		const now = internalDate(this);
		const target = toNewDate(this, toTime);

		const isFuture = target > now;
		const from = isFuture ? now : target;
		const to = isFuture ? target : now;

		/** Get difference between `to` and `from` for specific unit */
		const _getDiff = (suffix: $Suffix): number => {
			const method = ('get' + suffix) as `get${$Suffix}`;

			return to[method]() - from[method]();
		};

		let years = _getDiff('FullYear');
		let months = _getDiff('Month');
		let days = _getDiff('Date');
		let hours = _getDiff('Hours');
		let minutes = _getDiff('Minutes');
		let seconds = _getDiff('Seconds');
		let milliseconds = _getDiff('Milliseconds');

		if (milliseconds < 0) {
			milliseconds += 1000;
			seconds--;
		}

		if (seconds < 0) {
			seconds += 60;
			minutes--;
		}

		if (minutes < 0) {
			minutes += 60;
			hours--;
		}

		if (hours < 0) {
			hours += 24;
			days--;
		}

		if (days < 0) {
			const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
			days += prevMonth.getDate();
			months--;
		}

		if (months < 0) {
			months += 12;
			years--;
		}

		const result: TimeDuration = {
			years,
			months,
			days,
			hours,
			minutes,
			seconds,
			milliseconds,
		};

		return _normalizeDuration(result, absolute, isFuture);
	};

	ChronosClass.prototype.durationString = function (
		this: ChronosConstructor,
		options?: DurationOptions
	): string {
		const {
			toTime,
			absolute = true,
			maxUnits = 7,
			separator = ', ',
			style = 'full',
			showZero = false,
		} = options ?? {};

		const duration = this.duration(toTime, absolute);

		const units: $Record<DurationKey, string> = {
			years: 'y',
			months: 'mo',
			days: 'd',
			hours: 'h',
			minutes: 'm',
			seconds: 's',
			milliseconds: 'ms',
		};

		const _formatUnit = (unit: DurationKey, value: number): string => {
			if (style === 'short') {
				return `${value}${units[unit]}`;
			}

			const $unit = Math.abs(value) === 1 ? unit.slice(0, -1) : unit;

			return `${value} ${$unit}`;
		};

		const parts = (Object.entries(duration) as Array<[DurationKey, number]>)
			.filter(([_, value]) => showZero || Math.abs(value) > 0)
			.slice(0, maxUnits)
			.map(([unit, value]) => _formatUnit(unit, value));

		return (
			parts.length ? parts.join(separator)
			: style === 'short' ? '0s'
			: '0 seconds'
		);
	};
};
