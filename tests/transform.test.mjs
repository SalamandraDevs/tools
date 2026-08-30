import assert from 'node:assert/strict';
import test from 'node:test';
import { z } from 'zod';

import { userSchema } from '../../services/auth/dist/entities/users/schema.js';
import { zodToMongoSchema } from '../dist/shared/transform.js';

test('converts an authservice-style user schema into a Mongo validator', () => {
  // Use the service's actual Zod schema, rather than a duplicate test schema.
  const { $jsonSchema: actual } = zodToMongoSchema(userSchema).validator;

  assert.deepEqual(actual, {
    type: 'object',
    properties: {
      _id: { bsonType: 'objectId' },
      tenantId: { type: 'string', minLength: 1 },
      entityId: {
        type: 'string',
        pattern:
          '^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$'
      },
      entityType: { type: 'string', minLength: 1 },
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'suspended']
      },
      createdAt: { bsonType: 'date' },
      createdBy: { type: 'string', minLength: 1 },
      updatedAt: { bsonType: 'date' },
      updatedBy: { type: 'string', minLength: 1 },
      username: { type: 'string', minLength: 1 },
      passwordHash: { type: 'string', minLength: 1 },
      roles: {
        minItems: 1,
        type: 'array',
        items: { type: 'string', minLength: 1 }
      }
    },
    required: [
      'tenantId',
      'entityId',
      'entityType',
      'status',
      'createdAt',
      'createdBy',
      'updatedAt',
      'updatedBy',
      'username',
      'passwordHash',
      'roles'
    ],
    additionalProperties: false
  });
});

test('rejects a non-object schema as a collection validator', () => {
  assert.throws(
    () => zodToMongoSchema(userSchema.shape.username),
    /Unable to convert the Zod schema into a Mongo JSON validator/
  );
});

test('maps Zod integers to MongoDB BSON integer types', () => {
  const schema = z.object({ count: z.int() }).strict();
  const { $jsonSchema } = zodToMongoSchema(schema).validator;

  assert.deepEqual($jsonSchema.properties.count, {
    bsonType: ['int', 'long'],
    minimum: -9007199254740991,
    maximum: 9007199254740991
  });
});
