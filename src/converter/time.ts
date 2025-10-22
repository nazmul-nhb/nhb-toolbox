import { formatUnitWithPlural } from '../string/convert';
import { $Base } from './base';
import type { ConverterFormatOptions, UnitMap } from './types';

/**
 * @class $Time
 * @description Time-specific conversions with smart `.to()` and formatting options.
 */
export class $Time extends $Base<UnitMap['time']> {
	/** * Common conversion factors based on seconds. */
	static #factors: Record<UnitMap['time'], number> = {
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
	 * @instance Converts current value to the base unit (seconds).
	 * @returns Value in seconds.
	 */
	toSeconds(): number {
		return this.value * $Time.#factors[this.unit];
	}

	/**
	 * @instance Converts current value to the target unit.
	 * @param target Target time unit.
	 * @returns Numeric value converted to target unit.
	 */
	to(target: UnitMap['time']): number {
		const baseInSeconds = this.toSeconds();
		return baseInSeconds / $Time.#factors[target];
	}

	/**
	 * @instance Converts to minutes.
	 * @returns Value in minutes.
	 */
	toMinutes(): number {
		return this.to('minute');
	}

	/**
	 * @instance Converts to hours.
	 * @returns Value in hours.
	 */
	toHours(): number {
		return this.to('hour');
	}

	/**
	 * @instance Converts to days.
	 * @returns Value in days.
	 */
	toDays(): number {
		return this.to('day');
	}

	/**
	 * @instance Formats the converted value with optional formatting style.
	 * @param target Target unit to format to.
	 * @param options Formatting options: `compact`, `scientific`, or `plural`.
	 * @returns Formatted string like "2 hours", "2h", or "2e+0 h".
	 */
	formatTo(target: UnitMap['time'], options?: ConverterFormatOptions): string {
		const value = this.to(target);
		const { style = 'plural', decimals = 2 } = options ?? {};
		const rounded = Number(value.toFixed(decimals));

		switch (style) {
			case 'compact': {
				// Short labels
				const shortLabels: Record<UnitMap['time'], string> = {
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
				return `${rounded}${shortLabels[target]}`;
			}

			case 'scientific':
				return `${value.toExponential(decimals)} ${target}`;

			default:
				return formatUnitWithPlural(rounded, target);
		}
	}

	/**
	 * @instance Converts to all time units at once.
	 * @returns Object with all unit conversions.
	 */
	toAll(): Record<UnitMap['time'], number> {
		const inSeconds = this.toSeconds();

		const result = {} as Record<UnitMap['time'], number>;

		for (const unit of Object.keys($Time.#factors) as UnitMap['time'][]) {
			result[unit] = inSeconds / $Time.#factors[unit];
		}

		return result;
	}
}
