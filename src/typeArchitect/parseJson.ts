import {
  buildType,
  buildPrimitiveType,
  customMappingType,
  modelType,
  modelPrimitiveType,
  modelConstantType,
  modelObjectType,
  modelOrType,
} from '../types';

export { parseJson };

function parseJson<modelT extends modelType, customMappingT extends customMappingType>({
  model,
  customMapping = {} as { [key in keyof customMappingT]: (jsonValue: string) => customMappingT[key] },
  json,
}: {
  model: modelT;
  customMapping?: { [key in keyof customMappingT]: (jsonValue: string) => customMappingT[key] };
  json: string;
}): buildType<modelT, customMappingT> {
  const parsedJson = JSON.parse(json) as unknown;

  return checkAndParseJson({ model, customMapping, parsedJson });
}

function checkAndParseJson<modelT extends modelType, customMappingT extends customMappingType>({
  model,
  customMapping,
  parsedJson,
}: {
  model: modelT;
  customMapping: { [key in keyof customMappingT]: (jsonValue: string) => customMappingT[key] };
  parsedJson: unknown;
}): buildType<modelT, customMappingT> {
  switch (model.kind) {
    case 'primitive':
      type modelPrimitiveT = modelT['content'] extends modelPrimitiveType ? modelT['content'] : any;
      return checkAndParsePrimitiveJson(model.content as modelPrimitiveT, parsedJson) as buildType<
        modelT,
        customMappingT
      >;
    case 'constant':
      type modelConstantT = modelT['content'] extends modelConstantType ? modelT['content'] : any;
      const modelConstant = model.content as modelConstantT;

      if (typeof parsedJson === 'string' && modelConstant.includes(parsedJson)) {
        return parsedJson as buildType<modelT, customMappingT>;
      } else {
        throw buildConstantTypeError(modelConstant, parsedJson);
      }
    case 'custom':
      return customMapping[model.content as string](parsedJson as string) as buildType<modelT, customMappingT>;
    case 'object':
      if (typeof parsedJson === 'object') {
        type modelObjectT = modelT['content'] extends modelObjectType ? modelT['content'] : any;
        return checkAndParseObjectJson({
          modelObject: model.content as modelObjectT,
          customMapping,
          parsedJson,
        }) as buildType<modelT, customMappingT>;
      } else {
        throw buildObjectTypeError(parsedJson);
      }
    case 'or':
      type modelOrT = modelT['content'] extends modelOrType ? modelT['content'] : never;
      try {
        return checkAndParseJson({
          model: (model.content as modelOrT)[0],
          customMapping,
          parsedJson,
        }) as buildType<modelT, customMappingT>;
      } catch (err) {
        try {
          return checkAndParseJson({
            model: (model.content as modelOrT)[1],
            customMapping,
            parsedJson,
          }) as buildType<modelT, customMappingT>;
        } catch (err) {
          throw buildOrTypeError(parsedJson);
        }
      }
    case 'array':
      if (Array.isArray(parsedJson)) {
        type modelArrayItemT = modelT['content'] extends modelType ? modelT['content'] : any;
        return ((parsedJson as Array<unknown>).map((arrayItem) =>
          checkAndParseJson({
            model: model.content as modelArrayItemT,
            customMapping,
            parsedJson: arrayItem,
          }),
        ) as unknown) as buildType<modelT, customMappingT>;
      } else {
        throw buildArrayTypeError(parsedJson);
      }
  }
}

function checkAndParsePrimitiveJson<modelPrimitiveT extends modelPrimitiveType>(
  modelPrimitive: modelPrimitiveT,
  parsedJson: unknown,
): buildPrimitiveType<modelPrimitiveT> {
  switch (modelPrimitive) {
    case 'boolean':
      if (typeof parsedJson === 'boolean') {
        return parsedJson as buildPrimitiveType<modelPrimitiveT>;
      } else {
        throw buildPrimitiveTypeError(modelPrimitive, parsedJson);
      }
    case 'date':
      if (typeof parsedJson === 'string') {
        const parsedDate = new Date(parsedJson);
        if (!isNaN(parsedDate.getDate())) {
          return parsedDate as buildPrimitiveType<modelPrimitiveT>;
        } else {
          throw buildPrimitiveTypeError(modelPrimitive, parsedJson);
        }
      } else {
        throw buildPrimitiveTypeError(modelPrimitive, parsedJson);
      }
    case 'number':
      if (typeof parsedJson === 'number') {
        return parsedJson as buildPrimitiveType<modelPrimitiveT>;
      } else {
        throw buildPrimitiveTypeError(modelPrimitive, parsedJson);
      }
    case 'string':
      if (typeof parsedJson === 'string') {
        return parsedJson as buildPrimitiveType<modelPrimitiveT>;
      } else {
        throw buildPrimitiveTypeError(modelPrimitive, parsedJson);
      }
    case 'undefined':
      if (parsedJson === null || parsedJson === undefined) {
        return undefined as buildPrimitiveType<modelPrimitiveT>;
      } else {
        throw buildPrimitiveTypeError(modelPrimitive, parsedJson);
      }
    case 'void':
      if (parsedJson === undefined) {
        return parsedJson as buildPrimitiveType<modelPrimitiveT>;
      } else {
        throw buildPrimitiveTypeError(modelPrimitive, parsedJson);
      }
  }

  throw buildTypeEngineError();
}

function checkAndParseObjectJson<modelObjectT extends modelObjectType, customMappingT extends customMappingType>({
  modelObject,
  customMapping,
  parsedJson,
}: {
  modelObject: modelObjectT;
  customMapping: { [key in keyof customMappingT]: (jsonValue: string) => customMappingT[key] };
  parsedJson: unknown;
}): { [key in keyof modelObjectT]: buildType<modelObjectT[key], customMappingT> } {
  const parsedObjectJson = {} as {
    [key in keyof modelObjectT]: buildType<modelObjectT[key], customMappingT>;
  };

  for (const key in modelObject) {
    parsedObjectJson[key] = checkAndParseJson<modelObjectT[typeof key], customMappingT>({
      model: modelObject[key],
      customMapping,
      parsedJson: (parsedJson as any)[key],
    });
  }

  return parsedObjectJson;
}

function buildPrimitiveTypeError(modelPrimitive: modelPrimitiveType, parsedJson: unknown) {
  return new Error(`Expected ${modelPrimitive}, but got ${parsedJson}`);
}

function buildConstantTypeError(modelConstant: modelConstantType, parsedJson: unknown) {
  return new Error(`Expected one of these constants [${modelConstant}], but got ${parsedJson}`);
}

function buildObjectTypeError(parsedJson: unknown) {
  throw new Error(`Expected an object, but got ${parsedJson}`);
}

function buildOrTypeError(parsedJson: unknown) {
  throw new Error(`Expected a conjoction, but got ${parsedJson}`);
}

function buildArrayTypeError(parsedJson: unknown) {
  throw new Error(`Expected an array, but got ${parsedJson}`);
}

function buildTypeEngineError(): never {
  throw new Error(`TYPE ENGINE ERROR`);
}
