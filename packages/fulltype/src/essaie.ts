import { custom } from "./custom";
import { or } from "./or";
import { Schema } from "./schema";
import { value } from "./value";

export const optional = <T>(schema: Schema<T>): Schema<T | undefined> =>
  custom(or(schema, value([""] as const)), {
    deserialize: (value) => (value === "" ? undefined : value),
    serialize: (value) => (value === undefined ? "" : value),
    generate: (partialValue) =>
      partialValue === undefined ? undefined : schema.generate(partialValue),
    isType: (value): value is T | undefined =>
      typeof value === "undefined" || schema.isType(value),
  });
