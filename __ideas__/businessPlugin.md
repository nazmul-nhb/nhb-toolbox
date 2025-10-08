# New Methods (Idea) for `businessPlugin`

## - `nextWorkDay()` / `prevWorkDay()`

**Purpose:** Return the next or previous valid workday, skipping weekends.

```ts
/**
 * @instance Returns the next valid workday after the current date, skipping weekends.
 * @param options Optional. Configure weekend days, and direction.
 * @returns New Chronos instance pointing to the next workday.
 */
nextWorkDay(options?: BusinessDayOptions): Chronos;
```

Implementation can leverage existing `isWorkDay()`

---

## - `businessDaysBetween()`

**Purpose:** Count total business days between two dates (excluding weekends).

```ts
/**
 * @static Counts total workdays between two dates.
 * @param start The start date.
 * @param end The end date.
 * @param options Optional weekend configuration.
 * @returns Number of workdays.
 */
static businessDaysBetween(start: ChronosInput, end: ChronosInput, options?: BusinessDayOptions): number;
```

---

## - `toFiscalYear()`

**Purpose:** Complements `toFiscalQuarter()` by returning the **fiscal year label**.

```ts
/**
 * @instance Returns the fiscal year label based on the start month.
 * @param startMonth Optional. Fiscal year start month (1–12). Default is July (7).
 * @returns The fiscal year in `YYYY–YYYY` format.
 */
toFiscalYear(startMonth?: NumberRange<1, 12>): FiscalYear;
```

---

## - `isSameFiscalYear()` / `isSameFiscalQuarter()`

**Purpose:** Helpful for comparisons in business analytics.

```ts
isSameFiscalYear(compareDate: ChronosInput, startMonth?: NumberRange<1, 12>): boolean;
isSameFiscalQuarter(compareDate: ChronosInput, startMonth?: NumberRange<1, 12>): boolean;
```

---

## - `workingHoursRemaining()` / `workingHoursElapsed()`

**Purpose:** Business-day time tracking utilities.

```ts
/**
 * @instance Returns number of business hours remaining today based on current time and configured hours.
 */
workingHoursRemaining(options?: $BusinessHourOptions): number;
```

---

## - `isPayDay()` *(Optional, domain-specific but realistic)*

```ts
/**
 * @instance Checks if the current date is payday based on interval or fixed day-of-month.
 */
isPayDay( interval?: 'weekly' | 'biweekly' | 'monthly' ): boolean;
isPayDay( dayOfMonth?: NumberRange<1, 31> ): boolean;
```

---

## 🧾 Summary — Suggested New Methods Table

| Method                                         | Type     | Purpose                  |
| ---------------------------------------------- | -------- | ------------------------ |
| `nextWorkDay()` / `prevWorkDay()`              | Instance | Skip weekends            |
| `businessDaysBetween()`                        | Static   | Count working days       |
| `toFiscalYear()`                               | Instance | Return fiscal year label |
| `isSameFiscalYear()` / `isSameFiscalQuarter()` | Instance | Compare periods          |
| `workingHoursRemaining()`                      | Instance | Time tracking helper     |
| `isPayDay()`                                   | Instance | Payroll-related check    |
