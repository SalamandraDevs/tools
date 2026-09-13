import { z } from 'zod';

import { CustomError } from './errors.js';

/** MongoDB JSON schema passed to `createCollection`. */
export type MongoJSONSchema = {
  validator: {
    $jsonSchema: Record<string, unknown>;
  };
};

/** MySQL table-definition fragment consumed by the dataset provisioner. */
export type MySqlSchema = {
  ddl: string;
};

type ToJSONSchemaOptions = {
  target: 'draft-04'; //JSON Schema dialect supported by MongoDB.
  cycles: 'throw'; // Fail instead of generating references for recursive schemas.
  // Sign to handle unrepresentable Js to Mongo data types
  unrepresentable: (context: { zodSchema: z.ZodType }) => 'any' | 'throw';
  // Handle MongoDB keywords and apply BSON-specific mappings per node.
  override: (context: {
    zodSchema: z.ZodType;
    jsonSchema: Record<string, unknown>;
    path: (string | number)[];
  }) => void;
};

/**
 * Converts a Zod object schema into a MongoDB collection validator.
 *
 * Zod performs the recursive schema conversion. This function only adapts
 * the few differences required by MongoDB's JSON Schema implementation.
 * @param schema - Source Zod schema.
 * @returns MongoDB JSON schema validator.
 */
export function zodToMongoSchema(schema: z.ZodType): MongoJSONSchema {
  try {
    // Configure Zod's recursive conversion and the small MongoDB-specific node adaptations.
    const options: ToJSONSchemaOptions = {
      target: 'draft-04',
      cycles: 'throw',
      unrepresentable: ({ zodSchema }) =>
        zodSchema._zod.def.type === 'date' ? 'any' : 'throw',
      override: ({ zodSchema, jsonSchema: node, path }) => {
        // MongoDB does not support Js format or default keywords.
        delete node.format;
        delete node.default;

        // JavaScript dates have no JSON Schema equivalent, but MongoDB has a BSON date type.
        if (zodSchema._zod.def.type === 'date') {
          node.bsonType = 'date';
        }

        // MongoDB does not support JS integer type. Accept the
        // BSON integer representations used by MongoDB instead.
        if (node.type === 'integer') {
          delete node.type;
          node.bsonType = ['int', 'long'];
        }

        // The empty path identifies the collection root where MongoDB adds _id.
        if (path.length === 0) {
          node.properties = {
            _id: { bsonType: 'objectId' },
            ...(node.properties as Record<string, unknown>)
          };
        }
      }
    };

    // The installed Zod runtime supports the callback shape represented by these options.
    const jsonSchema: Record<string, unknown> = z.toJSONSchema(
      schema,
      options as unknown as z.core.ToJSONSchemaParams
    );

    // MongoDB uses Draft 4 validation but does not accept the schema declaration keyword.
    delete jsonSchema.$schema;

    // Dataset schemas describe documents, so reject primitive schemas before provisioning.
    if (jsonSchema.type !== 'object') {
      throw new TypeError('A MongoDB collection schema must be an object');
    }

    // Wrap the converted document schema in the shape expected by createCollection.
    return {
      validator: {
        $jsonSchema: jsonSchema
      }
    };
  } catch (cause) {
    // Normalize conversion failures while preserving the original error as the cause.
    throw new CustomError({
      name: 'DB_SCHEMA_CONVERTION_ERROR',
      message: 'Unable to convert the Zod schema into a Mongo JSON validator',
      cause
    });
  }
}

/**
 * Returns the temporary MySQL table definition used while Zod-to-MySQL mapping is pending.
 *
 * The storage-owned primary key is sufficient to exercise provisioning wiring. Entity fields
 * are deliberately not inferred until their MySQL type and constraint mappings are defined.
 * @param schema - Source schema reserved for the future converter implementation.
 * @returns Fixed MySQL table-definition fragment.
 */
export function zodToMySqlSchema(schema: z.ZodType): MySqlSchema {
  void schema;

  return {
    ddl: '`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY'
  };
}
