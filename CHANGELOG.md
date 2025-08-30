# Changelog

<!-- markdownlint-disable-file MD024 -->

All notable changes to the package will be documented here.

---

## [4.14.16] - 2025-08-30

- **Updated** _types_ related to _object flattening utilities_: `FlattenDotKey`, `DotValue`, `FlattenDotValue`, `FlattenLeafKey`, `LeafValue` and `FlattenLeafValue`.
- **Made** all the (output) properties of `FlattenDotValue` and `FlattenLeafValue` _optional_ to avoid issues.

## [4.14.14] - 2025-08-27

- **Updated** `DeepPartial` type to preserve optional properties of advanced types like `File`, `FileList`, `Chronos` etc.

## [4.14.13] - 2025-08-24

- **Updated** _return type_ for `getColorForInitial` utility and **improved** _internal logic_ and _error type_ for color generator utilities.

## [4.14.12] - 2025-08-23

- **Updated** _error type_ for `trimString` utility.

## [4.14.10] - 2025-08-17

- **Added** new utility `wordsToNumber` utility with alias: `convertWordsToNumber`, `convertWordToNumber` and `wordToNumber`

## [4.14.9] - 2025-08-16

- **Fixed** minor _internal issues_ and **updated** JSDoc for `Pluralizer`.

## [4.14.4-8] - 2025-08-13 - 2025-08-14

- **Updated** internal logic of `convertStringCase` utility, added new `options` parameter.
- **Fixed** multiple _internal issues_ and JSDoc; Optimized internal logic.

## [4.14.1-3] - 2025-08-11 - 2025-08-12

- **Updated** JSDoc, dev dependencies and **fixed** minor issues.

## [4.14.0] - 2025-08-11

- **Added** new class `HttpStatus` for retrieving and managing HTTP status codes.

## [4.13.11] - 2025-08-06

- **Fixed** an issue with `getZodiacSign` method in `Chronos` that could not return correct _Vedic_ sign.

## [4.13.10] - 2025-08-02

- **Updated** docs for `isPlural` and `isSingular` methods in `Pluralizer`.
- **Updated** `getTimeZoneName()` and `getTimeZoneNameShort()` methods in `Chronos` to accept an optional UTC offset.
- **Changed** return type of `getTimeZoneName()` to `string | UTCOffset` using `LooseLiteral<UTCOffset>`.

## [4.13.9] - 2025-07-31

- **Added** new `Chronos` method `getTimeZoneName()` to get full time-zone name.
- **Added** new `Chronos` `timeZonePlugin` method `getTimeZoneNameShort()` to get abbreviated time-zone name.

## [4.13.7] - 2025-07-23

- **Updated** `isPlural` and `isSingular` methods in `Pluralizer` class to handle more cases.
- **Ran full test** on `pluralizer` and fixed some known issues.

## [4.13.3-6] - 2025-07-22

- **Reordered** rules for `pluralizer` and fixed other issues.

## [4.13.3] - 2025-07-22

- **Updated** pluralization/uncountable rules, case restoration method and fixed other bugs in `pluralizer`.
- **Updated** docs for `pluralizer`, `Pluralizer` and `formatUnitWithPlural`.

## [4.13.1] - 2025-07-22

- **Updated** docs in [README](README.md) for `pluralizer`.

## [4.13.0] - 2025-07-22

- **Added** new `Pluralizer` class and utility `pluralizer` (shared instance of `Pluralizer` class) with multiple methods.
- **Refactored** codes in number utilities, introduced new `normalizeNumber` utility.

## [4.12.80-81] - 2025-07-19

