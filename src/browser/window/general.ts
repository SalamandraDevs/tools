/**
 * Closes an iframe by sending a message to the parent window.
 * @param origin - Target origin passed to `postMessage`; defaults to `*` (any origin).
 */
export function closeIframe(origin: string = '*'): void {
  window.parent.postMessage({ action: 'closeIframe' }, origin);
}
