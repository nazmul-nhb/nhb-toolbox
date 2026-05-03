import type { Numeric } from '../types/index';

/**
 * * Generates the first `limit` Fibonacci numbers.
 *
 * @param limit The number of Fibonacci numbers to generate.
 * @returns An array containing the first `limit` Fibonacci numbers.
 */
export function getFibonacciSeries(limit: Numeric): number[] {
	const cLimit = Number(limit);

	if (!Number.isFinite(cLimit) || cLimit <= 0) {
		return [];
	}

	if (cLimit === 1) return [0];

	const series: number[] = [0, 1];

	for (let i = 2; i < cLimit; i++) {
		series.push(series[i - 1] + series[i - 2]);
	}

	return series;
}

/**
 * * Generates the first `limit` Fibonacci numbers using recursion with memoization.
 *
 * @param limit - The number of Fibonacci numbers to generate.
 * @returns An array containing the first `limit` Fibonacci numbers.
 */
export function getFibonacciSeriesMemo(limit: Numeric): number[] {
	const cLimit = Number(limit);

	if (!Number.isFinite(cLimit) || cLimit <= 0) return [];

	if (cLimit === 1) return [0];

	const memo = new Map<number, number>([
		[0, 0],
		[1, 1],
	]);

	const fib = (n: number): number => {
		if (memo.has(n)) return memo.get(n)!;
		const val = fib(n - 1) + fib(n - 2);
		memo.set(n, val);
		return val;
	};

	return Array.from({ length: cLimit }, (_, i) => fib(i));
}

/**
 * * Generator function for Fibonacci sequence up to a given limit.
 *
 * @param limit - Number of Fibonacci numbers to generate.
 * @param onYield - Optional callback triggered on each yield with the current value and index.
 * @returns A generator yielding Fibonacci numbers one by one.
 */
export function* fibonacciGenerator(
	limit: Numeric,
	onYield?: (value: number, index: number) => void
): Generator<number, void, void> {
	const cLimit = Number(limit);

	if (!Number.isFinite(cLimit) || cLimit < 0) return;

	let a = 0;
	let b = 1;

	for (let i = 0; i < cLimit; i++) {
		onYield?.(a, i);
		yield a;
		[a, b] = [b, a + b];
	}
}

/**
 * * Calculates the `n`th Fibonacci number using optimized space.
 *
 * @param index - The index (0-based) of the Fibonacci number.
 * @returns The index=`n`th Fibonacci number.
 */
export function getNthFibonacci(index: Numeric): number {
	const n = Number(index);

	if (!Number.isFinite(n) || n < 0) return NaN;
	if (n === 0) return 0;
	if (n === 1) return 1;

	let a = 0,
		b = 1;

	for (let i = 2; i <= n; i++) {
		[a, b] = [b, a + b];
	}

	return b;
}
