import type { LooseLiteral } from '../utils/types';
import type { HTTP_STATUS_DATA } from './constants';

/** Mapped type of HTTP status entries */
export type $HttpStatusMap = (typeof HTTP_STATUS_DATA)[number];

/** HTTP status name variants: `name` or `readableName` */
export type $StatusNameVar = 'name' | 'readableName';

/** * Categories of HTTP status codes: `"informational"`, `"success"`, `"redirection"`, `"clientError`" or `"serverError"` */
export type StatusCategory = $HttpStatusMap['category'];

/** - Extracts standard HTTP status codes by the given `Category` name. Defaults to all {@link StatusCategory categories}. */
export type HttpStatusCode<Category extends StatusCategory = StatusCategory> =
	$HttpStatusMap extends infer Target ?
		Target extends $HttpStatusMap ?
			Target['category'] extends Category ?
				Target['code']
			:	never
		:	never
	:	never;

/** Standard HTTP Status Code, e.g. `404`, `500` etc. + any number */
export type StatusCode = LooseLiteral<HttpStatusCode>;

/**
 * - Extracts standard HTTP status names filtered by {@link $StatusNameVar variant} and {@link StatusCategory category}.
 *   - Defaults to all `variants` and `categories`.
 *
 * @remarks
 * - `Name` selects either the `name` (CONSTANT_CASE) or `readableName` (Title Case).
 * - `Category` restricts results to the chosen HTTP status {@link StatusCategory category}.
 * - Produces a union of all matching literal status name values.
 */
export type HttpStatusName<
	Name extends $StatusNameVar = $StatusNameVar,
	Category extends StatusCategory = StatusCategory,
> =
	$HttpStatusMap extends infer Target ?
		Target extends $HttpStatusMap ?
			Target['category'] extends Category ?
				Target[Name]
			:	never
		:	never
	:	never;

/** Standard HTTP status name in `CONSTANT_CASE`, e.g. `"INTERNAL_SERVER_ERROR"` + any string */
export type StatusName = LooseLiteral<HttpStatusName>;

/** HTTP status name (`CONSTANT_CASE`) in {@link StatusEntry} interface */
export type EntryStatusName = LooseLiteral<HttpStatusName<'name'>>;

/** HTTP status name (`Title Case`) in {@link StatusEntry} interface */
export type EntryReadableName = LooseLiteral<HttpStatusName<'readableName'>>;

/** * Shape of an HTTP status entry. */
export interface StatusEntry {
	/** HTTP Status Code, e.g. `404`, `500` etc. */
	code: StatusCode;
	/** HTTP status name in `CONSTANT_CASE`, e.g. `"NOT_FOUND"`, `"INTERNAL_SERVER_ERROR"` */
	name: EntryStatusName;
	/** HTTP status name in `Title Case` form, e.g. `"Not Found"`, `"Internal Server Error"`  */
	readableName: EntryReadableName;
	/** Link to full `MDN` Docs if available */
	link?: string;
	/** Short message, Can override using `httpStatus.setMessage` method */
	message: string;
	/** A brief description of the status code */
	description: string;
	/** The type of HTTP Status: `"informational"`, `"success"`, `"redirection"`, `"clientError`" or `"serverError"` */
	category: StatusCategory;
}
