import { buildSchema } from './buildSchema';
import { Schema } from './schema';

export const or = <LeftT, RightT>(leftSchema: Schema<LeftT>, rightSchema: Schema<RightT>): Schema<LeftT | RightT> =>
  buildSchema({
    deserialize: (value) => {
      try {
        return leftSchema.deserialize(value);
      } catch (error) {
        return rightSchema.deserialize(value);
      }
    },
    serialize: (value) => {
      if (leftSchema.isType(value)) {
        return leftSchema.serialize(value);
      } else {
        return rightSchema.serialize(value);
      }
    },
    generate: (custom) => {
      if (!custom) {
        return leftSchema.generate();
      } else if (leftSchema.isType(custom)) {
        return leftSchema.generate(custom);
      } else if (rightSchema.isType(custom)) {
        return rightSchema.generate(custom);
      } else {
        return leftSchema.generate();
      }
    },
    isType: (value): value is LeftT | RightT => leftSchema.isType(value) || rightSchema.isType(value),
  });
