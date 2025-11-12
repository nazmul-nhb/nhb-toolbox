import type { LooseLiteral } from '../../utils/types';
import { INTERNALS } from '../constants';
import { isValidTimeZoneId, isValidUTCOffset } from '../guards';
import { TIME_ZONES, TIME_ZONE_IDS, TIME_ZONE_LABELS } from '../timezone';
import type {
	$TZLabelKey,
	TimeZone,
	TimeZoneId,
	TimeZoneIdentifier,
	TimeZoneName,
	UTCOffset,
} from '../types';
import { _getNativeTzName, extractMinutesFromUTC } from '../utils';

type ChronosConstructor = import('../Chronos').Chronos;
type MainChronos = typeof import('../Chronos').Chronos;

/** Record of time zone name and abbreviation */
type $TZNameAbbr = { tzAbbr: TimeZone; tzName: TimeZoneName };

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Creates a new instance of `Chronos` for the specified time zone identifier.
		 *
		 * @remarks Using time zone identifier to create time zone instance is the best option.
		 *
		 * @param tzId - Time zone identifier (e.g., `'Africa/Harare'`). See: {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones IANA TZ Database on Wikipedia}.
		 * @returns A new instance of `Chronos` with time in the given time zone identifier. Invalid input sets time-zone to `UTC`.
		 */
		timeZone(tzId: TimeZoneIdentifier): ChronosConstructor;

		/**
		 * @instance Creates a new instance of `Chronos` for the specified abbreviated time zone name.
		 *
		 * @remarks Use abbreviated time zone name to create time zone instance only when you can't figure out the time zone identifier.
		 *
		 * @param zone - Standard time zone abbreviation (e.g., `'IST'`, `'UTC'`, `'EST'` etc.). See: {@link https://en.wikipedia.org/wiki/List_of_time_zone_abbreviations Time zone abbreviations on Wikipedia}.
		 * @returns A new instance of `Chronos` with time in the given time zone abbreviation. Invalid input sets time-zone to `UTC`.
		 */
		timeZone(zone: TimeZone): ChronosConstructor;

		/**
		 * @instance Creates a new instance of `Chronos` for the specified utc offset.
		 *
		 * @remarks Use UTC offset only to create a fictional/unlisted time zone instance.
		 *
		 * @param utc - UTC Offset in `UTC±HH:mm` format for fictional or unlisted time zone (e.g., `'UTC+06:15'`).
		 * @returns A new instance of `Chronos` with time in the given utc offset. Invalid input sets time-zone to `UTC`.
		 */
		timeZone(utc: UTCOffset): ChronosConstructor;

		/**
		 * @instance Returns the current time zone name as a full descriptive string (e.g. `"Bangladesh Standard Time"`).
		 *
		 * @remarks
		 * - This method uses a predefined mapping of UTC offsets to time zone names.
		 * - If multiple time zones share the same UTC offset, it returns the **first match** from the predefined list.
		 * - If no match is found (which is rare), it falls back to returning the UTC offset (e.g. `"UTC+06:00"`).
		 * - To retrieve the local system's native time zone name (or its identifier if the name is unavailable), use the {@link $getNativeTimeZoneName} instance method.
		 * - To retrieve the local system's native time zone identifier, use the {@link $getNativeTimeZoneId} instance method.
		 *
		 * @param utc Optional UTC offset in `"UTC+06:00"` format. When passed, it bypasses the current time zone offset.
		 * @returns Time zone name in full descriptive string or UTC offset if it is not a valid time zone.
		 */
		getTimeZoneName(utc?: UTCOffset): LooseLiteral<TimeZoneName | UTCOffset>;

		/**
		 * @instance Returns the current time zone abbreviation (e.g. `"BST"` for `Bangladesh Standard Time`).
		 *
		 * @remarks
		 * - This method uses a predefined mapping of UTC offsets to abbreviated time zone codes.
		 * - If multiple time zones share the same UTC offset, it returns the **first abbreviation** from the list.
		 * - If no abbreviation is found it abbreviates full time zone name from {@link TIME_ZONE_LABELS} using UTC offset.
		 * - If no match is found (for unlisted or fictional utc offset), it returns the UTC offset (e.g. `"UTC+06:00"`).
		 * - To retrieve the local system's native time zone name (or its identifier if the name is unavailable), use the {@link $getNativeTimeZoneName} instance method.
		 * - To retrieve the local system's native time zone identifier, use the {@link $getNativeTimeZoneId} instance method.
		 *
		 * @param utc Optional UTC offset in `"UTC+06:00"` format. When passed, it bypasses the current time zone offset.
		 * @returns Time zone name in full descriptive string or UTC offset if it is not a valid time zone.
		 */
		getTimeZoneNameShort(utc?: UTCOffset): LooseLiteral<TimeZone | UTCOffset>;

		/**
		 * @instance Returns the current time zone abbreviation (e.g. `"BST"` for `Bangladesh Standard Time`).
		 *
		 * @remarks This method is an alias for {@link getTimeZoneNameShort}.
		 *
		 * @param utc Optional UTC offset in `"UTC+06:00"` format. When passed, it bypasses the current time zone offset.
		 * @returns Time zone name in full descriptive string or UTC offset if it is not a valid time zone.
		 */
		getTimeZoneNameAbbr(utc?: UTCOffset): LooseLiteral<TimeZone | UTCOffset>;
	}
}

