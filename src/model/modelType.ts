export type {
  modelType,
  modelCasePrimitiveType,
  modelCaseConstantType,
  modelCaseObjectType,
  modelCaseArrayType,
  modelPrimitiveType,
  modelConstantType,
  modelObjectType,
};

type modelType = modelCasePrimitiveType | modelCaseConstantType | modelCaseObjectType | modelCaseArrayType;

type modelCasePrimitiveType = {
  kind: 'primitive';
  content: modelPrimitiveType;
};

type modelCaseConstantType = {
  kind: 'constant';
  content: modelConstantType;
};

type modelCaseObjectType = {
  kind: 'object';
  content: modelObjectType;
};

type modelCaseArrayType = {
  kind: 'array';
  content: modelType;
};

type modelPrimitiveType = 'boolean' | 'date' | 'string' | 'number' | 'void';

type modelConstantType = readonly string[];

type modelObjectType = { [key in string]: modelType };
