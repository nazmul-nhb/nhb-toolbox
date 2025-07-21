import { isPalindrome } from '../../string/guards';

type ChronosConstructor = import('../Chronos').Chronos;
type MainChronos = typeof import('../Chronos').Chronos;

declare module '../Chronos' {
	interface Chronos {
		/**
		 * @instance Checks if the current date is a palindrome in either padded or non-padded format.
		 *
		 * @remarks
		 * A palindrome date reads the same forward and backward, excluding delimiters.
		 * This method checks both zero-padded (`MM-DD`) and non-padded (`M-D`) formats for flexibility.
		 *
		 * Examples of palindromes:
		 * - `'2020-02-02'` → `'20200202'` ✅
		 * - `'2112-11-12'` → `'21121112'` ❌
		 * - `'2011-01-11'` (from `'YY-M-D'`) → `'11111'` ✅
		 * - `'2011-01-11'` (from `'YYYY-M-D'`) → `'11111'` ❌
		 *
		 * @param shortYear - If `true`, uses `'YY-MM-DD'` and `'YY-M-D'` formats.
		 *                    If `false`, uses `'YYYY-MM-DD'` and `'YYYY-M-D'` formats.
		 *                    Defaults to `false`.
		 *
		 * @returns `true` if either padded or non-padded formatted date is a palindrome, otherwise `false`.
		 *
		 * @example
		 * new Chronos('2020-02-02').isPalindromeDate(); // true
		 * new Chronos('2112-11-12').isPalindromeDate(); // false
		 * new Chronos('2011-1-11').isPalindromeDate(); // false (from '2011111')
		 * new Chronos('2011-1-11').isPalindromeDate(true); // true (from '11111')
		 * new Chronos('2024-04-11').isPalindromeDate(); // false
		 */
		isPalindromeDate(shortYear: boolean): boolean;
	}
}

/** * Plugin to inject `isPalindromeDate` method */
export const palindromePlugin = (ChronosClass: MainChronos): void => {
	ChronosClass.prototype.isPalindromeDate = function (
		this: ChronosConstructor,
		shortYear = false
	): boolean {
		const padded = this.formatStrict(shortYear ? 'YY-MM-DD' : 'YYYY-MM-DD');
		const normal = this.formatStrict(shortYear ? 'YY-M-D' : 'YYYY-M-D');
		return isPalindrome(padded) || isPalindrome(normal);
	};
};
