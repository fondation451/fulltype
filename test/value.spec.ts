import { value } from '../src/value';

describe('value', () => {
  describe('parse/stringify', () => {
    it('should be idempotent', () => {
      const schema = value(['VALUE1', 'VALUE2'] as const);
      const json = '"VALUE2"';

      const newJson = schema.stringify(schema.parse(json));

      expect(json).toEqual(newJson);
    });
  });

  describe('stringify/parse', () => {
    it('should be idempotent', () => {
      const schema = value(['VALUE1', 'VALUE2'] as const);
      const element = schema.generate('VALUE2');

      const newElement = schema.parse(schema.stringify(element));

      expect(element).toEqual(newElement);
    });
  });

  describe('parse', () => {
    it('should parse a valid value', () => {
      const schema = value(['VALUE1', 'VALUE2'] as const);

      const parsedValue = schema.parse('"VALUE2"');

      // eslint-disable-next-line
      const _typeCheck: 'VALUE1' | 'VALUE2' = parsedValue;
      expect(parsedValue).toEqual('VALUE2');
    });

    it('should throw if the given json is not a valid value', () => {
      const schema = value(['VALUE1', 'VALUE2'] as const);

      expect(() => schema.parse('"TEST"')).toThrow();
    });
  });

  describe('generate', () => {
    it('should generate a value (always first one)', () => {
      const schema = value(['VALUE1', 'VALUE2'] as const);

      const generatedValue = schema.generate();

      // eslint-disable-next-line
      const _typeCheck: 'VALUE1' | 'VALUE2' = generatedValue;
      expect(generatedValue).toEqual('VALUE1');
    });

    it('should return the given value', () => {
      const schema = value(['VALUE1', 'VALUE2'] as const);

      const generatedValue = schema.generate('VALUE2');

      // eslint-disable-next-line
      const _typeCheck: 'VALUE1' | 'VALUE2' = generatedValue;
      expect(generatedValue).toEqual('VALUE2');
    });
  });
});
