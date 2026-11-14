/* eslint-disable @typescript-eslint/no-explicit-any */
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
export function isObject(obj) {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}
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
export function isKeyedObject(obj) {
    return isObject(obj) && Object.keys(obj).length > 0;
}
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
export function isUuidV4(id) {
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return typeof id === 'string' && uuidV4Regex.test(id);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWd1YXJkcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zaGFyZWQvdHlwZWd1YXJkcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx1REFBdUQ7QUFFdkQ7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLFVBQVUsUUFBUSxDQUFDLEdBQVE7SUFDL0IsT0FBTyxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEUsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILE1BQU0sVUFBVSxhQUFhLENBQUMsR0FBWTtJQUN4QyxPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDdEQsQ0FBQztBQUVEOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFNLFVBQVUsUUFBUSxDQUFDLEVBQU87SUFDOUIsTUFBTSxXQUFXLEdBQ2Ysd0VBQXdFLENBQUM7SUFDM0UsT0FBTyxPQUFPLEVBQUUsS0FBSyxRQUFRLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN4RCxDQUFDIn0=