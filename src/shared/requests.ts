import { CustomError } from './errors.js';

/**
 * Standard response body returned by the service APIs.
 * @template T - Expected response data type.
 */
export type ResponseBody<T> = {
  message: string;
  data: T | null;
};

/**
 * Response returned by `makeApiRequest`.
 * @template T - Expected response data type.
 */
export type ApiResponse<T> = {
  response: Response;
  body: ResponseBody<T>;
};


type ParsedResponse = {
  value: unknown;
  errorMessage: string | null;
};

const unknownError: string = 'An unknown error occurred, check api server connection';

/**
 * Performs an HTTP request with the Node.js `fetch` implementation.
 *
 * JSON responses are parsed automatically, while non-JSON responses are
 * returned as text. Standard service response bodies are preserved; other
 * successful responses are wrapped in the same response shape. HTTP failures
 * are returned as response data, while network and unexpected failures are
 * raised as `CustomError` instances.
 * @template T - Expected response data type.
 * @param baseUrl - Base URL used to construct the request URL.
 * @param path - Relative or absolute path appended to the base URL.
 * @param options - Standard `fetch` request options.
 * @returns The native response and normalized response body.
 * @throws {CustomError} When the request cannot be completed or parsed.
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
 * @throws {CustomError} When response body parsing fails.
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
            message:  error instanceof Error ? error.message : unknownError,
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
      message: error instanceof Error ? error.message  : unknownError,
      cause: error
    });
  }
}

/**
 * Checks whether an unknown value is a standard service response body.
 * @template T - Expected response data type.
 * @param value - Value to inspect.
 * @returns `true` when the value has a string message and a data property.
 */
function isResponseBody<T>(value: unknown): value is ResponseBody<T> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return 'message' in value && typeof value.message === 'string' && 'data' in value;
}
