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
export function singleFlight<T>(operation: () => Promise<T>): () => Promise<T> {
  let inFlight: Promise<T> | undefined;

  return async (): Promise<T> => {
    // The first caller starts the operation; concurrent callers reuse the same promise.
    const current: Promise<T> = (inFlight ??= operation());

    try {
      return await current;
    } finally {
      // Clear only the promise this call joined, so a late awaiter cannot discard a newer run.
      if (inFlight === current) {
        inFlight = undefined;
      }
    }
  };
}
