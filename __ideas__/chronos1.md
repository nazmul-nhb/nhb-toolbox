# Methods Draft

```ts
/**
 * Checks if the current date is a public holiday based on a predefined list.
 *
 * This example uses a static holiday list — override or customize as needed.
 * @returns Whether the date is a public holiday.
 */
isPublicHoliday(): boolean {
  const holidays = [
    '01-01', // New Year's Day
    '02-21', // International Mother Language Day (Bangladesh)
    '03-26', // Independence Day (Bangladesh)
    '12-16', // Victory Day (Bangladesh)
    '12-25', // Christmas
  ];

  const mmdd = this.format('MM-DD');
  return holidays.includes(mmdd);
}

// More patterns like YYMMDD


// /**
//  * Checks if the date is within daylight saving time (DST).
//  * @returns Whether the date is in DST.
//  */
// isDST(): boolean {
//   const jan = new Date(this.#date.getFullYear(), 0, 1).getTimezoneOffset();
//   const jul = new Date(this.#date.getFullYear(), 6, 1).getTimezoneOffset();
//   return this.#date.getTimezoneOffset() < Math.max(jan, jul);
// }


// isDST(): boolean {
//   const jan = new Date(this.year, 0, 1);
//   const jul = new Date(this.year, 6, 1);

//   return (
//    Math.min(jan.getTimezoneOffset(), jul.getTimezoneOffset()) !==
//    this.#date.getTimezoneOffset()
//   );
// }

```
