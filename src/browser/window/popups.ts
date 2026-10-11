/**
 * Opens a popup window with specified dimensions and positioning
 * @param url - URL to open in popup
 * @param windowName - Name for the popup window
 * @param width - Width of popup window
 * @param height - Height of popup window
 * @returns Boolean indicating popup success or null if blocked
 */
export function openPopupWindow(
  url: string,
  windowName: string,
  width: number,
  height: number
): boolean | null {
  // Calculate center position relative to current window
  const left: number = (window.innerWidth - width) / 2 + window.screenX;
  const top: number = (window.innerHeight - height) / 2 + window.screenY;

  const uniq: number = Date.now();
  const sep: string = url.includes('?') ? '&' : '?';
  const cleanUrl: string = `${url}${sep}cb=${String(uniq)}`;

  // Open popup with calculated positioning
  const newWindow: Window | null = window.open(
    cleanUrl,
    windowName,
    `width=${String(width)},height=${String(height)},left=${String(left)},top=${String(top)},resizable=yes,scrollbars=yes`
  );

  // Handle popup blocker case
  if (!newWindow) {
    return null;
  }

  // Ensure popup gets focus
  newWindow.focus();
  return true;
}

/**
 * Use this function to force the load of a route in the parent window that
 * originated a popup window. For example when the payment checkout window
 * loads in a popup windows using `window.open` and the summary route
 * has to be loaded in the parent window.
 * @param windowName - Name of the popup window
 * @param action - Action to perform on the parent window
 * @returns Boolean indicating if popup handler succeeded
 */
export function popupHandler(
  windowName: string,
  action: 'open' | 'close' | 'redirect'
): boolean {
  const currentUrl: string = window.location.href;
  const origin: string = '*';

  // Check if this code is running in the expected popup window
  if (!window.opener || window.name !== windowName) {
    return false;
  }

  // Handle different parent window types (iframe vs direct window)
  if (window.opener.self !== window.opener.top) {
    // Parent is in an iframe - use postMessage
    window.opener.parent.postMessage({ action: action, url: currentUrl }, origin);
  } else {
    // Parent is direct window - navigate directly
    window.opener.location.href = currentUrl;
  }

  // Close the popup after communication
  window.close();
  return true;
}
