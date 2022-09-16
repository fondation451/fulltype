import { Schema } from './schema';

export const boolean = (): Schema<boolean> => {
  return {
    parse: (json: string) => {
      const parsedJson = JSON.parse(json);
      if (typeof parsedJson === 'boolean') {
        return parsedJson;
      } else {
        throw new Error('Invalid boolean parsed');
      }
    },

    generate: (custom) => (custom ? custom : false),

    stringify: (value) => JSON.stringify(value),
  };
};
