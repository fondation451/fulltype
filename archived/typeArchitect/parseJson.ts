import {
  Type,
  TypePrimitive,
  CustomMapping,
  Model,
  ModelPrimitiveContent,
  ModelConstantContent,
  ModelObjectContent,
  ModelOrContent,
} from '../types';

export { parseJson };

function parseJson<ModelT extends Model, CustomMappingT extends CustomMapping>({
  model,
  customMapping = {} as { [key in keyof CustomMappingT]: (jsonValue: string) => CustomMappingT[key] },
  json,
}: {
  model: ModelT;
  customMapping?: { [key in keyof CustomMappingT]: (jsonValue: string) => CustomMappingT[key] };
  json: string;
}): Type<ModelT, CustomMappingT> {
  const parsedJson = JSON.parse(json) as unknown;

  return checkAndParseJson({ model, customMapping, parsedJson });
}

function checkAndParseJson<ModelT extends Model, CustomMappingT extends CustomMapping>({
  model,
  customMapping,
  parsedJson,
}: {
  model: ModelT;
  customMapping: { [key in keyof CustomMappingT]: (jsonValue: string) => CustomMappingT[key] };
  parsedJson: unknown;
}): Type<ModelT, CustomMappingT> {
  switch (model.kind) {
    case 'primitive':
      type ModelPrimitiveContentT = ModelT['content'] extends ModelPrimitiveContent ? ModelT['content'] : any;
      return checkAndParsePrimitiveJson(model.content as ModelPrimitiveContentT, parsedJson) as Type<
        ModelT,
        CustomMappingT
      >;
    case 'constant':
      type ModelConstantContentT = ModelT['content'] extends ModelConstantContent ? ModelT['content'] : any;
      const modelConstant = model.content as ModelConstantContentT;

      if (typeof parsedJson === 'string' && modelConstant.includes(parsedJson)) {
        return parsedJson as Type<ModelT, CustomMappingT>;
      } else {
        throw buildConstantTypeError(modelConstant, parsedJson);
      }
    case 'custom':
      return customMapping[model.content as string](parsedJson as string) as Type<ModelT, CustomMappingT>;
    case 'object':
      if (typeof parsedJson === 'object') {
        type ModelObjectContentT = ModelT['content'] extends ModelObjectContent ? ModelT['content'] : any;
        return checkAndParseObjectJson({
          modelObject: model.content as ModelObjectContentT,
          customMapping,
          parsedJson,
        }) as Type<ModelT, CustomMappingT>;
      } else {
        throw buildObjectTypeError(parsedJson);
      }
    case 'or':
      type ModelOrT = ModelT['content'] extends ModelOrContent ? ModelT['content'] : never;
      try {
        return checkAndParseJson({
          model: (model.content as ModelOrT)[0],
          customMapping,
          parsedJson,
        }) as Type<ModelT, CustomMappingT>;
      } catch (err) {
        try {
          return checkAndParseJson({
            model: (model.content as ModelOrT)[1],
            customMapping,
            parsedJson,
          }) as Type<ModelT, CustomMappingT>;
        } catch (err) {
          throw buildOrTypeError(parsedJson);
        }
      }
    case 'array':
      if (Array.isArray(parsedJson)) {
        type ModelArrayContentT = ModelT['content'] extends Model ? ModelT['content'] : any;
        return (parsedJson as Array<unknown>).map((arrayItem) =>
          checkAndParseJson({
            model: model.content as ModelArrayContentT,
            customMapping,
            parsedJson: arrayItem,
          }),
        ) as unknown as Type<ModelT, CustomMappingT>;
      } else {
        throw buildArrayTypeError(parsedJson);
      }
  }
}

function checkAndParsePrimitiveJson<ModelPrimitiveContentT extends ModelPrimitiveContent>(
  modelPrimitive: ModelPrimitiveContentT,
  parsedJson: unknown,
): TypePrimitive<ModelPrimitiveContentT> {
  switch (modelPrimitive) {
    case 'boolean':
      if (typeof parsedJson === 'boolean') {
        return parsedJson as TypePrimitive<ModelPrimitiveContentT>;
      } else {
        throw buildPrimitiveTypeError(modelPrimitive, parsedJson);
      }
    case 'date':
      if (typeof parsedJson === 'string') {
        const parsedDate = new Date(parsedJson);
        if (!isNaN(parsedDate.getDate())) {
          return parsedDate as TypePrimitive<ModelPrimitiveContentT>;
        } else {
          throw buildPrimitiveTypeError(modelPrimitive, parsedJson);
        }
      } else {
        throw buildPrimitiveTypeError(modelPrimitive, parsedJson);
      }
    case 'number':
      if (typeof parsedJson === 'number') {
        return parsedJson as TypePrimitive<ModelPrimitiveContentT>;
      } else {
        throw buildPrimitiveTypeError(modelPrimitive, parsedJson);
      }
    case 'string':
      if (typeof parsedJson === 'string') {
        return parsedJson as TypePrimitive<ModelPrimitiveContentT>;
      } else {
        throw buildPrimitiveTypeError(modelPrimitive, parsedJson);
      }
    case 'undefined':
      if (parsedJson === null || parsedJson === undefined) {
        return undefined as TypePrimitive<ModelPrimitiveContentT>;
      } else {
        throw buildPrimitiveTypeError(modelPrimitive, parsedJson);
      }
    case 'void':
      if (parsedJson === undefined) {
        return parsedJson as TypePrimitive<ModelPrimitiveContentT>;
      } else {
        throw buildPrimitiveTypeError(modelPrimitive, parsedJson);
      }
  }

  throw buildTypeEngineError();
}

function checkAndParseObjectJson<ModelObjectContentT extends ModelObjectContent, CustomMappingT extends CustomMapping>({
  modelObject,
  customMapping,
  parsedJson,
}: {
  modelObject: ModelObjectContentT;
  customMapping: { [key in keyof CustomMappingT]: (jsonValue: string) => CustomMappingT[key] };
  parsedJson: unknown;
}): { [key in keyof ModelObjectContentT]: Type<ModelObjectContentT[key], CustomMappingT> } {
  const parsedObjectJson = {} as {
    [key in keyof ModelObjectContentT]: Type<ModelObjectContentT[key], CustomMappingT>;
  };

  for (const key in modelObject) {
    parsedObjectJson[key] = checkAndParseJson<ModelObjectContentT[typeof key], CustomMappingT>({
      model: modelObject[key],
      customMapping,
      parsedJson: (parsedJson as any)[key],
    });
  }

  return parsedObjectJson;
}

function buildPrimitiveTypeError(modelPrimitive: ModelPrimitiveContent, parsedJson: unknown) {
  return new Error(`Expected ${modelPrimitive}, but got ${parsedJson}`);
}

function buildConstantTypeError(modelConstant: ModelConstantContent, parsedJson: unknown) {
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
