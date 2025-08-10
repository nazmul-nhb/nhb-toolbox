/** Data for HTTP Status Codes */
export const HTTP_STATUS_DATA = [
	{
		category: 'informational',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/100',
		code: 100,
		name: 'CONTINUE',
		readableName: 'Continue',
		message: 'Continue the request',
		description:
			'This interim response indicates that the client should continue the request or ignore the response if the request is already finished.',
	},
	{
		category: 'informational',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/101',
		code: 101,
		name: 'SWITCHING_PROTOCOLS',
		readableName: 'Switching Protocols',
		message: 'Switching Protocols',
		description:
			'This code is sent in response to an Upgrade request header from the client and indicates the protocol the server is switching to.',
	},
	{
		category: 'informational',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/102',
		code: 102,
		name: 'PROCESSING',
		readableName: 'Processing',
		message: 'Processing',
		description:
			'This code was used in WebDAV contexts to indicate that a request has been received by the server, but no status was available at the time of the response.',
	},
	{
		category: 'informational',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/103',
		code: 103,
		name: 'EARLY_HINTS',
		readableName: 'Early Hints',
		message: 'Early Hints',
		description:
			'This status code is primarily intended to be used with the Link header, letting the user agent start preloading resources while the server prepares a response or preconnect to an origin from which the page will need resources.',
	},
	{
		category: 'success',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/200',
		code: 200,
		name: 'OK',
		readableName: 'Ok',
		message: 'The request succeeded',
		description:
			'The request succeeded. The result and meaning of "success" depends on the HTTP method: GET: The resource has been fetched and transmitted in the message body. HEAD: Representation headers are included in the response without any message body. PUT or POST: The resource describing the result of the action is transmitted in the message body. TRACE: The message body contains the request as received by the server.',
	},
	{
		category: 'success',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/201',
		code: 201,
		name: 'CREATED',
		readableName: 'Created',
		message: 'The request succeeded, and a new resource was created',
		description:
			'The request succeeded, and a new resource was created as a result. This is typically the response sent after POST requests, or some PUT requests.',
	},
	{
		category: 'success',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/202',
		code: 202,
		name: 'ACCEPTED',
		readableName: 'Accepted',
		message: 'The request has been received but not yet acted upon',
		description:
			'The request has been received but not yet acted upon. It is noncommittal, since there is no way in HTTP to later send an asynchronous response indicating the outcome of the request. It is intended for cases where another process or server handles the request, or for batch processing.',
	},
	{
		category: 'success',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/203',
		code: 203,
		name: 'NON_AUTHORITATIVE_INFORMATION',
		readableName: 'Non-Authoritative Information',
		message: 'Non-Authoritative Information',
		description:
			'This response code means the returned metadata is not exactly the same as is available from the origin server, but is collected from a local or a third-party copy. This is mostly used for mirrors or backups of another resource. Except for that specific case, the 200 OK response is preferred to this status.',
	},
	{
		category: 'success',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/204',
		code: 204,
		name: 'NO_CONTENT',
		readableName: 'No Content',
		message: 'There is no content to send for this request',
		description:
			'There is no content to send for this request, but the headers are useful. The user agent may update its cached headers for this resource with the new ones.',
	},
	{
		category: 'success',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/205',
		code: 205,
		name: 'RESET_CONTENT',
		readableName: 'Reset Content',
		message: 'Reset Content',
		description:
			'Tells the user agent to reset the document which sent this request.',
	},
	{
		category: 'success',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/206',
		code: 206,
		name: 'PARTIAL_CONTENT',
		readableName: 'Partial Content',
		message: 'Partial Content',
		description:
			'This response code is used in response to a range request when the client has requested a part or parts of a resource.',
	},
	{
		category: 'success',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/207',
		code: 207,
		name: 'MULTI_STATUS',
		readableName: 'Multi-Status',
		message: 'Multi-Status',
		description:
			'Conveys information about multiple resources, for situations where multiple status codes might be appropriate.',
	},
	{
		category: 'success',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/208',
		code: 208,
		name: 'ALREADY_REPORTED',
		readableName: 'Already Reported',
		message: 'Already Reported',
		description:
			'Used inside a "<dav:propstat>" response element to avoid repeatedly enumerating the internal members of multiple bindings to the same collection.',
	},
	{
		category: 'success',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/226',
		code: 226,
		name: 'IM_USED',
		readableName: 'IM Used',
		message: 'Instance-Manipulations applied to the current instance',
		description:
			'The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.',
	},
	{
		category: 'redirection',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/300',
		code: 300,
		name: 'MULTIPLE_CHOICES',
		readableName: 'Multiple Choices',
		message: 'Multiple Choices',
		description:
			'In agent-driven content negotiation, the request has more than one possible response and the user agent or user should choose one of them. There is no standardized way for clients to automatically choose one of the responses, so this is rarely used.',
	},
	{
		category: 'redirection',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/301',
		code: 301,
		name: 'MOVED_PERMANENTLY',
		readableName: 'Moved Permanently',
		message:
			'The URL of the requested resource has been changed permanently',
		description:
			'The URL of the requested resource has been changed permanently. The new URL is given in the response.',
	},
	{
		category: 'redirection',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/302',
		code: 302,
		name: 'FOUND',
		readableName: 'Found',
		message: 'URI of requested resource has been changed temporarily',
		description:
			'This response code means that the URI of requested resource has been changed temporarily. Further changes in the URI might be made in the future, so the same URI should be used by the client in future requests.',
	},
	{
		category: 'redirection',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/303',
		code: 303,
		name: 'SEE_OTHER',
		readableName: 'See Other',
		message: 'See Other',
		description:
			'The server sent this response to direct the client to get the requested resource at another URI with a GET request.',
	},
	{
		category: 'redirection',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/304',
		code: 304,
		name: 'NOT_MODIFIED',
		readableName: 'Not Modified',
		message: 'Not Modified',
		description:
			'This is used for caching purposes. It tells the client that the response has not been modified, so the client can continue to use the same cached version of the response.',
	},
	{
		category: 'redirection',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status#305_use_proxy',
		code: 305,
		name: 'USE_PROXY',
		readableName: 'Use Proxy',
		message: 'Use Proxy',
		description:
			'Defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy. It has been deprecated due to security concerns regarding in-band configuration of a proxy.',
	},
	{
		category: 'redirection',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status#306_unused',
		code: 306,
		name: 'UNUSED',
		readableName: 'unused',
		message: 'unused',
		description:
			'This response code is no longer used; but is reserved. It was used in a previous version of the HTTP/1.1 specification.',
	},
	{
		category: 'redirection',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/307',
		code: 307,
		name: 'TEMPORARY_REDIRECT',
		readableName: 'Temporary Redirect',
		message: 'Temporary Redirect',
		description:
			'The server sends this response to direct the client to get the requested resource at another URI with the same method that was used in the prior request. This has the same semantics as the 302 Found response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the redirected request.',
	},
	{
		category: 'redirection',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/308',
		code: 308,
		name: 'PERMANENT_REDIRECT',
		readableName: 'Permanent Redirect',
		message: 'Permanent Redirect',
		description:
			'This means that the resource is now permanently located at another URI, specified by the Location response header. This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/400',
		code: 400,
		name: 'BAD_REQUEST',
		readableName: 'Bad Request',
		message: 'Bad Request',
		description:
			'The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/401',
		code: 401,
		name: 'UNAUTHORIZED',
		readableName: 'Unauthorized',
		message: 'Unauthorized request',
		description:
			'Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/402',
		code: 402,
		name: 'PAYMENT_REQUIRED',
		readableName: 'Payment Required',
		message: 'Payment Required',
		description:
			'The initial purpose of this code was for digital payment systems, however this status code is rarely used and no standard convention exists.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/403',
		code: 403,
		name: 'FORBIDDEN',
		readableName: 'Forbidden',
		message: 'Forbidden request',
		description:
			"The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401 Unauthorized, the client's identity is known to the server.",
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/404',
		code: 404,
		name: 'NOT_FOUND',
		readableName: 'Not Found',
		message: 'Not Found',
		description:
			'The server cannot find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 Forbidden to hide the existence of a resource from an unauthorized client. This response code is probably the most well known due to its frequent occurrence on the web.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/405',
		code: 405,
		name: 'METHOD_NOT_ALLOWED',
		readableName: 'Method Not Allowed',
		message: 'Method Not Allowed',
		description:
			'The request method is known by the server but is not supported by the target resource. For example, an API may not allow DELETE on a resource, or the TRACE method entirely.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/406',
		code: 406,
		name: 'NOT_ACCEPTABLE',
		readableName: 'Not Acceptable',
		message: 'Not Acceptable',
		description:
			"This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content that conforms to the criteria given by the user agent.",
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/407',
		code: 407,
		name: 'PROXY_AUTHENTICATION_REQUIRED',
		readableName: 'Proxy Authentication Required',
		message: 'Proxy Authentication Required',
		description:
			'This is similar to 401 Unauthorized but authentication is needed to be done by a proxy.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/408',
		code: 408,
		name: 'REQUEST_TIMEOUT',
		readableName: 'Request Timeout',
		message: 'Request Timeout',
		description:
			'This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers use HTTP pre-connection mechanisms to speed up browsing. Some servers may shut down a connection without sending this message.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/409',
		code: 409,
		name: 'CONFLICT',
		readableName: 'Conflict',
		message: 'Conflict',
		description:
			'This response is sent when a request conflicts with the current state of the server. In WebDAV remote web authoring, 409 responses are errors sent to the client so that a user might be able to resolve a conflict and resubmit the request.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/410',
		code: 410,
		name: 'GONE',
		readableName: 'Gone',
		message: 'Content has been permanently deleted',
		description:
			'This response is sent when the requested content has been permanently deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/411',
		code: 411,
		name: 'LENGTH_REQUIRED',
		readableName: 'Length Required',
		message: 'Length Required',
		description:
			'Server rejected the request because the Content-Length header field is not defined and the server requires it.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/412',
		code: 412,
		name: 'PRECONDITION_FAILED',
		readableName: 'Precondition Failed',
		message: 'Precondition Failed',
		description:
			'In conditional requests, the client has indicated preconditions in its headers which the server does not meet.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/413',
		code: 413,
		name: 'CONTENT_TOO_LARGE',
		readableName: 'Content Too Large',
		message: 'Content Too Large',
		description:
			'The request body is larger than limits defined by server. The server might close the connection or return an Retry-After header field.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/414',
		code: 414,
		name: 'URI_TOO_LONG',
		readableName: 'URI Too Long',
		message: 'URI Too Long',
		description:
			'The URI requested by the client is longer than the server is willing to interpret.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/415',
		code: 415,
		name: 'UNSUPPORTED_MEDIA_TYPE',
		readableName: 'Unsupported Media Type',
		message: 'Unsupported Media Type',
		description:
			'The media format of the requested data is not supported by the server, so the server is rejecting the request.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/416',
		code: 416,
		name: 'RANGE_NOT_SATISFIABLE',
		readableName: 'Range Not Satisfiable',
		message: 'Range Not Satisfiable',
		description:
			"The ranges specified by the Range header field in the request cannot be fulfilled. It's possible that the range is outside the size of the target resource's data.",
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/417',
		code: 417,
		name: 'EXPECTATION_FAILED',
		readableName: 'Expectation Failed',
		message: 'Expectation Failed',
		description:
			'This response code means the expectation indicated by the Expect request header field cannot be met by the server.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/418',
		code: 418,
		name: 'I_M_A_TEAPOT',
		readableName: "I'm a teapot",
		message: "I'm a teapot",
		description:
			'The server refuses the attempt to brew coffee with a teapot.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/421',
		code: 421,
		name: 'MISDIRECTED_REQUEST',
		readableName: 'Misdirected Request',
		message: 'Misdirected Request',
		description:
			'The request was directed at a server that is not able to produce a response. This can be sent by a server that is not configured to produce responses for the combination of scheme and authority that are included in the request URI.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/422',
		code: 422,
		name: 'UNPROCESSABLE_CONTENT',
		readableName: 'Unprocessable Content',
		message: 'Unprocessable Content',
		description:
			'The request was well-formed but was unable to be followed due to semantic errors.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/423',
		code: 423,
		name: 'LOCKED',
		readableName: 'Locked',
		message: 'The resource is locked',
		description: 'The resource that is being accessed is locked.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/424',
		code: 424,
		name: 'FAILED_DEPENDENCY',
		readableName: 'Failed Dependency',
		message: 'Failed Dependency',
		description: 'The request failed due to failure of a previous request.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/425',
		code: 425,
		name: 'TOO_EARLY',
		readableName: 'Too Early',
		message: 'Too Early',
		description:
			'Indicates that the server is unwilling to risk processing a request that might be replayed.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/426',
		code: 426,
		name: 'UPGRADE_REQUIRED',
		readableName: 'Upgrade Required',
		message: 'Upgrade Required',
		description:
			'The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol. The server sends an Upgrade header in a 426 response to indicate the required protocol(s).',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/428',
		code: 428,
		name: 'PRECONDITION_REQUIRED',
		readableName: 'Precondition Required',
		message: 'Precondition Required',
		description:
			"The origin server requires the request to be conditional. This response is intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.",
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429',
		code: 429,
		name: 'TOO_MANY_REQUESTS',
		readableName: 'Too Many Requests',
		message: 'Too Many Requests',
		description:
			'The user has sent too many requests in a given amount of time (rate limiting).',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/431',
		code: 431,
		name: 'REQUEST_HEADER_FIELDS_TOO_LARGE',
		readableName: 'Request Header Fields Too Large',
		message: 'Request Header Fields Too Large',
		description:
			'The server is unwilling to process the request because its header fields are too large. The request may be resubmitted after reducing the size of the request header fields.',
	},
	{
		category: 'clientError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/451',
		code: 451,
		name: 'UNAVAILABLE_FOR_LEGAL_REASONS',
		readableName: 'Unavailable For Legal Reasons',
		message: 'Unavailable For Legal Reasons',
		description:
			'The user agent requested a resource that cannot legally be provided, such as a web page censored by a government.',
	},
	{
		category: 'serverError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/500',
		code: 500,
		name: 'INTERNAL_SERVER_ERROR',
		readableName: 'Internal Server Error',
		message: 'Internal Server Error',
		description:
			'The server has encountered a situation it does not know how to handle. This error is generic, indicating that the server cannot find a more appropriate 5XX status code to respond with.',
	},
	{
		category: 'serverError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/501',
		code: 501,
		name: 'NOT_IMPLEMENTED',
		readableName: 'Not Implemented',
		message: 'Not Implemented',
		description:
			'The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.',
	},
	{
		category: 'serverError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/502',
		code: 502,
		name: 'BAD_GATEWAY',
		readableName: 'Bad Gateway',
		message: 'Bad Gateway',
		description:
			'This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.',
	},
	{
		category: 'serverError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/503',
		code: 503,
		name: 'SERVICE_UNAVAILABLE',
		readableName: 'Service Unavailable',
		message: 'Service Unavailable',
		description:
			'The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This response should be used for temporary conditions and the Retry-After HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.',
	},
	{
		category: 'serverError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/504',
		code: 504,
		name: 'GATEWAY_TIMEOUT',
		readableName: 'Gateway Timeout',
		message: 'Gateway Timeout',
		description:
			'This error response is given when the server is acting as a gateway and cannot get a response in time.',
	},
	{
		category: 'serverError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/505',
		code: 505,
		name: 'HTTP_VERSION_NOT_SUPPORTED',
		readableName: 'HTTP Version Not Supported',
		message: 'HTTP Version Not Supported',
		description:
			'The HTTP version used in the request is not supported by the server.',
	},
	{
		category: 'serverError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/506',
		code: 506,
		name: 'VARIANT_ALSO_NEGOTIATES',
		readableName: 'Variant Also Negotiates',
		message: 'Variant Also Negotiates',
		description:
			'The server has an internal configuration error: during content negotiation, the chosen variant is configured to engage in content negotiation itself, which results in circular references when creating responses.',
	},
	{
		category: 'serverError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/507',
		code: 507,
		name: 'INSUFFICIENT_STORAGE',
		readableName: 'Insufficient Storage',
		message: 'Insufficient Storage',
		description:
			'The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.',
	},
	{
		category: 'serverError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/508',
		code: 508,
		name: 'LOOP_DETECTED',
		readableName: 'Loop Detected',
		message: 'Detected an infinite loop',
		description:
			'The server detected an infinite loop while processing the request.',
	},
	{
		category: 'serverError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/510',
		code: 510,
		name: 'NOT_EXTENDED',
		readableName: 'Not Extended',
		message: 'Not Extended',
		description:
			'The client request declares an HTTP Extension (RFC 2774) that should be used to process the request, but the extension is not supported.',
	},
	{
		category: 'serverError',
		link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/511',
		code: 511,
		name: 'NETWORK_AUTHENTICATION_REQUIRED',
		readableName: 'Network Authentication Required',
		message: 'Network Authentication Required',
		description:
			'Indicates that the client needs to authenticate to gain network access.',
	},
] as const;

/** List of HTTPS STATUS NAMES WITH CODES */
export const HTTP_STATUS_CODES = {
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/100 Continue}
	 * - This interim response indicates that the client should continue the request or ignore the response if the request is already finished.
	 */
	CONTINUE: 100,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/101 Switching Protocols}
	 * - This code is sent in response to an Upgrade request header from the client and indicates the protocol the server is switching to.
	 */
	SWITCHING_PROTOCOLS: 101,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/102 Processing}
	 * @deprecated This code was used in WebDAV contexts to indicate that a request has been received by the server, but no status was available at the time of the response.
	 */
	PROCESSING: 102,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/103 Early Hints}
	 * - This status code is primarily intended to be used with the Link header, letting the user agent start preloading resources while the server prepares a response or preconnect to an origin from which the page will need resources.
	 */
	EARLY_HINTS: 103,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/200 OK}
	 * - The request succeeded. The result and meaning of "success" depends on the HTTP method:
	 *   - GET: The resource has been fetched and transmitted in the message body.
	 *   - HEAD: Representation headers are included in the response without any message body.
	 *   - PUT or POST: The resource describing the result of the action is transmitted in the message body.
	 *   - TRACE: The message body contains the request as received by the server.
	 */
	OK: 200,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/201 Created}
	 * - The request succeeded, and a new resource was created as a result. This is typically the response sent after POST requests, or some PUT requests.
	 */
	CREATED: 201,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/202 Accepted}
	 * - The request has been received but not yet acted upon. It is noncommittal, since there is no way in HTTP to later send an asynchronous response indicating the outcome of the request. It is intended for cases where another process or server handles the request, or for batch processing.
	 */
	ACCEPTED: 202,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/203 Non-Authoritative Information}
	 * - This response code means the returned metadata is not exactly the same as is available from the origin server, but is collected from a local or a third-party copy. This is mostly used for mirrors or backups of another resource. Except for that specific case, the 200 OK response is preferred to this status.
	 */
	NON_AUTHORITATIVE_INFORMATION: 203,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/204 No Content}
	 * - There is no content to send for this request, but the headers are useful. The user agent may update its cached headers for this resource with the new ones.
	 */
	NO_CONTENT: 204,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/205 Reset Content}
	 * - Tells the user agent to reset the document which sent this request.
	 */
	RESET_CONTENT: 205,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/206 Partial Content}
	 * - This response code is used in response to a range request when the client has requested a part or parts of a resource.
	 */
	PARTIAL_CONTENT: 206,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/207 Multi-Status}
	 * - Conveys information about multiple resources, for situations where multiple status codes might be appropriate.
	 */
	MULTI_STATUS: 207,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/208 Already Reported}
	 * - Used inside a `<dav:propstat>` response element to avoid repeatedly enumerating the internal members of multiple bindings to the same collection.
	 */
	ALREADY_REPORTED: 208,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/226 IM Used}
	 * - The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.
	 */
	IM_USED: 226,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/300 Multiple Choices}
	 * - In agent-driven content negotiation, the request has more than one possible response and the user agent or user should choose one of them. There is no standardized way for clients to automatically choose one of the responses, so this is rarely used.
	 */
	MULTIPLE_CHOICES: 300,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/301 Moved Permanently}
	 * - The URL of the requested resource has been changed permanently. The new URL is given in the response.
	 */
	MOVED_PERMANENTLY: 301,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/302 Found}
	 * - This response code means that the URI of requested resource has been changed temporarily. Further changes in the URI might be made in the future, so the same URI should be used by the client in future requests.
	 */
	FOUND: 302,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/303 See Other}
	 * - The server sent this response to direct the client to get the requested resource at another URI with a GET request.
	 */
	SEE_OTHER: 303,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/304 Not Modified}
	 * - This is used for caching purposes. It tells the client that the response has not been modified, so the client can continue to use the same cached version of the response.
	 */
	NOT_MODIFIED: 304,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status#305_use_proxy Use Proxy}
	 * @deprecated Defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy. It has been deprecated due to security concerns regarding in-band configuration of a proxy.
	 */
	USE_PROXY: 305,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status#306_unused unused}
	 * @deprecated This response code is no longer used; but is reserved. It was used in a previous version of the HTTP/1.1 specification.
	 */
	UNUSED: 306,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/307 Temporary Redirect}
	 * - The server sends this response to direct the client to get the requested resource at another URI with the same method that was used in the prior request. This has the same semantics as the 302 Found response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the redirected request.
	 */
	TEMPORARY_REDIRECT: 307,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/308 Permanent Redirect}
	 * - This means that the resource is now permanently located at another URI, specified by the Location response header. This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
	 */
	PERMANENT_REDIRECT: 308,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/400 Bad Request}
	 * - The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
	 */
	BAD_REQUEST: 400,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/401 Unauthorized}
	 * - Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
	 */
	UNAUTHORIZED: 401,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/402 Payment Required}
	 * - The initial purpose of this code was for digital payment systems, however this status code is rarely used and no standard convention exists.
	 */
	PAYMENT_REQUIRED: 402,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/403 Forbidden}
	 * - The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401 Unauthorized, the client's identity is known to the server.
	 */
	FORBIDDEN: 403,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/404 Not Found}
	 * - The server cannot find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 Forbidden to hide the existence of a resource from an unauthorized client. This response code is probably the most well known due to its frequent occurrence on the web.
	 */
	NOT_FOUND: 404,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/405 Method Not Allowed}
	 * - The request method is known by the server but is not supported by the target resource. For example, an API may not allow DELETE on a resource, or the TRACE method entirely.
	 */
	METHOD_NOT_ALLOWED: 405,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/406 Not Acceptable}
	 * - This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content that conforms to the criteria given by the user agent.
	 */
	NOT_ACCEPTABLE: 406,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/407 Proxy Authentication Required}
	 * - This is similar to 401 Unauthorized but authentication is needed to be done by a proxy.
	 */
	PROXY_AUTHENTICATION_REQUIRED: 407,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/408 Request Timeout}
	 * - This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers use HTTP pre-connection mechanisms to speed up browsing. Some servers may shut down a connection without sending this message.
	 */
	REQUEST_TIMEOUT: 408,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/409 Conflict}
	 * - This response is sent when a request conflicts with the current state of the server. In WebDAV remote web authoring, 409 responses are errors sent to the client so that a user might be able to resolve a conflict and resubmit the request.
	 */
	CONFLICT: 409,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/410 Gone}
	 * - This response is sent when the requested content has been permanently deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code.
	 */
	GONE: 410,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/411 Length Required}
	 * - Server rejected the request because the Content-Length header field is not defined and the server requires it.
	 */
	LENGTH_REQUIRED: 411,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/412 Precondition Failed}
	 * - In conditional requests, the client has indicated preconditions in its headers which the server does not meet.
	 */
	PRECONDITION_FAILED: 412,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/413 Content Too Large}
	 * - The request body is larger than limits defined by server. The server might close the connection or return an Retry-After header field.
	 */
	CONTENT_TOO_LARGE: 413,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/414 URI Too Long}
	 * - The URI requested by the client is longer than the server is willing to interpret.
	 */
	URI_TOO_LONG: 414,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/415 Unsupported Media Type}
	 * - The media format of the requested data is not supported by the server, so the server is rejecting the request.
	 */
	UNSUPPORTED_MEDIA_TYPE: 415,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/416 Range Not Satisfiable}
	 * - The ranges specified by the Range header field in the request cannot be fulfilled. It's possible that the range is outside the size of the target resource's data.
	 */
	RANGE_NOT_SATISFIABLE: 416,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/417 Expectation Failed}
	 * - This response code means the expectation indicated by the Expect request header field cannot be met by the server.
	 */
	EXPECTATION_FAILED: 417,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/418 I'm a teapot}
	 * - The server refuses the attempt to brew coffee with a teapot.
	 */
	I_M_A_TEAPOT: 418,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/421 Misdirected Request}
	 * - The request was directed at a server that is not able to produce a response. This can be sent by a server that is not configured to produce responses for the combination of scheme and authority that are included in the request URI.
	 */
	MISDIRECTED_REQUEST: 421,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/422 Unprocessable Content}
	 * - The request was well-formed but was unable to be followed due to semantic errors.
	 */
	UNPROCESSABLE_CONTENT: 422,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/423 Locked}
	 * - The resource that is being accessed is locked.
	 */
	LOCKED: 423,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/424 Failed Dependency}
	 * - The request failed due to failure of a previous request.
	 */
	FAILED_DEPENDENCY: 424,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/425 Too Early}
	 * - Indicates that the server is unwilling to risk processing a request that might be replayed.
	 */
	TOO_EARLY: 425,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/426 Upgrade Required}
	 * - The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol. The server sends an Upgrade header in a 426 response to indicate the required protocol(s).
	 */
	UPGRADE_REQUIRED: 426,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/428 Precondition Required}
	 * - The origin server requires the request to be conditional. This response is intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.
	 */
	PRECONDITION_REQUIRED: 428,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429 Too Many Requests}
	 * - The user has sent too many requests in a given amount of time (rate limiting).
	 */
	TOO_MANY_REQUESTS: 429,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/431 Request Header Fields Too Large}
	 * - The server is unwilling to process the request because its header fields are too large. The request may be resubmitted after reducing the size of the request header fields.
	 */
	REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/451 Unavailable For Legal Reasons}
	 * - The user agent requested a resource that cannot legally be provided, such as a web page censored by a government.
	 */
	UNAVAILABLE_FOR_LEGAL_REASONS: 451,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/500 Internal Server Error}
	 * - The server has encountered a situation it does not know how to handle. This error is generic, indicating that the server cannot find a more appropriate 5XX status code to respond with.
	 */
	INTERNAL_SERVER_ERROR: 500,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/501 Not Implemented}
	 * - The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.
	 */
	NOT_IMPLEMENTED: 501,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/502 Bad Gateway}
	 * - This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.
	 */
	BAD_GATEWAY: 502,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/503 Service Unavailable}
	 * - The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This response should be used for temporary conditions and the Retry-After HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.
	 */
	SERVICE_UNAVAILABLE: 503,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/504 Gateway Timeout}
	 * - This error response is given when the server is acting as a gateway and cannot get a response in time.
	 */
	GATEWAY_TIMEOUT: 504,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/505 HTTP Version Not Supported}
	 * - The HTTP version used in the request is not supported by the server.
	 */
	HTTP_VERSION_NOT_SUPPORTED: 505,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/506 Variant Also Negotiates}
	 * - The server has an internal configuration error: during content negotiation, the chosen variant is configured to engage in content negotiation itself, which results in circular references when creating responses.
	 */
	VARIANT_ALSO_NEGOTIATES: 506,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/507 Insufficient Storage}
	 * - The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.
	 */
	INSUFFICIENT_STORAGE: 507,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/508 Loop Detected}
	 * - The server detected an infinite loop while processing the request.
	 */
	LOOP_DETECTED: 508,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/510 Not Extended}
	 * - The client request declares an HTTP Extension (RFC 2774) that should be used to process the request, but the extension is not supported.
	 */
	NOT_EXTENDED: 510,
	/**
	 * * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/511 Network Authentication Required}
	 * - Indicates that the client needs to authenticate to gain network access.
	 */
	NETWORK_AUTHENTICATION_REQUIRED: 511,
} as const;
