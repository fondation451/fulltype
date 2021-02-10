import { buildType, buildPrimitiveType, customMappingType } from './buildType';
import { modelType, modelPrimitiveType, modelConstantType, modelObjectType } from './modelType';

export { parseJson };

function parseJson<modelT extends modelType, customMappingT extends customMappingType>({
  model,
  typeMapping = {} as { [key in keyof customMappingT]: (jsonValue: string) => customMappingT[key] },
  json,
}: {
  model: modelT;
  typeMapping?: { [key in keyof customMappingT]: (jsonValue: string) => customMappingT[key] };
  json: string;
}): buildType<modelT, customMappingT> {
  const parsedJson = JSON.parse(json) as unknown;

  return checkAndParseJson({ model, typeMapping, parsedJson });
}

function checkAndParseJson<modelT extends modelType, customMappingT extends customMappingType>({
  model,
  typeMapping,
  parsedJson,
}: {
  model: modelT;
  typeMapping: { [key in keyof customMappingT]: (jsonValue: string) => customMappingT[key] };
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
      return typeMapping[model.content as string](parsedJson as string) as buildType<modelT, customMappingT>;
    case 'object':
      if (typeof parsedJson === 'object') {
        type modelObjectT = modelT['content'] extends modelObjectType ? modelT['content'] : any;
        return checkAndParseObjectJson({
          modelObject: model.content as modelObjectT,
          typeMapping,
          parsedJson,
        }) as buildType<modelT, customMappingT>;
      } else {
        throw buildObjectTypeError(parsedJson);
      }
    case 'array':
      if (Array.isArray(parsedJson)) {
        type modelArrayItemT = modelT['content'] extends modelType ? modelT['content'] : any;
        return ((parsedJson as Array<unknown>).map((arrayItem) =>
          checkAndParseJson({
            model: model.content as modelArrayItemT,
            typeMapping,
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
  typeMapping,
  parsedJson,
}: {
  modelObject: modelObjectT;
  typeMapping: { [key in keyof customMappingT]: (jsonValue: string) => customMappingT[key] };
  parsedJson: unknown;
}): { [key in keyof modelObjectT]: buildType<modelObjectT[key], customMappingT> } {
  const parsedObjectJson = {} as {
    [key in keyof modelObjectT]: buildType<modelObjectT[key], customMappingT>;
  };

  for (const key in modelObject) {
    parsedObjectJson[key] = checkAndParseJson<modelObjectT[typeof key], customMappingT>({
      model: modelObject[key],
      typeMapping,
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

function buildArrayTypeError(parsedJson: unknown) {
  throw new Error(`Expected an array, but got ${parsedJson}`);
}

function buildTypeEngineError(): never {
  throw new Error(`TYPE ENGINE ERROR`);
}
