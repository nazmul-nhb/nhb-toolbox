import type { LooseLiteral } from '../utils/types';
import type { UNIT_MAP } from './constants';
import type { $Base, $Data, $Length, $Temperature, $Time } from './converters';

export type Category = keyof typeof UNIT_MAP;

export type UnitMap = {
	[Key in keyof typeof UNIT_MAP]: (typeof UNIT_MAP)[Key][number];
};

export type Unit = LooseLiteral<UnitMap[Category]>;

export type InferCategory<U extends Unit> = {
	[K in Category]: U extends UnitMap[K] ? K : never;
}[Category];

export type Converted<U extends Unit> =
	InferCategory<U> extends 'time' ? $Time
	: InferCategory<U> extends 'length' ? $Length
	: InferCategory<U> extends 'data' ? $Data
	: InferCategory<U> extends 'temp' ? $Temperature
	: $Base<U>;
