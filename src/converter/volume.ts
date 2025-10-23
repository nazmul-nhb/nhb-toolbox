import type { $Record } from '../object/types';
import { $BaseConverter } from './base';
import { UNITS } from './constants';
import type { $VolumeUnit, ConverterFormatOptions } from './types';

/**
 * @class $Volume
 * @description Volume unit conversions with smart `.to()`, `.formatTo()`, and `.toAll()`.
 */
export class $Volume extends $BaseConverter<$VolumeUnit> {
	static #factors: $Record<$VolumeUnit, number> = {
		'cubic-millimeter': 1e-9,
		'cubic-centimeter': 1e-6,
		'cubic-meter': 1,
		'cubic-kilometer': 1e9,
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

	toCubicMeters(): number {
		return this.value * $Volume.#factors[this.unit];
	}

	to(target: $VolumeUnit): number {
		const base = this.toCubicMeters();
		return base / $Volume.#factors[target];
	}

	toAll(): $Record<$VolumeUnit, number> {
		const base = this.toCubicMeters();
		const result = {} as $Record<$VolumeUnit, number>;
		for (const unit of UNITS.volume) {
			result[unit] = base / $Volume.#factors[unit];
		}
		return result;
	}

	formatTo(target: $VolumeUnit, options?: ConverterFormatOptions): string {
		const value = this.to(target);
		const { style = 'plural', decimals = 2 } = options ?? {};
		const rounded = Number(value.toFixed(decimals));

		switch (style) {
			case 'compact': {
				const shortLabels: $Record<$VolumeUnit, string> = {
					'cubic-millimeter': 'mm³',
					'cubic-centimeter': 'cm³',
					'cubic-meter': 'm³',
					'cubic-kilometer': 'km³',
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
				return this.withPluralUnit(rounded, target);
		}
	}
}
