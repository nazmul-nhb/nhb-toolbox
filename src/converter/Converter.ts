import type { Numeric } from '../types/index';
import { UNIT_MAP } from './constants';
import { $Base, $Data, $Length, $Temperature, $Time } from './converters';
import type { Category, Converted, Unit, UnitMap } from './types';

/**
 * * Factory function that returns appropriate converter instance
 *
 * @description Converts values between compatible units (time, length, data, temp).
 * The returned instance exposes only methods relevant to the provided unit type.
 */
export function Converter<U extends Unit>(value: Numeric, unit?: U): Converted<U> {
	const category = ((): Category | undefined => {
		if (unit) {
			for (const [category, values] of Object.entries(UNIT_MAP)) {
				if ([...values].includes(unit as UnitMap[Category])) {
					return category as Category;
				}
			}
			// throw new Error(`Unknown unit: ${unit}`);
		}
	})();

	switch (category) {
		case 'time':
			return new $Time(value, unit as UnitMap['time']) as Converted<U>;
		case 'data':
			return new $Data(value, unit as UnitMap['data']) as Converted<U>;
		case 'length':
			return new $Length(value, unit as UnitMap['length']) as Converted<U>;
		case 'temp':
			return new $Temperature(value, unit as UnitMap['temp']) as Converted<U>;
		default:
			return new $Base(value, unit) as Converted<U>;
	}
}
