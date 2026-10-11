/**
 * Closes an iframe by sending a message to the parent window
 */
export function closeIframe(origin = '*') {
    window.parent.postMessage({ action: 'closeIframe' }, origin);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9icm93c2VyL3dpbmRvdy9nZW5lcmFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBQ0gsTUFBTSxVQUFVLFdBQVcsQ0FBQyxTQUFpQixHQUFHO0lBQzlDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQy9ELENBQUMifQ==