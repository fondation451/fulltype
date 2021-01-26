import { convertModelTypeToType, convertModelPrimitiveTypeToType } from './convertModelTypeToType';
import { modelType, modelPrimitiveType, modelConstantType, modelObjectType } from './modelType';
import { buildModel } from './buildModel';

export { parseJson };

const model = buildModel({
  kind: 'object',
  content: {
    lala: {
      kind: 'primitive',
      content: 'number',
      exclude: [],
    },
    lili: {
      kind: 'constant',
      content: ['aqui', 'delante'],
      exclude: [],
    },
    lolo: {
      kind: 'array',
      content: {
        kind: 'primitive',
        content: 'boolean',
        exclude: [],
      },
      exclude: [],
    },
  },
  exclude: [],
} as const);

const jsonGood = `{
  "lala": 3,
  "lili": "delante",
  "lolo": [true, false, true]
}`;

const tmp = parseJson(model, jsonGood);

function parseJson<modelT extends modelType>(model: modelT, json: string): convertModelTypeToType<modelT> {
  const parsedJson = JSON.parse(json) as unknown;

  return checkAndParseJson(model, parsedJson);
}

function checkAndParseJson<modelT extends modelType>(
  model: modelT,
  parsedJson: unknown,
): convertModelTypeToType<modelT> {
  switch (model.kind) {
    case 'primitive':
      type modelPrimitiveT = modelT['content'] extends modelPrimitiveType ? modelT['content'] : any;
      return checkAndParsePrimitiveJson(model.content as modelPrimitiveT, parsedJson) as convertModelTypeToType<modelT>;
    case 'constant':
      type modelConstantT = modelT['content'] extends modelConstantType ? modelT['content'] : any;
      const modelConstant = model.content as modelConstantT;

      if (typeof parsedJson === 'string' && modelConstant.includes(parsedJson)) {
        return parsedJson as convertModelTypeToType<modelT>;
      } else {
        throw new Error();
      }
    case 'object':
      if (typeof parsedJson === 'object') {
        type modelObjectT = modelT['content'] extends modelObjectType ? modelT['content'] : any;
        return checkAndParseObjectJson(model.content as modelObjectT, parsedJson) as convertModelTypeToType<modelT>;
      } else {
        throw new Error();
      }
    case 'array':
      if (Array.isArray(parsedJson)) {
        type modelArrayItemT = modelT['content'] extends modelType ? modelT['content'] : any;
        return ((parsedJson as Array<unknown>).map((arrayItem) =>
          checkAndParseJson(model.content as modelArrayItemT, arrayItem),
        ) as unknown) as convertModelTypeToType<modelT>;
      } else {
        throw new Error();
      }
  }
}

function checkAndParsePrimitiveJson<modelPrimitiveT extends modelPrimitiveType>(
  modelPrimitive: modelPrimitiveT,
  parsedJson: unknown,
): convertModelPrimitiveTypeToType<modelPrimitiveT> {
  switch (modelPrimitive) {
    case 'boolean':
      if (typeof parsedJson === 'boolean') {
        return parsedJson as convertModelPrimitiveTypeToType<modelPrimitiveT>;
      } else {
        throw new Error();
      }
    case 'date':
      if (typeof parsedJson === 'string') {
        try {
          return new Date(parsedJson) as convertModelPrimitiveTypeToType<modelPrimitiveT>;
        } catch (_) {
          throw new Error();
        }
      } else {
        throw new Error();
      }
    case 'number':
      if (typeof parsedJson === 'number') {
        return parsedJson as convertModelPrimitiveTypeToType<modelPrimitiveT>;
      } else {
        throw new Error();
      }
    case 'string':
      if (typeof parsedJson === 'string') {
        return parsedJson as convertModelPrimitiveTypeToType<modelPrimitiveT>;
      } else {
        throw new Error();
      }
    case 'void':
      if (parsedJson === undefined) {
        return parsedJson as convertModelPrimitiveTypeToType<modelPrimitiveT>;
      } else {
        throw new Error();
      }
  }

  throw new Error();
}

function checkAndParseObjectJson<modelObjectT extends modelObjectType>(
  modelObject: modelObjectT,
  parsedJson: unknown,
): { [key in keyof modelObjectT]: convertModelTypeToType<modelObjectT[key]> } {
  const parsedObjectJson = {} as { [key in keyof modelObjectT]: convertModelTypeToType<modelObjectT[key]> };

  for (const key in modelObject) {
    parsedObjectJson[key] = checkAndParseJson(modelObject[key], (parsedJson as any)[key]);
  }

  return parsedObjectJson;
}
