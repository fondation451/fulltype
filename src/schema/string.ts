import { buildSchema } from './buildSchema';
import { Schema } from './schema';

export const string = (): Schema<string> =>
  buildSchema({
    check: (value): value is string => typeof value === 'string',
    generate: (custom) => (custom ? custom : ''),
    stringify: (value) => JSON.stringify(value),
  });
