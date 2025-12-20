import type { Maybe } from '../types/index';
import { HTTP_STATUS_DATA } from './constants';
import type {
	HttpStatusCode,
	HttpStatusName,
	StatusCategory,
	StatusCode,
	StatusEntry,
	StatusName,
} from './types';

/**
 * * Utility class for retrieving and managing HTTP status codes with rich MDN-based metadata.
 *
 * @remarks
 * - Supports lookup by code or name (both `SOME_NAME` and `Some Name` formats).
 * - Allows adding custom codes and overriding messages for existing ones.
 * - Provides pre-grouped categories for quick filtering (see {@link https://toolbox.nazmul-nhb.dev/docs/classes/HttpStatus#groups-static-property HttpStatus.Groups}).
 * - Intended to be reusable — create multiple instances if you want separate registries.
 *
 * @see {@link https://toolbox.nazmul-nhb.dev/docs/utilities/misc/httpStatus httpStatus} for the default preloaded singleton instance.
 *
 * @example
 * // Using the class directly
 * const customStatus = new HttpStatus();
 * customStatus.addCode({
 *   code: 799,
 *   name: 'CUSTOM_ERROR',
 *   readableName: 'Custom Error',
 *   message: 'Something custom happened',
 *   description: 'This is an example of a user-defined HTTP status.',
 *   category: 'clientError'
 * });
 *
 * console.log(customStatus.getByCode(799)?.readableName);
 * // "Custom Error"
 *
 * console.log(customStatus.getByCode(404)?.name);
 * // "NOT_FOUND"
 *
 * console.log(customStatus.getByCode(404)?.message);
 * // "Not Found"
 */
export class HttpStatus {
	#codesByNumber: Map<StatusCode, StatusEntry>;
	#codesByName: Map<StatusName, StatusEntry>;

	/**
	 * * Static category groups for quick reference.
	 * @remarks Populated at runtime from default and the provided data.
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
	 * * Get status entry by standard numeric HTTP code.
	 * @param code Standard HTTP status code.
	 * @returns Matching standard status entry.
	 */
	getByCode(code: HttpStatusCode): StatusEntry;

	/**
	 * * Get status entry by numeric HTTP code.
	 * @param code HTTP status code.
	 * @returns Matching status entry or `undefined` if not found.
	 */
	getByCode(code: StatusCode): Maybe<StatusEntry>;

	/** * Get status entry by numeric HTTP code. */
	getByCode(code: StatusCode) {
		return this.#codesByNumber.get(code);
	}

	/**
	 * * Get status entry by standard name (either as `SOME_NAME` or `Some Name`).
	 * @param name Standard status name either as `SOME_NAME` or `Some Name`.
	 * @returns Matching standard status entry.
	 */
	getByName(name: HttpStatusName): StatusEntry;

	/**
	 * * Get status entry by name (either as `SOME_NAME` or `Some Name`).
	 * @param name Status name either as `SOME_NAME` or `Some Name`.
	 * @returns Matching status entry or `undefined` if not found.
	 */
	getByName(name: StatusName): Maybe<StatusEntry>;

	/** * Get status entry by name (either as `SOME_NAME` or `Some Name`). */
	getByName(name: StatusName) {
		return this.#codesByName.get(name);
	}

	/**
	 * * Override the short message of an existing code.
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
	 * * Add one or more new HTTP status code entries.
	 *
	 * @remarks
	 * - New entries are compared **by their `code` value** to determine uniqueness.
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
	 * * Add/override one or more HTTP status code entries.
	 *
	 * @remarks New entries use their `code` value as the comparison key and will overwrite existing ones.
	 *
	 * @param entries One or more status entries to add/override.
	 * @returns The modified instance with the newly added/updated entries.
	 */
	addOrOverrideCode(...entries: StatusEntry[]): HttpStatus {
		for (const entry of entries) {
			this.#storeEntry(entry);
			HttpStatus.Groups[entry.category].push(entry.code);
		}

		return this;
	}

	/**
	 * * List all codes, optionally filtered by category.
	 * @param category Optional category filter.
	 * @returns Array of status entries.
	 */
	list(category?: StatusCategory): StatusEntry[] {
		const entries = [...this.#codesByNumber.values()];

		if (!category) {
			return entries;
		} else {
			return entries.filter((entry) => entry.category === category);
		}
	}

	/** * Internal helper to store an entry in all lookup maps. */
	#storeEntry(entry: StatusEntry) {
		this.#codesByNumber.set(entry.code, { ...entry });
		this.#codesByName.set(entry.name, { ...entry });
		this.#codesByName.set(entry.readableName, { ...entry });
	}
}

/**
 * * Default singleton instance of {@link https://toolbox.nazmul-nhb.dev/docs/classes/HttpStatus HttpStatus} class.
 *
 * @remarks
 * - Preloaded with all MDN-based HTTP status codes.
 * - Useful when you do not need multiple independent registries.
 * - Provides immediate access to lookups, category groupings, and
 *   mutation methods without manual instantiation.
 *
 * @example
 * import { httpStatus } from 'nhb-toolbox';
 *
 * console.log(httpStatus.getByCode(404)?.readableName);
 * // "Not Found"
 *
 * httpStatus.setMessage(404, 'This page is gone');
 * console.log(httpStatus.getByCode(404)?.message);
 * // "This page is gone"
 */
export const httpStatus = new HttpStatus();
