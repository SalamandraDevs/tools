/**
 * Closes an iframe by sending a message to the parent window.
 *
 * @param origin - Target origin passed to `postMessage`; defaults to `*` (any origin).
 */
export function closeIframe(origin = '*') {
    window.parent.postMessage({ action: 'closeIframe' }, origin);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9icm93c2VyL3dpbmRvdy9nZW5lcmFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsV0FBVyxDQUFDLFNBQWlCLEdBQUc7SUFDOUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDL0QsQ0FBQyJ9