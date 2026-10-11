import type { ApiResponse } from './types.js';
/**
 * Performs an HTTP request with the Node.js `fetch` implementation and normalizes the
 * result.
 *
 * @remarks
 * A transport failure (DNS, connection, timeout) is raised as an error, but an HTTP failure
 * status is not: it is returned in the {@link ResponseBody} with `data` set to `null` and
 * the status text as the message, so callers inspect `response.ok` rather than catching.
 * Bodies already in the platform envelope are passed through unchanged (detected by
 * {@link isResponseBody}); any other successful body is wrapped in the same envelope so
 * callers see one consistent shape whether or not the peer is a first-party service.
 * @group Shared
 * @category HTTP
 * @example
 *
 * ```ts
 * const { response, body } = await makeApiRequest<User>(baseUrl, '/users/me', {
 *   method: 'GET'
 * });
 * if (!response.ok)
 *   throw new CustomError({ name: 'EXTERNAL_API_ERROR', message: body.message });
 * const user: User | null = body.data;
 * ```
 *
 * @template T - Expected response data type.
 * @param baseUrl - Base URL used to construct the request URL.
 * @param path - Relative or absolute path appended to the base URL.
 * @param options - Standard `fetch` request options.
 * @returns The native response paired with a body normalized into the {@link ResponseBody}
 *   envelope.
 * @throws {CustomError} API_CALL_ERROR when the request cannot reach the server.
 * @throws {CustomError} PARSE_RESPONSE_ERROR when the response body cannot be read as JSON
 *   or text.
 * @throws {CustomError} UNKNOWN_CONNECTION_ERROR when parsing fails for an unclassified
 *   reason.
 */
export declare function makeApiRequest<T>(baseUrl: string, path: string, options: RequestInit): Promise<ApiResponse<T>>;
//# sourceMappingURL=requests.d.ts.map