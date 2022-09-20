import { buildSchema } from './buildSchema';
import { Schema } from './schema';

export const or = <LeftT, RightT>(leftSchema: Schema<LeftT>, rightSchema: Schema<RightT>): Schema<LeftT | RightT> =>
  buildSchema({
    check: (value): value is LeftT | RightT => leftSchema.check(value) || rightSchema.check(value),
    generate: (custom) => {
      if (!custom) {
        return leftSchema.generate();
      } else if (leftSchema.check(custom)) {
        return leftSchema.generate(custom);
      } else if (rightSchema.check(custom)) {
        return rightSchema.generate(custom);
      } else {
        return leftSchema.generate();
      }
    },
    stringify: (value) => {
      if (leftSchema.check(value)) {
        return leftSchema.stringify(value);
      } else {
        return rightSchema.stringify(value);
      }
    },
  });
