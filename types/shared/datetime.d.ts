/**
 * Returns the instant a number of days after a base instant.
 *
 * @remarks
 * Adds elapsed time, not calendar days: each day is a fixed 86,400,000 milliseconds, so
 * the result is identical on every host regardless of timezone or daylight-saving
 * transitions, which suits durations such as token lifetimes. The base `from` is never
 * mutated; a new {@link Date} is returned. `days` may be negative to move backward or
 * fractional to add part of a day.
 * @param days - Number of 24-hour days to add to `from`.
 * @param from - Base instant to measure from; defaults to the current time.
 * @returns A new {@link Date} offset from `from` by `days` of 24 hours.
 */
export declare function addDays(days: number, from?: Date): Date;
//# sourceMappingURL=datetime.d.ts.map