/** * Plugin to inject `timeZone` related methods */
export const timeZonePlugin = (ChronosClass: MainChronos): void => {
	const { internalDate: $Date, withOrigin } = ChronosClass[INTERNALS];

	/** Check if a time zone factor represents GMT */
	const _isGMT = (factor: LooseLiteral<UTCOffset>) => {
		return factor === 'UTC+00:00' || factor === 'UTC-00:00';
	};

	/** Cache to store time zone name and abbreviation against UTC offset from {@link TIME_ZONES} */
	const TZ_NAME_ABBR_MAP = new Map<UTCOffset, $TZNameAbbr>(
		Object.entries(TIME_ZONES).map(([tzAbbr, { offset, tzName }]) => [
			offset,
			{ tzAbbr, tzName } as $TZNameAbbr,
		])
	);

	/** Check if a string is the key of `TIME_ZONE_LABELS` constant */
	const _isLabelKey = (offset: string): offset is $TZLabelKey => {
		return offset in TIME_ZONE_LABELS;
	};

	/** Resolve time zone name from `TIME_ZONE_LABELS` constant using UTC offset or get undefined */
	const _resolveTzName = (offset: UTCOffset) => {
		if (_isLabelKey(offset)) {
			return TIME_ZONE_LABELS[offset];
		}

		return undefined;
	};

	/** Get time zone name from `TIME_ZONE_LABELS`, `TIME_ZONE_IDS` or `TIME_ZONES` constants using UTC offset, time zone identifier or time zone abbreviation */
	const _getTimeZoneName = (zone: TimeZoneIdentifier | TimeZone | UTCOffset, date: Date) => {
		if (_isGMT(zone)) return 'Greenwich Mean Time';

		if (isValidUTCOffset(zone)) {
			const tzName = _resolveTzName(zone);

			if (!tzName && TZ_NAME_ABBR_MAP.has(zone)) {
				return TZ_NAME_ABBR_MAP.get(zone)?.tzName;
			}

			return tzName;
		} else if (isValidTimeZoneId(zone)) {
			const record = TIME_ZONE_IDS[zone];
			return (
				record?.tzName || _getNativeTzName(zone, date) || _resolveTzName(record?.offset)
			);
		} else {
			return zone in TIME_ZONES ?
					TIME_ZONES[zone].tzName
				:	_resolveTzName(TIME_ZONES[zone]?.offset);
		}
	};

	/** Cache to store time zone id against UTC offset from {@link TIME_ZONE_IDS} */
	const TZ_ID_MAP = new Map<UTCOffset, TimeZoneIdentifier[]>(
		Object.entries(TIME_ZONE_IDS).reduce((acc, [id, { offset }]) => {
			const arr = acc.get(offset) ?? [];

			arr.push(id as TimeZoneIdentifier);
			acc.set(offset, arr);

			return acc;
		}, new Map<UTCOffset, TimeZoneIdentifier[]>())
	);

	/** Get time zone identifier from {@link TIME_ZONE_IDS} using UTC offset */
	const _getTimeZoneId = (utc: UTCOffset) => {
		const tzIds = TZ_ID_MAP.get(utc);

		if (!tzIds || tzIds?.length === 0) return undefined;
		if (tzIds?.length === 1) return tzIds[0];

		return tzIds;
	};

	ChronosClass.prototype.timeZone = function (
		this: ChronosConstructor,
		zone: TimeZoneIdentifier | TimeZone | UTCOffset
	): ChronosConstructor {
		let offset: UTCOffset;
		let tzId: TimeZoneId;

		if (isValidUTCOffset(zone)) {
			offset = zone;
			tzId = _getTimeZoneId(offset) || offset;
		} else if (isValidTimeZoneId(zone)) {
			offset = TIME_ZONE_IDS[zone].offset;
			tzId = zone;
		} else {
			offset = zone in TIME_ZONES ? TIME_ZONES[zone].offset : TIME_ZONES['UTC'].offset;
			tzId = _getTimeZoneId(offset) || offset;
		}

		// ! in case zone has empty string
		const $zone = zone || offset;
		const tzName = _getTimeZoneName($zone, $Date(this)) ?? offset;

		const targetOffset = extractMinutesFromUTC(offset);
		const previousOffset = this.getTimeZoneOffsetMinutes();
		const relativeOffset = targetOffset - previousOffset;

		const adjustedTime = new Date($Date(this).getTime() + relativeOffset * 60 * 1000);
		const instance = new ChronosClass(adjustedTime);

		return withOrigin(instance, `timeZone`, offset, tzName, tzId, $zone);
	};

	ChronosClass.prototype.getTimeZoneName = function (
		this: ChronosConstructor,
		utc?: UTCOffset
	): LooseLiteral<TimeZoneName | UTCOffset> {
		const UTC = utc || this.utcOffset;

		return _getTimeZoneName(utc || this?.$tzTracker || this.utcOffset, $Date(this)) ?? UTC;
	};

	/** Cache to store abbreviated time zone names */
	const TZ_ABBR_CACHE = new Map<string, string>();

	/** Abbreviate full time zone name */
	const _abbreviate = (name: TimeZoneName) => {
		return name
			.split(/\s+/)
			.map((w) => w[0])
			.join('')
			.replace(/\W/g, '');
	};

	ChronosClass.prototype.getTimeZoneNameShort = function (
		this: ChronosConstructor,
		utc?: UTCOffset
	): LooseLiteral<TimeZone | UTCOffset> {
		const tracker = this?.$tzTracker;
		const UTC = utc || this.utcOffset;

		const tzMapKey = utc || tracker || this.utcOffset;

		if (_isGMT(tzMapKey)) return 'GMT';

		if (!utc && tracker && tracker in TIME_ZONES) return tracker as TimeZone;

		if (isValidUTCOffset(tzMapKey)) {
			if (TZ_ABBR_CACHE.has(tzMapKey)) return TZ_ABBR_CACHE.get(tzMapKey)!;

			if (TZ_NAME_ABBR_MAP.has(tzMapKey)) {
				return TZ_NAME_ABBR_MAP.get(tzMapKey)?.tzAbbr as TimeZone;
			}

			const tzName = _resolveTzName(tzMapKey);
			if (tzName) {
				const tzAbbr = _abbreviate(tzName);
				TZ_ABBR_CACHE.set(tzMapKey, tzAbbr);
				return tzAbbr;
			}
		}

		const zone = _getTimeZoneName(tzMapKey, $Date(this)) ?? UTC;

		if (TZ_ABBR_CACHE.has(`name-${zone}`)) return TZ_ABBR_CACHE.get(zone)!;

		const customAbbr =
			isValidUTCOffset(zone) || isValidTimeZoneId(zone) ? zone : _abbreviate(zone);

		TZ_ABBR_CACHE.set(`name-${zone}`, customAbbr);

		return customAbbr;
	};

	ChronosClass.prototype.getTimeZoneNameAbbr = function (
		this: ChronosConstructor,
		utc?: UTCOffset
	): LooseLiteral<TimeZone | UTCOffset> {
		return this.getTimeZoneNameShort(utc);
	};

	ChronosClass.prototype.toString = function (this: ChronosConstructor): string {
		const offset = this.utcOffset;
		const search = /GMT[+-]\d{4}\s+\([^)]+\)/;

		switch (this.origin) {
			case 'timeZone': {
				const gmt = offset.replace('UTC', 'GMT').replace(':', '');
				const label = this.getTimeZoneName();

				return $Date(this).toString().replace(search, `${gmt} (${label})`);
			}
			case 'toUTC':
			case 'utc': {
				return $Date(this)
					.toString()
					.replace(search, `GMT+0000 (Coordinated Universal Time)`);
			}
			default:
				return $Date(this).toString();
		}
	};
};
