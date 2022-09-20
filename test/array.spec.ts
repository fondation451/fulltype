import { array } from '../src/schema/array';
import { number } from '../src/schema/number';

describe('array', () => {
  describe('parse/stringify', () => {
    it('should be idempotent', () => {
      const schema = array(number());
      const json = '[1,2]';

      const newJson = schema.stringify(schema.parse(json));

      expect(json).toEqual(newJson);
    });
  });

  describe('stringify/parse', () => {
    it('should be idempotent', () => {
      const schema = array(number());
      const value = schema.generate([1, 2]);

      const newValue = schema.parse(schema.stringify(value));

      expect(value).toEqual(newValue);
    });
  });

  describe('parse', () => {
    it('should parse a valid array', () => {
      const schema = array(number());

      const parsedValue = schema.parse('[1, 2]');

      // eslint-disable-next-line
      const _typeCheck: number[] = parsedValue;
      expect(parsedValue).toEqual([1, 2]);
    });

    it('should throw if the given json is not a valid array', () => {
      const schema = array(number());

      expect(() => schema.parse('"TEST"')).toThrow('Failure');
    });

    it('should throw if there is an ill typed array element', () => {
      const schema = array(number());

      expect(() => schema.parse('[1, true]')).toThrow('Failure');
    });
  });

  describe('generate', () => {
    it('should generate an array', () => {
      const schema = array(number());

      const generatedValue = schema.generate();

      // eslint-disable-next-line
      const _typeCheck: number[] = generatedValue;
      expect(generatedValue).toEqual([0]);
    });

    it('should return the given array', () => {
      const schema = array(number());

      const generatedValue = schema.generate([3, 6]);

      // eslint-disable-next-line
      const _typeCheck: number[] = generatedValue;
      expect(generatedValue).toEqual([3, 6]);
    });
  });
});
