import { timingSafeEqual } from 'node:crypto';

/**
 * Creates the ASCII signing input for a compact JWT.
 * @param protectedHeader - JOSE protected header.
 * @param payload - JWT claims payload.
 * @returns Base64URL-encoded header and payload joined by a period.
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
 */
export function safeHashCompare(left: string, right: string): boolean {
  const leftBuffer: Buffer = Buffer.from(left);
  const rightBuffer: Buffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
  );
}
