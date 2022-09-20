import { date } from '../src/schema/date';

describe('date', () => {
  describe('parse/stringify', () => {
    it('should be idempotent', () => {
      const schema = date();
      const json = '"2022-09-16T00:00:00.000Z"';

      const newJson = schema.stringify(schema.parse(json));

      expect(json).toEqual(newJson);
    });
  });

  describe('stringify/parse', () => {
    it('should be idempotent', () => {
      const schema = date();
      const value = schema.generate(new Date('2022-09-16T00:00:00.000Z'));

      const newValue = schema.parse(schema.stringify(value));

      expect(value).toEqual(newValue);
    });
  });

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

      expect(() => schema.parse('"TEST"')).toThrow('Failure');
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
