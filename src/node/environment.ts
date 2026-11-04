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
 * @group Node
 * @category Environment
 * @example
 *
 * ```ts
 * const { baoAddr, baoToken } = loadEnvVariables(openBaoSigningKeysConfigSchema);
 * ```
 *
 * @param schema - Config object schema with fields carrying `.meta({ env: 'VAR' })`.
 * @returns The resolved values, keyed by their schema property names.
 * @throws {CustomError} ENV_VAR_ERROR when any declared variable is missing, blank, or
 *   malformed.
 */
export function loadEnvVariables(schema: z.ZodObject): Record<string, string> {
  const values: Record<string, string> = {};

  const faults: string[] = [];

  // `schema.shape` maps each property name to its field schema; iterate those field by field.
  for (const [key, field] of Object.entries(schema.shape)) {
    // Only fields tagged with `.meta({ env })` are env-sourced; plain config knobs are skipped.
    const envName: string | undefined = field.meta()?.env;

    if (typeof envName !== 'string') {
      continue;
    }

    // Use the own zod field parser while trim the any white space
    const parsed: ReturnType<typeof field.safeParse> = field.safeParse(
      process.env[envName]?.trim()
    );

    if (parsed.success) {
      // Keyed by the schema property name, not the env var, so the caller destructures by field.
      values[key] = parsed.data as string;

      continue;
    }

    // Collect every fault before throwing, so one pass reports all bad variables at once.
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
