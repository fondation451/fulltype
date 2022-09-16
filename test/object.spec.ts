import { boolean } from '../src/v2/boolean';
import { number } from '../src/v2/number';
import { object } from '../src/v2/object';

describe('object', () => {
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

      expect(() => schema.parse('"TEST"')).toThrow('Invalid object parsed');
    });

    it('should throw if there is a missing field in the given json', () => {
      const schema = object({
        field1: number(),
        field2: boolean(),
      });

      expect(() => schema.parse('{ "field1": 1 }')).toThrow('Undefined object property');
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
