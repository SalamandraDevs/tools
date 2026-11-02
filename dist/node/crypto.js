import { timingSafeEqual } from 'node:crypto';
/**
 * Creates the ASCII signing input for a compact JWT.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3J5cHRvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL25vZGUvY3J5cHRvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFOUM7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLFVBQVUscUJBQXFCLENBQUMsZUFBdUIsRUFBRSxPQUFlO0lBQzVFLE1BQU0sYUFBYSxHQUFXLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FDakYsV0FBVyxDQUNaLENBQUM7SUFDRixNQUFNLGNBQWMsR0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQzFFLFdBQVcsQ0FDWixDQUFDO0lBRUYsT0FBTyxHQUFHLGFBQWEsSUFBSSxjQUFjLEVBQUUsQ0FBQztBQUM5QyxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILE1BQU0sVUFBVSxlQUFlLENBQUMsSUFBWSxFQUFFLEtBQWE7SUFDekQsTUFBTSxVQUFVLEdBQVcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QyxNQUFNLFdBQVcsR0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRS9DLHNGQUFzRjtJQUN0RixPQUFPLENBQ0wsVUFBVSxDQUFDLE1BQU0sS0FBSyxXQUFXLENBQUMsTUFBTSxJQUFJLGVBQWUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQ3JGLENBQUM7QUFDSixDQUFDIn0=