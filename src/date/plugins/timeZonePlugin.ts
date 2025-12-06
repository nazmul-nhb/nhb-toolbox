import type { Any, Maybe } from '../../types/index';
import type { LooseLiteral } from '../../utils/types';
import { INTERNALS } from '../constants';
import { isValidUTCOffset } from '../guards';
import { TIME_ZONES, TIME_ZONE_LABELS } from '../timezone';
import type {
	$TZLabelKey,
	$TimeZoneIdentifier,
	TimeZone,
	TimeZoneId,
	TimeZoneIdentifier,
	TimeZoneName,
	UTCOffset,
} from '../types';
import { extractMinutesFromUTC } from '../utils';

type MainChronos = typeof import('../Chronos').Chronos;

/** Record of time zone name and abbreviation */
type $TZNameAbbr = { tzAbbr: TimeZone; tzName: TimeZoneName };

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Creates a new instance of `Chronos` for the specified time zone identifier.
		 *
		 * @remarks Using time zone identifier to create time zone instance is the best option as it extracts info from {@link Intl.supportedValuesOf} API.
		 *
		 * @param tzId - Time zone identifier (e.g., `'Africa/Harare'`). See: {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones IANA TZ Database on Wikipedia}.
		 * @returns A new instance of `Chronos` with time in the given time zone identifier. Invalid input sets time-zone to `UTC`.
		 */
		timeZone(tzId: TimeZoneIdentifier): Chronos;

		/**
		 * @instance Creates a new instance of `Chronos` for the specified abbreviated time zone name.
		 *
		 * @remarks Use abbreviated time zone name to create time zone instance only when you can't figure out the time zone identifier {@link TimeZoneIdentifier}.
		 *
		 * @param zone - Standard time zone abbreviation (e.g., `'IST'`, `'UTC'`, `'EST'` etc.). See: {@link https://en.wikipedia.org/wiki/List_of_time_zone_abbreviations Time zone abbreviations on Wikipedia}.
		 * @returns A new instance of `Chronos` with time in the given time zone abbreviation. Invalid input sets time-zone to `UTC`.
		 */
		timeZone(zone: TimeZone): Chronos;

		/**
		 * @instance Creates a new instance of `Chronos` for the specified UTC offset.
		 *
		 * @remarks Use UTC offset only to create a fictional/unlisted time zone instance.
		 *
		 * @param utc - UTC Offset in `UTC±HH:mm` format for fictional or unlisted time zone (e.g., `'UTC+06:15'`).
		 * @returns A new instance of `Chronos` with time in the given utc offset. Invalid input sets time-zone to `UTC`.
		 */
		timeZone(utc: UTCOffset): Chronos;

		/**
		 * @instance Creates a new instance of `Chronos` for the specified time zone id, abbreviation or UTC offset.
		 *
		 * @remarks
		 * - Using time zone identifier to create time zone instance is the best option as it extracts info from {@link Intl.supportedValuesOf} API.
		 * - Use abbreviated time zone name to create time zone instance only when you can't figure out the time zone identifier.
		 * - Use UTC offset only to create a fictional/unlisted time zone instance.
		 *
		 * @param tz - A time zone identifier ({@link TimeZoneIdentifier}), time zone abbreviation ({@link TimeZone}), or UTC offset ({@link UTCOffset}).
		 * @returns A new instance of `Chronos` with time in the given parameter. Invalid input sets time zone to `UTC`.
		 */
		timeZone(tz: TimeZoneIdentifier | TimeZone | UTCOffset): Chronos;

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

	/** Array of time zone ids extracted from {@link Intl.supportedValuesOf} */
	const TZ_IDS = Intl.supportedValuesOf('timeZone') as Array<$TimeZoneIdentifier>;

	/** Check if a time zone factor represents GMT */
	const _isGMT = (factor: LooseLiteral<UTCOffset>) => {
		return factor === 'UTC+00:00' || factor === 'UTC-00:00';
	};

	/** Check if a string is the key of `TIME_ZONE_LABELS` constant */
	const _isLabelKey = (offset: Maybe<string>): offset is $TZLabelKey => {
		return offset ? offset in TIME_ZONE_LABELS : false;
	};

	/** Check if a string is time zone abbreviation */
	const _isValidTzAbbr = (tz: string): tz is TimeZone => {
		return tz in TIME_ZONES;
	};

	/** Resolve time zone name from `TIME_ZONE_LABELS` constant using UTC offset or get undefined */
	const _resolveTzName = (offset: Maybe<UTCOffset>) => {
		if (_isLabelKey(offset)) {
			return TIME_ZONE_LABELS[offset];
		}

		return undefined;
	};

	/**
	 * * Retrieves comprehensive time zone details using the {@link Intl.supportedValuesOf} API.
	 * @param tzId Time zone identifier. Defaults to the system timezone.
	 * @param date Date for which to resolve the information.
	 * @returns Object containing time zone identifier, name, and offset.
	 */
	const _getTimeZoneDetails = (tzId: $TimeZoneIdentifier, date?: Date) => {
		const TZ_NAME_TYPES = ['long', 'longOffset'] as const;

		const obj = { tzId } as {
			tzId: $TimeZoneIdentifier;
			tzName: Maybe<LooseLiteral<TimeZoneName>>;
			offset: Maybe<UTCOffset>;
		};

		for (const type of TZ_NAME_TYPES) {
			const key = type === 'long' ? 'tzName' : 'offset';

			try {
				const parts = new Intl.DateTimeFormat('en', {
					timeZone: tzId,
					timeZoneName: type,
				}).formatToParts(date);

				const tzPart = parts.find((p) => p.type === 'timeZoneName');

				const value =
					type === 'longOffset' ?
						tzPart?.value === 'GMT' ?
							'UTC+00:00'
						:	tzPart?.value?.replace(/^GMT/, 'UTC')
					:	tzPart?.value;

				obj[key] = value as Any;
			} catch {
				obj[key] = undefined;
			}
		}

		return obj;
	};

	/** Cache to store time zone id (from {@link Intl.supportedValuesOf}) against UTC offset  */
	const TZ_ID_MAP = new Map<UTCOffset, $TimeZoneIdentifier[]>(
		TZ_IDS.reduce((tzIds, id) => {
			const { offset } = _getTimeZoneDetails(id);

			if (offset) {
				const arr = tzIds.get(offset) ?? [];

				arr.push(id);
				tzIds.set(offset, arr);
			}

			return tzIds;
		}, new Map<UTCOffset, $TimeZoneIdentifier[]>())
	);

	/** Cache to store time zone name and abbreviation against UTC offset from {@link TIME_ZONES} */
	const TZ_NAME_ABBR_MAP = new Map<UTCOffset, $TZNameAbbr>(
		Object.entries(TIME_ZONES).map(([tzAbbr, { offset, tzName }]) => [
			offset,
			{ tzAbbr, tzName } as $TZNameAbbr,
		])
	);

	/** Get time zone identifier from {@link TZ_ID_MAP} using UTC offset */
	const _getTimeZoneId = (utc: UTCOffset) => {
		const tzIds = TZ_ID_MAP.get(utc);

		if (!tzIds || tzIds?.length === 0) return undefined;
		if (tzIds?.length === 1) return tzIds[0];

		return tzIds;
	};

	/** Get time zone name from `Intl.supportedValuesOf('timeZone')`, `TIME_ZONE_LABELS` or `TIME_ZONES` constants using UTC offset, time zone identifier or time zone abbreviation */
	const _getTimeZoneName = (zone: $TimeZoneIdentifier | TimeZone | UTCOffset, date: Date) => {
		if (_isGMT(zone)) return 'Greenwich Mean Time';

		if (isValidUTCOffset(zone)) {
			const tzName = _resolveTzName(zone);

			if (!tzName && TZ_NAME_ABBR_MAP.has(zone)) {
				return TZ_NAME_ABBR_MAP.get(zone)?.tzName;
			}

			return tzName;
		} else if (_isValidTzAbbr(zone)) {
			return TIME_ZONES[zone].tzName;
		} else {
			const { offset, tzName } = _getTimeZoneDetails(zone, date);

			return tzName || _resolveTzName(offset);
		}
	};

	ChronosClass.prototype.timeZone = function (this, zone) {
		let offset: UTCOffset;
		let tzId: TimeZoneId;

		if (isValidUTCOffset(zone)) {
			offset = zone;
			tzId = _getTimeZoneId(offset) || offset;
		} else if (_isValidTzAbbr(zone)) {
			offset = TIME_ZONES[zone].offset;
			tzId = _getTimeZoneId(offset) || offset;
		} else {
			offset = _getTimeZoneDetails(zone, $Date(this)).offset || TIME_ZONES['UTC'].offset;
			tzId = zone;
		}

		// ! in case zone has empty string
		const $zone = zone || offset;
		const tzName = _getTimeZoneName($zone, $Date(this)) ?? offset;

		const relativeOffset = extractMinutesFromUTC(offset) - this.getTimeZoneOffsetMinutes();

		const adjustedTime = new Date($Date(this).getTime() + relativeOffset * 60 * 1000);
		const instance = new ChronosClass(adjustedTime);

		return withOrigin(instance, `timeZone`, offset, tzName, tzId, $zone);
	};

	ChronosClass.prototype.getTimeZoneName = function (this, utc) {
		const UTC = utc || this.utcOffset;

		return _getTimeZoneName(utc || this?.$tzTracker || this.utcOffset, $Date(this)) ?? UTC;
	};

	/** Cache to store abbreviated time zone names */
	const TZ_ABBR_CACHE = new Map<string, string>();

	/** Abbreviate full time zone name */
	const _abbreviate = (name: string) => {
		return name
			.split(/\s+/)
			.map((w) => w[0])
			.join('')
			.replace(/\W/g, '');
	};

	ChronosClass.prototype.getTimeZoneNameShort = function (this, utc) {
		const tracker = this?.$tzTracker;
		const UTC = utc || this.utcOffset;

		const tzMapKey = utc || tracker || this.utcOffset;

		if (_isGMT(tzMapKey)) return 'GMT';

		if (!utc && tracker && _isValidTzAbbr(tracker)) return tracker;

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

		const customAbbr = isValidUTCOffset(zone) ? zone : _abbreviate(zone);

		TZ_ABBR_CACHE.set(`name-${zone}`, customAbbr);

		return customAbbr;
	};

	ChronosClass.prototype.getTimeZoneNameAbbr = function (this, utc) {
		return this.getTimeZoneNameShort(utc);
	};
};
