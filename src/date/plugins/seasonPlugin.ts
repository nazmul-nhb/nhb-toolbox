import { SEASON_PRESETS } from '../seasons';
import type { SeasonOptions } from '../types';

type ChronosConstructor = import('../Chronos').Chronos;
type MainChronos = typeof import('../Chronos').Chronos;

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Returns the current season name based on optional season rules or presets.
		 * @param options Configuration with optional custom seasons or preset name.
		 * @returns The name of the season the current date falls under.
		 */
		season(options?: SeasonOptions): string;

		/**
		 * @instance Returns the current season name based on optional season rules or presets.
		 *
		 * @remarks This method alias for {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/names#season season} method.
		 *
		 * @param options Configuration with optional custom seasons or preset name.
		 * @returns The name of the season the current date falls under.
		 */
		getSeasonName(options?: SeasonOptions): string;
	}
}

/** * Plugin to inject `season`/`getSeasonName` method */
export const seasonPlugin = (ChronosClass: MainChronos): void => {
	ChronosClass.prototype.season = function (
		this: ChronosConstructor,
		options?: SeasonOptions
	): string {
		const { preset = 'default' } = options ?? {};

		const seasonSet = options?.seasons ?? SEASON_PRESETS[preset];

		const dateStr = this.format('MM-DD');

		for (const { name, boundary } of seasonSet) {
			if ('startDate' in boundary && 'endDate' in boundary) {
				const start = boundary.startDate;
				const end = boundary.endDate;

				if (start <= end) {
					if (dateStr >= start && dateStr <= end) return name;
				} else {
					// Handles wrap-around seasons like Dec–Feb
					if (dateStr >= start || dateStr <= end) return name;
				}
			} else if ('startMonth' in boundary && 'endMonth' in boundary) {
				const { startMonth, endMonth } = boundary;
				if (startMonth <= endMonth) {
					if (this.month >= startMonth && this.month <= endMonth) {
						return name;
					}
				} else {
					if (this.month >= startMonth || this.month <= endMonth) {
						return name;
					}
				}
			}
		}

		return 'Unknown';
	};

	ChronosClass.prototype.getSeasonName = function (
		this: ChronosConstructor,
		options?: SeasonOptions
	): string {
		return this.season(options);
	};
};
