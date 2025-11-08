import type { LooseLiteral } from '../../utils/types';
import { INTERNALS } from '../constants';
import { isValidTimeZoneId, isValidUTCOffSet } from '../guards';
import { TIME_ZONES, TIME_ZONE_IDS, TIME_ZONE_LABELS } from '../timezone';
import type { TimeZone, TimeZoneId, TimeZoneIdentifier, UTCOffSet } from '../types';
import { extractMinutesFromUTC, formatUTCOffset } from '../utils';

type ChronosConstructor = import('../Chronos').Chronos;
type MainChronos = typeof import('../Chronos').Chronos;

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Creates a new instance of `Chronos` in the specified timezone.
		 *
		 * @param zone - Standard timezone abbreviation (e.g., 'IST', 'UTC', 'EST' etc.), UTC Offset in `UTC±HH:mm` format or timezone identifier (e.g., `'Africa/Harare'`).
		 * @returns A new instance of `Chronos` with time in the given timezone. Invalid input sets time-zone to `UTC`.
		 */
		timeZone(zone: TimeZoneIdentifier | TimeZone | UTCOffSet): ChronosConstructor;

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
		 * - To retrieve the local system's native timezone name (or its identifier if the name is unavailable), use the {@link $getNativeTimeZone} instance method.
		 * - To retrieve the local system's native timezone identifier, use the {@link $getNativeTimeZoneId} instance method.
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
		 * - To retrieve the local system's native timezone name (or its identifier if the name is unavailable), use the {@link $getNativeTimeZone} instance method.
		 * - To retrieve the local system's native timezone identifier, use the {@link $getNativeTimeZoneId} instance method.
		 */
		getTimeZoneNameShort(utc?: UTCOffSet): TimeZone | UTCOffSet;
	}
}

/** * Plugin to inject `timeZone` related methods */
export const timeZonePlugin = (ChronosClass: MainChronos): void => {
	const internal = ChronosClass[INTERNALS];

	/**
	 * * Gets the internal `#date`, a readonly private property (core `Date` object)
	 * @param instance - Chronos instance to access
	 * @returns The core internal `Date` object
	 */
	const $Date = internal.internalDate;

	const getTimeZoneId = (utc: UTCOffSet) => {
		const obj = { ...TIME_ZONE_IDS } as Record<TimeZoneIdentifier, UTCOffSet>;

		const tzIds = (Object.keys(obj) as TimeZoneIdentifier[]).filter(
			(key) => obj[key] === utc
		);

		if (!tzIds || tzIds.length === 0) return undefined;
		if (tzIds.length === 1) return tzIds[0];

		return tzIds;
	};

	ChronosClass.prototype.timeZone = function (
		this: ChronosConstructor,
		zone: TimeZoneIdentifier | TimeZone | UTCOffSet
	): ChronosConstructor {
		let targetOffset: number;
		let stringOffset: UTCOffSet;
		let tzId: TimeZoneId;

		if (isValidUTCOffSet(zone)) {
			targetOffset = extractMinutesFromUTC(zone);
			stringOffset = zone;
			tzId = getTimeZoneId(stringOffset) || stringOffset;
		} else if (isValidTimeZoneId(zone)) {
			stringOffset = TIME_ZONE_IDS[zone];
			targetOffset = extractMinutesFromUTC(stringOffset);
			tzId = zone;
		} else {
			targetOffset = TIME_ZONES?.[zone] ?? TIME_ZONES['UTC'];
			stringOffset = formatUTCOffset(targetOffset);
			tzId = getTimeZoneId(stringOffset) || stringOffset;
		}

		const previousOffset = this.getTimeZoneOffsetMinutes();
		const relativeOffset = targetOffset - previousOffset;

		const adjustedTime = new Date($Date(this).getTime() + relativeOffset * 60 * 1000);

		const instance = new ChronosClass(adjustedTime);

		return internal.withOrigin(
			instance,
			'timeZone',
			stringOffset,
			this.getTimeZoneName(stringOffset),
			tzId
		);
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

				return $Date(this)
					.toString()
					.replace(/GMT[+-]\d{4}\s+\([^)]+\)/, `${gmt} (${label})`);
			}
			case 'toUTC':
			case 'utc': {
				return $Date(this)
					.toString()
					.replace(
						/GMT[+-]\d{4}\s+\([^)]+\)/,
						`GMT+0000 (Coordinated Universal Time)`
					);
			}
			default:
				return $Date(this).toString();
		}
	};
};
