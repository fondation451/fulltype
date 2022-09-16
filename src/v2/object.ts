import { Schema, GenericSchema } from './schema';
import { TypeOf } from './TypeOf';

export const object = <ObjectSchemaT extends { [key: string]: GenericSchema }>(
  objectSchema: ObjectSchemaT,
): Schema<{
  [Key in keyof ObjectSchemaT]: TypeOf<ObjectSchemaT[Key]>;
}> => {
  return {
    parse: (json: string) => {
      const parsedJson = JSON.parse(json);
      if (typeof parsedJson === 'object') {
        const parsedObjectJson = {} as {
          [Key in keyof ObjectSchemaT]: TypeOf<ObjectSchemaT[Key]>;
        };

        for (const key in objectSchema) {
          if (!parsedJson[key]) {
            throw new Error('Undefined object property');
          } else {
            parsedObjectJson[key] = objectSchema[key].parse(JSON.stringify(parsedJson[key]));
          }
        }

        return parsedObjectJson;
      } else {
        throw new Error('Invalid object parsed');
      }
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

      return JSON.stringify(stringifiedObject);
    },
  };
};
