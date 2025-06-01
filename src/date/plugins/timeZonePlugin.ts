import { INTERNALS, TIME_ZONES } from '../constants';
import { isValidUTCOffSet } from '../guards';
import type { TimeZone, UTCOffSet } from '../types';
import { extractMinutesFromUTC, formatUTCOffset } from '../utils';

type ChronosConstructor = import('../Chronos').Chronos;
type MainChronos = typeof import('../Chronos').Chronos;

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Create a new instance of `Chronos` in the specified timezone.
		 *
		 * @param zone - Standard timezone abbreviation (e.g., 'IST', 'UTC', 'EST') or UTC Offset in `UTC-01:30` format.
		 * @returns A new instance of `Chronos` with time in the given timezone. Invalid input sets time-zone to `UTC`.
		 */
		timeZone(zone: TimeZone | UTCOffSet): ChronosConstructor;
	}
}

/** * Plugin to inject `timeZone` method */
export const timeZonePlugin = (ChronosClass: MainChronos): void => {
	ChronosClass.prototype.timeZone = function (
		this: ChronosConstructor,
		zone: TimeZone | UTCOffSet,
	): ChronosConstructor {
		let targetOffset: number;
		let stringOffset: UTCOffSet;

		if (isValidUTCOffSet(zone)) {
			targetOffset = extractMinutesFromUTC(zone);
			stringOffset = zone;
		} else {
			targetOffset = TIME_ZONES[zone] ?? TIME_ZONES['UTC'];
			stringOffset = formatUTCOffset(targetOffset);
		}

		const previousOffset = this.getTimeZoneOffsetMinutes();
		const relativeOffset = targetOffset - previousOffset;

		const adjustedTime = new Date(
			ChronosClass[INTERNALS].internalDate(this).getTime() +
				relativeOffset * 60 * 1000,
		);

		const instance = new ChronosClass(adjustedTime);

		return ChronosClass[INTERNALS].withOrigin(
			instance,
			'timeZone',
			stringOffset,
		);
	};
};