- **Updated** `convertArrayToString` to accept array of any primitive values.
- **Fully integrated** with [nhb-scripts](https://www.npmjs.com/package/nhb-scripts/).

## [4.12.70] - 2025-07-08

- **Updated** numeric string related issues, specifically in `isNumber` & `isNumericString` and other helper functions.

## [4.12.68-69] - 2025-07-05

- **Updated Docs:** Added links to other npm packages.

## [4.12.67] - 2025-07-03

- **Fixed** some import alias typo.

## [4.12.66] - 2025-07-02

- **Updated** `convertArrayToString` function, now accepts array of objects and have 2 overload signatures with options.
- **Updated** `RenameKeys` utility type by fixing some minor issues.

## [4.12.64] - 2025-07-02

- **Added** more utility types.
- **Updated** JSDoc for some `Chronos` methods.

## [4.12.61] - 2025-06-28

- **Added** new utility type `Expand<T>` to resolve complex helper-wrapped types into readable structures, similar to `Prettify<T>` but only for special types to use with.
- **Improved** type display for special cases where types were previously wrapped in multiple utility layers (e.g., `MergeAll`, `FlattenValue` etc.).

## [4.12.60] - 2025-06-27

- **Added** new array utilities:
  - `sumByField`
  - `averageByField`
  - `sumFieldDifference`
  - `groupAndSumByField`
  - `groupAndAverageByField`

- **Updated** `splitArrayByProperty` utility to allow nested field as dot-notation.

## [4.12.50] - 2025-06-27

- **Updated** return type definition and **enhanced** internal logic for `mergeObjects`, `mergeAndFlattenObjects`, `flattenObjectKeyValue`, `flattenObjectDotNotation`.
- **Created** new utility types for the mentioned utilities.

## [4.12.48] - 2025-06-24

- **Fixed** typo for utility name `splitArrayByProperty`.
- **Added** new utilities `getInstanceGetterNames` and `getStaticGetterNames`;
- **Updated** `getClassDetails` and its return type.

## [4.12.46] - 2025-06-24

- **Added** new utilities ~~spitArrayByProperty~~ `splitArrayByProperty` and `deleteFields`.

## [4.12.44] - 2025-06-23

- **Updated** `getDatesInRange()` method in `Chronos`: fixed an option conflict.

## [4.12.43] - 2025-06-22

- **Updated** `getDatesInRange()` method in `Chronos`, now accepts both `day-names` and `day-index` array for `skipDays` and `onlyDays`.
- **Updated** JSDoc for some functions and methods.

## [4.12.42] - 2025-06-21

- **Updated** JSDoc for some functions and methods.
- **Updated and Optimized** `getDatesInRange()` method in `Chronos`. Added new option `onlyDays` to get dates for only the provided days.
- **Allowed** `formatStrict()` method in `Chronos` to accept other string values [made less strict].

## [4.12.41] - 2025-06-17

- **Updated** `getDatesInRange()` and `getDatesForDay()` `Chronos` methods' options to change the date rounding behaviour.

## [4.12.40] - 2025-06-17

- **Added** new utility: `convertMinutesToTime` to convert minutes into clock-time (`H:mm`) format.
- **Exposed** important `constants` to consumers via `'nhb-toolbox/constants'` import path.

### 🕧 Updates for Chronos

- **Added** new instance method `getDatesInRange()` to get dates in the range as ISO date string.
- **Fixed** a bug by rounding the date to the start hour of the day and **updated** internal logic in static `getDatesForDay()` method.

## [4.12.36] - 2025-06-13

- **Added** new `convertSync()` method in `Currency` class to convert currency without network request.

## [4.12.34-35] - 2025-06-12

- **Updated** `format()` and `convert()` methods in `Currency` class:
  - `format()` method now accepts `CurrencyCode` as optional second parameter
  - `convert()` method now returns a new `Currency` instance.

## [4.12.33] - 2025-06-11

- **Trim** input string for `numberToWordsOrdinal` utility.
- **Preserve** `File`, `FileList` and other file related object(s) when processing nested object(s) using `sanitizeData`.

## [4.12.32] - 2025-06-11

- **Fixed** a bug in `sanitizeData` and `createFormData` where key selections did not allow to choose keys with null/undefined value(s).
- **Fixed** a bug in `createFormData` where values of nested object(s) incorrectly converted to lowercase. Process `date-like object(s)` more efficiently in both utilities.

## [4.12.31] - 2025-06-10

- **Added** new utility to convert number or numeric string to ordinal word.
- **Updated** JSDoc for some types.
- **Upgraded** TypeScript version to `5.8.3` and other dev-dependencies.

## [4.12.28-30] - 2025-06-06

- **Resolved** a compile-time `not-assignable` error that occurred when optional properties were present in parameters of `sanitizeData`, `createFormData`, and other utility functions.
- **Added** additional utility types and integrated them into various parts of the package to improve type safety and maintainability.

## [4.12.27] - 2025-06-02

- **Updated** [README](README.md).
- **Added** new utility types, can be imported from `'nhb-toolbox/utils/types'`.

## [4.12.25-26] - 2025-06-02

- **Updated** JSDoc for some `Chronos` methods and exposed `INTERNALS` Symbol

## [4.12.24] - 2025-06-01

### 🕧 Updates for Chronos

- **Reduced** bloat by moving _rarely used_ `Chronos` methods to plugin system.
- **Changed** plugin import paths as `import { somePlugin } from nhb-toolbox/plugins/somePlugin` format so the users can assume the path easily.
- **Updated** parameter type for `isBusinessHour` method: instead of multiple parameters can accept one options object now.

## [4.12.23] - 2025-06-01

### 🕧 Updates for Chronos

- All plugin imports now use statement like `import { somePlugin } from 'nhb-toolbox/plugins/plugin-path';`
- **Updated** `getZodiacSign` method: includes 2 presets `western` and `vedic` with aliases `tropical` and `sidereal`.
- **Fixed** issues in `getZodiacSign` method which previously could not parse some date/month range.

## [4.12.21-beta.2] - 2025-05-31

- **Updated** `types.mjs` script for updating the exports fields for plugins in `package.json`.

## [4.12.21-beta.1] - 2025-05-31

- **Updated** `getZodiacSign` method: includes 2 presets `western` and `vedic`.
- **Fixed** issues in `getZodiacSign` method.
- Experimenting with exporting each Chronos plugin as separate module from the respective locations.

## [4.12.20] - 2025-05-31

### 🕧 Released Plugin System for Chronos

- Plugin injection system for Chronos is now fully functional.

## [4.12.13-beta.1] - 2025-05-31

- **Created** more plugins for resource heavy methods of `Chronos`.

## [4.12.13-alpha.2] - 2025-05-30

- **Solved** experimental plugin export/import issues.

## [4.12.13-alpha.1] - 2025-05-30

### 🕧 Experimenting with Plugin System for Chronos

- **Introduced** plugin injection in `Chronos` class. Started with `season` method. Will make convert more methods if this is successful after publishing.

## [4.12.12] - 2025-05-30

### 🕧 Updates in Chronos

- **Added** new method `season` to get the name of the season for current Chronos instance. It has configurable options.
- All `Chronos` methods that use `#format` method internally now accepts escape tokens and new token `ZZ` is introduced to include timezone offset (or Z for UTC time) in the formatted date string.
- **Updated** some type names such as `Hours` ➡️ `ClockHour`, `Minutes` ➡️ `ClockMinute`, `Time` ➡️ `ClockTIme` etc. But the core definitions remain the same.

## [4.12.10] - 2025-05-30

### 🕧 New Chronos Methods

- **Added** 2 new instance methods in `Chronos`, `day` and `monthName` to get day and month names respectively.

### ℹ️ [README](README.md)

- **Added** `Signature Utilities` section in `README.md`

## [4.12.8] - 2025-05-29

### Types

- **Added** new types `Enumerate` and `NumberRange` to generate number literals like `0 | 1 | 2 | ... | 998`.
- **Implemented** both types in few cases where a return type is number and limited to a range, especially in color and number related functions and `Color` & `Chronos` classes.

### Method Changed in Chronos

- `isoWeekday` is now `isoWeekDay`
- Some method logic changed internally

---

## [4.12.7] - 2025-05-28

### Docs

- ➕ Introduced `CHANGELOG.md`

## [4.12.6] - 2025-05-28

### Added

- ➕ `Chronos.getDatesFromDay()` — a new static method to retrieve all matching dates for a given day of the week.

### Fixed

- 🐛 Minor internal issues and stability improvements.

---

## [4.12.0] - 2025-05-28

### ⚠️ Breaking Changes

- ⚠️ **Deprecation Notice**: All versions below `4.12.0` are now marked as deprecated
- ♻️ **Build System**: Switched from `tsup` back to `tsc` for building the library to resolve compatibility and output issues.

### Fixed

- 🛠️ Resolved ESM import issues by adding missing `.js` extensions in internal paths.
- 🧩 Improved module resolution in strict ESM-only environments.

### Improved

- 🌲 Full **tree-shaking support** for ESM builds (CommonJS remains unaffected).
- 🌲 _From the beginning the library was tree-shakable_ but now it's **properly tree-shakable** for ESM builds.
- 📦 CommonJS (`cjs`) build remains unaffected and stable.
