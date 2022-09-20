import { buildSchema } from './buildSchema';
import { Schema } from './schema';

export const number = (): Schema<number> =>
  buildSchema({
    check: (value): value is number => typeof value === 'number',
    generate: (custom) => (custom ? custom : 0),
    stringify: (value) => JSON.stringify(value),
  });
