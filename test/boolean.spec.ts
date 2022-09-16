import { boolean } from '../src/v2/boolean';

describe('boolean', () => {
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

      expect(() => schema.parse('"TEST"')).toThrow('Invalid boolean parsed');
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
