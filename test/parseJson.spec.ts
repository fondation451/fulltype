import { ObjectId } from 'mongodb';
import { buildModel } from '../src/typeArchitect/buildModel';
import { parseJson } from '../src/typeArchitect/parseJson';

describe('parseJson', () => {
  describe('good case', () => {
    describe('primitive case', () => {
      it('should parse a valid JSON (case number)', () => {
        const model = buildModel({
          kind: 'primitive',
          content: 'number',
        } as const);
        const json = `3`;

        const parsedJson = parseJson({ model, json });

        const _typeCheck: number = parsedJson;
        expect(parsedJson).toEqual(JSON.parse(json));
      });

      it('should parse a valid JSON (case boolean)', () => {
        const model = buildModel({
          kind: 'primitive',
          content: 'boolean',
        } as const);
        const json = `true`;

        const parsedJson = parseJson({ model, json });

        const _typeCheck: boolean = parsedJson;
        expect(parsedJson).toEqual(JSON.parse(json));
      });

      it('should parse a valid JSON (case string)', () => {
        const model = buildModel({
          kind: 'primitive',
          content: 'string',
        } as const);
        const json = `"STRING"`;

        const parsedJson = parseJson({ model, json });

        const _typeCheck: string = parsedJson;
        expect(parsedJson).toEqual(JSON.parse(json));
      });

      it('should parse a valid JSON (case date)', () => {
        const model = buildModel({
          kind: 'primitive',
          content: 'date',
        } as const);
        const json = `"2021-01-26T18:52:28.926Z"`;

        const parsedJson = parseJson({ model, json });

        const _typeCheck: Date = parsedJson;
        expect(parsedJson.toISOString()).toEqual(JSON.parse(json));
      });
    });

    it('should parse a valid JSON (constant case)', () => {
      const model = buildModel({
        kind: 'constant',
        content: ['CONSTANT_1', 'CONSTANT_2'],
      } as const);
      const json = `"CONSTANT_2"`;

      const parsedJson = parseJson({ model, json });

      const _typeCheck: 'CONSTANT_1' | 'CONSTANT_2' = parsedJson;
      expect(parsedJson).toEqual(JSON.parse(json));
    });

    describe('custom case', () => {
      it('should parse a valid JSON (custom string)', () => {
        const model = buildModel({
          kind: 'custom',
          content: 'CUSTOM_TYPE',
        } as const);
        const json = `"CUSTOM_TYPE_VALUE"`;

        const parsedJson = parseJson({
          model,
          json,
          customMapping: { CUSTOM_TYPE: (value) => `constructor(${value})` },
        });

        const _typeCheck: string = parsedJson;
        expect(parsedJson).toEqual('constructor(CUSTOM_TYPE_VALUE)');
      });

      it('should parse a valid JSON (custom object id)', () => {
        const model = buildModel({
          kind: 'custom',
          content: 'Mongo_ID',
        } as const);
        const json = `${JSON.stringify(new ObjectId())}`;

        const parsedJson = parseJson({ model, json, customMapping: { Mongo_ID: (idStr) => new ObjectId(idStr) } });

        const _typeCheck: ObjectId = parsedJson;
        expect(JSON.stringify(parsedJson)).toEqual(json);
      });
    });

    it('should parse a valid JSON (array case)', () => {
      const model = buildModel({
        kind: 'array',
        content: {
          kind: 'primitive',
          content: 'boolean',
        },
      } as const);
      const json = `[true, false, true]`;

      const parsedJson = parseJson({ model, json });

      const _typeCheck: boolean[] = parsedJson;
      expect(parsedJson).toEqual(JSON.parse(json));
    });

    it('should parse a valid JSON (object case)', () => {
      const model = buildModel({
        kind: 'object',
        content: {
          field1: { kind: 'primitive', content: 'boolean' },
          field2: { kind: 'primitive', content: 'number' },
          field3: { kind: 'primitive', content: 'string' },
        },
      } as const);
      const json = `{
          "field1": false,
          "field2": 1,
          "field3": "STRING"
        }`;

      const parsedJson = parseJson({ model, json });

      const _typeCheck: { field1: boolean; field2: number; field3: string } = parsedJson;
      expect(parsedJson).toEqual(JSON.parse(json));
    });

    it('should parse a valid JSON (general case)', () => {
      const model = buildModel({
        kind: 'object',
        content: {
          field1: { kind: 'primitive', content: 'boolean' },
          field2: {
            kind: 'array',
            content: {
              kind: 'object',
              content: {
                arraySubField1: {
                  kind: 'primitive',
                  content: 'string',
                },
                arraySubField2: {
                  kind: 'array',
                  content: {
                    kind: 'primitive',
                    content: 'boolean',
                  },
                },
                arraySubField3: {
                  kind: 'constant',
                  content: ['CONSTANT1', 'CONSTANT2'],
                },
              },
            },
          },
          field3: {
            kind: 'array',
            content: {
              kind: 'constant',
              content: ['ANOTHER_CONSTANT1', 'ANOTHER_CONSTANT2'],
            },
          },
        },
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

      const parsedJson = parseJson({ model, json });

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
        } as const);
        const json = `"STRING"`;

        expect(() => parseJson({ model, json })).toThrow('Expected number, but got STRING');
      });

      it('should throw an Error with invalid JSON (case boolean)', () => {
        const model = buildModel({
          kind: 'primitive',
          content: 'boolean',
        } as const);
        const json = `3`;

        expect(() => parseJson({ model, json })).toThrow('Expected boolean, but got 3');
      });

      it('should throw an Error with invalid JSON (case string)', () => {
        const model = buildModel({
          kind: 'primitive',
          content: 'string',
        } as const);
        const json = `true`;

        expect(() => parseJson({ model, json })).toThrow('Expected string, but got true');
      });

      it('should throw an Error with invalid JSON (case date)', () => {
        const model = buildModel({
          kind: 'primitive',
          content: 'date',
        } as const);
        const json = `3`;

        expect(() => parseJson({ model, json })).toThrow('Expected date, but got 3');
      });

      it('should throw an Error with invalid JSON (case invalid date)', () => {
        const model = buildModel({
          kind: 'primitive',
          content: 'date',
        } as const);
        const json = `"INVALID DATE"`;

        expect(() => parseJson({ model, json })).toThrow('Expected date, but got INVALID DATE');
      });
    });

    describe('constant case', () => {
      it('should throw an Error with invalid JSON (not the good type case)', () => {
        const model = buildModel({
          kind: 'constant',
          content: ['CONSTANT_1', 'CONSTANT_2'],
        } as const);
        const json = `3`;

        expect(() => parseJson({ model, json })).toThrow(
          'Expected one of these constants [CONSTANT_1,CONSTANT_2], but got 3',
        );
      });

      it('should throw an Error with invalid JSON (not the good constant case)', () => {
        const model = buildModel({
          kind: 'constant',
          content: ['CONSTANT_1', 'CONSTANT_2'],
        } as const);
        const json = `\"ANOTHER_CONSTANT\"`;

        expect(() => parseJson({ model, json })).toThrow(
          'Expected one of these constants [CONSTANT_1,CONSTANT_2], but got ANOTHER_CONSTANT',
        );
      });
    });

    describe('object case', () => {
      it('should throw an Error with invalid JSON (not an object case)', () => {
        const model = buildModel({
          kind: 'object',
          content: {
            field: { kind: 'primitive', content: 'string' },
          },
        } as const);
        const json = `\"STRING\"`;

        expect(() => parseJson({ model, json })).toThrow('Expected an object, but got STRING');
      });
    });

    describe('array case', () => {
      it('should throw an Error with invalid JSON (not an array case)', () => {
        const model = buildModel({
          kind: 'array',
          content: { kind: 'primitive', content: 'string' },
        } as const);
        const json = `\"STRING\"`;

        expect(() => parseJson({ model, json })).toThrow('Expected an array, but got STRING');
      });
    });

    describe('general case', () => {
      const model = buildModel({
        kind: 'object',
        content: {
          field1: { kind: 'primitive', content: 'string' },
          field2: {
            kind: 'array',
            content: {
              kind: 'object',
              content: {
                arraySubField1: { kind: 'primitive', content: 'number' },
                arraySubField2: { kind: 'constant', content: ['CONSTANT1', 'CONSTANT2'] },
              },
            },
          },
        },
      } as const);

      it('should throw an Error with invalid JSON (case 1)', () => {
        const json = `{
          "field1": false,
          "field2": [
            {
              "arraySubField1": 1,
              "arraySubField2": "CONSTANT1"
            },
            {
              "arraySubField1": 0,
              "arraySubField2": "CONSTANT2"
            }
          ]
        }`;

        expect(() => parseJson({ model, json })).toThrow('Expected string, but got false');
      });

      it('should throw an Error with invalid JSON (case 2)', () => {
        const json = `{
          "field1": "string",
          "field2": [
            {
              "arraySubField1": false,
              "arraySubField2": "CONSTANT1"
            },
            {
              "arraySubField1": 0,
              "arraySubField2": "CONSTANT2"
            }
          ]
        }`;

        expect(() => parseJson({ model, json })).toThrow('Expected number, but got false');
      });

      it('should throw an Error with invalid JSON (case 3)', () => {
        const json = `{
          "field1": "string",
          "field2": [
            {
              "arraySubField1": 1,
              "arraySubField2": "CONSTANT1"
            },
            {
              "arraySubField1": 0,
              "arraySubField2": false
            }
          ]
        }`;

        expect(() => parseJson({ model, json })).toThrow(
          'Expected one of these constants [CONSTANT1,CONSTANT2], but got false',
        );
      });
    });
  });
});
