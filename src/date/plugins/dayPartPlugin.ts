import { DEFAULT_RANGES } from '../constants';
import type { DayPart, DayPartConfig } from '../types';

type ChronosConstructor = import('../Chronos').Chronos;
type MainChronos = typeof import('../Chronos').Chronos;

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Returns the part of day (`'midnight', 'lateNight', 'night', 'morning', 'afternoon', 'evening'`) based on the current hour.
		 *
		 * *Supports both normal and wraparound (overnight) ranges.*
		 *
		 * @param config - Optional custom hour ranges for each part of day.
		 *                 Each range must be a tuple of strings as `[startHour, endHour]` in 24-hour format (e.g., `['06', '11']`).
		 *                 Supports wraparound ranges like `['22', '04']` that cross midnight.
		 *
		 *                 **Default Ranges:**
		 *                 - night: ['21', '23']
		 *                 - midnight: ['00', '01']
		 *                 - lateNight: ['02', '04']
		 *                 - morning: ['05', '11']
		 *                 - afternoon: ['12', '16']
		 *                 - evening: ['17', '20']
		 *
		 * @returns The current part of the day as a string.
		 *
		 * @example
		 * chronosInstance.getPartOfDay(); // e.g., 'morning'
		 *
		 * @example
		 * // Example with custom ranges
		 * chronosInstance.getPartOfDay({
		 *   night: ['22', '04'],
		 *   morning: ['05', '11'],
		 *   afternoon: ['12', '16'],
		 *   evening: ['17', '21'],
		 *   lateNight: ['01', '03'],
		 *   midnight: ['00', '00'],
		 * });
		 */
		getPartOfDay(config?: Partial<DayPartConfig>): DayPart;
	}
}

/** * Plugin to inject `getPartOfDay` method */
export const dayPartPlugin = (ChronosClass: MainChronos): void => {
	ChronosClass.prototype.getPartOfDay = function (
		this: ChronosConstructor,
		config?: Partial<DayPartConfig>
	): DayPart {
		const hour = this.hour;

		const ranges: DayPartConfig = {
			...DEFAULT_RANGES,
			...config,
		};

		for (const [part, [start, end]] of Object.entries(ranges)) {
			const from = Number(start);
			const to = Number(end);

			if (from <= to) {
				if (hour >= from && hour <= to) {
					return part as DayPart;
				}
			} else {
				// Wraparound logic (e.g., 20 to 04 means 20–23 OR 00–04)
				if (hour >= from || hour <= to) {
					return part as DayPart;
				}
			}
		}

		return 'night';
	};
};
