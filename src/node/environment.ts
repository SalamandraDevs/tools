import { z } from 'zod';

import { CustomError } from '../shared/errors.js';

/**
 * Reads the environment-sourced values a configuration schema declares.
 * @param schema - Config object schema whose environment fields carry `.meta({ env: 'VAR' })`.
 * @returns The resolved values, keyed by their schema property names.
 * @throws {CustomError} ENV_VAR_ERROR when any declared variable is missing, blank, or malformed.
 * @remarks
 * The schema is the single source of truth: each field marked with a `meta.env` name is read
 * from that process variable and validated by the field's own schema, while plain configuration
 * knobs are skipped. The values are returned to the caller, never written back into the config
 * object, so a reader of the config sees only the file placeholder (for example
 * `READ FROM ENV BAO_TOKEN`) and never the resolved secret.
 * @example
 * ```ts
 * const { baoAddr, baoToken } = loadEnvVariables(openBaoSigningKeysConfigSchema);
 * ```
 * @group Node
 * @category Environment
 */
export function loadEnvVariables(schema: z.ZodObject): Record<string, string> {
  const values: Record<string, string> = {};

  // One line per variable, naming the variable but never its value: any of them may be a secret.
  const faults: string[] = [];

  for (const [key, field] of Object.entries(schema.shape)) {
    const envName: string | undefined = field.meta()?.env;

    if (typeof envName !== 'string') {
      continue;
    }

    const parsed: ReturnType<typeof field.safeParse> = field.safeParse(
      process.env[envName]?.trim()
    );

    if (parsed.success) {
      values[key] = parsed.data as string;

      continue;
    }

    const detail: string = parsed.error.issues[0]?.message ?? 'is invalid';

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
