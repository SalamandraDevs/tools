import { CustomError } from './errors.js';
import { isResponseBody } from './typeguards.js';
const unknownError = 'An unknown error occurred, check api server connection';
/**
 * Performs an HTTP request with the Node.js `fetch` implementation and normalizes the
 * result.
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
export async function makeApiRequest(baseUrl, path, options) {
    let response;
    try {
        response = await fetch(baseUrl + path, options);
    }
    catch (error) {
        throw new CustomError({
            name: 'API_CALL_ERROR',
            message: error instanceof Error ? error.message : unknownError,
            cause: error
        });
    }
    // Parse responde to extract data or error message
    const { value: parsedResponse, errorMessage } = await parseResponse(response);
    // Return calls that meets slmdevs response shape
    if (isResponseBody(parsedResponse)) {
        return { response, body: parsedResponse };
    }
    // Calls that doesn't belong to slmdevs services.
    if (response.ok) {
        return {
            response,
            body: {
                message: 'API call succeeded, returning a third-party response body.',
                data: parsedResponse
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
 * @throws {CustomError} PARSE_RESPONSE_ERROR when both JSON parsing and the text fallback
 *   fail.
 * @throws {CustomError} UNKNOWN_CONNECTION_ERROR when parsing fails for an unclassified
 *   reason.
 */
async function parseResponse(response) {
    try {
        const contentType = response.headers.get('content-type');
        const isJsonResponse = contentType?.includes('application/json') ?? false;
        let parsedResponse;
        if (isJsonResponse) {
            // A response body can only be consumed once, so keep a clone for text fallback.
            const responseClone = response.clone();
            try {
                // Prefer structured data when the server declares a JSON response.
                parsedResponse = await response.json();
            }
            catch {
                try {
                    // Malformed JSON is still useful as raw response text.
                    parsedResponse = await responseClone.text();
                }
                catch (error) {
                    // Normalize failures from both JSON parsing and text fallback.
                    throw new CustomError({
                        name: 'PARSE_RESPONSE_ERROR',
                        message: error instanceof Error ? error.message : unknownError,
                        cause: error
                    });
                }
            }
        }
        else {
            // Non-JSON responses are returned as plain text.
            parsedResponse = await response.text();
        }
        if (response.ok) {
            return { value: parsedResponse, errorMessage: null };
        }
        let errorMessage = response.statusText;
        if (isJsonResponse) {
            if (typeof parsedResponse === 'object' &&
                parsedResponse !== null &&
                'message' in parsedResponse) {
                errorMessage += `: ${String(parsedResponse.message)}`;
            }
            else {
                errorMessage += `: ${JSON.stringify(parsedResponse)}`;
            }
        }
        else {
            errorMessage += `: ${String(parsedResponse)}`;
        }
        return { value: parsedResponse, errorMessage };
    }
    catch (error) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2hhcmVkL3JlcXVlc3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDMUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBR2pELE1BQU0sWUFBWSxHQUFXLHdEQUF3RCxDQUFDO0FBRXRGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQ0c7QUFDSCxNQUFNLENBQUMsS0FBSyxVQUFVLGNBQWMsQ0FDbEMsT0FBZSxFQUNmLElBQVksRUFDWixPQUFvQjtJQUVwQixJQUFJLFFBQWtCLENBQUM7SUFFdkIsSUFBSSxDQUFDO1FBQ0gsUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUFDLE9BQU8sS0FBYyxFQUFFLENBQUM7UUFDeEIsTUFBTSxJQUFJLFdBQVcsQ0FBQztZQUNwQixJQUFJLEVBQUUsZ0JBQWdCO1lBQ3RCLE9BQU8sRUFBRSxLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxZQUFZO1lBQzlELEtBQUssRUFBRSxLQUFLO1NBQ2IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGtEQUFrRDtJQUNsRCxNQUFNLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUUsR0FBRyxNQUFNLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUU5RSxpREFBaUQ7SUFDakQsSUFBSSxjQUFjLENBQUksY0FBYyxDQUFDLEVBQUUsQ0FBQztRQUN0QyxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBRUQsaURBQWlEO0lBQ2pELElBQUksUUFBUSxDQUFDLEVBQUUs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