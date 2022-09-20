import { custom } from './custom';
import { Schema } from './schema';
import { string } from './string';

export const date = (): Schema<Date> =>
  custom(string(), {
    parseCustomization: (input) => {
      if (!isNaN(Date.parse(input))) {
        return new Date(input);
      } else {
        throw new Error('Invalid date parsed');
      }
    },
    generate: (custom) => (custom ? (custom as any) : new Date(0)),
    stringifyCustomization: (value) => value.toISOString(),
  });
