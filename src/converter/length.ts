import type { $Record } from '../object/types';
import type { Numeric } from '../types/index';
import { $BaseConverter } from './base';
import { UNITS } from './constants';
import type { $LengthUnit, ConverterFormatOptions } from './types';

/**
 * @class LengthConverter
 * @description Handles conversions with smart `.to()`, `.toAll()`, and `.formatTo()`.
 */
export class $Length extends $BaseConverter<$LengthUnit> {
	/** * Conversion factors based on meters. */
	static #factors: $Record<$LengthUnit, number> = {
		millimeter: 0.001,
		centimeter: 0.01,
		meter: 1,
		kilometer: 1000,
		millimetre: 0.001,
		centimetre: 0.01,
		metre: 1,
		kilometre: 1000,
		inch: 0.0254,
		foot: 0.3048,
		yard: 0.9144,
		mile: 1609.344,
		'nautical-mile': 1852,
		'light-year': 9.4607e15,
	};

	/**
	 * Convert length/distance value to other length/distance units
	 * @param value Number or numeric string value to convert.
	 * @param unit Base length/distance unit for the provided value.
	 */
	constructor(value: Numeric, unit: $LengthUnit) {
		super(value, unit);
	}

	/** @instance Converts to base unit (meters). */
	#toMeters(): number {
		return this.value * $Length.#factors[this.unit];
	}

	/**
	 * @instance Converts to target length/distance unit.
	 * @param target Target length/distance unit.
	 */
	to(target: $LengthUnit): number {
		const inMeters = this.#toMeters();
		return inMeters / $Length.#factors[target];
	}

	/**
	 * @instance Converts to all data units.
	 * @returns Object with all unit conversions.
	 */
	toAll(): $Record<$LengthUnit, number> {
		const inMeters = this.#toMeters();

		const result = {} as $Record<$LengthUnit, number>;

		for (const unit of UNITS.length) {
			result[unit] = inMeters / $Length.#factors[unit];
		}

		return result;
	}

	/**
	 * @instance Formats the converted value and unit.
	 * @param target Target unit to format to.
	 * @param options Formatting options.
	 * @returns Formatted string like "5km", "5.12 miles", or "5e+3 meter".
	 */
	formatTo(target: $LengthUnit, options?: ConverterFormatOptions): string {
		const value = this.to(target);
		const { style = 'plural', decimals = 2 } = options ?? {};
		const rounded = this.$round(value, decimals);

		switch (style) {
			case 'compact': {
				const shortLabels: $Record<$LengthUnit, string> = {
					millimeter: 'mm',
					centimeter: 'cm',
					meter: 'm',
					kilometer: 'km',
					millimetre: 'mm',
					centimetre: 'cm',
					metre: 'm',
					kilometre: 'km',
					inch: 'in',
					foot: 'ft',
					yard: 'yd',
					mile: 'mi',
					'nautical-mile': 'nmi',
					'light-year': 'ly',
				};
				return `${rounded}${shortLabels[target]}`;
			}
			case 'scientific':
				return `${value.toExponential(decimals)} ${target}`;
			default:
				return this.$withPluralUnit(rounded, target);
		}
	}
}
