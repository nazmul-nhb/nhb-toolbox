import type { LooseLiteral } from '../utils/types';
import type { $Area } from './area';
import type { $BaseConverter } from './base';
import type { UNITS } from './constants';
import type { $Data } from './data';
import type { $Length } from './length';
import type { $Mass } from './mass';
import type { $Temperature } from './temp';
import type { $Time } from './time';
import type { $Volume } from './volume';

/** - Type for Record of Units */
type Units = typeof UNITS;

/** * Category of units supported by the converter. */
export type Category = keyof Units;

/** * Map of unit categories to their respective units. */
export type UnitMap = {
	[Key in Category]: Units[Key][number];
};

/** * Union type of all supported units. May include any other strings. */
export type $Unit = LooseLiteral<UnitMap[Category]>;

/** * Infer the category of a given unit type `U`. */
export type InferCategory<U extends $Unit> = {
	[K in Category]: U extends UnitMap[K] ? K : never;
}[Category];

/** * Type for the returned converter instance based on the provided unit `U`. */
export type Converted<U extends $Unit> =
	InferCategory<U> extends never ? $BaseConverter<U>
	: InferCategory<U> extends 'area' ? $Area
	: InferCategory<U> extends 'time' ? $Time
	: InferCategory<U> extends 'length' ? $Length
	: InferCategory<U> extends 'mass' ? $Mass
	: InferCategory<U> extends 'data' ? $Data
	: InferCategory<U> extends 'temp' ? $Temperature
	: InferCategory<U> extends 'volume' ? $Volume
	: $BaseConverter<U>;

/** * Options for formatting converted values. */
export type ConverterFormatOptions = {
	/** Style of formatting. Default is `'plural'`. */
	style?: 'compact' | 'scientific' | 'plural';
	/** Number of decimal places to include. Default is `2`. */
	decimals?: number;
};

/** Union type for all the area units */
export type $AreaUnit = UnitMap['area'];
/** Union type for all the data units */
export type $DataUnit = UnitMap['data'];
/** Union type for all the length/distance units */
export type $LengthUnit = UnitMap['length'];
/** Union type for all the mass units */
export type $MassUnit = UnitMap['mass'];
/** Union type for all the temperature units */
export type $TempUnit = UnitMap['temp'];
/** Union type for all the time units */
export type $TimeUnit = UnitMap['time'];
/** Union type for all the volume units */
export type $VolumeUnit = UnitMap['volume'];
