/**
 * Opens a popup window with specified dimensions and positioning
 *
 * @param url - URL to open in popup
 * @param windowName - Name for the popup window
 * @param width - Width of popup window
 * @param height - Height of popup window
 * @returns Boolean indicating popup success or null if blocked
 */
export function openPopupWindow(url, windowName, width, height) {
    // Calculate center position relative to current window
    const left = (window.innerWidth - width) / 2 + window.screenX;
    const top = (window.innerHeight - height) / 2 + window.screenY;
    const uniq = Date.now();
    const sep = url.includes('?') ? '&' : '?';
    const cleanUrl = `${url}${sep}cb=${String(uniq)}`;
    // Open popup with calculated positioning
    const newWindow = window.open(cleanUrl, windowName, `width=${String(width)},height=${String(height)},left=${String(left)},top=${String(top)},resizable=yes,scrollbars=yes`);
    // Handle popup blocker case
    if (!newWindow) {
        return null;
    }
    // Ensure popup gets focus
    newWindow.focus();
    return true;
}
/**
 * Use this function to force the load of a route in the parent window that originated a
 * popup window. For example when the payment checkout window loads in a popup windows using
 * `window.open` and the summary route has to be loaded in the parent window.
 *
 * @param windowName - Name of the popup window
 * @param action - Action to perform on the parent window
 * @returns Boolean indicating if popup handler succeeded
 */
export function popupHandler(windowName, action) {
    const currentUrl = window.location.href;
    const origin = '*';
    // Check if this code is running in the expected popup window
    if (!window.opener || window.name !== windowName) {
        return false;
    }
    // Handle different parent window types (iframe vs direct window)
    if (window.opener.self !== window.opener.top) {
        // Parent is in an iframe - use postMessage
        window.opener.parent.postMessage({ action: action, url: currentUrl }, origin);
    }
    else {
        // Parent is direct window - navigate directly
        window.opener.location.href = currentUrl;
    }
    // Close the popup after communication
    window.close();
    return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXBzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2Jyb3dzZXIvd2luZG93L3BvcHVwcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sVUFBVSxlQUFlLENBQzdCLEdBQVcsRUFDWCxVQUFrQixFQUNsQixLQUFhLEVBQ2IsTUFBYztJQUVkLHVEQUF1RDtJQUN2RCxNQUFNLElBQUksR0FBVyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDdEUsTUFBTSxHQUFHLEdBQVcsQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO0lBRXZFLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNoQyxNQUFNLEdBQUcsR0FBVyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNsRCxNQUFNLFFBQVEsR0FBVyxHQUFHLEdBQUcsR0FBRyxHQUFHLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7SUFFMUQseUNBQXlDO0lBQ3pDLE1BQU0sU0FBUyxHQUFrQixNQUFNLENBQUMsSUFBSSxDQUMxQyxRQUFRLEVBQ1IsVUFBVSxFQUNWLFNBQVMsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FDdkgsQ0FBQztJQUVGLDRCQUE0QjtJQUM1QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDZixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCwwQkFBMEI7SUFDMUIsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2xCLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FDMUIsVUFBa0IsRUFDbEIsTUFBcUM7SUFFckMsTUFBTSxVQUFVLEdBQVcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDaEQsTUFBTSxNQUFNLEdBQVcsR0FBRyxDQUFDO0lBRTNCLDZEQUE2RDtJQUM3RCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBRSxDQUFDO1FBQ2pELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELGlFQUFpRTtJQUNqRSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDN0MsMkNBQTJDO1FBQzNDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2hGLENBQUM7U0FBTSxDQUFDO1FBQ04sOENBQThDO1FBQzlDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7SUFDM0MsQ0FBQztJQUVELHNDQUFzQztJQUN0QyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZixPQUFPLElBQUksQ0FBQztBQUNkLENBQUMifQ==