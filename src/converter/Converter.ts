import type { Numeric } from '../types/index';
import { $Area } from './area';
import { $BaseConverter } from './base';
import { UNITS } from './constants';
import { $Data } from './data';
import { $Length } from './length';
import { $Mass } from './mass';
import { $Temperature } from './temp';
import { $Time } from './time';
import type {
	$AreaUnit,
	$DataUnit,
	$LengthUnit,
	$MassUnit,
	$TempUnit,
	$TimeUnit,
	$Unit,
	$VolumeUnit,
	Category,
	Converted,
	UnitMap,
} from './types';
import { $Volume } from './volume';

/**
 * * Factory function that returns appropriate converter instance
 *
 * @description Converts values between compatible units (time, length, data, temp).
 * The returned instance exposes only methods relevant to the provided unit type.
 */
export function Converter<U extends $Unit>(value: Numeric, unit?: U): Converted<U> {
	const category = ((): Category | undefined => {
		if (unit) {
			for (const [category, values] of Object.entries(UNITS)) {
				if ([...values].includes(unit as UnitMap[Category])) {
					return category as Category;
				}
			}
		}
	})();

	switch (category) {
		case 'area':
			return new $Area(value, unit as $AreaUnit) as Converted<U>;
		case 'time':
			return new $Time(value, unit as $TimeUnit) as Converted<U>;
		case 'data':
			return new $Data(value, unit as $DataUnit) as Converted<U>;
		case 'length':
			return new $Length(value, unit as $LengthUnit) as Converted<U>;
		case 'mass':
			return new $Mass(value, unit as $MassUnit) as Converted<U>;
		case 'temp':
			return new $Temperature(value, unit as $TempUnit) as Converted<U>;
		case 'volume':
			return new $Volume(value, unit as $VolumeUnit) as Converted<U>;
		default:
			return new $BaseConverter(value, unit) as Converted<U>;
	}
}
