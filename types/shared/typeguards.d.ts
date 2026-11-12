import type { ResponseBody } from './types.js';
/**
 * Narrows an unknown value to a non-null, non-array plain object.
 *
 * @remarks
 * Arrays are rejected because callers use this guard before indexing string keys, where an
 * array would type-check but carry the wrong shape. It is the primitive on which the other
 * guards in this module build.
 * @group Shared
 * @category Type Guards
 * @param obj - Value to test.
 * @returns Whether the value is a non-null object that is not an array.
 */
export declare function isObject(obj: any): obj is Record<string, unknown>;
/**
 * Narrows an unknown value to a non-empty plain object: an {@link isObject} with at least
 * one own key.
 *
 * @remarks
 * Refines {@link isObject} with a key-count check, so an empty `{}` is rejected. Callers use
 * it to decide that a value actually carries fields, such as a database criteria or a range
 * bound that must select records before a query is built.
 * @group Shared
 * @category Type Guards
 * @param obj - Value to test.
 * @returns Whether the value is a non-array object with at least one own key.
 */
export declare function isKeyedObject(obj: unknown): obj is Record<string, unknown>;
/**
 * Narrows a value to a canonical UUID v4 string.
 *
 * @remarks
 * Validates the version nibble (`4`) and variant bits (`8`, `9`, `a`, or `b`), so a
 * well-formed but non-v4 UUID is rejected. Matching is case-insensitive.
 * @group Shared
 * @category Type Guards
 * @param id - Value to test.
 * @returns Whether the value is a string matching the UUID v4 layout.
 */
export declare function isUuidV4(id: any): id is string;
/**
 * Narrows an unknown value to the standard {@link ResponseBody} envelope.
 *
 * @remarks
 * Distinguishes a first-party service response from a third-party payload;
 * {@link makeApiRequest} uses it to decide whether a body is already in the platform
 * envelope. A present-but-null `data` still satisfies the guard, matching the envelope's
 * optional-data contract.
 * @group Shared
 * @category Type Guards
 * @param obj - Value to test.
 * @returns Whether the value carries a string `message` and a `data` property.
 */
export declare function isResponseBody<T>(obj: unknown): obj is ResponseBody<T>;
//# sourceMappingURL=typeguards.d.ts.map