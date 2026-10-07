/**
 * Standard response body returned by the service APIs.
 * - message: Human-readable status or error description.
 * - data: Payload on success, or `null` when none is available.
 * @template T - Expected response data type.
 * @group Shared
 * @category HTTP
 */
export type ResponseBody<T> = {
  message: string;
  data: T | null;
};

/**
 * Response returned by {@link makeApiRequest}, pairing the native response with a normalized body.
 * - response: Native `fetch` `Response`, retained for status and headers.
 * - body: Response body normalized into the {@link ResponseBody} envelope.
 * @template T - Expected response data type.
 * @group Shared
 * @category HTTP
 */
export type ApiResponse<T> = {
  response: Response;
  body: ResponseBody<T>;
};

export type ParsedResponse = {
  value: unknown;
  errorMessage: string | null;
};
