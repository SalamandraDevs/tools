import { z } from 'zod';
import { CustomError } from './errors.js';
/**
 * Converts a Zod object schema into a MongoDB collection validator.
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
export function zodToMongoSchema(schema) {
    try {
        // Configure Zod's recursive conversion and the small MongoDB-specific node adaptations.
        const options = {
            target: 'draft-04',
            cycles: 'throw',
            unrepresentable: ({ zodSchema }) => zodSchema._zod.def.type === 'date' ? 'any' : 'throw',
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
                        ...node.properties
                    };
                }
            }
        };
        // The installed Zod runtime supports the callback shape represented by these options.
        const jsonSchema = z.toJSONSchema(schema, options);
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
    }
    catch (cause) {
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
export function zodToMySqlSchema(schema) {
    void schema;
    return {
        ddl: '`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY'
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NoYXJlZC90cmFuc2Zvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLENBQUMsRUFBRSxNQUFNLEtBQUssQ0FBQztBQUV4QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBdUMxQzs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQUMsTUFBaUI7SUFDaEQsSUFBSSxDQUFDO1FBQ0gsd0ZBQXdGO1FBQ3hGLE1BQU0sT0FBTyxHQUF3QjtZQUNuQyxNQUFNLEVBQUUsVUFBVTtZQUNsQixNQUFNLEVBQUUsT0FBTztZQUNmLGVBQWUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxDQUNqQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU87WUFDdEQsUUFBUSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO2dCQUNsRCwwREFBMEQ7Z0JBQzFELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDbkIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUVwQixxRkFBcUY7Z0JBQ3JGLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRSxDQUFDO29CQUN2QyxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztnQkFDekIsQ0FBQztnQkFFRCx1REFBdUQ7Z0JBQ3ZELHdEQUF3RDtnQkFDeEQsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRSxDQUFDO29CQUM1QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ2xDLENBQUM7Z0JBRUQsd0VBQXdFO2dCQUN4RSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUc7d0JBQ2hCLEdBQUcsRUFBRSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUU7d0JBQzdCLEdBQUksSUFBSSxDQUFDLFVBQXNDO3FCQUNoRCxDQUFDO2dCQUNKLENBQUM7WUFDSCxDQUFDO1NBQ0YsQ0FBQztRQUVGLHNGQUFzRjtRQUN0RixNQUFNLFVBQVUsR0FBNEIsQ0FBQyxDQUFDLFlBQVksQ0FDeEQsTUFBTSxFQUNOLE9BQStDLENBQ2hELENBQUM7UUFFRixzRkFBc0Y7UUFDdEYsT0FBTyxVQUFVLENBQUMsT0FBTyxDQUFDO1FBRTFCLHVGQUF1RjtRQUN2RixJQUFJLFVBQVUsQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFLENBQUM7WUFDakMsTUFBTSxJQUFJLFNBQVMsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1FBQ3ZFLENBQUM7UUFFRCxnRkFBZ0Y7UUFDaEYsT0FBTztZQUNMLFNBQVMsRUFBRTtnQkFDVCxXQUFXLEVBQUUsVUFBVTthQUN4QjtTQUNGLENBQUM7SUFDSixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLGtGQUFrRjtRQUNsRixNQUFNLElBQUksV0FBVyxDQUFDO1lBQ3BCLElBQUksRUFBRSw0QkFBNEI7WUFDbEMsT0FBTyxFQUFFLDhEQUE4RDtZQUN2RSxLQUFLO1NBQ04sQ0FBQyxDQUFDO0lBQ0wsQ0FBQztBQUNILENBQUM7QUFFRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQUMsTUFBaUI7SUFDaEQsS0FBSyxNQUFNLENBQUM7SUFFWixPQUFPO1FBQ0wsR0FBRyxFQUFFLDBEQUEwRDtLQUNoRSxDQUFDO0FBQ0osQ0FBQyJ9