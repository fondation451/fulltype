import { number } from '../src/v2/number';

describe('number', () => {
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

      expect(() => schema.parse('"TEST"')).toThrow('Invalid number parsed');
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
