/**
 * Names used to classify application errors.
 *
 * @remarks
 * Every {@link CustomError} carries one of these literals as its `name`, so callers can
 * branch on classification without string parsing and API error handlers can map a name to
 * a status code. The trailing `TypeError` and `Error` members mirror the built-in names so
 * a normalized native error keeps a recognizable classification.
 * @group Shared
 * @category Errors
 */
export type ErrorName =
  | 'API_CALL_ERROR'
  | 'PARSE_RESPONSE_ERROR'
  | 'UNKNOWN_CONNECTION_ERROR'
  | 'EXTERNAL_API_ERROR'
  | 'ENV_VAR_ERROR'
  | 'CONFIG_ERROR'
  | 'AUTHENTICATION_FAILED'
  | 'AUTHORIZATION_DENIED'
  | 'OAUTH_FLOW_ERROR'
  | 'VALIDATION_ERROR'
  | 'DB_SCHEMA_CONVERTION_ERROR'
  | 'DB_DUPLICATE_KEY_ERROR'
  | 'DB_DATASET_ERROR'
  | 'DB_BACKEND_ERROR'
  | 'INTERNAL_ERROR'
  | 'KEYS_PROVIDER_ERROR'
  | 'ARCHITECTURE_NOT_IMPLEMENTED'
  | 'RESOURCE_NOT_FOUND'
  | 'TypeError'
  | 'Error';

/**
 * Reusable error messages shared across call sites that raise the same failure.
 *
 * @remarks
 * Keyed by a short stable code so distinct call sites report one identical wording; keeping
 * the text here avoids drift between the places that detect the same condition.
 * @group Shared
 * @category Errors
 */
export const errMessages: Record<string, string> = {
  DB_DUPLICATE_KEY: 'New record conflicts with an existing unique constraint'
};

/**
 * Parameters used to create a structured application error.
 *
 * - Name: Classification literal assigned to the error's `name`.
 * - Message: Human-readable description passed to the base `Error`.
 * - Cause: Optional underlying error or value retained as the `cause`.
 *
 * @group Shared
 * @category Errors
 */
export type ErrorParams = {
  name: ErrorName;
  message: string;
  cause?: unknown;
};

/**
 * Error with a caller-defined name and an optional underlying cause.
 *
 * @remarks
 * The structured constructor keeps error classification and causal context available
 * through a fixed set of literal {@link ErrorName} values, so consumers branch on `name`
 * rather than matching message text. Wrapping a caught error as the `cause` preserves the
 * original stack while re-classifying the failure at a boundary.
 * @group Shared
 * @category Errors
 * @example
 *
 * ```ts
 * try {
 *   await provider.fetch();
 * } catch (error: unknown) {
 *   throw new CustomError({
 *     name: 'EXTERNAL_API_ERROR',
 *     message: 'OAuth provider request failed',
 *     cause: error
 *   });
 * }
 * ```
 */
export class CustomError extends Error {
  /** Classification literal narrowing the base `Error` name to a known {@link ErrorName}. */
  override name: ErrorName;

  /**
   * Creates a structured application error.
   *
   * @param params - Error name, message, and optional underlying cause.
   */
  constructor(params: ErrorParams) {
    super(params.message, { cause: params.cause });
    this.name = params.name;
  }
}
