export type GenericSchema = {
  parse: (json: string) => any;
  stringify: (value: any) => string;
  deserialize: (value: any) => any;
  serialize: (value: any) => any;
  generate: (custom?: any) => any;
  isType(value: any): value is any;
};

export type Schema<T> = {
  parse: (json: string) => T;
  stringify: (value: T) => string;
  deserialize: (value: any) => T;
  serialize: (value: T) => any;
  generate: (custom?: Partial<T>) => T;
  isType(value: any): value is T;
};
