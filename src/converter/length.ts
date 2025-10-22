import type { Numeric } from '../types/index';
import { $BaseConverter } from './base';
import { UNIT_MAP } from './constants';
import type { $LengthUnit, ConverterFormatOptions } from './types';

/**
 * @class $Length
 * @description Handles conversions between length/distance units with smart `.to()` and `.formatTo()`.
 */
export class $Length extends $BaseConverter<$LengthUnit> {
	/** * Conversion factors based on meters. */
	static #factors: Record<$LengthUnit, number> = {
		millimeter: 0.001,
		centimeter: 0.01,
		meter: 1,
		kilometer: 1000,
		inch: 0.0254,
		foot: 0.3048,
		yard: 0.9144,
		mile: 1609.344,
		'nautical-mile': 1852,
		'light-year': 9.4607e15,
	};

	constructor(value: Numeric, unit: $LengthUnit) {
		super(value, unit);
	}

	/**
	 * @instance Converts current value to meters.
	 * @returns Value in meters.
	 */
	toMeters(): number {
		return this.value * $Length.#factors[this.unit];
	}

	/**
	 * @instance Converts current value to the target unit.
	 * @param target Target length unit.
	 * @returns Numeric value converted to target unit.
	 */
	to(target: $LengthUnit): number {
		const inMeters = this.toMeters();
		return inMeters / $Length.#factors[target];
	}

	/**
	 * @instance Converts to kilometers.
	 * @returns Value in kilometers.
	 */
	toKilometers(): number {
		return this.to('kilometer');
	}

	/**
	 * @instance Converts to miles.
	 * @returns Value in miles.
	 */
	toMiles(): number {
		return this.to('mile');
	}

	/**
	 * @instance Converts to all length units.
	 * @returns Object with all unit conversions.
	 */
	toAll(): Record<$LengthUnit, number> {
		const inMeters = this.toMeters();

		const result = {} as Record<$LengthUnit, number>;

		for (const unit of UNIT_MAP.length) {
			result[unit] = inMeters / $Length.#factors[unit];
		}

		return result;
	}

	/**
	 * @instance Formats the converted value.
	 * @param target Target unit to format to.
	 * @param options Formatting options.
	 * @returns Formatted string like "5 km", "5.00 miles", or "5e+3 m".
	 */
	formatTo(target: $LengthUnit, options?: ConverterFormatOptions): string {
		const value = this.to(target);
		const { style = 'plural', decimals = 2 } = options ?? {};
		const rounded = Number(value.toFixed(decimals));

		switch (style) {
			case 'compact': {
				const shortLabels: Record<$LengthUnit, string> = {
					millimeter: 'mm',
					centimeter: 'cm',
					meter: 'm',
					kilometer: 'km',
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
				return this.withPluralUnit(rounded, target);
		}
	}
}
