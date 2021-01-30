import { convertModelTypeToType, convertModelPrimitiveTypeToType } from './convertModelTypeToType';
import { modelType, modelPrimitiveType, modelConstantType, modelObjectType } from './modelType';

export { parseJson };

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
        throwPrimitiveTypeError(modelPrimitive, parsedJson);
      }
    case 'date':
      if (typeof parsedJson === 'string') {
        const parsedDate = new Date(parsedJson);
        if (!isNaN(parsedDate.getDate())) {
          return parsedDate as convertModelPrimitiveTypeToType<modelPrimitiveT>;
        } else {
          throwPrimitiveTypeError(modelPrimitive, parsedJson);
        }
      } else {
        throwPrimitiveTypeError(modelPrimitive, parsedJson);
      }
    case 'number':
      if (typeof parsedJson === 'number') {
        return parsedJson as convertModelPrimitiveTypeToType<modelPrimitiveT>;
      } else {
        throwPrimitiveTypeError(modelPrimitive, parsedJson);
      }
    case 'string':
      if (typeof parsedJson === 'string') {
        return parsedJson as convertModelPrimitiveTypeToType<modelPrimitiveT>;
      } else {
        throwPrimitiveTypeError(modelPrimitive, parsedJson);
      }
    case 'void':
      if (parsedJson === undefined) {
        return parsedJson as convertModelPrimitiveTypeToType<modelPrimitiveT>;
      } else {
        throwPrimitiveTypeError(modelPrimitive, parsedJson);
      }
  }

  throwTypeEngineError();
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

function throwPrimitiveTypeError(modelPrimitive: modelPrimitiveType, parsedJson: unknown) {
  throw new Error(`Expected ${modelPrimitive}, but got ${parsedJson}`);
}

function throwTypeEngineError(): never {
  throw new Error(`TYPE ENGINE ERROR`);
}
