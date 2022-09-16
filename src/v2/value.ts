import { Schema } from './schema';

export const value = <ValuesT extends readonly string[]>(possibleValues: ValuesT): Schema<ValuesT[number]> => {
  return {
    parse: (json: string) => {
      const parsedJson = JSON.parse(json);
      if (typeof parsedJson === 'string' && possibleValues.includes(parsedJson)) {
        return parsedJson;
      } else {
        throw new Error('Invalid value parsed');
      }
    },

    generate: (custom) => (custom ? (custom as any) : possibleValues[0]),

    stringify: (value) => JSON.stringify(value),
  };
};
