import type { Numeric } from '../types/index';
import type {
	ConvertOptions,
	CurrencyCode,
	FrankFurter,
	FrankFurterCurrency,
	LocaleCode,
} from './types';
import { formatCurrency } from './utilities';

/**
 * * A utility class for handling currency operations like formatting and conversion.
 *
 * - Supports formatting based on locale and currency code.
 * - Converts between **fiat currencies supported by `api.frankfurter.app`**.
 * - Automatically caches conversion rates to reduce redundant API calls.
 * - Intended for use with numeric inputs (number or numeric string).
 */
export class Currency<Code extends CurrencyCode> {
	readonly #amount: number;
	readonly #code: CurrencyCode;
	/**
	 * * The formatted currency string (e.g., `$1,000.00`).
	 *
	 * - Generated using the `en-US` locale during construction.
	 * - This is a display-friendly version of the currency value.
	 * - For formatting with other locales, use the `format()` method.
	 */
	readonly currency: string;

	/**
	 * Creates an instance of the Currency class.
	 *
	 * @param amount - The numeric amount of currency (e.g., `100`, `'99.99'`).
	 * @param code - The ISO 4217 currency code representing the currency (e.g., `'USD'`, `'EUR'`).
	 */
	constructor(amount: Numeric, code: Code) {
		this.#amount = Number(amount);
		this.#code = code;
		this.currency = this.format('en-US');
	}

	static readonly #RATE_CACHE = new Map<string, number>();

	/** * Clears cached rates that were fetched previously. */
	static clearRateCache(): void {
		Currency.#RATE_CACHE.clear();
	}

	/**
	 * @instance Formats the stored amount as a localized currency string.
	 *
	 * @param locale - Optional. A BCP 47 locale string (e.g., `'de-DE'`, `'en-US'`). Defaults to `'en-US'` if not provided.
	 * @param code - Optional. An ISO 4217 currency code (e.g., `'USD'`, `'EUR'`) used solely for formatting purposes.
	 *            _This does not alter the internal currency code set during instantiation._
	 * @returns A string representing the formatted currency value according to the specified locale and currency code.
	 */
	format(locale?: LocaleCode, code?: CurrencyCode): string {
		return formatCurrency(this.#amount, code ?? this.#code, locale);
	}

	/**
	 * @instance Converts the current currency amount to a target currency using real-time exchange rates.
	 *
	 * - Uses {@link https://api.frankfurter.app/latest api.frankfurter.app} to fetch live exchange rates.
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
	 * @returns A new `Currency` instance with the converted amount in the target currency.
	 * @throws Will throw error if the API call fails and no `fallbackRate` is provided.
	 *
	 * @example
	 * await new Currency(100, 'USD').convert('EUR');
	 */
	async convert<To extends FrankFurterCurrency>(
		to: To,
		options?: ConvertOptions
	): Promise<Currency<To>> {
		const key = `${this.#code}->${to}`;

		if (!options?.forceRefresh && Currency.#RATE_CACHE.has(key)) {
			const cachedRate = Currency.#RATE_CACHE.get(key)!;

			return new Currency(this.#amount * cachedRate, to);
		}

		try {
			const rate = await this.#fetchFromFrankfurter(to);
			Currency.#RATE_CACHE.set(key, rate);

			return new Currency(this.#amount * rate, to);
		} catch (error) {
			if (options?.fallbackRate != null) {
				console.warn(
					`Currency conversion failed (${this.#code} → ${to}): ${(error as Error).message}. Using fallback rate...`
				);

				return new Currency(this.#amount * options.fallbackRate, to);
			} else {
				throw new Error(
					`Currency conversion failed (${this.#code} → ${to}): ${(error as Error).message}`
				);
			}
		}
	}

	/**
	 * @instance Converts the current currency amount to a target currency using either a cached rate or a manual exchange rate.
	 *
	 * - This method is **synchronous** and does **not perform any network requests**.
	 * - If a cached rate exists for the currency pair, it is used.
	 * - If no cached rate is found, `rate` is used as a manual exchange rate.
	 * - If neither are available, the original instance is returned unchanged.
	 *
	 * @param to - The target currency code to convert to.
	 * @param rate - A manual exchange rate to use if no cached rate is available.
	 * @returns A new `Currency` instance with the converted amount, or the original instance if no rate is available.
	 *
	 * @example
	 * const usd = new Currency(100, 'USD');
	 * const eur = usd.convertSync('EUR', 0.92);
	 *
	 * console.log(eur.currency); // €92.00
	 */
	convertSync<To extends CurrencyCode>(to: To, rate: number): Currency<To> {
		const key = `${this.#code}->${to}`;
		const cachedRate = Currency.#RATE_CACHE.get(key);

		if (cachedRate) {
			return new Currency(this.#amount * cachedRate, to);
		} else if (rate) {
			return new Currency(this.#amount * rate, to);
		} else {
			return this;
		}
	}

	/**
	 * @private Attempts to fetch rate from frankfurter.app
	 * @param to - Target currency code
	 * @returns Exchange rate (multiplier)
	 */
	async #fetchFromFrankfurter(to: FrankFurterCurrency): Promise<number> {
		const url = `https://api.frankfurter.app/latest?amount=1&from=${this.#code}`;

		try {
			const res = await fetch(url, { redirect: 'error' });

			if (!res.ok) {
				throw new Error(`FrankFurter Error: ${res.status}. "${res.statusText}"`);
			}

			const data: FrankFurter = await res.json();

			if (!data.rates?.[to]) {
				throw new Error(`Currency "${to}" is not found in FrankFurter Database!`);
			}

			return data.rates[to];
		} catch (error) {
			throw new Error(
				(error as Error).message || `Failed to fetch data from FrankFurter API`
			);
		}
	}
}
