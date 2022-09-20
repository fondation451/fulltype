import { string } from '../src/string';

describe('string', () => {
  describe('parse/stringify', () => {
    it('should be idempotent', () => {
      const schema = string();
      const json = '"TEST"';

      const newJson = schema.stringify(schema.parse(json));

      expect(json).toEqual(newJson);
    });
  });

  describe('stringify/parse', () => {
    it('should be idempotent', () => {
      const schema = string();
      const value = schema.generate('TEST');

      const newValue = schema.parse(schema.stringify(value));

      expect(value).toEqual(newValue);
    });
  });

  describe('parse', () => {
    it('should parse a valid string', () => {
      const schema = string();

      const parsedValue = schema.parse('"TEST"');

      // eslint-disable-next-line
      const _typeCheck: string = parsedValue;
      expect(parsedValue).toEqual('TEST');
    });

    it('should throw if the given json is not a valid string', () => {
      const schema = string();

      expect(() => schema.parse('4')).toThrow();
    });
  });

  describe('generate', () => {
    it('should generate a string', () => {
      const schema = string();

      const generatedValue = schema.generate();

      // eslint-disable-next-line
      const _typeCheck: string = generatedValue;
      expect(generatedValue).toEqual('');
    });

    it('should return the given string', () => {
      const schema = string();

      const generatedValue = schema.generate('TEST');

      // eslint-disable-next-line
      const _typeCheck: string = generatedValue;
      expect(generatedValue).toEqual('TEST');
    });
  });
});
