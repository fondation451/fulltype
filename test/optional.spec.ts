import { boolean } from '../src/schema/boolean';
import { optional } from '../src/schema/optional';

describe('optional', () => {
  describe('parse/stringify', () => {
    it('should be idempotent (case: defined)', () => {
      const schema = optional(boolean());
      const json = 'true';

      const newJson = schema.stringify(schema.parse(json));

      expect(json).toEqual(newJson);
    });

    it('should be idempotent (case: undefined)', () => {
      const schema = optional(boolean());
      const json = '';

      const newJson = schema.stringify(schema.parse(json));

      expect(json).toEqual(newJson);
    });
  });

  describe('stringify/parse', () => {
    it('should be idempotent (case: defined)', () => {
      const schema = optional(boolean());
      const value = schema.generate(true);

      const newValue = schema.parse(schema.stringify(value));

      expect(value).toEqual(newValue);
    });

    it('should be idempotent (case: undefined)', () => {
      const schema = optional(boolean());
      const value = schema.generate(undefined);

      const newValue = schema.parse(schema.stringify(value));

      expect(value).toEqual(newValue);
    });
  });

  describe('parse', () => {
    it('should parse a valid boolean', () => {
      const schema = optional(boolean());

      const parsedValue = schema.parse('true');

      // eslint-disable-next-line
      const _typeCheck: boolean | undefined = parsedValue;
      expect(parsedValue).toEqual(true);
    });

    it('should parse a valid undefined', () => {
      const schema = optional(boolean());

      const parsedValue = schema.parse('');

      // eslint-disable-next-line
      const _typeCheck: boolean | undefined = parsedValue;
      expect(parsedValue).toEqual(undefined);
    });

    it('should throw if the given json is not a valid boolean or undefined', () => {
      const schema = optional(boolean());

      expect(() => schema.parse('"TEST"')).toThrow();
    });
  });

  describe('generate', () => {
    it('should generate a boolean', () => {
      const schema = optional(boolean());

      const generatedValue = schema.generate();

      // eslint-disable-next-line
      const _typeCheck: boolean | undefined = generatedValue;
      expect(generatedValue).toEqual(false);
    });
  });
});
