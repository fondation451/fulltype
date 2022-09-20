import { boolean } from '../src/schema/boolean';
import { number } from '../src/schema/number';
import { object } from '../src/schema/object';

describe('object', () => {
  describe('parse/stringify', () => {
    it('should be idempotent', () => {
      const schema = object({
        field1: number(),
        field2: boolean(),
      });
      const json = '{"field1":1,"field2":true}';

      const newJson = schema.stringify(schema.parse(json));

      expect(json).toEqual(newJson);
    });
  });

  describe('stringify/parse', () => {
    it('should be idempotent', () => {
      const schema = object({
        field1: number(),
        field2: boolean(),
      });
      const value = schema.generate({ field1: 1, field2: true });

      const newValue = schema.parse(schema.stringify(value));

      expect(value).toEqual(newValue);
    });
  });

  describe('parse', () => {
    it('should parse a valid object', () => {
      const schema = object({
        field1: number(),
        field2: boolean(),
      });

      const parsedValue = schema.parse('{ "field1": 1, "field2": true }');

      // eslint-disable-next-line
      const _typeCheck: { field1: number; field2: boolean } = parsedValue;
      expect(parsedValue).toEqual({ field1: 1, field2: true });
    });

    it('should throw if the given json is not a valid object', () => {
      const schema = object({
        field1: number(),
        field2: boolean(),
      });

      expect(() => schema.parse('"TEST"')).toThrow('Failure');
    });

    it('should throw if there is a missing field in the given json', () => {
      const schema = object({
        field1: number(),
        field2: boolean(),
      });

      expect(() => schema.parse('{ "field1": 1 }')).toThrow('Failure');
    });
  });

  describe('generate', () => {
    it('should generate an object', () => {
      const schema = object({
        field1: number(),
        field2: boolean(),
      });

      const generatedValue = schema.generate();

      // eslint-disable-next-line
      const _typeCheck: { field1: number; field2: boolean } = generatedValue;
      expect(generatedValue).toEqual({ field1: 0, field2: false });
    });

    it('should generate an object with the given fields', () => {
      const schema = object({
        field1: number(),
        field2: boolean(),
      });

      const generatedValue = schema.generate({ field2: true });

      // eslint-disable-next-line
      const _typeCheck: { field1: number; field2: boolean } = generatedValue;
      expect(generatedValue).toEqual({ field1: 0, field2: true });
    });
  });
});
