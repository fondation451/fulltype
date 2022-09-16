import { Schema } from './schema';

export const date = (): Schema<Date> => {
  return {
    parse: (json: string) => {
      const parsedJson = JSON.parse(json);
      if (typeof parsedJson === 'string' && !isNaN(Date.parse(parsedJson))) {
        return new Date(parsedJson);
      } else {
        throw new Error('Invalid date parsed');
      }
    },

    generate: (custom) => (custom ? (custom as any) : new Date(0)),

    stringify: (value) => JSON.stringify(value),
  };
};
