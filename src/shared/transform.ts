import type { ZodType } from 'zod';

export type MongoJSONSchema = {
  validator: {
    $jsonSchema: Record<string, unknown>;
  };
};

export function zodToMongoSchema(schema: ZodType): MongoJSONSchema {
  void schema;
  return {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        additionalProperties: false
      }
    }
  };
}
