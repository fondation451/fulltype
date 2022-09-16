import { string } from '../src/v2/string';

describe('string', () => {
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

      expect(() => schema.parse('4')).toThrow('Invalid string parsed');
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
