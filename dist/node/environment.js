import { z } from 'zod';
import { CustomError } from '../shared/errors.js';
/**
 * Reads the environment-sourced values a configuration schema declares.
 *
 * @remarks
 * The schema is the single source of truth: each field marked with a `meta.env` name is
 * read from that process variable and validated by the field's own schema, while plain
 * configuration knobs are skipped. The values are returned to the caller, never written
 * back into the config object, so a reader of the config sees only the file placeholder
 * (for example `READ FROM ENV BAO_TOKEN`) and never the resolved secret.
 * @example
 *
 * ```ts
 * const { baoAddr, baoToken } = loadEnvVariables(openBaoSigningKeysConfigSchema);
 * ```
 *
 * @param schema - Config object schema with fields carrying `.meta({ env: 'VAR' })`.
 * @returns The resolved values, keyed by their schema property names.
 * @throws {CustomError} ENV_VAR_ERROR when any declared variable is missing, blank, or
 * malformed.
 * @group Node
 * @category Environment
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbm9kZS9lbnZpcm9ubWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsQ0FBQyxFQUFFLE1BQU0sS0FBSyxDQUFDO0FBRXhCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVsRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUJHO0FBQ0gsTUFBTSxVQUFVLGdCQUFnQixDQUFDLE1BQW1CO0lBQ2xELE1BQU0sTUFBTSxHQUEyQixFQUFFLENBQUM7SUFFMUMsK0ZBQStGO0lBQy9GLE1BQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUU1QixLQUFLLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUN4RCxNQUFNLE9BQU8sR0FBdUIsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsQ0FBQztRQUV0RCxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQ2hDLFNBQVM7UUFDWCxDQUFDO1FBRUQsTUFBTSxNQUFNLEdBQXVDLEtBQUssQ0FBQyxTQUFTLENBQ2hFLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQzdCLENBQUM7UUFFRixJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNuQixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQWMsQ0FBQztZQUVwQyxTQUFTO1FBQ1gsQ0FBQztRQUVELE1BQU0sTUFBTSxHQUFXLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sSUFBSSxZQUFZLENBQUM7UUFFdkUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sSUFBSSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDdEIsTUFBTSxJQUFJLFdBQVcsQ0FBQztZQUNwQixJQUFJLEVBQUUsZUFBZTtZQUNyQixPQUFPLEVBQUUsNEJBQTRCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7U0FDekQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMifQ==