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
export declare function createJwtSigningInput(protectedHeader: object, payload: object): string;
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
export declare function safeHashCompare(left: string, right: string): boolean;
//# sourceMappingURL=crypto.d.ts.map