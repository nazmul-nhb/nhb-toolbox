import type { Numeric } from '../types/index';

/** Options to initialize Paginator */
export interface PaginatorOptions {
	/** The total number of items. */
	totalItems: Numeric;
	/** Number of items per page. (Default is `10`). */
	itemsPerPage?: Numeric;
	/** Current active page. (Default is `1`). */
	currentPage?: Numeric;
}

/** Paginator metadata */
export interface PaginatorMeta {
	/** Total number of items in the dataset. */
	totalItems: number;
	/** The current page number in the pagination. */
	currentPage: number;
	/** The number of items per page in the pagination. */
	itemsPerPage: number;
	/** The total number of pages based on the totalItems and itemsPerPage. */
	totalPages: number;
	/** Whether the current page has a previous page. */
	hasPrev: boolean;
	/** Whether the current page has a next page. */
	hasNext: boolean;
	/** Whether the current page is the first page. */
	isFirst: boolean;
	/** Whether the current page is the last page. */
	isLast: boolean;
	/** The number of items to skip (the offset) for the current page. */
	offset: number;
}

/** Options for `fromMeta` method. */
export type FromMetaOptions = Pick<
	PaginatorMeta,
	'totalItems' | 'itemsPerPage' | 'currentPage'
>;

/** Options for pageList method. */
export interface PageListOptions {
	/** Number of edge pages to always show (default 1). */
	edgeCount?: number;
	/** Number of siblings pages to show around the current page (default 1). */
	siblingCount?: number;
}
