import { z } from 'zod';
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
export declare function loadEnvVariables(schema: z.ZodObject): Record<string, string>;
//# sourceMappingURL=environment.d.ts.map