import { buildSchema } from './buildSchema';
import { Schema } from './schema';

export const boolean = (): Schema<boolean> =>
  buildSchema({
    deserialize: (value) => {
      if (typeof value === 'boolean') {
        return value;
      } else {
        throw new Error();
      }
    },
    serialize: (value) => value,
    generate: (custom) => (custom ? custom : false),
    isType: (value): value is boolean => typeof value === 'boolean',
  });
