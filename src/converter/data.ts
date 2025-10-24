import type { $Record } from '../object/types';
import type { Numeric } from '../types/index';
import { $BaseConverter } from './base';
import { UNITS } from './constants';
import type { $DataUnit, ConverterFormatOptions } from './types';

/**
 * @class DataConverter
 * @description Handles conversions with smart `.to()`, `.toAll()`, and `.formatTo()`.
 */
export class $Data extends $BaseConverter<$DataUnit> {
	/** * Conversion factors based on bytes. */
	static #factors: $Record<$DataUnit, number> = {
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
	 * Convert data value to other data units
	 * @param value Number or numeric string value to convert.
	 * @param unit Base data unit for the provided value.
	 */
	constructor(value: Numeric, unit: $DataUnit) {
		super(value, unit);
	}

	/** @instance Converts to base unit (bytes). */
	#toBytes(): number {
		return this.value * $Data.#factors[this.unit];
	}

	/**
	 * @instance Converts to target data unit.
	 * @param target Target data unit.
	 */
	to(target: $DataUnit): number {
		const inBytes = this.#toBytes();
		return inBytes / $Data.#factors[target];
	}

	/**
	 * @instance Converts to all data units.
	 * @returns Object with all unit conversions.
	 */
	toAll(): $Record<$DataUnit, number> {
		const inBytes = this.#toBytes();

		const result = {} as $Record<$DataUnit, number>;

		for (const unit of UNITS.data) {
			result[unit] = inBytes / $Data.#factors[unit];
		}

		return result;
	}

	/**
	 * @instance Formats the converted value.
	 * @param target Target data unit.
	 * @param options Formatting options.
	 * @returns Formatted string like "256MB", "256 megabytes", or "2.56e+2 MB".
	 */
	formatTo(target: $DataUnit, options?: ConverterFormatOptions): string {
		const value = this.to(target);

		const shortLabels: $Record<$DataUnit, string> = {
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

		return this.$formatTo(value, target, shortLabels, options);
	}
}
