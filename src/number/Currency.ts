import type { Numeric } from '../types';
import type {
	ConvertOptions,
	CurrencyCode,
	FrankFurter,
	LocaleCode,
	SupportedCurrency,
} from './types';
import { formatCurrency } from './utilities';

const rateCache: Map<string, number> = new Map();

/**
 * * A utility class for handling currency operations like formatting and conversion.
 *
 * - Supports formatting based on locale.
 * - Converts between **fiat currencies supported by `api.frankfurter.app`**.
 * - Automatically caches conversion rates to reduce redundant API calls.
 * - Intended for use with numeric inputs (number or numeric string).
 */
export class Currency {
	#amount: number;
	#code: CurrencyCode;
	/**
	 * * The formatted currency string (e.g., `$1,000.00`).
	 *
	 * - Generated using the `en-US` locale during construction.
	 * - This is a display-friendly version of the currency value.
	 * - For formatting with other locales, use the `format(locale)` method.
	 */
	readonly currency: string;

	/**
	 * Creates an instance of the Currency class.
	 *
	 * @param amount - The numeric amount of currency (e.g., `100`, `'99.99'`).
	 * @param code - The ISO 4217 currency code representing the currency (e.g., `'USD'`, `'EUR'`).
	 */
	constructor(amount: Numeric, code: CurrencyCode) {
		this.#amount = Number(amount);
		this.#code = code;
		this.currency = this.format('en-US');
	}

	/**
	 * @instance Formats the currency for a given locale.
	 * @param locale - The target locale (e.g., 'de-DE')
	 * @returns The formatted currency string
	 */
	format(locale?: LocaleCode): string {
		return formatCurrency(this.#amount, this.#code, locale);
	}

	/**
	 * @instance Converts the current currency amount to a target currency using real-time exchange rates.
	 *
	 * - Uses `api.frankfurter.app` to fetch live exchange rates.
	 * - Supports **only the following fiat currencies**:
	 *   `AUD`, `BGN`, `BRL`, `CAD`, `CHF`, `CNY`, `CZK`, `DKK`, `EUR`, `GBP`, `HKD`, `HUF`, `IDR`, `ILS`, `INR`, `ISK`, `JPY`,
	 *   `KRW`, `MXN`, `MYR`, `NOK`, `NZD`, `PHP`, `PLN`, `RON`, `SEK`, `SGD`, `THB`, `TRY`, `USD`, `ZAR`.
	 * - Uses cached rates unless `forceRefresh` is set to `true`.
	 * - If API fails or currency not supported, falls back to `fallbackRate` if provided.
	 *
	 * @param to - The target currency code (must be one of the supported ones, e.g., `'EUR'`, `'USD'`).
	 * @param options - Optional settings:
	 *   - `fallbackRate`: A manual exchange rate to use if the API call fails or currency is not supported.
	 *   - `forceRefresh`: If true, ignores cached rates and fetches fresh data.
	 * @returns The converted amount as a number.
	 * @throws Will throw if the API call fails and no `fallbackRate` is provided.
	 */
	async convert(
		to: SupportedCurrency | CurrencyCode,
		options?: ConvertOptions,
	): Promise<number> {
		const key = `${this.#code}->${to}`;

		if (!options?.forceRefresh && rateCache.has(key)) {
			const cachedRate = rateCache.get(key)!;

			return this.#amount * cachedRate;
		}

		try {
			const rate = await this.#fetchFromFrankfurter(to);
			rateCache.set(key, rate);

			return this.#amount * rate;
		} catch (error) {
			if (options?.fallbackRate != null) {
				console.warn(
					`Currency conversion failed (${this.#code} → ${to}): ${JSON.stringify(error)}. Using fallback rate...`,
				);

				return this.#amount * options.fallbackRate;
			}

			throw new Error(
				`Currency conversion failed (${this.#code} → ${to}): ${JSON.stringify(error)}`,
			);
		}
	}

	/**
	 * @private @instance Attempts to fetch rate from frankfurter.app
	 * @param to - Target currency code
	 * @returns Exchange rate (multiplier)
	 */
	async #fetchFromFrankfurter(to: CurrencyCode): Promise<number> {
		const url = `https://api.frankfurter.app/latest?amount=${this.#amount}&from=${this.#code}&to=${to}`;

		const res = await fetch(url, { redirect: 'error' });

		if (!res.ok) throw new Error(`Frankfurter error: ${res.status}`);

		const data = (await res.json()) as FrankFurter;

		if (!data.rates?.[to]) {
			throw new Error(`Currency "${to}" not found in rates`);
		}

		return data.rates[to] / this.#amount;
	}
}
