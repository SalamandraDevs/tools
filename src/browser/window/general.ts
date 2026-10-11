/**
 * Closes an iframe by sending a message to the parent window
 */
export function closeIframe(origin: string = '*'): void {
  window.parent.postMessage({ action: 'closeIframe' }, origin);
}
