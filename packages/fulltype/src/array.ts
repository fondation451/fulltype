import { buildSchema } from './buildSchema';
import { Schema, GenericSchema } from './schema';
import { TypeOf } from './TypeOf';

export const array = <SchemaT extends GenericSchema>(schema: SchemaT): Schema<Array<TypeOf<SchemaT>>> =>
  buildSchema({
    deserialize: (value) => {
      if (Array.isArray(value)) {
        return value.map(schema.deserialize);
      } else {
        throw new Error();
      }
    },
    serialize: (value) => value.map((element) => schema.serialize(element)),
    generate: (custom) => (custom ? (custom as any) : [schema.generate()]),
    isType: (value): value is Array<TypeOf<SchemaT>> => {
      return Array.isArray(value) && value.every(schema.isType);
    },
  });
