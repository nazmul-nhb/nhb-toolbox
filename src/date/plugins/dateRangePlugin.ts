import { isValidArray } from '../../guards/non-primitives';
import { isNumber } from '../../guards/primitives';
import { INTERNALS } from '../Chronos';
import { DAYS, MS_PER_DAY } from '../constants';
import type { $Chronos, RangeWithDates, RelativeDateRange } from '../types';

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Returns an array of ISO date strings within a specific date range.
		 *
		 * - If the input is a fixed range (`from` and `to`), it includes all dates between them.
		 * - If the input is a relative range (`span` and `unit`), it starts from current date and goes forward.
		 * - If `skipDays` are provided, matching weekdays are excluded from the result.
		 *
		 * @param options - Configuration for the date range. Accepts a fixed (`RangeWithDates`) format.
		 * @returns Array of ISO date strings in either local or UTC format, excluding any skipped weekdays if specified.
		 *
		 * - Please refer to {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/calculation#getdatesinrange docs} for details.
		 *
		 * @remarks
		 * - When using `Chronos` instances for `from` and/or `to`, ensure both are created in the **same time zone** to avoid mismatched boundaries.
		 * - Mixing zones may shift the interpreted start or end by several hours, which can cause the range to include or exclude incorrect weekdays.
		 *
		 * @example
		 * // Using a fixed date range:
		 * new Chronos().getDatesInRange({ from: '2025-01-01', to: '2025-01-03' });
		 * // → ['2025-01-01T00:00:00+06:00', '2025-01-02T00:00:00+06:00', '2025-01-03T00:00:00+06:00']
		 *
		 * @example
		 * // Using a relative date range with skipDays:
		 * new Chronos().getDatesInRange({ span: 7, unit: 'day', skipDays: ['Saturday', 'Sunday'] });
		 * // → Array of 7 dates excluding weekends
		 *
		 * @example
		 * // UTC format:
		 * new Chronos().getDatesInRange({ span: 2, unit: 'day', format: 'utc' });
		 * // → ['2025-06-16T00:00:00.000Z', '2025-06-17T00:00:00.000Z']
		 */
		getDatesInRange(options?: RangeWithDates): string[];

		/**
		 * @instance Returns an array of ISO date strings within a specific date range.
		 *
		 * - If the input is a fixed range (`from` and `to`), it includes all dates between them.
		 * - If the input is a relative range (`span` and `unit`), it starts from current date and goes forward.
		 * - If `skipDays` are provided, matching weekdays are excluded from the result.
		 *
		 * @param options - Configuration for the date range. Accepts a relative (`RelativeDateRange`) format.
		 * @returns Array of ISO date strings in either local or UTC format, excluding any skipped weekdays if specified.
		 *
		 * - Please refer to {@link https://toolbox.nazmul-nhb.dev/docs/classes/Chronos/calculation#getdatesinrange docs} for details.
		 *
		 * @example
		 * // Using a relative date range with skipDays:
		 * new Chronos().getDatesInRange({ span: 7, unit: 'day', skipDays: ['Saturday', 'Sunday'] });
		 * // → Array of 7 dates excluding weekends
		 *
		 * @example
		 * // UTC format:
		 * new Chronos().getDatesInRange({ span: 2, unit: 'day', format: 'utc' });
		 * // → ['2025-06-16T00:00:00.000Z', '2025-06-17T00:00:00.000Z']
		 *
		 * @example
		 * // Using a fixed date range:
		 * new Chronos().getDatesInRange({ from: '2025-01-01', to: '2025-01-03' });
		 * // → ['2025-01-01T00:00:00+06:00', '2025-01-02T00:00:00+06:00', '2025-01-03T00:00:00+06:00']
		 */
		getDatesInRange(options?: RelativeDateRange): string[];
	}
}

/** * Plugin to inject `getDatesInRange` related method */
export const dateRangePlugin = ($Chronos: $Chronos): void => {
	const { internalDate: $Date, cast, withOrigin, offset } = $Chronos[INTERNALS];

	$Chronos.prototype.getDatesInRange = function (this, options) {
		let startDate = this.clone(),
			endDate = this.addWeeks(4);

		const { format = 'local', onlyDays, skipDays, roundDate = false } = options ?? {};

		if (options) {
			if ('from' in options || 'to' in options) {
				if (options?.from) startDate = cast(options.from);
				if (options?.to) endDate = cast(options.to);
			} else if ('span' in options || 'unit' in options) {
				const { span = 4, unit = 'week' } = options;
				endDate = startDate.add(span, unit);
			}
		}

		if (roundDate) {
			startDate = startDate.startOf('day');
			endDate = endDate.startOf('day');
		}

		const skippedDays =
			isValidArray(onlyDays) ? onlyDays
			: isValidArray(skipDays) ? skipDays
			: [];

		const skipSet = new Set<number>(
			skippedDays.map((day) => (isNumber(day) ? day : DAYS.indexOf(day)))
		);

		const dates: string[] = [];

		const startTime = $Date(startDate).getTime();
		const endTime = $Date(endDate).getTime();
		const step = (startTime <= endTime ? 1 : -1) * MS_PER_DAY;
		const totalDays = Math.floor(Math.abs(endTime - startTime) / MS_PER_DAY);

		for (let i = 0; i <= totalDays; i++) {
			const ts = startTime + i * step;
			const wDay = new Date(ts).getDay(); // temporary, just for weekday

			const include = isValidArray(onlyDays) ? skipSet.has(wDay) : !skipSet.has(wDay);

			if (include) {
				const chr = withOrigin(
					new $Chronos(ts),
					'clone',
					offset(this),
					startDate.timeZoneName,
					startDate.timeZoneId,
					startDate.$tzTracker
				);

				dates.push(format === 'local' ? chr.toLocalISOString() : chr.toISOString());
			}
		}

		return dates;
	};
};
