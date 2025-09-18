import type { NormalPrimitive, ValidArray } from '../src/types/index';
import type { TupleOf } from '../src/utils/types';

export const makeEnum = <T>(values: ValidArray<T>) => {
	return values[0];
};

makeEnum(['a']);
makeEnum(['a', 'b', 'c']);
makeEnum([0, 5, '5']);

// @ts-expect-error Testing
makeEnum([]);

export type List<A = any> = ReadonlyArray<A>;

/**
 * Ask TS to re-check that `A1` extends `A2`.
 * And if it fails, `A2` will be enforced anyway.
 * Can also be used to add constraints on parameters.
 * @param A1 to check against
 * @param A2 to cast to
 * @returns `A1 | A2`
 *
 * @example
 * type Test0 = Cast<'42', string>; // '42'
 * type Test1 = Cast<'42', number>; // number
 */
export type Cast<A1, A2> = A1 extends A2 ? A1 : A2;

/** * Remove the last element out of `L` */
export type Pop<L extends List> =
	L extends readonly [...infer El, any] | readonly [...infer El, any?] ? El : L;

type __Split<S extends string, D extends string, T extends string[] = []> =
	S extends `${infer BS}${D}${infer AS}` ? __Split<AS, D, [...T, BS]> : [...T, S];

type _Split<S extends string, D extends string = ''> =
	D extends '' ? Pop<__Split<S, D>> : __Split<S, D>;

/**
 * Split `S` by `D` into a [[List]]
 * @param S to split up
 * @param D to split at
 */
export type Split<S extends string, D extends string = ''> =
	_Split<S, D> extends infer X ? Cast<X, string[]> : never;

type _Join<T extends List, D extends string> =
	T extends [] ? ''
	: T extends [NormalPrimitive] ? `${T[0]}`
	: T extends [NormalPrimitive, ...infer R] ? `${T[0]}${D}${_Join<R, D>}`
	: string;

/**
 * Concat many literals together
 * @param T to concat
 * @param D to delimit
 */
export type Join<T extends List<NormalPrimitive>, D extends string = ' '> =
	_Join<T, D> extends infer X ? Cast<X, string> : never;

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
