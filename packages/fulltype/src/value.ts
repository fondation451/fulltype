import { buildSchema } from "./buildSchema";
import { Schema } from "./schema";

export const value = <ValuesT extends readonly string[]>(
  possibleValues: ValuesT,
): Schema<ValuesT[number]> =>
  buildSchema({
    deserialize: (value) => {
      if (typeof value === "string" && possibleValues.includes(value)) {
        return value;
      } else {
        throw new Error();
      }
    },
    serialize: (value) => value,
    generate: (custom) => (custom ? (custom as any) : possibleValues[0]),
    isType: (value): value is ValuesT[number] =>
      typeof value === "string" && possibleValues.includes(value),
  });
