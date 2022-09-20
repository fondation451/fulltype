import { ParsingError, StringifyingError } from './errors';
import { Schema } from './schema';

export const undefinedSchema = (): Schema<undefined> => {
  const check = (value: any): value is undefined => value === undefined;

  return {
    check,
    parse: (json: string) => {
      if (json === '') {
        return undefined;
      } else {
        throw new ParsingError();
      }
    },
    generate: () => undefined,
    stringify: (value) => {
      if (check(value)) {
        return '';
      } else {
        throw new StringifyingError();
      }
    },
  };
};
