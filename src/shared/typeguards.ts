import type { ResponseBody } from './requests.js';
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Helper function to check if an object has the required structure
 * @param obj - Object that will be checked
 * @returns - true if the type matches the given structure, false otherwise.
 */
export function isObject(obj: any): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

/**
 * Checks if a given value is a valid UUID v4 string.
 * @param id - Object that will be checked.
 * @returns - true if the type matches the given structure, false otherwise.
 */
export function isUuidV4(id: any): id is string {
  const uuidV4Regex: RegExp =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof id === 'string' && uuidV4Regex.test(id);
}

/**
 * Type guard to check if an object matches the ApiResponse<T> structure.
 * @param obj - Object that will be checked.
 * @returns - true if the type matches the given structure, false otherwise.
 */
export function isResponseBody<T>(obj: unknown): obj is ResponseBody<T> {
  return isObject(obj) && typeof obj.message === 'string' && 'data' in obj;
}
