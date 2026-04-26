import { isNonEmptyString, isNumber, isString } from '../guards/primitives';
import { COUNTRIES } from '../object/countries';
import type { CountryDetails } from '../object/types';

/**
 * @function `getCountryByPhone` Get country details by phone number
 * @param phone - The phone number to look up, can be a string or a number. It will be normalized by removing any non-digit character before matching against the country codes.
 * @returns An array of country details that match the provided phone number. Each country detail includes the country name, country code, ISO short code, and ISO code. If the input is invalid (not a primitive value or an empty string), an empty array will be returned.
 *
 * @remarks
 * - The function uses the {@link COUNTRIES} constant, which is an array of country details, to find matches based on the normalized phone number.
 * - The normalization process removes any non-digit character from the input phone number to ensure consistent matching against the country codes.
 * - The function checks if the input is neither an empty string nor a finite number before proceeding with the normalization and matching process. If the input is invalid, it returns an empty array.
 * - If multiple countries share the same country code, all matching countries will be included in the returned array.
 * - **`IMPORTANT:`** If a phone number does not start with a country code (plain local number), the function will return an empty array since it cannot determine the country. But if the number matches the country code of any country, it will return the corresponding country details even if the number is a local number.
 *
 * @example
 * ```typescript
 * const country = getCountryByPhone('+8801623732187');
 * console.info(country);
 * // Output: [
 * //   {
 * //     country_name: 'Bangladesh',
 * //     country_code: '880',
 * //     iso_code_short: 'BD',
 * //     iso_code: 'BGD'
 * //   }
 * // ]
 * ```
 */
export function getCountryByPhone(phone: number | string): CountryDetails[] {
	if (!isNonEmptyString(phone) && !isNumber(phone)) return [];

	const normalized = (isString(phone) ? phone : String(phone)).replace(/\D/g, '');

	return COUNTRIES.filter((country) =>
		normalized.startsWith(country.country_code.replace(/-/g, ''))
	);
}
