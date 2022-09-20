import { buildSchema } from './buildSchema';
import { Schema } from './schema';

export const boolean = (): Schema<boolean> =>
  buildSchema({
    check: (value): value is boolean => typeof value === 'boolean',
    generate: (custom) => (custom ? custom : false),
    stringify: (value) => JSON.stringify(value),
  });
