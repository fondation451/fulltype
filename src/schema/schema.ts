export type GenericSchema = {
  check(value: any): value is any;
  parse: (json: string) => any;
  generate: (custom?: any) => any;
  stringify: (value: any) => string;
};

export type Schema<T> = {
  check(value: any): value is T;
  parse: (json: string) => T;
  generate: (custom?: Partial<T>) => T;
  stringify: (value: T) => string;
};
