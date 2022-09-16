import { date } from '../src/v2/date';

describe('date', () => {
  describe('parse', () => {
    it('should parse a valid date', () => {
      const schema = date();

      const parsedValue = schema.parse('"2022-09-16T00:00:00.000Z"');

      // eslint-disable-next-line
      const _typeCheck: Date = parsedValue;
      expect(parsedValue).toEqual(new Date('2022-09-16T00:00:00.000Z'));
    });

    it('should throw if the given json is not a valid date', () => {
      const schema = date();

      expect(() => schema.parse('"TEST"')).toThrow('Invalid date parsed');
    });
  });

  describe('generate', () => {
    it('should generate a date', () => {
      const schema = date();

      const generatedValue = schema.generate();

      // eslint-disable-next-line
      const _typeCheck: Date = generatedValue;
      expect(generatedValue).toEqual(new Date('1970-01-01T00:00:00.000Z'));
    });

    it('should return the given date', () => {
      const schema = date();

      const generatedValue = schema.generate(new Date('2022-09-16T00:00:00.000Z'));

      // eslint-disable-next-line
      const _typeCheck: Date = generatedValue;
      expect(generatedValue).toEqual(new Date('2022-09-16T00:00:00.000Z'));
    });
  });
});
