import type { $Record } from '../object/types';
import type { Numeric } from '../types/index';
import { $BaseConverter } from './base';
import { UNITS } from './constants';
import type { $TimeUnit, FormatToOptions } from './types';

/**
 * @class TimeConverter
 * @description Handles conversions with smart `.to()`, `.toAll()`, and `.formatTo()`.
 */
export class $Time extends $BaseConverter<$TimeUnit> {
	/** * Common conversion factors based on seconds. */
	static #factors: $Record<$TimeUnit, number> = {
		nanosecond: 1e-9,
		microsecond: 1e-6,
		millisecond: 1e-3,
		second: 1,
		minute: 60,
		hour: 3600,
		day: 86400,
		week: 604800,
		month: 2_629_746, // average month (30.44 days)
		year: 31_556_952, // average year (365.2425 days)
		decade: 315_569_520, // 10 years
		century: 3_155_695_200, // 100 years
		millennium: 31_556_952_000, // 1000 years
	};

	/**
	 * Convert time value to other time units
	 * @param value Number or numeric string value to convert.
	 * @param unit Base time unit for the provided value.
	 */
	constructor(value: Numeric, unit: $TimeUnit) {
		super(value, unit);
	}

	/** @instance Converts to base unit (seconds). */
	#toSeconds(): number {
		return this.value * $Time.#factors[this.unit];
	}

	/**
	 * @instance Converts to target time unit.
	 * @param target Target time unit.
	 */
	to(target: $TimeUnit): number {
		const baseInSeconds = this.#toSeconds();
		return baseInSeconds / $Time.#factors[target];
	}

	/**
	 * @instance Converts to all time units at once.
	 * @returns Object with all unit conversions.
	 */
	toAll(): $Record<$TimeUnit, number> {
		const inSeconds = this.#toSeconds();

		const result = {} as $Record<$TimeUnit, number>;

		for (const unit of UNITS.time) {
			result[unit] = inSeconds / $Time.#factors[unit];
		}

		return result;
	}

	/**
	 * @instance Formats the converted value and unit.
	 * @param target Target unit to format to.
	 * @param options Formatting options.
	 * @returns Formatted string like "5h", "5.25 hours", or "5e+3 minute".
	 */
	formatTo(target: $TimeUnit, options?: FormatToOptions): string {
		const value = this.to(target);

		const shortLabels: $Record<$TimeUnit, string> = {
			nanosecond: 'ns',
			microsecond: 'µs',
			millisecond: 'ms',
			second: 's',
			minute: 'min',
			hour: 'h',
			day: 'd',
			week: 'wk',
			month: 'mo',
			year: 'yr',
			decade: 'dec',
			century: 'cen',
			millennium: 'mil',
		};

		return this.$formatTo(value, target, shortLabels, options);
	}
}
