import { buildSchema } from "./buildSchema";
import { GenericSchema, Schema } from "./schema";
import { TypeOf } from "./TypeOf";

export const object = <ObjectSchemaT extends { [key: string]: GenericSchema }>(
  objectSchema: ObjectSchemaT,
): Schema<{
  [Key in keyof ObjectSchemaT]: TypeOf<ObjectSchemaT[Key]>;
}> =>
  buildSchema({
    deserialize: (value) => {
      if (typeof value !== "object") {
        throw new Error();
      }

      const deserializedObject = {} as {
        [Key in keyof ObjectSchemaT]: TypeOf<ObjectSchemaT[Key]>;
      };

      for (const key in objectSchema) {
        // eslint-disable-next-line
        deserializedObject[key] = objectSchema[key]!.deserialize(value[key]);
      }

      return deserializedObject;
    },
    serialize: (value) => {
      const serializedObject = {} as {
        [Key in keyof ObjectSchemaT]: string;
      };

      for (const key in objectSchema) {
        // eslint-disable-next-line
        serializedObject[key] = objectSchema[key]!.serialize(value[key]);
      }

      return serializedObject;
    },
    generate: (custom) => {
      const generatedObject = {} as {
        [Key in keyof ObjectSchemaT]: TypeOf<ObjectSchemaT[Key]>;
      };

      for (const key in objectSchema) {
        const customField = custom && custom[key];
        // eslint-disable-next-line
        generatedObject[key] = objectSchema[key]!.generate(customField);
      }

      return generatedObject;
    },
    isType: (
      value,
    ): value is {
      [Key in keyof ObjectSchemaT]: TypeOf<ObjectSchemaT[Key]>;
    } => {
      if (typeof value !== "object") {
        return false;
      }

      for (const key in objectSchema) {
        // eslint-disable-next-line
        if (!objectSchema[key]!.isType(value[key])) {
          return false;
        }
      }

      return true;
    },
  });
