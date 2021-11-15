import {
  Model,
  ModelArray,
  ModelConstant,
  ModelCustom,
  ModelObject,
  ModelOr,
  ModelPrimitive,
  ModelConstantContent,
  ModelPrimitiveContent,
} from './types';

export type { buildType, buildPrimitiveType, buildConstantType, customMappingType };

type buildType<modelT extends Model, customMappingT extends customMappingType> = modelT extends ModelPrimitive
  ? buildPrimitiveType<modelT['content']>
  : modelT extends ModelConstant
  ? buildConstantType<modelT['content']>
  : modelT extends ModelCustom
  ? customMappingT[modelT['content']]
  : modelT extends ModelObject
  ? {
      [key in keyof modelT['content']]: buildType<modelT['content'][key], customMappingT>;
    }
  : modelT extends ModelOr
  ? buildOrType<modelT['content'][0], customMappingT> | buildOrType<modelT['content'][1], customMappingT>
  : modelT extends ModelArray
  ? Array<buildType<modelT['content'], customMappingT>>
  : never;

type buildConstantType<modelConstantT extends ModelConstantContent> = modelConstantT[number];

type buildOrType<
  modelOrT extends Model,
  customMappingT extends customMappingType = Record<string, unknown>
> = modelOrT extends ModelPrimitive
  ? buildPrimitiveType<modelOrT['content']>
  : modelOrT extends ModelConstant
  ? buildConstantType<modelOrT['content']>
  : modelOrT extends ModelArray
  ? Array<buildType<modelOrT['content'], customMappingT>>
  : modelOrT extends ModelCustom
  ? customMappingT[modelOrT['content']]
  : modelOrT extends ModelObject
  ? {
      [key in keyof modelOrT['content']]: buildType<modelOrT['content'][key], customMappingT>;
    }
  : never;

type buildPrimitiveType<modelPrimitiveT extends ModelPrimitiveContent> = modelPrimitiveT extends 'boolean'
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
