import type { Numeric } from '../types/index';
import { $BaseConverter } from './base';
import { UNIT_MAP } from './constants';
import { $Data } from './data';
import { $Length } from './length';
import { $Temperature } from './temp';
import { $Time } from './time';
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
			return new $BaseConverter(value, unit) as Converted<U>;
	}
}
