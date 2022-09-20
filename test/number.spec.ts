import { number } from '../src/schema/number';

describe('number', () => {
  describe('parse/stringify', () => {
    it('should be idempotent', () => {
      const schema = number();
      const json = '4';

      const newJson = schema.stringify(schema.parse(json));

      expect(json).toEqual(newJson);
    });
  });

  describe('stringify/parse', () => {
    it('should be idempotent', () => {
      const schema = number();
      const value = schema.generate(4);

      const newValue = schema.parse(schema.stringify(value));

      expect(value).toEqual(newValue);
    });
  });

  describe('parse', () => {
    it('should parse a valid number', () => {
      const schema = number();

      const parsedValue = schema.parse('4');

      // eslint-disable-next-line
      const _typeCheck: number = parsedValue;
      expect(parsedValue).toEqual(4);
    });

    it('should throw if the given json is not a valid number', () => {
      const schema = number();

      expect(() => schema.parse('"TEST"')).toThrow('Failure');
    });
  });

  describe('generate', () => {
    it('should generate a number', () => {
      const schema = number();

      const generatedValue = schema.generate();

      // eslint-disable-next-line
      const _typeCheck: number = generatedValue;
      expect(generatedValue).toEqual(0);
    });

    it('should return the given number', () => {
      const schema = number();

      const generatedValue = schema.generate(4);

      // eslint-disable-next-line
      const _typeCheck: number = generatedValue;
      expect(generatedValue).toEqual(4);
    });
  });
});
