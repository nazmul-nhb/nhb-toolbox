import type {
	FromMetaOptions,
	PageListOptions,
	PaginatorMeta,
	PaginatorOptions,
} from './types';

/** * Generates pagination logic, offsets, metadata and other pagination logic(s) for APIs and UIs. */
export class Paginator {
	readonly #totalItems: number;
	readonly #perPage: number;
	readonly #currentPage: number;

	/**
	 * * Creates an instance of the Paginator.
	 * @param options - The options for pagination.
	 */
	constructor(options: PaginatorOptions) {
		const {
			totalItems,
			itemsPerPage = 10,
			currentPage = 1,
		} = options ?? {};

		this.#totalItems = Math.max(0, Number(totalItems));
		this.#perPage = Math.max(1, Number(itemsPerPage));
		this.#currentPage = Math.max(1, Number(currentPage));
	}

	/**
	 * @instance Returns a new Paginator instance with the given page number.
	 * * This method does not modify the current instance.
	 * - **N.B.** *If the provided page is out of range, it will be clamped between 1 and the last page.*
	 * @param page - The new current page to use.
	 * @returns A new Paginator instance with the updated (clamped) page.
	 */
	withPage(page: number): Paginator {
		const safePage = Math.min(Math.max(1, page), this.totalPages());

		return new Paginator({
			totalItems: this.#totalItems,
			itemsPerPage: this.#perPage,
			currentPage: safePage,
		});
	}

	/**
	 * @instance Returns a new Paginator instance with the given items per page.
	 * - **N.B.** *If the value is less than `1`, it will be clamped to 1.*
	 * @param perPage - New items per page value.
	 * @returns A new Paginator instance with updated items per page.
	 */
	withPerPage(perPage: number): Paginator {
		const safePerPage = Math.max(1, perPage);
		return new Paginator({
			totalItems: this.#totalItems,
			itemsPerPage: safePerPage,
			currentPage: this.#currentPage,
		});
	}

	/**
	 * @instance Returns a new Paginator instance with the given total items.
	 * - **N.B.** *If the value is `negative`, it will be clamped to `0`.*
	 * @param totalItems - New total items value.
	 * @returns A new Paginator instance with updated total items.
	 */
	withTotalItems(totalItems: number): Paginator {
		const safeTotalItems = Math.max(0, totalItems);
		return new Paginator({
			totalItems: safeTotalItems,
			itemsPerPage: this.#perPage,
			currentPage: this.#currentPage,
		});
	}

	/**
	 * @instance Returns a new Paginator instance with updated pagination options.
	 * - **N.B.** *Any value provided will override the existing one, with clamping applied for safety.*
	 * @param options - Partial pagination options to override the current instance.
	 * @returns A new Paginator instance with merged and clamped options.
	 */
	withOptions(options: Partial<PaginatorOptions>): Paginator {
		const newTotalItems = Math.max(
			0,
			options.totalItems ? Number(options.totalItems) : this.#totalItems
		);
		const newItemsPerPage = Math.max(
			1,
			options.itemsPerPage ? Number(options.itemsPerPage) : this.#perPage
		);
		const totalPages = Math.ceil(newTotalItems / newItemsPerPage);
		const newCurrentPage = Math.min(
			Math.max(
				1,
				options.currentPage ?
					Number(options.currentPage)
				:	this.#currentPage
			),
			totalPages
		);

		return new Paginator({
			totalItems: newTotalItems,
			itemsPerPage: newItemsPerPage,
			currentPage: newCurrentPage,
		});
	}

