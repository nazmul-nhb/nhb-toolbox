import { reverseString } from './convert';

/**
 * * Checks if a string is a palindrome.
 * @param input - The string to check.
 * @returns True if the string is a palindrome, otherwise false.
 */
export const isPalindrome = (input: string): boolean => {
	const normalized = input.toLowerCase().replace(/[^a-z0-9]/g, '');
	return normalized === reverseString(normalized);
};

/**
 * * Checks if a string is in camelCase format.
 * @param str The string to check.
 * @returns `true` if the string is in camelCase, otherwise `false`.
 */
export function isCamelCase(str: string): boolean {
	return /^[a-z]+([A-Z][a-z]*)*$/.test(str);
}

/**
 * * Checks if a string is in PascalCase format.
 * @param str The string to check.
 * @returns `true` if the string is in PascalCase, otherwise `false`.
 */
export function isPascalCase(str: string): boolean {
	return /^[A-Z][a-zA-Z]*$/.test(str);
}

/**
 * * Checks if a string is in snake_case format.
 * @param str The string to check.
 * @returns `true` if the string is in snake_case, otherwise `false`.
 */
export function isSnakeCase(str: string): boolean {
	return /^[a-z]+(_[a-z]+)*$/.test(str);
}

/**
 * * Checks if a string is in kebab-case format.
 * @param str The string to check.
 * @returns `true` if the string is in kebab-case, otherwise `false`.
 */
export function isKebabCase(str: string): boolean {
	return /^[a-z]+(-[a-z]+)*$/.test(str);
}

/**
 * * Checks if a string contains only emojis.
 * @param str The string to check.
 * @returns `true` if the string contains only emojis, otherwise `false`.
 */
export function isEmojiOnly(str: string): boolean {
	return /^[\p{Emoji}]+$/u.test(str);
}
