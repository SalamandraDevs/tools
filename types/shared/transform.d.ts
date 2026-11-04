import { z } from 'zod';
/**
 * MongoDB JSON schema validator passed to `createCollection`.
 *
 * - Validator: `$jsonSchema` wrapper MongoDB applies as a document validator.
 *
 * @group Shared
 * @category Schema Conversion
 */
export type MongoJSONSchema = {
    validator: {
        $jsonSchema: Record<string, unknown>;
    };
};
/**
 * MySQL table-definition fragment consumed by the dataset provisioner.
 *
 * - Ddl: Column and constraint DDL spliced into a `CREATE TABLE` statement.
 *
 * @group Shared
 * @category Schema Conversion
 */
export type MySqlSchema = {
    ddl: string;
};
/**
 * Converts a Zod object schema into a MongoDB collection validator.
 *
 * @remarks
 * Zod performs the recursive JSON Schema conversion; this function only adapts the handful
 * of differences MongoDB's Draft 4 dialect requires: dropping the `format`, `default`, and
 * `$schema` keywords, mapping JavaScript `Date` to the BSON `date` type, widening `integer`
 * to the `int`/`long` BSON types, and injecting the `_id` object-id property at the
 * document root. A primitive top-level schema is rejected, since datasets provision
 * document collections.
 * @group Shared
 * @category Schema Conversion
 * @param schema - Source Zod schema; must describe an object, not a primitive.
 * @returns A {@link MongoJSONSchema} validator ready for `createCollection`.
 * @throws {CustomError} DB_SCHEMA_CONVERTION_ERROR when conversion fails, including when
 *   the schema does not resolve to an object type.
 */
export declare function zodToMongoSchema(schema: z.ZodType): MongoJSONSchema;
/**
 * Returns the temporary MySQL table definition used while Zod-to-MySQL mapping is pending.
 *
 * @remarks
 * A placeholder for the eventual counterpart to {@link zodToMongoSchema}. The storage-owned
 * primary key alone is enough to exercise the provisioning wiring, so entity fields are
 * deliberately not inferred until their MySQL type and constraint mappings are defined; the
 * `schema` argument is accepted now to keep the signature stable for that future work.
 * @group Shared
 * @category Schema Conversion
 * @param schema - Source schema reserved for the future converter implementation.
 * @returns A fixed {@link MySqlSchema} fragment declaring only the storage-owned primary
 *   key.
 */
export declare function zodToMySqlSchema(schema: z.ZodType): MySqlSchema;
//# sourceMappingURL=transform.d.ts.map