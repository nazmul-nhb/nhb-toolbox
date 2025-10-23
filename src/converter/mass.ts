import type { $Record } from '../object/types';
import type { Numeric } from '../types/index';
import { $BaseConverter } from './base';
import { UNITS } from './constants';
import type { $MassUnit, ConverterFormatOptions } from './types';

/**
 * @class MassConverter
 * @description Handles conversions with smart `.to()`, `.toAll()`, and `.formatTo()`.
 */
export class $Mass extends $BaseConverter<$MassUnit> {
	/** * Common conversion factors relative to 1 kilogram. */
	static #factors: $Record<$MassUnit, number> = {
		microgram: 1e-9,
		milligram: 1e-6,
		gram: 0.001,
		kilogram: 1,
		tonne: 1000,
		ounce: 0.0283495,
		pound: 0.453592,
		stone: 6.35029,
		'short-ton': 907.185,
		'long-ton': 1016.05,
	};

	/**
	 * Convert mass value to other mass units
	 * @param value Number or numeric string value to convert.
	 * @param unit Base mass unit for the provided value.
	 */
	constructor(value: Numeric, unit: $MassUnit) {
		super(value, unit);
	}

	/** @instance Converts to base unit (kilograms). */
	#toKilograms(): number {
		return this.value * $Mass.#factors[this.unit];
	}

	/**
	 * @instance Converts to target mass unit.
	 * @param target Target mass unit.
	 */
	to(target: $MassUnit): number {
		const base = this.#toKilograms();
		return base / $Mass.#factors[target];
	}

	/**
	 * @instance Converts to all mass units at once.
	 * @returns Object with all unit conversions.
	 */
	toAll(): $Record<$MassUnit, number> {
		const base = this.#toKilograms();

		const result = {} as $Record<$MassUnit, number>;

		for (const unit of UNITS.mass) {
			result[unit] = base / $Mass.#factors[unit];
		}

		return result;
	}

	/**
	 * @instance Formats the converted value and unit.
	 * @param target Target unit to format to.
	 * @param options Formatting options.
	 * @returns Formatted string like "5kg", "5.25 kilograms", or "5e+3 gram".
	 */
	formatTo(target: $MassUnit, options?: ConverterFormatOptions): string {
		const value = this.to(target);
		const { style = 'plural', decimals = 2 } = options ?? {};
		const rounded = this.$round(value, decimals);

		switch (style) {
			case 'compact': {
				const shortLabels: $Record<$MassUnit, string> = {
					microgram: 'µg',
					milligram: 'mg',
					gram: 'g',
					kilogram: 'kg',
					tonne: 't',
					ounce: 'oz',
					pound: 'lb',
					stone: 'st',
					'short-ton': 't (US)',
					'long-ton': 't (UK)',
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
