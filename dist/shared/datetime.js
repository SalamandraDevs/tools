/** Milliseconds in one 24-hour day. */
const millisecondsPerDay = 86_400_000;
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
export function addDays(days, from = new Date()) {
    return new Date(from.getTime() + days * millisecondsPerDay);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXRpbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2hhcmVkL2RhdGV0aW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHVDQUF1QztBQUN2QyxNQUFNLGtCQUFrQixHQUFXLFVBQVUsQ0FBQztBQUU5Qzs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFNLFVBQVUsT0FBTyxDQUFDLElBQVksRUFBRSxPQUFhLElBQUksSUFBSSxFQUFFO0lBQzNELE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzlELENBQUMifQ==