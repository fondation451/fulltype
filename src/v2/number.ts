import { Schema } from './schema';

export const number = (): Schema<number> => {
  return {
    parse: (json: string) => {
      const parsedJson = JSON.parse(json);
      if (typeof parsedJson === 'number') {
        return parsedJson;
      } else {
        throw new Error('Invalid number parsed');
      }
    },

    generate: (custom) => (custom ? custom : 0),

    stringify: (value) => JSON.stringify(value),
  };
};
