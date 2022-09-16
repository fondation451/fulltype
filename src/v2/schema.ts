export type GenericSchema = {
  parse: (json: string) => any;
  generate: (custom?: any) => any;
  stringify: (value: any) => string;
};

export type Schema<T> = {
  parse: (json: string) => T;
  generate: (custom?: Partial<T>) => T;
  stringify: (value: T) => string;
};
