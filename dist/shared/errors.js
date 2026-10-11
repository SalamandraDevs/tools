/**
 * Reusable error messages shared across call sites that raise the same failure.
 *
 * @remarks
 * Keyed by a short stable code so distinct call sites report one identical wording; keeping
 * the text here avoids drift between the places that detect the same condition.
 * @group Shared
 * @category Errors
 */
export const errMessages = {
    DB_DUPLICATE_KEY: 'New record conflicts with an existing unique constraint'
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
    name;
    /**
     * Creates a structured application error.
     *
     * @param params - Error name, message, and optional underlying cause.
     */
    constructor(params) {
        super(params.message, { cause: params.cause });
        this.name = params.name;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NoYXJlZC9lcnJvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBaUNBOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUEyQjtJQUNqRCxnQkFBZ0IsRUFBRSx5REFBeUQ7Q0FDNUUsQ0FBQztBQWtCRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Qkc7QUFDSCxNQUFNLE9BQU8sV0FBWSxTQUFRLEtBQUs7SUFDcEMsMkZBQTJGO0lBQ2xGLElBQUksQ0FBWTtJQUV6Qjs7OztPQUlHO0lBQ0gsWUFBWSxNQUFtQjtRQUM3QixLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDMUIsQ0FBQztDQUNGIn0=