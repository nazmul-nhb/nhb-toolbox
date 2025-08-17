import { wordsToNumber } from '../../src/index';

describe('wordsToNumber — valid cardinal conversions', () => {
	test.each<[string, number]>([
		// ones
		['zero', 0],
		['one', 1],
		['two', 2],
		['nine', 9],
		// teens
		['ten', 10],
		['eleven', 11],
		['nineteen', 19],
		// tens
		['twenty', 20],
		['thirty', 30],
		['ninety-nine', 99],
		['ninety nine', 99], // space instead of hyphen
		['forty-two', 42],
		['forty two', 42],
		// hundreds
		['one hundred', 100],
		['one hundred and one', 101],
		['one hundred one', 101],
		['two hundred thirty-four', 234],
		['two hundred and thirty four', 234],
		// thousands
		['one thousand', 1000],
		['one thousand one', 1001],
		['two thousand three hundred', 2300],
		['twelve thousand three hundred forty-five', 12345],
		// millions
		['one million', 1_000_000],
		[
			'one million two hundred thirty-four thousand five hundred sixty-seven',
			1_234_567,
		],
		// mixed whitespace and commas
		['1,234', 1234],
		['042', 42],
		// numeric strings
		['123', 123],
		['3.14', 3.14],
		// negative forms
		['minus five', -5],
		['negative forty-two', -42],
		// more combinations
		['seven hundred thirteen thousand nine hundred and one', 713_901],
		['forty five thousand six hundred seventy eight', 45_678],
	])('parses "%s" → %d', (input, expected) => {
		const got = wordsToNumber(input);
		// use toBeCloseTo for possible float input like '3.14'
		if (!Number.isInteger(expected)) {
			expect(got).toBeCloseTo(expected);
		} else {
			expect(got).toBe(expected);
		}
	});
});

describe('wordsToNumber — ordinals and ordinal-like inputs', () => {
	test.each<[string, number]>([
		['first', 1],
		['second', 2],
		['third', 3],
		['fourth', 4],
		['fifth', 5],
		['tenth', 10],
		['eleventh', 11],
		['twelfth', 12],
		['twentieth', 20],
		['thirtieth', 30],
		['fiftieth', 50], // best-effort -> 50
		['hundredth', 100], // best-effort -> 100
		['thousandth', 1000], // best-effort -> 1000
		['twenty-first', 21],
		['twenty first', 21],
		['one hundred and first', 101],
		['one hundred first', 101],
		['one thousandth', 1000],
		['one millionth', 1_000_000],
	])('parses ordinal "%s" → %d', (input, expected) => {
		const got = wordsToNumber(input);
		expect(got).toBe(expected);
	});
});

describe('wordsToNumber — edge cases and anomalies', () => {
	test.each<[string, number]>([
		// stray "and"
		['and', NaN],
		['one and', NaN],
		// mixed words that include unexpected tokens
		['seventy-seven cats', NaN],
		['one hundred bananas', NaN],
		// empty / whitespace
		['', NaN],
		['   ', NaN],
		// unknown words
		['foobar', NaN],
		['one zillion', NaN],
	])('parses anomalous "%s" → NaN', (input, _expected) => {
		const got = wordsToNumber(input);
		expect(Number.isNaN(got)).toBe(true);
	});
});

describe('wordsToNumber — precision and large values', () => {
	test.each<[string, number]>([
		['one thousand two hundred thirty-four', 1234],
		[
			'twelve million three hundred forty-five thousand six hundred seventy-eight',
			12_345_678,
		],
		['one billion', 1_000_000_000],
		// non-integer numeric strings preserved
		['0.0', 0],
		['0003.140', 3.14],
	])('parses large/precision "%s" → %d', (input, expected) => {
		const got = wordsToNumber(input);
		if (!Number.isInteger(expected)) {
			expect(got).toBeCloseTo(expected);
		} else {
			expect(got).toBe(expected);
		}
	});
});

describe('wordsToNumber — robustness for token separators', () => {
	test.each<[string, number]>([
		['twenty-five', 25],
		['twenty five', 25],
		['twenty   five', 25],
		[' twenty five ', 25],
		['thirty, five', NaN], // comma inside words is not valid (except numeric comma like "1,234")
		['1,000,000', 1_000_000],
	])('parses token variations "%s"', (input, expected) => {
		const got = wordsToNumber(input);
		if (Number.isNaN(expected)) {
			expect(Number.isNaN(got)).toBe(true);
		} else {
			expect(got).toBe(expected);
		}
	});
});
