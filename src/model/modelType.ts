export type {
  tagsType,
  modelType,
  modelCasePrimitiveType,
  modelCaseConstantType,
  modelCaseObjectType,
  modelCaseArrayType,
  modelPrimitiveType,
  modelConstantType,
  modelObjectType,
};

type tagsType = readonly string[];

type modelType = modelCasePrimitiveType | modelCaseConstantType | modelCaseObjectType | modelCaseArrayType;

type modelCasePrimitiveType = {
  kind: 'primitive';
  content: modelPrimitiveType;
  exclude: tagsType;
};

type modelCaseConstantType = {
  kind: 'constant';
  content: modelConstantType;
  exclude: tagsType;
};

type modelCaseObjectType = {
  kind: 'object';
  content: modelObjectType;
  exclude: tagsType;
};

type modelCaseArrayType = {
  kind: 'array';
  content: modelType;
  exclude: tagsType;
};

type modelPrimitiveType = 'boolean' | 'date' | 'string' | 'number' | 'void';

type modelConstantType = readonly string[];

type modelObjectType = { [key in string]: modelType };
