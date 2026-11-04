import { timingSafeEqual } from 'node:crypto';
/**
 * Creates the ASCII signing input for a compact JWT.
 *
 * @remarks
 * Produces the exact `header.payload` string that a JWS signature is computed over; the
 * caller appends `.<signature>` to form the complete compact token. Both segments use
 * base64url without padding, per the JWS compact serialization.
 * @group Node
 * @category Crypto
 * @param protectedHeader - JOSE protected header.
 * @param payload - JWT claims payload.
 * @returns Base64URL-encoded header and payload joined by a period.
 */
export function createJwtSigningInput(protectedHeader, payload) {
    const encodedHeader = Buffer.from(JSON.stringify(protectedHeader)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    return `${encodedHeader}.${encodedPayload}`;
}
/**
 * Compares two hash strings without leaking the first differing byte position.
 *
 * @remarks
 * Uses `node:crypto` `timingSafeEqual` so comparison time does not depend on where the
 * values diverge, closing the timing side channel a plain `===` would open. The length
 * check runs first because `timingSafeEqual` throws on unequal-length buffers; unequal
 * lengths are already public information for fixed-width hashes, so short-circuiting there
 * leaks nothing sensitive.
 * @group Node
 * @category Crypto
 * @param left - First hash value.
 * @param right - Second hash value.
 * @returns Whether both hashes are equal.
 */
export function safeHashCompare(left, right) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    // Length must match before timingSafeEqual, which throws on differing buffer lengths.
    return (leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3J5cHRvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL25vZGUvY3J5cHRvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFOUM7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsTUFBTSxVQUFVLHFCQUFxQixDQUFDLGVBQXVCLEVBQUUsT0FBZTtJQUM1RSxNQUFNLGFBQWEsR0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQ2pGLFdBQVcsQ0FDWixDQUFDO0lBQ0YsTUFBTSxjQUFjLEdBQVcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUMxRSxXQUFXLENBQ1osQ0FBQztJQUVGLE9BQU8sR0FBRyxhQUFhLElBQUksY0FBYyxFQUFFLENBQUM7QUFDOUMsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0gsTUFBTSxVQUFVLGVBQWUsQ0FBQyxJQUFZLEVBQUUsS0FBYTtJQUN6RCxNQUFNLFVBQVUsR0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdDLE1BQU0sV0FBVyxHQUFXLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFL0Msc0ZBQXNGO0lBQ3RGLE9BQU8sQ0FDTCxVQUFVLENBQUMsTUFBTSxLQUFLLFdBQVcsQ0FBQyxNQUFNLElBQUksZUFBZSxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FDckYsQ0FBQztBQUNKLENBQUMifQ==