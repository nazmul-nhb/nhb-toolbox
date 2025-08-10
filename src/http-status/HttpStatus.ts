import { HTTP_STATUS_DATA } from './constants';
import type {
	StatusCategory,
	StatusCode,
	StatusEntry,
	StatusName,
	StatusNameReadable,
} from './types';

/**
 * * Utility for retrieving and managing HTTP status codes with rich MDN-based metadata.
 *
 * @remarks
 * - Supports lookup by code or name (both `SOME_NAME` and `Some Name` formats).
 * - Allows adding custom codes and overriding messages.
 * - Pre-grouped categories for quick filtering.
 */
export class HttpStatus {
	#codesByNumber: Map<StatusCode, StatusEntry>;
	#codesByName: Map<StatusName | StatusNameReadable, StatusEntry>;

	/**
	 * Static category groups for quick reference.
	 * Populated at runtime from the provided data.
	 */
	static Groups: Record<StatusCategory, StatusCode[]> = {
		informational: [],
		success: [],
		redirection: [],
		clientError: [],
		serverError: [],
	};

	constructor() {
		this.#codesByNumber = new Map();
		this.#codesByName = new Map();

		// Initialize status code data
		for (const entry of HTTP_STATUS_DATA) {
			this.#storeEntry(entry);
			HttpStatus.Groups[entry.category].push(entry.code);
		}
	}

	/**
	 * Get status entry by numeric HTTP code.
	 * @param code HTTP status code.
	 * @returns Matching status entry or `undefined` if not found.
	 */
	getByCode(code: StatusCode): StatusEntry | undefined {
		return this.#codesByNumber.get(code);
	}

	/**
	 * Get status entry by name (either SOME_NAME or "Some Name").
	 * @param name Status name.
	 * @returns Matching status entry or `undefined` if not found.
	 */
	getByName(name: StatusName | StatusNameReadable): StatusEntry | undefined {
		return this.#codesByName.get(name);
	}

	/**
	 * Override the short message of an existing code.
	 * @param code HTTP status code.
	 * @param newMessage Custom message.
	 * @returns `true` if updated, `false` if code not found.
	 */
	setMessage(code: StatusCode, newMessage: string): boolean {
		const entry = this.#codesByNumber.get(code);

		if (!entry) {
			return false;
		} else {
			entry.message = newMessage;
			return true;
		}
	}

	/**
	 * Add one or more new HTTP status code entries.
	 *
	 * @remarks
	 * - If a code already exists, it will be skipped and not overwritten.
	 * - Returns `true` if at least one code was successfully added.
	 * - Returns `false` if all provided codes already exist.
	 *
	 * @param entries One or more status entries to add.
	 * @returns `true` if at least one code was added, otherwise `false`.
	 */
	addCode(...entries: StatusEntry[]): boolean {
		let added = false;

		for (const entry of entries) {
			if (!this.#codesByNumber.has(entry.code)) {
				this.#storeEntry(entry);
				HttpStatus.Groups[entry.category].push(entry.code);
				added = true;
			}
		}

		return added;
	}

	/**
	 * List all codes, optionally filtered by category.
	 * @param category Optional category filter.
	 * @returns Array of status entries.
	 */
	list(category?: StatusCategory): StatusEntry[] {
		if (!category) {
			return [...this.#codesByNumber.values()];
		} else {
			return [...this.#codesByNumber.values()].filter(
				(entry) => entry.category === category
			);
		}
	}

	/** * Internal helper to store an entry in all lookup maps. */
	#storeEntry(entry: StatusEntry) {
		this.#codesByNumber.set(entry.code, { ...entry });
		this.#codesByName.set(entry.name, { ...entry });
		this.#codesByName.set(entry.readableName, { ...entry });
	}
}
