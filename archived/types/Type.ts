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
} from './Model';

export type { Type, TypePrimitive, CustomMapping };

type Type<ModelT extends Model, CustomMappingT extends CustomMapping> = ModelT extends ModelPrimitive
  ? TypePrimitive<ModelT['content']>
  : ModelT extends ModelConstant
  ? TypeConstant<ModelT['content']>
  : ModelT extends ModelCustom
  ? CustomMappingT[ModelT['content']]
  : ModelT extends ModelObject
  ? {
      [key in keyof ModelT['content']]: Type<ModelT['content'][key], CustomMappingT>;
    }
  : ModelT extends ModelOr
  ? TypeOr<ModelT['content'][0], CustomMappingT> | TypeOr<ModelT['content'][1], CustomMappingT>
  : ModelT extends ModelArray
  ? Array<Type<ModelT['content'], CustomMappingT>>
  : never;

type TypeConstant<ModelConstantContentT extends ModelConstantContent> = ModelConstantContentT[number];

type TypeOr<
  ModelOrT extends Model,
  CustomMappingT extends CustomMapping = Record<string, unknown>
> = ModelOrT extends ModelPrimitive
  ? TypePrimitive<ModelOrT['content']>
  : ModelOrT extends ModelConstant
  ? TypeConstant<ModelOrT['content']>
  : ModelOrT extends ModelArray
  ? Array<Type<ModelOrT['content'], CustomMappingT>>
  : ModelOrT extends ModelCustom
  ? CustomMappingT[ModelOrT['content']]
  : ModelOrT extends ModelObject
  ? {
      [key in keyof ModelOrT['content']]: Type<ModelOrT['content'][key], CustomMappingT>;
    }
  : never;

type TypePrimitive<ModelPrimitiveContentT extends ModelPrimitiveContent> = ModelPrimitiveContentT extends 'boolean'
  ? boolean
  : ModelPrimitiveContentT extends 'date'
  ? Date
  : ModelPrimitiveContentT extends 'number'
  ? number
  : ModelPrimitiveContentT extends 'string'
  ? string
  : ModelPrimitiveContentT extends 'undefined'
  ? undefined
  : ModelPrimitiveContentT extends 'void'
  ? void
  : never;

type CustomMapping = { [typeName: string]: any };
