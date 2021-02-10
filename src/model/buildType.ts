import {
  modelType,
  modelCasePrimitiveType,
  modelCaseConstantType,
  modelCaseCustomType,
  modelCaseObjectType,
  modelCaseArrayType,
  modelPrimitiveType,
  modelConstantType,
} from './modelType';

export type { buildType, buildPrimitiveType, buildConstantType, customMappingType };

type buildType<
  modelT extends modelType,
  customMappingT extends customMappingType
> = modelT extends modelCasePrimitiveType
  ? buildPrimitiveType<modelT['content']>
  : modelT extends modelCaseConstantType
  ? buildConstantType<modelT['content']>
  : modelT extends modelCaseCustomType
  ? customMappingT[modelT['content']]
  : modelT extends modelCaseObjectType
  ? {
      [key in keyof modelT['content']]: buildType<modelT['content'][key], customMappingT>;
    }
  : modelT extends modelCaseArrayType
  ? Array<buildType<modelT['content'], customMappingT>>
  : never;

type buildPrimitiveType<modelPrimitiveT extends modelPrimitiveType> = modelPrimitiveT extends 'boolean'
  ? boolean
  : modelPrimitiveT extends 'date'
  ? Date
  : modelPrimitiveT extends 'string'
  ? string
  : modelPrimitiveT extends 'number'
  ? number
  : modelPrimitiveT extends 'void'
  ? void
  : never;

type buildConstantType<modelConstantT extends modelConstantType> = modelConstantT[number];

type customMappingType = { [typeName: string]: any };
