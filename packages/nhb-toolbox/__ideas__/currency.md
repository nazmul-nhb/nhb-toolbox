# Your `Currency` methods

## 🔁 `add(amount: Numeric | Currency): Currency`

Add an amount to the current currency instance, returning a new one.

```ts
/**
 * Adds a numeric value or another currency (with the same code) to this instance.
 *
 * @param value - The amount to add, as a number or another `Currency` instance.
 * @returns A new `Currency` instance with the updated amount.
 * @throws Will throw if `value` is a `Currency` with a different code.
 */
add(value: Numeric | Currency): Currency
```

---

## ➖ `subtract(amount: Numeric | Currency): Currency`

Same as `add`, but for subtraction.

---

## ➗ `divide(divisor: number): Currency`

Divide the current currency amount. Often used for per-unit cost, average, etc.

```ts
/**
 * Divides the currency amount by a given divisor.
 *
 * @param divisor - A non-zero number.
 * @returns A new `Currency` instance.
 * @throws Will throw if divisor is `0`.
 */
divide(divisor: number): Currency
```

---

## ✖️ `multiply(factor: number): Currency`

Multiply currency, e.g., for interest calculation or tax additions.

---

## 🔄 `to(code: CurrencyCode): Currency`

Shortcut to convert and return a **new instance** rather than just the number.

```ts
/**
 * Converts this currency to another currency and returns a new `Currency` instance.
 *
 * @param to - Target currency code.
 * @param options - Optional conversion settings.
 * @returns A new `Currency` instance in the target currency.
 */
async to(to: CurrencyCode, options?: ConvertOptions): Promise<Currency>
```

---

## 💵 `getRawAmount(): number`

You already expose `currency` for formatted string, so expose a getter for raw value.

```ts
/**
 * Returns the internal numeric currency amount.
 *
 * @returns The unformatted numeric amount.
 */
getRawAmount(): number
```

---

## 🧮 `equals(other: Currency): boolean`

Compare if two currencies are equal in amount and code.

```ts
/**
 * Checks equality between this and another currency.
 *
 * @param other - Another `Currency` instance.
 * @returns `true` if both amounts and codes match.
 */
equals(other: Currency): boolean
```

---

## 📈 `isGreaterThan(other: Currency): boolean`

## 📉 `isLessThan(other: Currency): boolean`

Useful for comparisons, especially in pricing logic.
