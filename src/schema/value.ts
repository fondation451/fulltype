import { buildSchema } from './buildSchema';
import { Schema } from './schema';

export const value = <ValuesT extends readonly string[]>(possibleValues: ValuesT): Schema<ValuesT[number]> =>
  buildSchema({
    check: (value): value is ValuesT[number] => typeof value === 'string' && possibleValues.includes(value),
    generate: (custom) => (custom ? (custom as any) : possibleValues[0]),
    stringify: (value) => JSON.stringify(value),
  });
