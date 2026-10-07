import { CustomError } from './errors.js';
import { isResponseBody } from './typeguards.js';
import type { ResponseBody, ApiResponse, ParsedResponse } from './types.js';

const unknownError: string = 'An unknown error occurred, check api server connection';

/**
 * Performs an HTTP request with the Node.js `fetch` implementation and normalizes the result.
 * @template T - Expected response data type.
 * @param baseUrl - Base URL used to construct the request URL.
 * @param path - Relative or absolute path appended to the base URL.
 * @param options - Standard `fetch` request options.
 * @returns The native response paired with a body normalized into the {@link ResponseBody} envelope.
 * @throws {CustomError} API_CALL_ERROR when the request cannot reach the server.
 * @throws {CustomError} PARSE_RESPONSE_ERROR when the response body cannot be read as JSON or text.
 * @throws {CustomError} UNKNOWN_CONNECTION_ERROR when parsing fails for an unclassified reason.
 * @remarks
 * A transport failure (DNS, connection, timeout) is raised as an error, but an HTTP failure
 * status is not: it is returned in the {@link ResponseBody} with `data` set to `null` and the
 * status text as the message, so callers inspect `response.ok` rather than catching. Bodies
 * already in the platform envelope are passed through unchanged (detected by
 * {@link isResponseBody}); any other successful body is wrapped in the same envelope so callers
 * see one consistent shape whether or not the peer is a first-party service.
 * @example
 * ```ts
 * const { response, body } = await makeApiRequest<User>(baseUrl, '/users/me', { method: 'GET' });
 * if (!response.ok) throw new CustomError({ name: 'EXTERNAL_API_ERROR', message: body.message });
 * const user: User | null = body.data;
 * ```
 * @group Shared
 * @category HTTP
 */
export async function makeApiRequest<T>(
  baseUrl: string,
  path: string,
  options: RequestInit
): Promise<ApiResponse<T>> {
  let response: Response;

  try {
    response = await fetch(baseUrl + path, options);
  } catch (error: unknown) {
    throw new CustomError({
      name: 'API_CALL_ERROR',
      message: error instanceof Error ? error.message : unknownError,
      cause: error
    });
  }

  // Parse responde to extract data or error message
  const { value: parsedResponse, errorMessage } = await parseResponse(response);

  // Return calls that meets slmdevs response shape
  if (isResponseBody<T>(parsedResponse)) {
    return { response, body: parsedResponse };
  }

  // Calls that doesn't belong to slmdevs services.
  if (response.ok) {
    return {
      response,
      body: {
        message: 'API call succeeded, returning a third-party response body.',
        data: parsedResponse as T
      }
    };
  }

  // Return failed response that is not an error.
  return {
    response,
    body: {
      message: errorMessage ?? response.statusText,
      data: null
    }
  };
}

/**
 * Parses a response body and builds a message for HTTP failures.
 * @param response - Response whose body should be parsed.
 * @returns The parsed value and an HTTP error message when applicable.
 * @throws {CustomError} PARSE_RESPONSE_ERROR when both JSON parsing and the text fallback fail.
 * @throws {CustomError} UNKNOWN_CONNECTION_ERROR when parsing fails for an unclassified reason.
 */
async function parseResponse(response: Response): Promise<ParsedResponse> {
  try {
    const contentType: string | null = response.headers.get('content-type');
    const isJsonResponse: boolean = contentType?.includes('application/json') ?? false;
    let parsedResponse: unknown;

    if (isJsonResponse) {
      // A response body can only be consumed once, so keep a clone for text fallback.
      const responseClone: Response = response.clone();

      try {
        // Prefer structured data when the server declares a JSON response.
        parsedResponse = await response.json();
      } catch {
        try {
          // Malformed JSON is still useful as raw response text.
          parsedResponse = await responseClone.text();
        } catch (error: unknown) {
          // Normalize failures from both JSON parsing and text fallback.
          throw new CustomError({
            name: 'PARSE_RESPONSE_ERROR',
            message: error instanceof Error ? error.message : unknownError,
            cause: error
          });
        }
      }
    } else {
      // Non-JSON responses are returned as plain text.
      parsedResponse = await response.text();
    }

    if (response.ok) {
      return { value: parsedResponse, errorMessage: null };
    }

    let errorMessage: string = response.statusText;

    if (isJsonResponse) {
      if (
        typeof parsedResponse === 'object' &&
        parsedResponse !== null &&
        'message' in parsedResponse
      ) {
        errorMessage += `: ${String(parsedResponse.message)}`;
      } else {
        errorMessage += `: ${JSON.stringify(parsedResponse)}`;
      }
    } else {
      errorMessage += `: ${String(parsedResponse)}`;
    }

    return { value: parsedResponse, errorMessage };
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      throw error;
    }

    throw new CustomError({
      name: 'UNKNOWN_CONNECTION_ERROR',
      message: error instanceof Error ? error.message : unknownError,
      cause: error
    });
  }
}