	/**
	 * @instance Calculates the offset (number of items to skip) based on the `current page` and `items per page`.
	 * @returns The number of items to skip.
	 */
	offset(): number {
		return (this.#currentPage - 1) * this.#perPage;
	}

	/**
	 * @instance Calculates the offset (number of items to skip) based on the `current page` and `items per page`.
	 * @alias of {@link offset}
	 * @returns The number of items to skip.
	 */
	getOffset(): number {
		return this.offset();
	}

	/**
	 * @instance Calculates the number of items to skip based on the `current page` and `items per page`.
	 * @alias of {@link offset}
	 * @returns The number of items to skip.
	 */
	skipCount(): number {
		return this.offset();
	}

	/**
	 * @instance Calculates the total number of pages based on `total items` and `items per page`.
	 * @returns The total number of pages.
	 */
	totalPages(): number {
		return Math.ceil(this.#totalItems / this.#perPage);
	}

	/**
	 * * Returns pagination metadata useful for API responses or UI rendering.
	 * @returns An object with pagination metadata.
	 */
	getMeta(): PaginatorMeta {
		const totalPages = this.totalPages();
		return {
			totalItems: this.#totalItems,
			currentPage: this.#currentPage,
			itemsPerPage: this.#perPage,
			totalPages,
			hasPrev: this.hasPrevPage(),
			hasNext: this.hasNextPage(),
			isFirst: this.isFirstPage(),
			isLast: this.isLastPage(),
			offset: this.offset(),
		};
	}

	/**
	 * @instance Returns the next page number if it exists.
	 * @returns The next page number or null if it's the last page.
	 */
	nextPage(): number | null {
		return this.#currentPage < this.totalPages() ?
				this.#currentPage + 1
			:	null;
	}

	/**
	 * @instance Returns the previous page number if it exists.
	 * @returns The previous page number or null if it's the first page.
	 */
	prevPage(): number | null {
		return this.#currentPage > 1 ? this.#currentPage - 1 : null;
	}

	/**
	 * @instance Checks if the current page is the first page.
	 * @returns Whether the current page is the first page.
	 */
	isFirstPage(): boolean {
		return this.#currentPage === 1;
	}

	/**
	 * @instance Checks if the current page is the last page.
	 * @returns Whether the current page is the last page.
	 */
	isLastPage(): boolean {
		return this.#currentPage === this.totalPages();
	}

	/**
	 * @instance Checks if a previous page exists.
	 * @returns Whether a previous page exists.
	 */
	hasPrevPage(): boolean {
		return this.#currentPage > 1;
	}

	/**
	 * @instance Checks if a next page exists.
	 * @returns Whether a next page exists.
	 */
	hasNextPage(): boolean {
		return this.#currentPage < this.totalPages();
	}

	/**
	 * @instance Creates an array of page numbers for UI pagination display.
	 * @param options Options for customizing the page list.
	 * @returns An array of visible page numbers.
	 */
	pageList(options: PageListOptions = {}): number[] {
		const total = this.totalPages();
		const edgeCount = Math.max(0, options.edgeCount ?? 1);
		const siblingCount = Math.max(0, options.siblingCount ?? 1);
		const start = Math.max(this.#currentPage - siblingCount, edgeCount + 1);
		const end = Math.min(
			this.#currentPage + siblingCount,
			total - edgeCount
		);

		const _getRange = (from: number, to: number): number[] => {
			return from > to ?
					[]
				:	Array.from({ length: to - from + 1 }, (_, i) => from + i);
		};

		const startPages = _getRange(1, edgeCount);
		const middlePages = _getRange(start, end);
		const endPages = _getRange(total - edgeCount + 1, total);

		const pages = new Set<number>([
			...startPages,
			...middlePages,
			...endPages,
		]);

		return Array.from(pages).sort((a, b) => a - b);
	}

	/**
	 * @instance Returns the first page number.
	 * @returns Always returns 1.
	 */
	firstPage(): number {
		return 1;
	}

	/**
	 * @instance Returns the last page number based on total items and per page count.
	 * @returns The last page number.
	 */
	lastPage(): number {
		return this.totalPages();
	}

	/**
	 * @instance Checks if a page number is valid within the pagination range.
	 * @param page - The page number to validate.
	 * @returns Whether the page number is within range.
	 */
	isPageValid(page: number): boolean {
		const p = Math.floor(page);
		return p >= 1 && p <= this.totalPages();
	}

	/**
	 * @static Creates a new Paginator instance from a meta object.
	 * @param meta - A pagination metadata object.
	 * @returns A new Paginator instance.
	 */
	static fromMeta(meta: FromMetaOptions): Paginator {
		return new Paginator({
			totalItems: meta.totalItems,
			itemsPerPage: meta.itemsPerPage,
			currentPage: meta.currentPage,
		});
	}
}
