import type { LooseLiteral } from '../utils/types';
import type { HTTP_STATUS_DATA } from './constants';

export type StatusCode = LooseLiteral<
	(typeof HTTP_STATUS_DATA)[number]['code']
>;

export type StatusName = LooseLiteral<
	(typeof HTTP_STATUS_DATA)[number]['name']
>;

export type StatusNameReadable = LooseLiteral<
	(typeof HTTP_STATUS_DATA)[number]['readableName']
>;

/** * Categories of HTTP status codes. */
export type StatusCategory = (typeof HTTP_STATUS_DATA)[number]['category'];

// export type StatusCategory = 'informational' | 'success' | 'redirection' | 'clientError' | 'serverError';

/** * Shape of an HTTP status entry. */
export interface StatusEntry {
	code: StatusCode;
	name: StatusName; // Uppercase snake case
	readableName: StatusNameReadable; // Human readable
	link?: string;
	message: string; // Short message
	description: string; // Full MDN description
	category: StatusCategory;
}
