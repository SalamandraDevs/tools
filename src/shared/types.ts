/**
 * Standard response body returned by the service APIs.
 *
 * - Message: Human-readable status or error description.
 * - Data: Payload on success, or `null` when none is available.
 *
 * @group Shared
 * @category HTTP
 * @template T - Expected response data type.
 */
export type ResponseBody<T> = {
  message: string;
  data: T | null;
};

/**
 * Response returned by {@link makeApiRequest}, pairing the native response with a normalized
 * body.
 *
 * - Response: Native `fetch` `Response`, retained for status and headers.
 * - Body: Response body normalized into the {@link ResponseBody} envelope.
 *
 * @group Shared
 * @category HTTP
 * @template T - Expected response data type.
 */
export type ApiResponse<T> = {
  response: Response;
  body: ResponseBody<T>;
};

export type ParsedResponse = {
  value: unknown;
  errorMessage: string | null;
};
