import { formatUnitWithPlural } from '../string/convert';
import { $Base } from './base';
import type { ConverterFormatOptions, UnitMap } from './types';

/**
 * @class $Data
 * @description Handles conversions between digital data units (bits, bytes, kilobytes, etc.).
 */
export class $Data extends $Base<UnitMap['data']> {
	/** * Conversion factors based on bytes. */
	static #factors: Record<UnitMap['data'], number> = {
		bit: 1 / 8,
		byte: 1,
		kilobit: 128,
		kilobyte: 1024,
		megabit: 131072,
		megabyte: 1048576,
		gigabit: 134217728,
		gigabyte: 1073741824,
		terabit: 137438953472,
		terabyte: 1099511627776,
		petabit: 140737488355328,
		petabyte: 1125899906842624,
	};

	/**
	 * @instance Converts current value to bytes.
	 * @returns Value in bytes.
	 */
	toBytes(): number {
		return this.value * $Data.#factors[this.unit];
	}

	/**
	 * @instance Converts current value to the target unit.
	 * @param target Target data unit.
	 * @returns Numeric value converted to target unit.
	 */
	to(target: UnitMap['data']): number {
		const inBytes = this.toBytes();
		return inBytes / $Data.#factors[target];
	}

	/**
	 * @instance Converts to megabytes.
	 * @returns Value in megabytes.
	 */
	toMegabytes(): number {
		return this.to('megabyte');
	}

	/**
	 * @instance Converts to gigabytes.
	 * @returns Value in gigabytes.
	 */
	toGigabytes(): number {
		return this.to('gigabyte');
	}

	/**
	 * @instance Converts to all data units.
	 * @returns Object with all unit conversions.
	 */
	toAll(): Record<UnitMap['data'], number> {
		const inBytes = this.toBytes();
		const result = {} as Record<UnitMap['data'], number>;
		for (const unit of Object.keys($Data.#factors) as UnitMap['data'][]) {
			result[unit] = inBytes / $Data.#factors[unit];
		}
		return result;
	}

	/**
	 * @instance Formats the converted value.
	 * @param target Target data unit.
	 * @param options Formatting options.
	 * @returns Formatted string like "256 MB", "256MB", or "2.56e+2 MB".
	 */
	formatTo(target: UnitMap['data'], options?: ConverterFormatOptions): string {
		const value = this.to(target);
		const { style = 'plural', decimals = 2 } = options ?? {};
		const rounded = Number(value.toFixed(decimals));

		switch (style) {
			case 'compact': {
				const shortLabels: Record<UnitMap['data'], string> = {
					bit: 'b',
					byte: 'B',
					kilobit: 'Kb',
					kilobyte: 'KB',
					megabit: 'Mb',
					megabyte: 'MB',
					gigabit: 'Gb',
					gigabyte: 'GB',
					terabit: 'Tb',
					terabyte: 'TB',
					petabit: 'Pb',
					petabyte: 'PB',
				};
				return `${rounded}${shortLabels[target]}`;
			}
			case 'scientific':
				return `${value.toExponential(decimals)} ${target}`;
			default:
				return formatUnitWithPlural(rounded, target);
		}
	}
}
