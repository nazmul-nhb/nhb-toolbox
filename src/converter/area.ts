import type { $Record } from '../object/types';
import { $BaseConverter } from './base';
import { UNITS } from './constants';
import type { $AreaUnit, ConverterFormatOptions } from './types';

/**
 * @class $Area
 * @description Area unit conversions with smart `.to()`, `.formatTo()`, and `.toAll()`.
 */
export class $Area extends $BaseConverter<$AreaUnit> {
	static #factors: $Record<$AreaUnit, number> = {
		'square-millimeter': 1e-6,
		'square-centimeter': 1e-4,
		'square-meter': 1,
		'square-kilometer': 1e6,
		'square-inch': 0.00064516,
		'square-foot': 0.092903,
		'square-yard': 0.836127,
		'square-mile': 2.59e6,
		hectare: 1e4,
		acre: 4046.856,
	};

	/**
	 * @instance Converts to base unit (square meters).
	 */
	toSquareMeters(): number {
		return this.value * $Area.#factors[this.unit];
	}

	/**
	 * @instance Converts to target area unit.
	 * @param target Target area unit.
	 */
	to(target: $AreaUnit): number {
		const base = this.toSquareMeters();
		return base / $Area.#factors[target];
	}

	/**
	 * @instance Converts to all area units.
	 */
	toAll(): $Record<$AreaUnit, number> {
		const base = this.toSquareMeters();
		const result = {} as $Record<$AreaUnit, number>;
		for (const unit of UNITS.area) {
			result[unit] = base / $Area.#factors[unit];
		}
		return result;
	}

	/**
	 * @instance Formats converted area value.
	 */
	formatTo(target: $AreaUnit, options?: ConverterFormatOptions): string {
		const value = this.to(target);
		const { style = 'plural', decimals = 2 } = options ?? {};
		const rounded = Number(value.toFixed(decimals));

		switch (style) {
			case 'compact': {
				const shortLabels: $Record<$AreaUnit, string> = {
					'square-millimeter': 'mm²',
					'square-centimeter': 'cm²',
					'square-meter': 'm²',
					'square-kilometer': 'km²',
					'square-inch': 'in²',
					'square-foot': 'ft²',
					'square-yard': 'yd²',
					'square-mile': 'mi²',
					hectare: 'ha',
					acre: 'ac',
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
