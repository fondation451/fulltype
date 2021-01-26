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
    describe('constant case', () => {
      it('should parse a valid JSON (constant)', () => {
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
    });
    describe('array case', () => {
      it('should parse a valid JSON (array)', () => {
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
    });
    describe('object case', () => {
      it('should parse a valid JSON (object)', () => {
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
    });
  });
});
