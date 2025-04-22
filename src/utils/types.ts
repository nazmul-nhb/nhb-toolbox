import type { Numeric } from '../types';

export interface PaginatorOptions {
	/** The total number of items. */
	totalItems: Numeric;
	/** Number of items per page. (Default is `10`). */
	itemsPerPage?: Numeric;
	/** Current active page. (Default is `1`). */
	currentPage?: Numeric;
}

export interface PaginatorMeta {
	totalItems: number;
	currentPage: number;
	itemsPerPage: number;
	totalPages: number;
	hasPrev: boolean;
	hasNext: boolean;
	isFirst: boolean;
	isLast: boolean;
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
