import type { Deserializer, Serializer } from '../types/index';

// * ****************** Local Storage ****************** * //

/**
 * * Get item(s) from local storage.
 *
 * @param key - Key to get item(s) from local storage.
 * @param deserialize - Optional deserializer function to convert the stored value back to type `T`. Defaults to `JSON.parse`.
 * @returns Returns saved item(s) from local storage if it exists with that key.
 */
export function getFromLocalStorage<T>(key: string, deserialize?: Deserializer<T>): T | null {
	const deserializer: Deserializer<T> = deserialize ?? JSON.parse;

	try {
		const item = localStorage.getItem(key);

		return item ? deserializer(item) : null;
	} catch {
		return null;
	}
}

/**
 * * Save item(s) in local storage.
 *
 * @param key - Key to save an item(s).
 * @param value - The item(s)/value to save.
 * @param serialize - Optional serializer function to convert the value of type `T` to a string. Defaults to `JSON.stringify`.
 */
export function saveToLocalStorage<T>(key: string, value: T, serialize?: Serializer<T>) {
	const serializer: Serializer<T> = serialize ?? JSON.stringify;

	try {
		localStorage.setItem(key, serializer(value));
	} catch (error) {
		console.error(`Error saving item with key "${key}" from local storage:`, error);
	}
}

/**
 * * Remove item(s) from local storage.
 *
 * @param key - Key to delete item(s) from local storage.
 */
export function removeFromLocalStorage(key: string): void {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error(`Error removing item with key "${key}" from local storage:`, error);
	}
}

// * ****************** Session Storage ****************** * //

/**
 * * Get item(s) from session storage.
 *
 * @param key - Key to get item(s) from session storage.
 * @param deserialize - Optional deserializer function to convert the stored value back to type `T`. Defaults to `JSON.parse`.
 * @returns Returns saved item(s) from session storage if it exists with that key.
 */
export function getFromSessionStorage<T>(key: string, deserialize?: Deserializer<T>): T | null {
	const deserializer: Deserializer<T> = deserialize ?? JSON.parse;

	try {
		const item = sessionStorage.getItem(key);

		return item ? deserializer(item) : null;
	} catch {
		return null;
	}
}

/**
 * * Save item(s) in session storage.
 *
 * @param key - Key to save an item(s).
 * @param value - The item(s)/value to save.
 * @param serialize - Optional serializer function to convert the value of type `T` to a string. Defaults to `JSON.stringify`.
 */
export function saveToSessionStorage<T>(key: string, value: T, serialize?: Serializer<T>) {
	const serializer: Serializer<T> = serialize ?? JSON.stringify;

	try {
		sessionStorage.setItem(key, serializer(value));
	} catch (error) {
		console.error(`Error saving item with key "${key}" from session storage:`, error);
	}
}

/**
 * * Remove item(s) from session storage.
 *
 * @param key - Key to delete item(s) from session storage.
 */
export function removeFromSessionStorage(key: string): void {
	try {
		sessionStorage.removeItem(key);
	} catch (error) {
		console.error(`Error removing item with key "${key}" from session storage:`, error);
	}
}
