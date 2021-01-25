import { convertModelTypeToType, convertModelPrimitiveTypeToType } from './convertModelTypeToType';
import { modelType, modelPrimitiveType, modelConstantType } from './modelType';
import { buildModel } from './buildModel';

export { parseJson };

const model = buildModel({
  kind: 'primitive',
  content: 'string',
  exclude: [],
});

const json = '"lala"';

const tmp = parseJson(model, json);

function parseJson<modelT extends modelType>(model: modelT, json: string): convertModelTypeToType<modelT> {
  const parsedJson = JSON.parse(json) as unknown;

  return parseAndCheckJson(model, parsedJson);
}

function parseAndCheckJson<modelT extends modelType>(
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
      } else {
        throw new Error();
      }
      return 0 as convertModelTypeToType<modelT>;
    case 'array':
      return 0 as convertModelTypeToType<modelT>;
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

function checkAndParseObjectJson<modelPrimitiveT extends modelPrimitiveType>(
  modelPrimitive: modelPrimitiveT,
  parsedJson: unknown,
): convertModelPrimitiveTypeToType<modelPrimitiveT> {}
