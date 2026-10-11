/**
 * Coalesces concurrent calls to an async operation into a single in-flight execution.
 *
 * @remarks
 * Single flight (also called request coalescing or in-flight deduplication) ensures that
 * when several callers request the same work at the same time, the work runs once and every
 * caller awaits that one execution. The first caller starts the operation and stores its
 * promise; callers that arrive while it is still pending receive the same promise instead
 * of starting their own. Once the promise settles the stored reference is cleared, so the
 * next call after completion starts a fresh execution rather than serving a stale result.
 *
 * The clearing step guards on promise identity: a caller only clears the stored promise
 * when it is still the one that caller joined, so a late awaiter of a finished run never
 * discards a newer execution another caller has since started. Rejections propagate to
 * every joined caller and also clear the stored promise, so a failed run is not cached and
 * the next call retries.
 *
 * The returned function takes no arguments, because coalescing distinct arguments into one
 * result is ambiguous; it fits refresh-style work where every caller wants the same latest
 * state, such as reloading a cached document.
 * @group Shared
 * @category Concurrency
 * @example
 *
 * ```ts
 * class SigningKeyProvider {
 *   readonly #synchronize = singleFlight(() => this.#refreshSnapshot());
 *
 *   async getCurrentSigner(): Promise<SigningKeyHandle> {
 *     await this.#synchronize();
 *     // ...
 *   }
 *
 *   async #refreshSnapshot(): Promise<void> {
 *     // read the signing keys document and republish the snapshot
 *   }
 * }
 * ```
 *
 * @typeParam T - Value the operation resolves to; `void` for a side-effecting refresh.
 * @param operation - Async operation to run at most once per in-flight window.
 * @returns A function that, when called, returns the shared in-flight result, starting the
 *   operation only when none is currently running.
 */
export function singleFlight(operation) {
    let inFlight;
    return async () => {
        // The first caller starts the operation; concurrent callers reuse the same promise.
        const current = (inFlight ??= operation());
        try {
            return await current;
        }
        finally {
            // Clear only the promise this call joined, so a late awaiter cannot discard a newer run.
            if (inFlight === current) {
                inFlight = undefined;
            }
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY3VycmVuY3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2hhcmVkL2NvbmN1cnJlbmN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkNHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBSSxTQUEyQjtJQUN6RCxJQUFJLFFBQWdDLENBQUM7SUFFckMsT0FBTyxLQUFLLElBQWdCLEVBQUU7UUFDNUIsb0ZBQW9GO1FBQ3BGLE1BQU0sT0FBTyxHQUFlLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFFdkQsSUFBSSxDQUFDO1lBQ0gsT0FBTyxNQUFNLE9BQU8sQ0FBQztRQUN2QixDQUFDO2dCQUFTLENBQUM7WUFDVCx5RkFBeUY7WUFDekYsSUFBSSxRQUFRLEtBQUssT0FBTyxFQUFFLENBQUM7Z0JBQ3pCLFFBQVEsR0FBRyxTQUFTLENBQUM7WUFDdkIsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDLENBQUM7QUFDSixDQUFDIn0=