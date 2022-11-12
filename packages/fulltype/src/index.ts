import { array } from "./array";
import { boolean } from "./boolean";
import { custom } from "./custom";
import { date } from "./date";
import { extend } from "./extend";
import { number } from "./number";
import { numberStr } from "./numberStr";
import { object } from "./object";
import { optional } from "./optional";
import { or } from "./or";
import type { Schema } from "./schema";
import { string } from "./string";
import type { TypeOf } from "./TypeOf";
import { undefinedSchema } from "./undefinedSchema";
import { value } from "./value";

export {
  array,
  boolean,
  custom,
  date,
  extend,
  number,
  numberStr,
  object,
  optional,
  or,
  string,
  undefinedSchema as undefined,
  value,
};

export type { Schema, TypeOf };
