import {
  buildType,
  buildPrimitiveType,
  customMappingType,
  modelType,
  modelPrimitiveType,
  modelConstantType,
  modelObjectType,
} from '../types';

export { generate };

const MAX_NUMBER = 100000000;
const MAX_ARRAY_LENGTH = 5;

function generate<modelT extends modelType, customMappingT extends customMappingType>({
  model,
  customGenerator = {} as { [key in keyof customMappingT]: (randomInt: number) => customMappingT[key] },
}: {
  model: modelT;
  customGenerator?: { [key in keyof customMappingT]: (randomInt: number) => customMappingT[key] };
}): buildType<modelT, customMappingT> {
  return generateFromModel({ model, customGenerator });
}

function generateFromModel<modelT extends modelType, customMappingT extends customMappingType>({
  model,
  customGenerator,
  currentFieldName,
}: {
  model: modelT;
  customGenerator: { [key in keyof customMappingT]: (randomInt: number) => customMappingT[key] };
  currentFieldName?: string;
}): buildType<modelT, customMappingT> {
  switch (model.kind) {
    case 'primitive':
      type modelPrimitiveT = modelT['content'] extends modelPrimitiveType ? modelT['content'] : any;
      return generateFromPrimitive({ modelPrimitive: model.content as modelPrimitiveT, currentFieldName }) as buildType<
        modelT,
        customMappingT
      >;
    case 'constant':
      type modelConstantT = modelT['content'] extends modelConstantType ? modelT['content'] : any;
      const constants = model.content as modelConstantT;

      return constants[random(constants.length)] as buildType<modelT, customMappingT>;
    case 'custom':
      return customGenerator[model.content as string](random(MAX_NUMBER)) as buildType<modelT, customMappingT>;
    case 'object':
      type modelObjectT = modelT['content'] extends modelObjectType ? modelT['content'] : any;
      return generateFromObject({
        modelObject: model.content as modelObjectT,
        customGenerator,
        currentFieldName,
      }) as buildType<modelT, customMappingT>;
    case 'array':
      type modelArrayItemT = modelT['content'] extends modelType ? modelT['content'] : any;
      const generatedArray = [] as buildType<modelT, customMappingT>;
      const generatedArrayLength = random(MAX_ARRAY_LENGTH);

      for (let index = 0; index < generatedArrayLength; index++) {
        generatedArray.push(
          generateFromModel({
            model: model.content as modelArrayItemT,
            customGenerator,
            currentFieldName: currentFieldName ? `${currentFieldName}_${index}` : undefined,
          }),
        );
      }

      return generatedArray;
  }
}

function generateFromPrimitive<modelPrimitiveT extends modelPrimitiveType>({
  modelPrimitive,
  currentFieldName,
}: {
  modelPrimitive: modelPrimitiveT;
  currentFieldName?: string;
}): buildPrimitiveType<modelPrimitiveT> {
  switch (modelPrimitive) {
    case 'boolean':
      return (random(2) === 0 ? true : false) as buildPrimitiveType<modelPrimitiveT>;
    case 'date':
      const day = random(28);
      const month = random(13);
      const year = 1970 + random(new Date(Date.now()).getFullYear() - 1970);

      const date = new Date();
      date.setDate(day);
      date.setMonth(month);
      date.setFullYear(year);

      return date as buildPrimitiveType<modelPrimitiveT>;
    case 'number':
      return random(MAX_NUMBER) as buildPrimitiveType<modelPrimitiveT>;
    case 'string':
      return (currentFieldName
        ? `${currentFieldName}_${random(MAX_NUMBER)}`
        : `STRING_${random(MAX_NUMBER)}`) as buildPrimitiveType<modelPrimitiveT>;
    case 'void':
      return undefined as buildPrimitiveType<modelPrimitiveT>;
  }

  return undefined as buildPrimitiveType<modelPrimitiveT>;
}

function generateFromObject<modelObjectT extends modelObjectType, customMappingT extends customMappingType>({
  modelObject,
  customGenerator,
  currentFieldName,
}: {
  modelObject: modelObjectT;
  customGenerator: { [key in keyof customMappingT]: (randomInt: number) => customMappingT[key] };
  currentFieldName?: string;
}): { [key in keyof modelObjectT]: buildType<modelObjectT[key], customMappingT> } {
  const generatedObject = {} as {
    [key in keyof modelObjectT]: buildType<modelObjectT[key], customMappingT>;
  };

  for (const key in modelObject) {
    generatedObject[key] = generateFromModel<modelObjectT[typeof key], customMappingT>({
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
