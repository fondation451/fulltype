import { Schema } from './schema';
import { parseJson } from './utils/parseJson';
import { stringify } from './utils/stringify';

export const buildSchema = <T>({
  deserialize,
  serialize,
  generate,
  isType,
}: {
  deserialize: (value: any) => T;
  serialize: (value: T) => any;
  generate: (custom?: Partial<T>) => T;
  isType(value: any): value is T;
}): Schema<T> => {
  return {
    parse: (json: string) => {
      const parsedJson = parseJson(json);
      return deserialize(parsedJson);
    },
    stringify: (value) => {
      return stringify(serialize(value));
    },
    deserialize,
    serialize,
    generate,
    isType,
  };
};
