export type Expect<T extends true> = T;

export type Equal<X, Y> =
	(<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

type NonEmptyArray<T> = [T, ...Array<T>];

export const makeEnum = <T>(values: NonEmptyArray<T>) => {
	return values;
};

makeEnum(['a']);
makeEnum(['a', 'b', 'c']);
makeEnum([0, 5, '5']);

// @ts-expect-error Testing
makeEnum([]);
