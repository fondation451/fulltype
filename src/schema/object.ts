import { buildSchema } from './buildSchema';
import { Schema, GenericSchema } from './schema';
import { TypeOf } from './TypeOf';

export const object = <ObjectSchemaT extends { [key: string]: GenericSchema }>(
  objectSchema: ObjectSchemaT,
): Schema<{
  [Key in keyof ObjectSchemaT]: TypeOf<ObjectSchemaT[Key]>;
}> =>
  buildSchema({
    check: (
      value,
    ): value is {
      [Key in keyof ObjectSchemaT]: TypeOf<ObjectSchemaT[Key]>;
    } => {
      if (typeof value !== 'object') {
        return false;
      }

      for (const key in objectSchema) {
        if (!objectSchema[key].check(value[key])) {
          return false;
        }
      }

      return true;
    },
    generate: (custom) => {
      const generatedObject = {} as {
        [Key in keyof ObjectSchemaT]: TypeOf<ObjectSchemaT[Key]>;
      };

      for (const key in objectSchema) {
        const customField = custom && custom[key];
        generatedObject[key] = objectSchema[key].generate(customField);
      }

      return generatedObject;
    },
    stringify: (value) => {
      const stringifiedObject = {} as {
        [Key in keyof ObjectSchemaT]: string;
      };

      for (const key in objectSchema) {
        stringifiedObject[key] = objectSchema[key].stringify(value[key]);
      }

      return `{${Object.entries(stringifiedObject)
        .map(([key, value]) => `"${key}":${value}`)
        .join(',')}}`;
    },
  });
