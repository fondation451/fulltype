import {
  modelType,
  modelCasePrimitiveType,
  modelCaseConstantType,
  modelCaseObjectType,
  modelCaseArrayType,
  modelPrimitiveType,
  modelConstantType,
} from './modelType';

export type { convertModelTypeToType, convertModelPrimitiveTypeToType, convertModelConstantTypeToType };

type convertModelTypeToType<modelT extends modelType> = modelT extends modelCasePrimitiveType
  ? convertModelPrimitiveTypeToType<modelT['content']>
  : modelT extends modelCaseConstantType
  ? convertModelConstantTypeToType<modelT['content']>
  : modelT extends modelCaseObjectType
  ? {
      [key in keyof modelT['content']]: convertModelTypeToType<modelT['content'][key]>;
    }
  : modelT extends modelCaseArrayType
  ? Array<convertModelTypeToType<modelT['content']>>
  : never;

type convertModelPrimitiveTypeToType<modelPrimitiveT extends modelPrimitiveType> = modelPrimitiveT extends 'boolean'
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

type convertModelConstantTypeToType<modelConstantT extends modelConstantType> = modelConstantT[number];
