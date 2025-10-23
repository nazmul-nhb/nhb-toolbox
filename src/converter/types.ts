import type { LooseLiteral } from '../utils/types';
import type { $Area } from './area';
import type { $BaseConverter } from './base';
import type { UNIT_MAP } from './constants';
import type { $Data } from './data';
import type { $Length } from './length';
import type { $Temperature } from './temp';
import type { $Time } from './time';

export type Category = keyof typeof UNIT_MAP;

export type UnitMap = {
	[Key in keyof typeof UNIT_MAP]: (typeof UNIT_MAP)[Key][number];
};

export type $Unit = LooseLiteral<UnitMap[Category]>;

export type InferCategory<U extends $Unit> = {
	[K in Category]: U extends UnitMap[K] ? K : never;
}[Category];

export type Converted<U extends $Unit> =
	InferCategory<U> extends never ? $BaseConverter<U>
	: InferCategory<U> extends 'area' ? $Area
	: InferCategory<U> extends 'time' ? $Time
	: InferCategory<U> extends 'length' ? $Length
	: InferCategory<U> extends 'data' ? $Data
	: InferCategory<U> extends 'temp' ? $Temperature
	: $BaseConverter<U>;

export type ConverterFormatOptions = {
	/** Style of formatting. Default is `'plural'`. */
	style?: 'compact' | 'scientific' | 'plural';
	/** Number of decimal places to include. Default is `2`. */
	decimals?: number;
};

export type $AreaUnit = UnitMap['area'];
export type $DataUnit = UnitMap['data'];
export type $LengthUnit = UnitMap['length'];
export type $TempUnit = UnitMap['temp'];
export type $TimeUnit = UnitMap['time'];
export type $VolumeUnit = UnitMap['volume'];
