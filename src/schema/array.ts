import { buildSchema } from './buildSchema';
import { Schema, GenericSchema } from './schema';
import { TypeOf } from './TypeOf';

export const array = <SchemaT extends GenericSchema>(schema: SchemaT): Schema<Array<TypeOf<SchemaT>>> =>
  buildSchema({
    check: (value): value is Array<TypeOf<SchemaT>> => {
      return Array.isArray(value) && value.every(schema.check);
    },
    generate: (custom) => (custom ? (custom as any) : [schema.generate()]),
    stringify: (value) => `[${value.map((element) => schema.stringify(element)).join(',')}]`,
  });
