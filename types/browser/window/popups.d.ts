/**
 * Opens a popup window with specified dimensions and positioning
 * @param url - URL to open in popup
 * @param windowName - Name for the popup window
 * @param width - Width of popup window
 * @param height - Height of popup window
 * @returns Boolean indicating popup success or null if blocked
 */
export declare function openPopupWindow(url: string, windowName: string, width: number, height: number): boolean | null;
/**
 * Use this function to force the load of a route in the parent window that
 * originated a popup window. For example when the payment checkout window
 * loads in a popup windows using `window.open` and the summary route
 * has to be loaded in the parent window.
 * @param windowName - Name of the popup window
 * @param action - Action to perform on the parent window
 * @returns Boolean indicating if popup handler succeeded
 */
export declare function popupHandler(windowName: string, action: 'open' | 'close' | 'redirect'): boolean;
//# sourceMappingURL=popups.d.ts.map