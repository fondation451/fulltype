import { numberStr } from '../src/numberStr';

describe('numberStr', () => {
  describe('parse/stringify', () => {
    it('should be idempotent', () => {
      const schema = numberStr();
      const json = '"4.5"';

      const newJson = schema.stringify(schema.parse(json));

      expect(json).toEqual(newJson);
    });
  });

  describe('stringify/parse', () => {
    it('should be idempotent', () => {
      const schema = numberStr();
      const value = schema.generate(4.5);

      const newValue = schema.parse(schema.stringify(value));

      expect(value).toEqual(newValue);
    });
  });

  describe('parse', () => {
    it('should parse a valid number as a string', () => {
      const schema = numberStr();

      const parsedValue = schema.parse('"4.5"');

      // eslint-disable-next-line
      const _typeCheck: number | undefined = parsedValue;
      expect(parsedValue).toEqual(4.5);
    });

    it('should throw if the given json is not a valid number', () => {
      const schema = numberStr();

      const parsedValue = schema.parse('""');

      // eslint-disable-next-line
      const _typeCheck: number | undefined = parsedValue;
      expect(parsedValue).toEqual(undefined);
    });

    it('should throw if the given json is not a valid string number', () => {
      const schema = numberStr();

      expect(() => schema.parse('false')).toThrow();
    });
  });

  describe('generate', () => {
    it('should generate a number', () => {
      const schema = numberStr();

      const generatedValue = schema.generate();

      // eslint-disable-next-line
      const _typeCheck: number | undefined = generatedValue;
      expect(generatedValue).toEqual(0);
    });

    it('should return the given number', () => {
      const schema = numberStr();

      const generatedValue = schema.generate(4.5);

      // eslint-disable-next-line
      const _typeCheck: number | undefined = generatedValue;
      expect(generatedValue).toEqual(4.5);
    });
  });
});
