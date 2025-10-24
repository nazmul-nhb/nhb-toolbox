import type { $Record } from '../object/types';
import type { Numeric } from '../types/index';
import { $BaseConverter } from './base';
import { UNITS } from './constants';
import type { $AreaUnit, ConverterFormatOptions } from './types';

/**
 * @class AreaConverter
 * @description Handles conversions with smart `.to()`, `.toAll()`, and `.formatTo()`.
 */
export class $Area extends $BaseConverter<$AreaUnit> {
	/** * Conversion factors based on square-meters. */
	static #factors: $Record<$AreaUnit, number> = {
		'square-millimeter': 1e-6,
		'square-centimeter': 1e-4,
		'square-meter': 1,
		'square-kilometer': 1e6,
		'square-millimetre': 1e-6,
		'square-centimetre': 1e-4,
		'square-metre': 1,
		'square-kilometre': 1e6,
		'square-inch': 0.00064516,
		'square-foot': 0.09290304,
		'square-yard': 0.83612736,
		'square-mile': 2_589_988.110336,
		hectare: 1e4,
		acre: 4_046.8564224,
	};

	/**
	 * Convert area value to other area units
	 * @param value Number or numeric string value to convert.
	 * @param unit Base area unit for the provided value.
	 */
	constructor(value: Numeric, unit: $AreaUnit) {
		super(value, unit);
	}

	/** @instance Converts to base unit (square meters). */
	#toSquareMeters(): number {
		return this.value * $Area.#factors[this.unit];
	}

	/**
	 * @instance Converts to target area unit.
	 * @param target Target area unit.
	 */
	to(target: $AreaUnit): number {
		const base = this.#toSquareMeters();
		return base / $Area.#factors[target];
	}

	/**
	 * @instance Converts to all area units.
	 * @returns Object with all unit conversions.
	 */
	toAll(): $Record<$AreaUnit, number> {
		const base = this.#toSquareMeters();

		const result = {} as $Record<$AreaUnit, number>;

		for (const unit of UNITS.area) {
			result[unit] = base / $Area.#factors[unit];
		}

		return result;
	}

	/**
	 * @instance Formats the converted value and unit.
	 * @param target Target unit to format to.
	 * @param options Formatting options.
	 * @returns Formatted string like "5km²", "5.02 square-miles", or "5e+3 meter".
	 */
	formatTo(target: $AreaUnit, options?: ConverterFormatOptions): string {
		const value = this.to(target);

		const shortLabels: $Record<$AreaUnit, string> = {
			'square-millimeter': 'mm²',
			'square-centimeter': 'cm²',
			'square-meter': 'm²',
			'square-kilometer': 'km²',
			'square-millimetre': 'mm²',
			'square-centimetre': 'cm²',
			'square-metre': 'm²',
			'square-kilometre': 'km²',
			'square-inch': 'in²',
			'square-foot': 'ft²',
			'square-yard': 'yd²',
			'square-mile': 'mi²',
			hectare: 'ha',
			acre: 'ac',
		};

		return this.$formatTo(value, target, shortLabels, options);
	}
}
