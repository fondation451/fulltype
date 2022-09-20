import { undefinedSchema } from '../src/schema/undefinedSchema';

describe('undefinedSchema', () => {
  describe('parse/stringify', () => {
    it('should be idempotent', () => {
      const schema = undefinedSchema();
      const json = '';

      const newJson = schema.stringify(schema.parse(json));

      expect(json).toEqual(newJson);
    });
  });

  describe('stringify/parse', () => {
    it('should be idempotent', () => {
      const schema = undefinedSchema();
      const value = schema.generate(undefined);

      const newValue = schema.parse(schema.stringify(value));

      expect(value).toEqual(newValue);
    });
  });

  describe('parse', () => {
    it('should parse a valid undefined', () => {
      const schema = undefinedSchema();

      const parsedValue = schema.parse('');

      // eslint-disable-next-line
      const _typeCheck: undefined = parsedValue;
      expect(parsedValue).toEqual(undefined);
    });

    it('should throw if the given json is not a valid undefined', () => {
      const schema = undefinedSchema();

      expect(() => schema.parse('"TEST"')).toThrow();
    });
  });

  describe('generate', () => {
    it('should generate a undefined', () => {
      const schema = undefinedSchema();

      const generatedValue = schema.generate();

      // eslint-disable-next-line
      const _typeCheck: undefined = generatedValue;
      expect(generatedValue).toEqual(undefined);
    });
  });
});
