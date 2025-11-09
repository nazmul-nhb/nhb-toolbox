import type { LooseLiteral } from '../../utils/types';
import { INTERNALS } from '../constants';
import { isValidTimeZoneId, isValidUTCOffSet } from '../guards';
import { TIME_ZONES, TIME_ZONE_IDS, TIME_ZONE_LABELS } from '../timezone';
import type { TimeZone, TimeZoneId, TimeZoneIdentifier, UTCOffSet } from '../types';
import { extractMinutesFromUTC } from '../utils';

type ChronosConstructor = import('../Chronos').Chronos;
type MainChronos = typeof import('../Chronos').Chronos;

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Creates a new instance of `Chronos` for the specified time zone identifier.
		 *
		 * @param tzId - Time zone identifier (e.g., `'Africa/Harare'`). See: {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones IANA TZ Database on Wikipedia}.
		 * @returns A new instance of `Chronos` with time in the given time zone identifier. Invalid input sets time-zone to `UTC`.
		 */
		timeZone(tzId: TimeZoneIdentifier): ChronosConstructor;

		/**
		 * @instance Creates a new instance of `Chronos` for the specified abbreviated time zone name.
		 *
		 * @param zone - Standard time zone abbreviation (e.g., `'IST'`, `'UTC'`, `'EST'` etc.). See: {@link https://en.wikipedia.org/wiki/List_of_time_zone_abbreviations Time zone abbreviations on Wikipedia}.
		 * @returns A new instance of `Chronos` with time in the given time zone abbreviation. Invalid input sets time-zone to `UTC`.
		 */
		timeZone(zone: TimeZone): ChronosConstructor;

		/**
		 * @instance Creates a new instance of `Chronos` for the specified utc offset.
		 *
		 * @param utc - UTC Offset in `UTC±HH:mm` format for fictional or unlisted time zone (e.g., `'UTC+06:15'`).
		 * @returns A new instance of `Chronos` with time in the given utc offset. Invalid input sets time-zone to `UTC`.
		 */
		timeZone(utc: UTCOffSet): ChronosConstructor;

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
		 * - To retrieve the local system's native time zone name (or its identifier if the name is unavailable), use the {@link $getNativeTimeZone} instance method.
		 * - To retrieve the local system's native time zone identifier, use the {@link $getNativeTimeZoneId} instance method.
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
		 * - To retrieve the local system's native time zone name (or its identifier if the name is unavailable), use the {@link $getNativeTimeZone} instance method.
		 * - To retrieve the local system's native time zone identifier, use the {@link $getNativeTimeZoneId} instance method.
		 */
		getTimeZoneNameShort(utc?: UTCOffSet): LooseLiteral<TimeZone | UTCOffSet>;
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

	const _getTimeZoneName = (zone: TimeZoneIdentifier | TimeZone | UTCOffSet) => {
		const _resolveTzName = (offset: UTCOffSet) => {
			if (offset in TIME_ZONE_LABELS) {
				return TIME_ZONE_LABELS[offset];
			}

			return undefined;
		};

		if (isValidUTCOffSet(zone)) {
			return _resolveTzName(zone);
		} else if (isValidTimeZoneId(zone)) {
			return TIME_ZONE_IDS[zone].tzName ?
					TIME_ZONE_IDS[zone].tzName
				:	_resolveTzName(TIME_ZONE_IDS[zone].offset);
		} else {
			return zone in TIME_ZONES ?
					TIME_ZONES[zone].tzName
				:	_resolveTzName(TIME_ZONES[zone].offset);
		}
	};

	const _getTimeZoneId = (utc: UTCOffSet) => {
		const tzIds = (Object.keys(TIME_ZONE_IDS) as TimeZoneIdentifier[]).filter(
			(key) => TIME_ZONE_IDS[key].offset === utc
		);

		if (tzIds?.length === 0) return undefined;
		if (tzIds?.length === 1) return tzIds[0];

		return tzIds;
	};

	ChronosClass.prototype.timeZone = function (
		this: ChronosConstructor,
		zone: TimeZoneIdentifier | TimeZone | UTCOffSet
	): ChronosConstructor {
		let targetOffset: number;
		let stringOffset: UTCOffSet;
		let tzId: TimeZoneId;
		let tzName: string;

		if (isValidUTCOffSet(zone)) {
			targetOffset = extractMinutesFromUTC(zone);
			stringOffset = zone;
			tzId = _getTimeZoneId(stringOffset) || stringOffset;
			tzName = _getTimeZoneName(zone) ?? TIME_ZONES['UTC'].offset;
		} else if (isValidTimeZoneId(zone)) {
			stringOffset = TIME_ZONE_IDS[zone].offset;
			targetOffset = extractMinutesFromUTC(stringOffset);
			tzId = zone;
			tzName = _getTimeZoneName(zone) ?? TIME_ZONES['UTC'].offset;
		} else {
			stringOffset =
				zone in TIME_ZONES ? TIME_ZONES[zone].offset : TIME_ZONES['UTC'].offset;
			targetOffset = extractMinutesFromUTC(stringOffset);
			tzId = _getTimeZoneId(stringOffset) || stringOffset;
			tzName = _getTimeZoneName(zone) ?? TIME_ZONES['UTC'].offset;
		}

		const previousOffset = this.getTimeZoneOffsetMinutes();
		const relativeOffset = targetOffset - previousOffset;

		const adjustedTime = new Date($Date(this).getTime() + relativeOffset * 60 * 1000);

		const instance = new ChronosClass(adjustedTime);

		return internal.withOrigin(instance, `timeZone_${zone}`, stringOffset, tzName, tzId);
	};

	ChronosClass.prototype.getTimeZoneName = function (
		this: ChronosConstructor,
		utc?: UTCOffSet
	): LooseLiteral<UTCOffSet> {
		const UTC = utc ?? this.utcOffset;

		const tracker = this.origin.split('_')?.[1] as
			| TimeZoneIdentifier
			| TimeZone
			| UTCOffSet
			| undefined;

		return _getTimeZoneName(tracker ? tracker : UTC) ?? UTC;
	};

	ChronosClass.prototype.getTimeZoneNameShort = function (
		this: ChronosConstructor,
		utc?: UTCOffSet
	): LooseLiteral<TimeZone | UTCOffSet> {
		const tracker = this.origin.split('_')?.[1];

		if (!utc && tracker && tracker in TIME_ZONES) {
			return tracker as TimeZone;
		}

		const timeZone = this.getTimeZoneName(utc);

		const result = timeZone
			?.split(/\s+/)
			?.filter(Boolean)
			?.map((part) => part?.[0])
			?.join('')
			?.replace(/\W/g, '');

		return result ? result : this.utcOffset;
	};

	ChronosClass.prototype.toString = function (this: ChronosConstructor): string {
		const offset = this.utcOffset;

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
