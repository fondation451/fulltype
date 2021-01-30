import { buildModel } from '../src/model/buildModel';
import { parseJson } from '../src/model/parseJson';

describe('parseJson', () => {
  describe('good case', () => {
    describe('primitive case', () => {
      it('should parse a valid JSON (case number)', () => {
        const model = buildModel({
          kind: 'primitive',
          content: 'number',
          exclude: [],
        } as const);
        const json = `3`;

        const parsedJson = parseJson(model, json);

        const _typeCheck: number = parsedJson;
        expect(parsedJson).toEqual(JSON.parse(json));
      });

      it('should parse a valid JSON (case boolean)', () => {
        const model = buildModel({
          kind: 'primitive',
          content: 'boolean',
          exclude: [],
        } as const);
        const json = `true`;

        const parsedJson = parseJson(model, json);

        const _typeCheck: boolean = parsedJson;
        expect(parsedJson).toEqual(JSON.parse(json));
      });

      it('should parse a valid JSON (case string)', () => {
        const model = buildModel({
          kind: 'primitive',
          content: 'string',
          exclude: [],
        } as const);
        const json = `"STRING"`;

        const parsedJson = parseJson(model, json);

        const _typeCheck: string = parsedJson;
        expect(parsedJson).toEqual(JSON.parse(json));
      });

      it('should parse a valid JSON (case date)', () => {
        const model = buildModel({
          kind: 'primitive',
          content: 'date',
          exclude: [],
        } as const);
        const json = `"2021-01-26T18:52:28.926Z"`;

        const parsedJson = parseJson(model, json);

        const _typeCheck: Date = parsedJson;
        expect(parsedJson.toISOString()).toEqual(JSON.parse(json));
      });
    });

    it('should parse a valid JSON (constant case)', () => {
      const model = buildModel({
        kind: 'constant',
        content: ['CONSTANT_1', 'CONSTANT_2'],
        exclude: [],
      } as const);
      const json = `"CONSTANT_2"`;

      const parsedJson = parseJson(model, json);

      const _typeCheck: 'CONSTANT_1' | 'CONSTANT_2' = parsedJson;
      expect(parsedJson).toEqual(JSON.parse(json));
    });

    it('should parse a valid JSON (array case)', () => {
      const model = buildModel({
        kind: 'array',
        content: {
          kind: 'primitive',
          content: 'boolean',
          exclude: [],
        },
        exclude: [],
      } as const);
      const json = `[true, false, true]`;

      const parsedJson = parseJson(model, json);

      const _typeCheck: boolean[] = parsedJson;
      expect(parsedJson).toEqual(JSON.parse(json));
    });

    it('should parse a valid JSON (object case)', () => {
      const model = buildModel({
        kind: 'object',
        content: {
          field1: { kind: 'primitive', content: 'boolean', exclude: [] },
          field2: { kind: 'primitive', content: 'number', exclude: [] },
          field3: { kind: 'primitive', content: 'string', exclude: [] },
        },
        exclude: [],
      } as const);
      const json = `{
          "field1": false,
          "field2": 1,
          "field3": "STRING"
        }`;

      const parsedJson = parseJson(model, json);

      const _typeCheck: { field1: boolean; field2: number; field3: string } = parsedJson;
      expect(parsedJson).toEqual(JSON.parse(json));
    });

    it('should parse a valid JSON (general case)', () => {
      const model = buildModel({
        kind: 'object',
        content: {
          field1: { kind: 'primitive', content: 'boolean', exclude: [] },
          field2: {
            kind: 'array',
            content: {
              kind: 'object',
              content: {
                arraySubField1: {
                  kind: 'primitive',
                  content: 'string',
                  exclude: [],
                },
                arraySubField2: {
                  kind: 'array',
                  content: {
                    kind: 'primitive',
                    content: 'boolean',
                    exclude: [],
                  },
                  exclude: [],
                },
                arraySubField3: {
                  kind: 'constant',
                  content: ['CONSTANT1', 'CONSTANT2'],
                  exclude: [],
                },
              },
              exclude: [],
            },
            exclude: [],
          },
          field3: {
            kind: 'array',
            content: {
              kind: 'constant',
              content: ['ANOTHER_CONSTANT1', 'ANOTHER_CONSTANT2'],
              exclude: [],
            },
            exclude: [],
          },
        },
        exclude: [],
      } as const);
      const json = `{
        "field1": false,
        "field2": [
          {
            "arraySubField1": "STRING",
            "arraySubField2": [true, false, true],
            "arraySubField3": "CONSTANT2"
          },
          {
            "arraySubField1": "ANOTHER_STRING",
            "arraySubField2": [false, false],
            "arraySubField3": "CONSTANT1"
          }
        ],
        "field3": ["ANOTHER_CONSTANT1", "ANOTHER_CONSTANT1", "ANOTHER_CONSTANT2"]
      }`;

      const parsedJson = parseJson(model, json);

      const _typeCheck: {
        field1: boolean;
        field2: Array<{
          arraySubField1: string;
          arraySubField2: Array<boolean>;
          arraySubField3: 'CONSTANT1' | 'CONSTANT2';
        }>;
        field3: Array<'ANOTHER_CONSTANT1' | 'ANOTHER_CONSTANT2'>;
      } = parsedJson;
      expect(parsedJson).toEqual(JSON.parse(json));
    });
  });

  describe('bad case', () => {
    describe('primitive case', () => {
      it('should throw an Error with invalid JSON (case number)', () => {
        const model = buildModel({
          kind: 'primitive',
          content: 'number',
          exclude: [],
        } as const);
        const json = `"STRING"`;

        expect(() => parseJson(model, json)).toThrow('Expected number, but got STRING');
      });

      it('should throw an Error with invalid JSON (case boolean)', () => {
        const model = buildModel({
          kind: 'primitive',
          content: 'boolean',
          exclude: [],
        } as const);
        const json = `3`;

        expect(() => parseJson(model, json)).toThrow('Expected boolean, but got 3');
      });

      it('should throw an Error with invalid JSON (case string)', () => {
        const model = buildModel({
          kind: 'primitive',
          content: 'string',
          exclude: [],
        } as const);
        const json = `true`;

        expect(() => parseJson(model, json)).toThrow('Expected string, but got true');
      });

      it('should throw an Error with invalid JSON (case date)', () => {
        const model = buildModel({
          kind: 'primitive',
          content: 'date',
          exclude: [],
        } as const);
        const json = `3`;

        expect(() => parseJson(model, json)).toThrow('Expected date, but got 3');
      });

      it('should throw an Error with invalid JSON (case invalid date)', () => {
        const model = buildModel({
          kind: 'primitive',
          content: 'date',
          exclude: [],
        } as const);
        const json = `"INVALID DATE"`;

        expect(() => parseJson(model, json)).toThrow('Expected date, but got INVALID DATE');
      });
    });

    describe('constant case', () => {
      it('should throw an Error with invalid JSON (not the good type case)', () => {
        const model = buildModel({
          kind: 'constant',
          content: ['CONSTANT_1', 'CONSTANT_2'],
          exclude: [],
        } as const);
        const json = `3`;

        expect(() => parseJson(model, json)).toThrow(
          'Expected one of these constants [CONSTANT_1,CONSTANT_2], but got 3',
        );
      });

      it('should throw an Error with invalid JSON (not the good constant case)', () => {
        const model = buildModel({
          kind: 'constant',
          content: ['CONSTANT_1', 'CONSTANT_2'],
          exclude: [],
        } as const);
        const json = `\"ANOTHER_CONSTANT\"`;

        expect(() => parseJson(model, json)).toThrow(
          'Expected one of these constants [CONSTANT_1,CONSTANT_2], but got ANOTHER_CONSTANT',
        );
      });
    });

    describe('object case', () => {
      it('should throw an Error with invalid JSON (not an object case)', () => {
        const model = buildModel({
          kind: 'object',
          content: {
            field: { kind: 'primitive', content: 'string', exclude: [] },
          },
          exclude: [],
        } as const);
        const json = `\"STRING\"`;

        expect(() => parseJson(model, json)).toThrow('Expected an object, but got STRING');
      });
    });

    describe('array case', () => {
      it('should throw an Error with invalid JSON (not an array case)', () => {
        const model = buildModel({
          kind: 'array',
          content: {
            kind: 'primitive',
            content: 'string',
            exclude: [],
          },
          exclude: [],
        } as const);
        const json = `\"STRING\"`;

        expect(() => parseJson(model, json)).toThrow('Expected an array, but got STRING');
      });
    });
  });
});
