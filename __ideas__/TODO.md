# String Utilities

<!-- - Convert a string to camelCase, snake_case, or kebab-case. -->
<!-- - Truncate a string with ellipsis if it exceeds a certain length. -->
<!-- - Generate a random string of specified length (e.g., for unique IDs). -->

# Array Utilities

<!-- - Shuffle an array. -->
<!-- - Remove duplicates from an array. -->
<!-- - Sort array of numbers/strings/boolean or objects. -->
<!-- - Find the intersection, difference, or union of two arrays. -->
<!-- - Filter arrays. -->

# Object Utilities

<!-- - Deep clone an object. -->
<!-- - Check if an object is empty. -->
<!-- - Merge two or more objects deeply. -->
<!-- - Remove certain properties using keys from an object. -->

# Number Utilities

<!-- - Format a number (e.g., as currency or with thousand separators). -->
<!-- - Generate a random number within a range. -->
<!-- - Round a number to a specified number of decimal places. -->

# Date Utilities

<!-- - Format a date in different formats (e.g., `YYYY-MM-DD`, `DD/MM/YYYY`). -->
<!-- - Calculate the difference between two dates. -->
<!-- - Add or subtract days, months, or years from a date. -->

# Audio/Video Utilities

- Control volume programmatically.
- Get the current playback time of an audio/video.
- Manage playback speed.
- Next/Previous controls.

# DOM Utilities

<!-- - Smooth scroll to an element. -->

- Debounce or throttle an event listener.
- Get the position or dimensions of an element.

# Validation Utilities

<!-- - Validate email, phone numbers, or URLs. -->
<!-- - Check if a value is a valid JSON. -->

- Validate if a password meets certain criteria (length, special characters, etc.).

# Fetch Utilities

- Handle HTTP requests with automatic retries.
- Parse and handle API errors consistently.
- Convert query parameters to a URL string.

# Miscellaneous

- Generate UUIDs or GUIDs. --> Did `generateRandomID`
- Check device type (mobile, tablet, desktop). --> Did in `nhb-hooks`
- Convert a file to base64. --> Did few but not published
      <!-- - Debounce and throttle functions -->
- Convert units (e.g., bytes to KB, MB, GB) --> Did in `Unit` class

# New Number Utilities

<!-- - Check if a number is even or odd (NO NEED) -->
<!-- - Find the greatest common divisor (GCD) of two numbers -->
<!-- - Find the least common multiple (LCM) of two numbers -->

<!-- - capitalize the first letter, play/pause, create array of data for select options, create formData -->

```typescript
/**
 * Flattens an array recursively.
 * @param arr - An array that may contain nested arrays.
 * @returns A flattened array with all elements.
 */
const flattenArray = <T>(arr: (T | T[])[]): T[] => {
	return arr.reduce((acc, el) => {
		if (Array.isArray(el)) {
			return acc.concat(flattenArray(el));
		}
		acc.push(el);
		return acc;
	}, []);
};
```
