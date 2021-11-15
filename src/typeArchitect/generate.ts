import {
  CustomMapping,
  Model,
  ModelConstantContent,
  ModelObject,
  ModelObjectContent,
  ModelOrContent,
  ModelPrimitiveContent,
  Type,
  TypePrimitive,
} from '../types';

export { generate, generateObject };

const MAX_NUMBER = 100000000;
const MAX_ARRAY_LENGTH = 5;

function generateObject<ModelObjectT extends ModelObject, CustomMappingT extends CustomMapping>({
  model,
  customGenerator = {} as { [key in keyof CustomMappingT]: (randomInt: number) => CustomMappingT[key] },
  customFields = {},
}: {
  model: ModelObjectT;
  customGenerator?: { [key in keyof CustomMappingT]: (randomInt: number) => CustomMappingT[key] };
  customFields?: Partial<Type<ModelObjectT, CustomMappingT>>;
}): Type<ModelObjectT, CustomMappingT> {
  return {
    ...generate({ model, customGenerator }),
    ...customFields,
  };
}

function generate<ModelT extends Model, CustomMappingT extends CustomMapping>({
  model,
  customGenerator = {} as { [key in keyof CustomMappingT]: (randomInt: number) => CustomMappingT[key] },
}: {
  model: ModelT;
  customGenerator?: { [key in keyof CustomMappingT]: (randomInt: number) => CustomMappingT[key] };
}): Type<ModelT, CustomMappingT> {
  return generateFromModel({ model, customGenerator });
}

function generateFromModel<ModelT extends Model, CustomMappingT extends CustomMapping>({
  model,
  customGenerator,
  currentFieldName,
}: {
  model: ModelT;
  customGenerator: { [key in keyof CustomMappingT]: (randomInt: number) => CustomMappingT[key] };
  currentFieldName?: string;
}): Type<ModelT, CustomMappingT> {
  switch (model.kind) {
    case 'primitive':
      type ModelPrimitiveContentT = ModelT['content'] extends ModelPrimitiveContent ? ModelT['content'] : any;
      return generateFromPrimitive({
        modelPrimitive: model.content as ModelPrimitiveContentT,
        currentFieldName,
      }) as Type<ModelT, CustomMappingT>;
    case 'constant':
      type ModelConstantContentT = ModelT['content'] extends ModelConstantContent ? ModelT['content'] : any;
      const constants = model.content as ModelConstantContentT;

      return constants[random(constants.length)] as Type<ModelT, CustomMappingT>;
    case 'custom':
      return customGenerator[model.content as string](random(MAX_NUMBER)) as Type<ModelT, CustomMappingT>;
    case 'object':
      type ModelObjectContentT = ModelT['content'] extends ModelObjectContent ? ModelT['content'] : any;
      return generateFromObject({
        modelObject: model.content as ModelObjectContentT,
        customGenerator,
        currentFieldName,
      }) as Type<ModelT, CustomMappingT>;
    case 'or':
      type ModelOrT = ModelT['content'] extends ModelOrContent ? ModelT['content'] : any;
      const choice = Math.round(Math.random());

      return generateFromModel({
        model: (model.content as ModelOrT)[choice],
        customGenerator,
        currentFieldName,
      }) as Type<ModelT, CustomMappingT>;
    case 'array':
      type ModelArrayContentT = ModelT['content'] extends Model ? ModelT['content'] : any;
      const generatedArray = [] as Type<ModelT, CustomMappingT>;
      const generatedArrayLength = random(MAX_ARRAY_LENGTH);

      for (let index = 0; index < generatedArrayLength; index++) {
        generatedArray.push(
          generateFromModel({
            model: model.content as ModelArrayContentT,
            customGenerator,
            currentFieldName: currentFieldName ? `${currentFieldName}_${index}` : undefined,
          }),
        );
      }

      return generatedArray;
  }
}

function generateFromPrimitive<ModelPrimitiveContentT extends ModelPrimitiveContent>({
  modelPrimitive,
  currentFieldName,
}: {
  modelPrimitive: ModelPrimitiveContentT;
  currentFieldName?: string;
}): TypePrimitive<ModelPrimitiveContentT> {
  switch (modelPrimitive) {
    case 'boolean':
      return (random(2) === 0 ? true : false) as TypePrimitive<ModelPrimitiveContentT>;
    case 'date':
      const day = random(28);
      const month = random(13);
      const year = 1970 + random(new Date(Date.now()).getFullYear() - 1970);

      const date = new Date();
      date.setDate(day);
      date.setMonth(month);
      date.setFullYear(year);

      return date as TypePrimitive<ModelPrimitiveContentT>;
    case 'number':
      return random(MAX_NUMBER) as TypePrimitive<ModelPrimitiveContentT>;
    case 'string':
      return (currentFieldName
        ? `${currentFieldName}_${random(MAX_NUMBER)}`
        : `STRING_${random(MAX_NUMBER)}`) as TypePrimitive<ModelPrimitiveContentT>;
    case 'undefined':
      return undefined as TypePrimitive<ModelPrimitiveContentT>;
    case 'void':
      return undefined as TypePrimitive<ModelPrimitiveContentT>;
  }

  return undefined as TypePrimitive<ModelPrimitiveContentT>;
}

function generateFromObject<ModelObjectContentT extends ModelObjectContent, CustomMappingT extends CustomMapping>({
  modelObject,
  customGenerator,
  currentFieldName,
}: {
  modelObject: ModelObjectContentT;
  customGenerator: { [key in keyof CustomMappingT]: (randomInt: number) => CustomMappingT[key] };
  currentFieldName?: string;
}): { [key in keyof ModelObjectContentT]: Type<ModelObjectContentT[key], CustomMappingT> } {
  const generatedObject = {} as {
    [key in keyof ModelObjectContentT]: Type<ModelObjectContentT[key], CustomMappingT>;
  };

  for (const key in modelObject) {
    generatedObject[key] = generateFromModel<ModelObjectContentT[typeof key], CustomMappingT>({
      model: modelObject[key],
      customGenerator,
      currentFieldName: currentFieldName ? `${currentFieldName}_${key}` : key,
    });
  }

  return generatedObject;
}

function random(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}
