import { Schema, GenericSchema } from './schema';
import { TypeOf } from './TypeOf';

export const array = <SchemaT extends GenericSchema>(schema: SchemaT): Schema<Array<TypeOf<SchemaT>>> => {
  return {
    parse: (json: string) => {
      const parsedJson = JSON.parse(json);
      if (Array.isArray(parsedJson)) {
        return parsedJson.map((element) => schema.parse(JSON.stringify(element)));
      } else {
        throw new Error('Invalid array parsed');
      }
    },

    generate: (custom) => (custom ? (custom as any) : [schema.generate()]),

    stringify: (value) => JSON.stringify(value.map((element) => schema.stringify(element))),
  };
};
