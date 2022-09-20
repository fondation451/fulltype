import { buildSchema } from './buildSchema';
import { Schema } from './schema';

export const string = (): Schema<string> =>
  buildSchema({
    deserialize: (value) => {
      if (typeof value === 'string') {
        return value;
      } else {
        throw new Error();
      }
    },
    serialize: (value) => value,
    generate: (custom) => (custom ? custom : ''),
    isType: (value): value is string => typeof value === 'string',
  });
