/**
 * Opens a popup window with specified dimensions and positioning
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
 * Use this function to force the load of a route in the parent window that
 * originated a popup window. For example when the payment checkout window
 * loads in a popup windows using `window.open` and the summary route
 * has to be loaded in the parent window.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXBzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2Jyb3dzZXIvd2luZG93L3BvcHVwcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztHQU9HO0FBQ0gsTUFBTSxVQUFVLGVBQWUsQ0FDN0IsR0FBVyxFQUNYLFVBQWtCLEVBQ2xCLEtBQWEsRUFDYixNQUFjO0lBRWQsdURBQXVEO0lBQ3ZELE1BQU0sSUFBSSxHQUFXLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUN0RSxNQUFNLEdBQUcsR0FBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFFdkUsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2hDLE1BQU0sR0FBRyxHQUFXLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2xELE1BQU0sUUFBUSxHQUFXLEdBQUcsR0FBRyxHQUFHLEdBQUcsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUUxRCx5Q0FBeUM7SUFDekMsTUFBTSxTQUFTLEdBQWtCLE1BQU0sQ0FBQyxJQUFJLENBQzFDLFFBQVEsRUFDUixVQUFVLEVBQ1YsU0FBUyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxNQUFNLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUN2SCxDQUFDO0lBRUYsNEJBQTRCO0lBQzVCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNmLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELDBCQUEwQjtJQUMxQixTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDbEIsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUMxQixVQUFrQixFQUNsQixNQUFxQztJQUVyQyxNQUFNLFVBQVUsR0FBVyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztJQUNoRCxNQUFNLE1BQU0sR0FBVyxHQUFHLENBQUM7SUFFM0IsNkRBQTZEO0lBQzdELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssVUFBVSxFQUFFLENBQUM7UUFDakQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsaUVBQWlFO0lBQ2pFLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM3QywyQ0FBMkM7UUFDM0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEYsQ0FBQztTQUFNLENBQUM7UUFDTiw4Q0FBOEM7UUFDOUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztJQUMzQyxDQUFDO0lBRUQsc0NBQXNDO0lBQ3RDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNmLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyJ9