import { boolean } from '../src/boolean';

describe('boolean', () => {
  describe('parse/stringify', () => {
    it('should be idempotent', () => {
      const schema = boolean();
      const json = 'true';

      const newJson = schema.stringify(schema.parse(json));

      expect(json).toEqual(newJson);
    });
  });

  describe('stringify/parse', () => {
    it('should be idempotent', () => {
      const schema = boolean();
      const value = schema.generate(true);

      const newValue = schema.parse(schema.stringify(value));

      expect(value).toEqual(newValue);
    });
  });

  describe('parse', () => {
    it('should parse a valid boolean', () => {
      const schema = boolean();

      const parsedValue = schema.parse('true');

      // eslint-disable-next-line
      const _typeCheck: boolean = parsedValue;
      expect(parsedValue).toEqual(true);
    });

    it('should throw if the given json is not a valid boolean', () => {
      const schema = boolean();

      expect(() => schema.parse('"TEST"')).toThrow();
    });
  });

  describe('generate', () => {
    it('should generate a boolean', () => {
      const schema = boolean();

      const generatedValue = schema.generate();

      // eslint-disable-next-line
      const _typeCheck: boolean = generatedValue;
      expect(generatedValue).toEqual(false);
    });

    it('should return the given boolean', () => {
      const schema = boolean();

      const generatedValue = schema.generate(true);

      // eslint-disable-next-line
      const _typeCheck: boolean = generatedValue;
      expect(generatedValue).toEqual(true);
    });
  });
});
