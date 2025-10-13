import type { LooseLiteral } from '../../utils/types';
import { INTERNALS, TIME_ZONE_LABELS, TIME_ZONES } from '../constants';
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

		/**
		 * @instance Returns the current time zone name as a full descriptive string (e.g. `"Bangladesh Standard Time"`).
		 *
		 * @param utc Optional UTC offset in `"UTC+06:00"` format. When passed, it bypasses the current time zone offset.
		 * @returns Time zone name in full descriptive string or UTC offset if it is not a valid time zone.
		 *
		 * @remarks
		 * - This method uses a predefined mapping of UTC offsets to time zone names.
		 * - If multiple time zones share the same UTC offset, it returns the **first match** from the predefined list.
		 * - If no match is found (which is rare), it falls back to returning the UTC offset (e.g. `"UTC+06:00"`).
		 */
		getTimeZoneName(utc?: UTCOffSet): LooseLiteral<UTCOffSet>;

		/**
		 * @instance Returns the current time zone abbreviation (e.g. `"BST"` for `Bangladesh Standard Time`).
		 *
		 * @param utc Optional UTC offset in `"UTC+06:00"` format. When passed, it bypasses the current time zone offset.
		 * @returns Time zone name in full descriptive string or UTC offset if it is not a valid time zone.
		 *
		 * @remarks
		 * - This method uses a predefined mapping of UTC offsets to abbreviated time zone codes.
		 * - If multiple time zones share the same UTC offset, it returns the **first abbreviation** from the list.
		 * - If no match is found (which is rare), it returns the UTC offset (e.g. `"UTC+06:00"`).
		 */
		getTimeZoneNameShort(utc?: UTCOffSet): TimeZone | UTCOffSet;
	}
}

/** * Plugin to inject `timeZone` related methods */
export const timeZonePlugin = (ChronosClass: MainChronos): void => {
	const internal = ChronosClass[INTERNALS];
	const inDate = internal.internalDate;

	ChronosClass.prototype.timeZone = function (
		this: ChronosConstructor,
		zone: TimeZone | UTCOffSet
	): ChronosConstructor {
		let targetOffset: number;
		let stringOffset: UTCOffSet;

		if (isValidUTCOffSet(zone)) {
			targetOffset = extractMinutesFromUTC(zone);
			stringOffset = zone;
		} else {
			targetOffset = TIME_ZONES?.[zone] ?? TIME_ZONES['UTC'];
			stringOffset = formatUTCOffset(targetOffset);
		}

		const previousOffset = this.getTimeZoneOffsetMinutes();
		const relativeOffset = targetOffset - previousOffset;

		const adjustedTime = new Date(inDate(this).getTime() + relativeOffset * 60 * 1000);

		const instance = new ChronosClass(adjustedTime);

		return internal.withOrigin(instance, 'timeZone', stringOffset);
	};

	ChronosClass.prototype.getTimeZoneName = function (
		this: ChronosConstructor,
		utc?: UTCOffSet
	): LooseLiteral<UTCOffSet> {
		const UTC = utc ?? `UTC${this.getTimeZoneOffset()}`;

		return TIME_ZONE_LABELS?.[UTC] ?? UTC;
	};

	ChronosClass.prototype.getTimeZoneNameShort = function (
		this: ChronosConstructor,
		utc?: UTCOffSet
	): TimeZone | UTCOffSet {
		const mins = utc ? extractMinutesFromUTC(utc) : this.getTimeZoneOffsetMinutes();

		const UTC = formatUTCOffset(mins);

		const timeZone = TIME_ZONE_LABELS?.[UTC];

		let result = timeZone
			?.split(/\s+/)
			?.filter(Boolean)
			?.map((part) => part?.[0])
			?.join('')
			?.replace(/\W/g, '') as TimeZone | undefined;

		if (!result) {
			const zones = Object.entries(TIME_ZONES) as Array<[TimeZone, number]>;

			result = zones.find((zone) => zone?.[1] === mins)?.[0];
		}

		return result ?? formatUTCOffset(mins);
	};

	ChronosClass.prototype.toString = function (this: ChronosConstructor): string {
		const offset = internal.offset(this);

		switch (this.origin) {
			case 'timeZone': {
				const gmt = offset.replace('UTC', 'GMT').replace(':', '');
				const label = TIME_ZONE_LABELS[offset] ?? offset;

				return inDate(this)
					.toString()
					.replace(/GMT[+-]\d{4}\s+\([^)]+\)/, `${gmt} (${label})`);
			}
			case 'toUTC':
			case 'utc': {
				return inDate(this)
					.toString()
					.replace(
						/GMT[+-]\d{4}\s+\([^)]+\)/,
						`GMT+0000 (Coordinated Universal Time)`
					);
			}
			default:
				return inDate(this).toString();
		}
	};
};
