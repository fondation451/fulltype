import { buildSchema } from "./buildSchema";
import { Schema } from "./schema";
import { TypeOf } from "./TypeOf";

export const extend = <
  BaseObjectSchemaT extends { [key: string]: any }, // eslint-disable-line
  ExtendObjectSchemaT extends { [key: string]: any }, // eslint-disable-line
>(
  baseObjectSchema: Schema<BaseObjectSchemaT>,
  extendObjectSchema: Schema<ExtendObjectSchemaT>,
): Schema<TypeOf<Schema<BaseObjectSchemaT>> & TypeOf<Schema<ExtendObjectSchemaT>>> =>
  buildSchema({
    deserialize: (value) => {
      const deserializedBaseObject = baseObjectSchema.deserialize(value);
      const deserializedExtendObject = extendObjectSchema.deserialize(value);

      return { ...deserializedBaseObject, ...deserializedExtendObject };
    },
    serialize: (value) => {
      const serializedBaseObject = baseObjectSchema.deserialize(value);
      const serializedExtendObject = extendObjectSchema.deserialize(value);

      return { ...serializedBaseObject, ...serializedExtendObject };
    },
    generate: (custom) => {
      const generatedBaseObject = baseObjectSchema.generate(custom);
      const generatedExtendObject = extendObjectSchema.generate(custom);

      return { ...generatedBaseObject, ...generatedExtendObject };
    },
    isType: (
      value,
    ): value is TypeOf<Schema<BaseObjectSchemaT>> &
      TypeOf<Schema<ExtendObjectSchemaT>> => {
      return baseObjectSchema.isType(value) && extendObjectSchema.isType(value);
    },
  });
