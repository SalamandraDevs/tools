import { z } from 'zod';
import { CustomError } from '../shared/errors.js';
/**
 * Reads the environment-sourced values a configuration schema declares.
 * @remarks
 * The schema is the single source of truth: each field marked with a `meta.env` name is
 * read from that process variable and validated by the field's own schema, while plain
 * configuration knobs are skipped. The values are returned to the caller, never written
 * back into the config object, so a reader of the config sees only the file placeholder
 * (for example `READ FROM ENV BAO_TOKEN`) and never the resolved secret.
 * @group Node
 * @category Environment
 * @example
 *
 * ```ts
 * const { baoAddr, baoToken } = loadEnvVariables(openBaoSigningKeysConfigSchema);
 * ```
 * @param schema - Config object schema with fields carrying `.meta({ env: 'VAR' })`.
 * @returns The resolved values, keyed by their schema property names.
 * @throws {CustomError} ENV_VAR_ERROR when any declared variable is missing, blank, or
 *   malformed.
 */
export function loadEnvVariables(schema) {
    const values = {};
    // One line per variable, naming the variable but never its value: any of them may be a secret.
    const faults = [];
    for (const [key, field] of Object.entries(schema.shape)) {
        const envName = field.meta()?.env;
        if (typeof envName !== 'string') {
            continue;
        }
        const parsed = field.safeParse(process.env[envName]?.trim());
        if (parsed.success) {
            values[key] = parsed.data;
            continue;
        }
        const detail = parsed.error.issues[0]?.message ?? 'is invalid';
        faults.push(`${envName} ${detail}`);
    }
    if (faults.length > 0) {
        throw new CustomError({
            name: 'ENV_VAR_ERROR',
            message: `Environment is unusable: ${faults.join('; ')}`
        });
    }
    return values;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbm9kZS9lbnZpcm9ubWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsQ0FBQyxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBRXhCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVsRDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1CRztBQUNILE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxNQUFtQjtJQUNsRCxNQUFNLE1BQU0sR0FBMkIsRUFBRSxDQUFDO0lBRTFDLCtGQUErRjtJQUMvRixNQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7SUFFNUIsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDeEQsTUFBTSxPQUFPLEdBQXVCLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxHQUFHLENBQUM7UUFFdEQsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUNoQyxTQUFTO1FBQ1gsQ0FBQztRQUVELE1BQU0sTUFBTSxHQUF1QyxLQUFLLENBQUMsU0FBUyxDQUNoRSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUM3QixDQUFDO1FBRUYsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFjLENBQUM7WUFFcEMsU0FBUztRQUNYLENBQUM7UUFFRCxNQUFNLE1BQU0sR0FBVyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLElBQUksWUFBWSxDQUFDO1FBRXZFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sSUFBSSxXQUFXLENBQUM7WUFDcEIsSUFBSSxFQUFFLGVBQWU7WUFDckIsT0FBTyxFQUFFLDRCQUE0QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1NBQ3pELENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDIn0=