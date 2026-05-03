# Array Maths

```ts
type NumericKey<T> = {
  [K in keyof T]: T[K] extends Numeric  | undefined | null ? K : never;
}[keyof T];

/**
 * Calculates the sum of differences between two fields for each item in an array of objects.
 *
 * @param data - The array of objects to process.
 * @param first - The field name to subtract **from** (minuend).
 * @param second - The field name to subtract **(subtrahend)**.
 * @returns The total sum of `item[first] - item[second]` across all objects.
 *
 * @example
 * sumFieldDifference([{ buy: 10, sell: 3 }, { buy: 8, sell: 5 }], 'buy', 'sell');
 * // => 10
 * 
 * totalDelta
 */
export function sumFieldDifference<
 T extends GenericObject,
 P extends NormalPrimitiveKey<T>,
>(data: T[] | undefined, first: P, second: P): number {
 if (!isValidArray(data)) return 0;

 return data.reduce((acc, item) => {
  const numberify = (val: unknown): number => {
   return (
    isNumber(val) ? val
    : isNumericString(val) ? Number(val)
    : 0
   );
  };

  return acc + (numberify(item?.[first]) - numberify(item?.[second]));
 }, 0);
}
```

## Aliases

| Name                         | Rationale                                                       |
| ---------------------------- | --------------------------------------------------------------- |
| `sumFieldDifference`         | most accurate — you sum the difference between 2 fields         |
| `totalDelta`                 | common in analytics or metrics context                          |
| `sumByFieldDifference`       | follows lodash-style naming                                     |
| `netFromFields`              | useful for financial applications (e.g. `net = credit - debit`) |
| `sumDifferenceBetweenFields` | more verbose, but clear                                         |

## More like this

| Utility                                                   | Purpose                                |
| --------------------------------------------------------- | -------------------------------------- |
| `sumByField<T>(data: T[], field: keyof T)`                | Sum values of a single field           |
| `avgByField<T>(data: T[], field: keyof T)`                | Average of values                      |
| `maxByField<T>()`, `minByField<T>()`                      | Extrema values                         |
| `sumDerived<T>(data: T[], deriveFn: (item: T) => number)` | Fully custom reducer                   |
| `groupSum<T, K extends keyof T>()`                        | Sum per group (e.g. by category/label) |
