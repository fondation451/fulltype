import { Schema } from './schema';

export const string = (): Schema<string> => {
  return {
    parse: (json: string) => {
      const parsedJson = JSON.parse(json);
      if (typeof parsedJson === 'string') {
        return parsedJson;
      } else {
        throw new Error('Invalid string parsed');
      }
    },

    generate: (custom) => (custom ? custom : ''),

    stringify: (value) => JSON.stringify(value),
  };
};
