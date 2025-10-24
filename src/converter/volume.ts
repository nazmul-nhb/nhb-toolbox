import type { $Record } from '../object/types';
import type { Numeric } from '../types/index';
import { $BaseConverter } from './base';
import { UNITS } from './constants';
import type { $VolumeUnit, ConverterFormatOptions } from './types';

/**
 * @class VolumeConverter
 * @description Handles conversions with smart `.to()`, `.toAll()`, and `.formatTo()`.
 */
export class $Volume extends $BaseConverter<$VolumeUnit> {
	/** * Common conversion factors based on cubic-meters. */
	static #factors: $Record<$VolumeUnit, number> = {
		'cubic-millimeter': 1e-9,
		'cubic-centimeter': 1e-6,
		'cubic-meter': 1,
		'cubic-kilometer': 1e9,
		'cubic-millimetre': 1e-9,
		'cubic-centimetre': 1e-6,
		'cubic-metre': 1,
		'cubic-kilometre': 1e9,
		'cubic-inch': 1.6387e-5,
		'cubic-foot': 0.0283168,
		'cubic-yard': 0.764555,
		liter: 0.001,
		litre: 0.001,
		milliliter: 1e-6,
		millilitre: 1e-6,
		gallon: 0.00378541,
		quart: 0.000946353,
		pint: 0.000473176,
		cup: 0.000236588,
		tablespoon: 1.47868e-5,
		teaspoon: 4.92892e-6,
	};

	/**
	 * Convert volume value to other volume units
	 * @param value Number or numeric string value to convert.
	 * @param unit Base volume unit for the provided value.
	 */
	constructor(value: Numeric, unit: $VolumeUnit) {
		super(value, unit);
	}

	/** @instance Converts to base unit (cubic-meters). */
	#toCubicMeters(): number {
		return this.value * $Volume.#factors[this.unit];
	}

	/**
	 * @instance Converts to target volume unit.
	 * @param target Target volume unit.
	 */
	to(target: $VolumeUnit): number {
		const base = this.#toCubicMeters();
		return base / $Volume.#factors[target];
	}

	/**
	 * @instance Converts to target volume unit.
	 * @param target Target volume unit.
	 */
	toAll(): $Record<$VolumeUnit, number> {
		const base = this.#toCubicMeters();

		const result = {} as $Record<$VolumeUnit, number>;

		for (const unit of UNITS.volume) {
			result[unit] = base / $Volume.#factors[unit];
		}

		return result;
	}

	/**
	 * @instance Formats the converted value and unit.
	 * @param target Target unit to format to.
	 * @param options Formatting options.
	 * @returns Formatted string like "5m³", "5.25 cubic-meters", or "5e+3 meter".
	 */
	formatTo(target: $VolumeUnit, options?: ConverterFormatOptions): string {
		const value = this.to(target);
		const { style = 'plural', decimals = 2 } = options ?? {};
		const rounded = this.$round(value, decimals);

		switch (style) {
			case 'compact': {
				const shortLabels: $Record<$VolumeUnit, string> = {
					'cubic-millimeter': 'mm³',
					'cubic-centimeter': 'cm³',
					'cubic-meter': 'm³',
					'cubic-kilometer': 'km³',
					'cubic-millimetre': 'mm³',
					'cubic-centimetre': 'cm³',
					'cubic-metre': 'm³',
					'cubic-kilometre': 'km³',
					'cubic-inch': 'in³',
					'cubic-foot': 'ft³',
					'cubic-yard': 'yd³',
					liter: 'L',
					litre: 'L',
					milliliter: 'mL',
					millilitre: 'mL',
					gallon: 'gal',
					quart: 'qt',
					pint: 'pt',
					cup: 'c',
					tablespoon: 'tbsp',
					teaspoon: 'tsp',
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
