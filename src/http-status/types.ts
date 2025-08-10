import type { LooseLiteral } from '../utils/types';
import type { HTTP_STATUS_DATA } from './constants';

/** HTTP Status Code, e.g. `404`, `500` etc. */
export type StatusCode = LooseLiteral<
	(typeof HTTP_STATUS_DATA)[number]['code']
>;

/** Name for the Status Code in Uppercase snake case, e.g. `"NOT_FOUND"`, `"INTERNAL_SERVER_ERROR"` */
export type StatusName = LooseLiteral<
	(typeof HTTP_STATUS_DATA)[number]['name']
>;

/** Name for the Status Code in Human readable form, e.g. `"Not Found"`, `"Internal Server Error"`  */
export type StatusNameReadable = LooseLiteral<
	(typeof HTTP_STATUS_DATA)[number]['readableName']
>;

/** Name for the Status Code in both Human readable and Uppercase snake case */
export type HttpStatusName = StatusName | StatusNameReadable;

/** * Categories of HTTP status codes: `"informational"`, `"success"`, `"redirection"`, `"clientError`" or `"serverError"` */
export type StatusCategory = (typeof HTTP_STATUS_DATA)[number]['category'];

/** * Shape of an HTTP status entry. */
export interface StatusEntry {
	/** HTTP Status Code, e.g. `404`, `500` etc. */
	code: StatusCode;
	/** Name for the Status Code in Uppercase snake case, e.g. `"NOT_FOUND"`, `"INTERNAL_SERVER_ERROR"` */
	name: StatusName;
	/** Name for the Status Code in Human readable form, e.g. `"Not Found"`, `"Internal Server Error"`  */
	readableName: StatusNameReadable;
	/** Link to full `MDN` Docs if available */
	link?: string;
	/** Short message, Can override using `httpStatus.setMessage` method */
	message: string;
	/** A brief description if available */
	description: string;
	/** The type of HTTP Status: `"informational"`, `"success"`, `"redirection"`, `"clientError`" or `"serverError"` */
	category: StatusCategory;
}
