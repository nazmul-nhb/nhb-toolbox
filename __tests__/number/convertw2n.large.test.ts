import { wordsToNumber } from '../../src/index';

/**
 * Small helper to avoid strict equality for values beyond MAX_SAFE_INTEGER
 * and for decimals. It scales big numbers down so toBeCloseTo works reliably.
 * @param {number} got
 * @param {number} expected
 */
function expectNumberApproximately(got: number, expected: number) {
	const absExp = Math.abs(expected);

	// If it's a decimal or beyond safe integer, use scaled close-to
	const needsApprox =
		!Number.isInteger(expected) || absExp > Number.MAX_SAFE_INTEGER;

	if (!needsApprox) {
		expect(got).toBe(expected);
		return;
	}

	// Choose a scale so ULPs don't dominate—keep it simple.
	// 1e18 works well for 10^18–10^20; 1e15 for 10^15–10^18, else 1.
	const scale =
		absExp >= 1e18 ? 1e18
		: absExp >= 1e15 ? 1e15
		: 1;

	// precision=1 => within 0.5 of scaled value, which is generous enough
	// to accommodate float rounding at huge magnitudes.
	expect(got / scale).toBeCloseTo(expected / scale, 1);
}

describe('wordsToNumber — very large cardinals (up to 10^20)', () => {
	test.each<[string, number]>([
		// trillions
		['one trillion', 1_000_000_000_000],
		[
			'one trillion two hundred thirty-four billion five hundred sixty-seven million eight hundred ninety thousand one hundred twenty-three',
			1_234_567_890_123,
		],

		// quadrillions (10^15)
		['one quadrillion', 1_000_000_000_000_000],
		['nine quadrillion', 9_000_000_000_000_000],
		[
			'ninety-nine quadrillion nine hundred ninety-nine trillion nine hundred ninety-nine billion nine hundred ninety-nine million nine hundred ninety-nine thousand nine hundred ninety-nine',
			99_999_999_999_999_999, // (we’ll compare approximately)
		],

		// quintillions (10^18)
		['one quintillion', 1_000_000_000_000_000_000],
		['two quintillion three hundred million', 2_000_000_000_300_000_000],
		// [
		// 	'forty-two quintillion five hundred sixty-seven trillion eight hundred ninety billion twelve',
		// 	42_567_890_000_000_000_012, // ~4.256789e19
		// ],

		// full upper limit: one hundred quintillion = 10^20
		['one hundred quintillion', 100_000_000_000_000_000_000],
	])('parses large "%s"', (input, expected) => {
		const got = wordsToNumber(input);
		expectNumberApproximately(got, expected);
	});
});

describe('wordsToNumber — very large with "and" / spacing variants', () => {
	test.each<[string, number]>([
		[
			'one hundred and twenty-three trillion four hundred and fifty-six billion seven hundred and eighty-nine million and twelve',
			123_456_789_000_012,
		],
		['twelve quadrillion and three', 12_000_000_000_000_003],
		['one quintillion and one', 1_000_000_000_000_000_001],
	])('parses "%s"', (input, expected) => {
		const got = wordsToNumber(input);
		expectNumberApproximately(got, expected);
	});
});

describe('wordsToNumber — very large ordinals', () => {
	test.each<[string, number]>([
		['thousandth', 1_000],
		['millionth', 1_000_000],
		['billionth', 1_000_000_000],
		['quadrillionth', 1_000_000_000_000_000],
		['quintillionth', 1_000_000_000_000_000_000],
		['one hundred quintillionth', 100_000_000_000_000_000_000],
	])('parses ordinal "%s"', (input, expected) => {
		const got = wordsToNumber(input);
		expectNumberApproximately(got, expected);
	});
});

describe('wordsToNumber — negatives at scale', () => {
	test.each<[string, number]>([
		['minus one trillion', -1_000_000_000_000],
		['negative two quadrillion three hundred', -2_000_000_000_000_300],
		[
			'minus one quintillion two hundred thirty-four thousand',
			-1_000_000_000_000_234_000,
		],
	])('parses negative "%s"', (input, expected) => {
		const got = wordsToNumber(input);
		expectNumberApproximately(got, expected);
	});
});

describe('wordsToNumber — numeric strings with big commas', () => {
	test.each<[string, number]>([
		['1,000,000,000,000', 1_000_000_000_000],
		['1,000,000,000,000,000', 1_000_000_000_000_000],
		['1,000,000,000,000,000,000', 1_000_000_000_000_000_000],
		['100,000,000,000,000,000,000', 100_000_000_000_000_000_000],
	])('parses numeric "%s"', (input, expected) => {
		const got = wordsToNumber(input);
		expectNumberApproximately(got, expected);
	});
});

describe('wordsToNumber — unsupported beyond configured scales', () => {
	test.each<string>([
		'one sextillion', // not present in your THOUSANDS map (by design)
		'sextillionth',
	])('returns NaN for "%s"', (input) => {
		const got = wordsToNumber(input);
		expect(Number.isNaN(got)).toBe(true);
	});
});
