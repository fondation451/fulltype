import {
  modelType,
  modelCaseArrayType,
  modelCaseConstantType,
  modelCaseCustomType,
  modelCaseObjectType,
  modelCaseOrType,
  modelCasePrimitiveType,
  modelConstantType,
  modelPrimitiveType,
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
  : modelT extends modelCaseOrType
  ? buildOrType<modelT['content'][0], customMappingT> | buildOrType<modelT['content'][1], customMappingT>
  : modelT extends modelCaseArrayType
  ? Array<buildType<modelT['content'], customMappingT>>
  : never;

type buildConstantType<modelConstantT extends modelConstantType> = modelConstantT[number];

type buildOrType<
  modelOrT extends modelType,
  customMappingT extends customMappingType = Record<string, unknown>
> = modelOrT extends modelCasePrimitiveType
  ? buildPrimitiveType<modelOrT['content']>
  : modelOrT extends modelCaseConstantType
  ? buildConstantType<modelOrT['content']>
  : modelOrT extends modelCaseArrayType
  ? Array<buildType<modelOrT['content'], customMappingT>>
  : modelOrT extends modelCaseCustomType
  ? customMappingT[modelOrT['content']]
  : modelOrT extends modelCaseObjectType
  ? {
      [key in keyof modelOrT['content']]: buildType<modelOrT['content'][key], customMappingT>;
    }
  : never;

type buildPrimitiveType<modelPrimitiveT extends modelPrimitiveType> = modelPrimitiveT extends 'boolean'
  ? boolean
  : modelPrimitiveT extends 'date'
  ? Date
  : modelPrimitiveT extends 'number'
  ? number
  : modelPrimitiveT extends 'string'
  ? string
  : modelPrimitiveT extends 'undefined'
  ? undefined
  : modelPrimitiveT extends 'void'
  ? void
  : never;

type customMappingType = { [typeName: string]: any };
