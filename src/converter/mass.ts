import { $BaseConverter } from './base';
import { UNIT_MAP } from './constants';
import type { $MassUnit } from './types';

/**
 * @class $Mass
 * @description Mass and weight conversions (metric & imperial) with `.to()`, `.formatTo()`, and `.toAll()`.
 */
export class $Mass extends $BaseConverter<$MassUnit> {
	/** * Common conversion factors relative to 1 kilogram. */
	static #factors: Record<$MassUnit, number> = {
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
	 * @instance Converts current value to kilograms (base unit).
	 * @returns Value in kilograms.
	 */
	toKilograms(): number {
		return this.value * $Mass.#factors[this.unit];
	}

	/**
	 * @instance Converts to target mass unit.
	 * @param target Target mass unit.
	 * @returns Numeric value converted to target unit.
	 */
	to(target: $MassUnit): number {
		const base = this.toKilograms();
		return base / $Mass.#factors[target];
	}

	/**
	 * @instance Converts to all mass units at once.
	 * @returns Object with all conversions.
	 */
	toAll(): Record<$MassUnit, number> {
		const base = this.toKilograms();
		const result = {} as Record<$MassUnit, number>;
		for (const unit of UNIT_MAP.mass) {
			result[unit] = base / $Mass.#factors[unit];
		}
		return result;
	}

	/**
	 * @instance Formats converted value to a readable string.
	 * @param target Target mass unit.
	 * @param options Formatting options.
	 * @returns Formatted string.
	 */
	formatTo(
		target: $MassUnit,
		options?: {
			style?: 'compact' | 'scientific' | 'plural';
			decimals?: number;
		}
	): string {
		const value = this.to(target);
		const { style = 'plural', decimals = 2 } = options ?? {};
		const rounded = Number(value.toFixed(decimals));

		switch (style) {
			case 'compact': {
				const shortLabels: Record<$MassUnit, string> = {
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
				return this.withPluralUnit(rounded, target);
		}
	}
}
