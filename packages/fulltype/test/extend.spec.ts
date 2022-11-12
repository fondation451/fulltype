import { boolean } from '../src/boolean';
import { extend } from '../src/extend';
import { number } from '../src/number';
import { object } from '../src/object';
import { optional } from '../src/optional';

describe('object', () => {
  describe('parse/stringify', () => {
    it('should be idempotent', () => {
      const baseObjectSchema = object({ field1: number() });
      const extendObjectSchema = object({ field2: boolean() });
      const schema = extend(baseObjectSchema, extendObjectSchema);
      const json = '{"field1":1,"field2":true}';

      const newJson = schema.stringify(schema.parse(json));

      expect(json).toEqual(newJson);
    });
  });

  describe('stringify/parse', () => {
    it('should be idempotent', () => {
      const baseObjectSchema = object({ field1: number() });
      const extendObjectSchema = object({ field2: boolean() });
      const schema = extend(baseObjectSchema, extendObjectSchema);
      const value = schema.generate({ field1: 1, field2: true });

      const newValue = schema.parse(schema.stringify(value));

      expect(value).toEqual(newValue);
    });
  });

  describe('parse', () => {
    it('should parse a valid object', () => {
      const baseObjectSchema = object({ field1: number() });
      const extendObjectSchema = object({ field2: boolean() });
      const schema = extend(baseObjectSchema, extendObjectSchema);

      const parsedValue = schema.parse('{ "field1": 1, "field2": true }');

      // eslint-disable-next-line
      const _typeCheck: { field1: number; field2: boolean } = parsedValue;
      expect(parsedValue).toEqual({ field1: 1, field2: true });
    });

    it('should parse a valid object with optional field', () => {
      const baseObjectSchema = object({ field1: optional(number()) });
      const extendObjectSchema = object({ field2: boolean() });
      const schema = extend(baseObjectSchema, extendObjectSchema);

      const parsedValue = schema.parse('{ "field2": true }');

      // eslint-disable-next-line
      const _typeCheck: { field1?: number; field2: boolean } = parsedValue;
      expect(parsedValue).toEqual({ field2: true });
    });

    it('should throw if the given json is not a valid object', () => {
      const baseObjectSchema = object({ field1: number() });
      const extendObjectSchema = object({ field2: boolean() });
      const schema = extend(baseObjectSchema, extendObjectSchema);

      expect(() => schema.parse('"TEST"')).toThrow();
    });

    it('should throw if there is a missing field in the given json', () => {
      const baseObjectSchema = object({ field1: number() });
      const extendObjectSchema = object({ field2: boolean() });
      const schema = extend(baseObjectSchema, extendObjectSchema);

      expect(() => schema.parse('{ "field1": 1 }')).toThrow();
    });
  });

  describe('generate', () => {
    it('should generate an object', () => {
      const baseObjectSchema = object({ field1: number() });
      const extendObjectSchema = object({ field2: boolean() });
      const schema = extend(baseObjectSchema, extendObjectSchema);

      const generatedValue = schema.generate();

      // eslint-disable-next-line
      const _typeCheck: { field1: number; field2: boolean } = generatedValue;
      expect(generatedValue).toEqual({ field1: 0, field2: false });
    });

    it('should generate an object with the given fields', () => {
      const baseObjectSchema = object({ field1: number() });
      const extendObjectSchema = object({ field2: boolean() });
      const schema = extend(baseObjectSchema, extendObjectSchema);

      const generatedValue = schema.generate({ field2: true });

      // eslint-disable-next-line
      const _typeCheck: { field1: number; field2: boolean } = generatedValue;
      expect(generatedValue).toEqual({ field1: 0, field2: true });
    });
  });
});
