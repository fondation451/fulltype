import { custom } from "./custom";
import { Schema } from "./schema";
import { string } from "./string";

export const date = (): Schema<Date> =>
  custom(string(), {
    deserialize: (input) => {
      if (!isNaN(Date.parse(input))) {
        return new Date(input);
      } else {
        throw new Error();
      }
    },
    serialize: (value) => value.toISOString(),
    generate: (custom) => (custom ? (custom as any) : new Date(0)),
    isType: (value): value is Date =>
      typeof value === "string" && !isNaN(Date.parse(value)),
  });
