import { custom } from "./custom";
import { Schema } from "./schema";
import { string } from "./string";

export const numberStr = (): Schema<number | undefined> =>
  custom(string(), {
    deserialize: (str) => {
      const nb = parseFloat(str);

      if (isNaN(nb)) {
        return;
      } else {
        return nb;
      }
    },
    serialize: (nb) => (nb === undefined ? "" : nb.toString()),
    generate: (custom) => (custom ? custom : 0),
    isType: (nb): nb is number | undefined =>
      typeof nb === "undefined" || typeof nb === "number",
  });
