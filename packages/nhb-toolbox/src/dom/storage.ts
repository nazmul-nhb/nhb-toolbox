import type { Deserializer, Serializer } from '../types/index';

// * ****************** Local Storage ****************** * //

/**
 * * Get item from local storage.
 *
 * @param key - Key to get item from local storage.
 * @param deserialize - Optional deserializer function to convert the stored value back to type `T`. Defaults to `JSON.parse`.
 * @returns Returns saved item from local storage if it exists with that key.
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
 * * Save item in local storage.
 *
 * @param key - Key to save an item.
 * @param value - The item/value to save.
 * @param serialize - Optional serializer function to convert the value of type `T` to a string. Defaults to `JSON.stringify`.
 */
export function saveToLocalStorage<T>(key: string, value: T, serialize?: Serializer<T>) {
	const serializer: Serializer<T> = serialize ?? JSON.stringify;

	try {
		localStorage.setItem(key, serializer(value));
	} catch (error) {
		console.error(`Error saving item with key "${key}" in local storage:`, error);
	}
}

/**
 * * Remove item from local storage.
 *
 * @param key - Key to delete item from local storage.
 */
export function removeFromLocalStorage(key: string) {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error(`Error removing item with key "${key}" from local storage:`, error);
	}
}

// * ****************** Session Storage ****************** * //

/**
 * * Get item from session storage.
 *
 * @param key - Key to get item from session storage.
 * @param deserialize - Optional deserializer function to convert the stored value back to type `T`. Defaults to `JSON.parse`.
 * @returns Returns saved item from session storage if it exists with that key.
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
 * * Save item in session storage.
 *
 * @param key - Key to save an item.
 * @param value - The item/value to save.
 * @param serialize - Optional serializer function to convert the value of type `T` to a string. Defaults to `JSON.stringify`.
 */
export function saveToSessionStorage<T>(key: string, value: T, serialize?: Serializer<T>) {
	const serializer: Serializer<T> = serialize ?? JSON.stringify;

	try {
		sessionStorage.setItem(key, serializer(value));
	} catch (error) {
		console.error(`Error saving item with key "${key}" in session storage:`, error);
	}
}

/**
 * * Remove item from session storage.
 *
 * @param key - Key to delete item from session storage.
 */
export function removeFromSessionStorage(key: string) {
	try {
		sessionStorage.removeItem(key);
	} catch (error) {
		console.error(`Error removing item with key "${key}" from session storage:`, error);
	}
}
