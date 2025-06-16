# Changelog

<!-- markdownlint-disable-file MD024 -->

All notable changes to the package will be documented here.

---

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
