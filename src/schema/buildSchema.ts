import { parseJson } from '../utils/parseJson';
import { ParsingError, StringifyingError } from './errors';
import { Schema } from './schema';

export const buildSchema = <T>({
  check,
  generate,
  stringify,
}: {
  check(value: any): value is T;
  generate: (custom?: Partial<T>) => T;
  stringify: (value: T) => string;
}): Schema<T> => {
  return {
    check,
    parse: (json: string) => {
      const parsedJson = parseJson(json);
      if (check(parsedJson)) {
        return parsedJson;
      } else {
        throw new ParsingError();
      }
    },
    generate,
    stringify: (value) => {
      if (check(value)) {
        return stringify(value);
      } else {
        throw new StringifyingError();
      }
    },
  };
};
