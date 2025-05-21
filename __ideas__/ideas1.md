# Future Plans

## 1. **String Utilities:**

- `sanitizeHTML` – To sanitize HTML input to prevent XSS vulnerabilities.
    <!-- - `wordCount` – To count words in a string. -->
    <!-- - `truncateAtWord` – To truncate a string at the nearest word boundary instead of a character limit. -->
    <!-- - `toTitleCase` – Converts a string to title case (useful for headings). -->

## 2. **Number Utilities:**

- `formatPhoneNumber` – Formats phone numbers based on the country code.
  <!-- - `getAverage` – Calculates the average of a set of numbers. -->
- `convertToBase` – Convert numbers between various bases (binary, octal, hexadecimal, etc.).
  <!-- - `generateRandomString` – Generate random strings of alphanumeric characters, useful for session IDs or tokens. -->

## 3. **Color Utilities:**

<!-- - `blendColors` – To blend two colors together to create a gradient or a new color. -->
<!-- - `contrastRatio` – Calculate the contrast ratio between two colors for accessibility purposes. -->
<!-- - `getComplementaryColor` – Find the complementary color for a given color. -->
<!-- - `isLightColor` – Determine if a color is light or dark based on its RGB values. -->

## 4. **Date & Time Utilities:**

<!-- - `formatDuration` – Format a duration given in seconds or milliseconds into a readable string (e.g., "2 hours 3 minutes"). -->
<!-- - `getTimeAgo` – Return a human-readable string for relative time (e.g., "5 minutes ago", "2 days ago"). -->
<!-- - `convertToTimestamp` – Convert a date object or string into a UNIX timestamp. -->
<!-- - `parseDate` – Parse a variety of date formats into a standardized Date object. -->

- `getNextWeekday` – Find the next weekday given a start date and a target weekday (e.g., next Monday).

## 5. **Array Utilities:**

<!-- - `getDuplicates` – Find duplicates in an array. -->
<!-- - `deepCloneArray` – Deep clone an array of objects. -->
<!-- - `chunkArray` – Split an array into chunks of a given size. -->
<!-- - `findMissingElements` – Compare two arrays and find the missing elements from the first array. -->

## 6. **Object Utilities:**

<!-- - `deepCloneObject` – Deeply clone an object to ensure no references are maintained. -->
<!-- - `pickObjectFieldsByCondition` – Pick object fields based on a condition (e.g., type or value). -->
<!-- - `flattenDeepObject` – Recursively flatten an object. -->
<!-- - `objectToQueryParams` – Convert an object into a query string for URL parameters. -->

## 7. **DOM Utilities:**

- `getElementPosition` – Get the absolute position of an element relative to the page.
- `getElementSize` – Get the width and height of an element including padding and border.
- `checkVisibilityInViewport` – Check if an element is visible in the user's viewport (useful for lazy loading).
- `waitForElement` – Wait for an element to appear in the DOM before executing a callback.

## 8. **Form Utilities:**

<!-- - `validateEmailFormat` – Validate if an email address matches a regex pattern. -->

- `resetForm` – Reset a form’s fields to their initial values.
    <!-- - `serializeForm` – Convert form data into an object or query string. -->
    <!-- - `parseFormData` – Parse form data into a structured object format. -->

## 9. **Other Utilities:**

- `generateUUIDv5` – Generate UUID v5 (namespace-based).
- `encryptData` – Encrypt data (AES, RSA, etc.) and provide a utility for decrypting.
- `validateCreditCard` – Check if a credit card number is valid using the Luhn algorithm.
- `waitFor` – A utility to pause execution for a set amount of time.
- `getRandomBoolean` – Get a random boolean value (true or false). !! But Why?

## 10. **Network Utilities:**

- `getRequestBody` – Extract the body of an HTTP request for API services.
- `parseJSONResponse` – Safely parse JSON from an HTTP response with error handling.
- `checkInternetConnection` – Check if the device has an active internet connection.
- `fetchWithRetry` – Fetch data with retry logic in case of network failure.

## 11. **Type Utilities:**

<!-- - `deepEqual` – Perform a deep equality check for objects and arrays. -->

- `isFunctionWithArgs` – Check if a function has a specific number of arguments.
- `extractValueFromObject` – Extract values from nested objects based on a path.
- `getObjectKeysByValue` – Get object keys based on a specific value.

```ts
type Primitive = string | number | boolean | bigint | symbol | null | undefined;
type AdvancedTypes =
	| Function
	| Date
	| RegExp
	| Map<unknown, unknown>
	| Set<unknown>;

/**
 * Extracts dot-notation keys from nested objects (recursively), including objects inside arrays.
 */
export type DotNotationKey<T> =
	T extends Primitive | AdvancedTypes ? never
	: T extends Array<infer U> ?
		DotNotationKey<U> // drill into array item
	: T extends object ?
		{
			[K in keyof T & string]: T[K] extends Primitive | AdvancedTypes ?
				`${K}`
			: T[K] extends Array<infer U> ?
				U extends object ?
					`${K}` | `${K}.${DotNotationKey<U>}`
				:	`${K}`
			: T[K] extends object ? `${K}` | `${K}.${DotNotationKey<T[K]>}`
			: never;
		}[keyof T & string]
	:	never;
```
