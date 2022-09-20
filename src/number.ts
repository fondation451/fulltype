import { buildSchema } from './buildSchema';
import { Schema } from './schema';

export const number = (): Schema<number> =>
  buildSchema({
    deserialize: (value) => {
      if (typeof value === 'number') {
        return value;
      } else {
        throw new Error();
      }
    },
    serialize: (value) => value,
    generate: (custom) => (custom ? custom : 0),
    isType: (value): value is number => typeof value === 'number',
  });
