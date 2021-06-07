export type {
  modelType,
  modelCaseArrayType,
  modelCaseConstantType,
  modelCaseCustomType,
  modelCaseObjectType,
  modelCaseOrType,
  modelCasePrimitiveType,
  modelConstantType,
  modelObjectType,
  modelOrType,
  modelPrimitiveType,
};

type modelType =
  | modelCaseArrayType
  | modelCaseConstantType
  | modelCaseCustomType
  | modelCaseObjectType
  | modelCaseOrType
  | modelCasePrimitiveType;

type modelCaseArrayType = {
  kind: 'array';
  content: modelType;
};

type modelCaseConstantType = {
  kind: 'constant';
  content: modelConstantType;
};

type modelCaseCustomType = {
  kind: 'custom';
  content: string;
};

type modelCaseObjectType = {
  kind: 'object';
  content: modelObjectType;
};

type modelCaseOrType = { kind: 'or'; content: modelOrType };

type modelCasePrimitiveType = {
  kind: 'primitive';
  content: modelPrimitiveType;
};

type modelConstantType = readonly string[];

type modelObjectType = { [key in string]: modelType };

type modelOrType = Readonly<[modelOrCaseType, modelOrCaseType]>;

type modelOrCaseType =
  | modelCaseArrayType
  | modelCaseConstantType
  | modelCaseCustomType
  | modelCaseObjectType
  | modelCasePrimitiveType;

type modelPrimitiveType = 'boolean' | 'date' | 'number' | 'string' | 'undefined' | 'void';
