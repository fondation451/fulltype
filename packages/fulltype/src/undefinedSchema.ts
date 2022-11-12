import { buildSchema } from "./buildSchema";
import { Schema } from "./schema";

export const undefinedSchema = (): Schema<undefined> =>
  buildSchema({
    deserialize: (value) => {
      if (value === undefined) {
        return undefined;
      } else {
        throw new Error();
      }
    },
    serialize: (value) => value,
    generate: () => undefined,
    isType: (value: any): value is undefined => value === undefined,
  });
