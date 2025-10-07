import type { ValidArray } from '../src/types/index';
import type { RangeTuple, TupleOf } from '../src/utils/types';
import { registerStringMethods } from './string.extensions';

registerStringMethods();

export const makeEnum = <T>(values: ValidArray<T>) => {
	return values[0];
};

makeEnum(['a']);
makeEnum(['a', 'b', 'c']);
makeEnum([0, 5, '5']);

// @ts-expect-error Testing
makeEnum([]);

'hello world'.typedSplit('o ');

type MyType = {
	a: string;
	b: number;
	c: {
		d: string;
		e: {
			f: Date;
			g: {
				h: string;
				i: string;
			}[];
		};
	};
};

type Result = TupleOf<MyType, 5>;
type Result2 = RangeTuple<MyType, 2, 5>;
