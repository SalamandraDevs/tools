import { timingSafeEqual } from 'node:crypto';

/**
 * Creates the ASCII signing input for a compact JWT.
 * @param protectedHeader - JOSE protected header.
 * @param payload - JWT claims payload.
 * @returns Base64URL-encoded header and payload joined by a period.
 * @remarks
 * Produces the exact `header.payload` string that a JWS signature is computed over; the caller
 * appends `.<signature>` to form the complete compact token. Both segments use base64url
 * without padding, per the JWS compact serialization.
 * @group Node
 * @category Crypto
 */
export function createJwtSigningInput(protectedHeader: object, payload: object): string {
  const encodedHeader: string = Buffer.from(JSON.stringify(protectedHeader)).toString(
    'base64url'
  );
  const encodedPayload: string = Buffer.from(JSON.stringify(payload)).toString(
    'base64url'
  );

  return `${encodedHeader}.${encodedPayload}`;
}

/**
 * Compares two hash strings without leaking the first differing byte position.
 * @param left - First hash value.
 * @param right - Second hash value.
 * @returns Whether both hashes are equal.
 * @remarks
 * Uses `node:crypto` `timingSafeEqual` so comparison time does not depend on where the values
 * diverge, closing the timing side channel a plain `===` would open. The length check runs
 * first because `timingSafeEqual` throws on unequal-length buffers; unequal lengths are already
 * public information for fixed-width hashes, so short-circuiting there leaks nothing sensitive.
 * @group Node
 * @category Crypto
 */
export function safeHashCompare(left: string, right: string): boolean {
  const leftBuffer: Buffer = Buffer.from(left);
  const rightBuffer: Buffer = Buffer.from(right);

  // Length must match before timingSafeEqual, which throws on differing buffer lengths.
  return (
    leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
  );
}
