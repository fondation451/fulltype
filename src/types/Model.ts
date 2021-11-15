export type {
  Model,
  ModelArray,
  ModelConstant,
  ModelCustom,
  ModelObject,
  ModelOr,
  ModelPrimitive,
  ModelConstantContent,
  ModelObjectContent,
  ModelOrContent,
  ModelPrimitiveContent,
};

type Model = ModelArray | ModelConstant | ModelCustom | ModelObject | ModelOr | ModelPrimitive;

type ModelArray = {
  kind: 'array';
  content: Model;
};

type ModelConstant = {
  kind: 'constant';
  content: ModelConstantContent;
};

type ModelCustom = {
  kind: 'custom';
  content: string;
};

type ModelObject = {
  kind: 'object';
  content: ModelObjectContent;
};

type ModelOr = { kind: 'or'; content: ModelOrContent };

type ModelPrimitive = {
  kind: 'primitive';
  content: ModelPrimitiveContent;
};

type ModelConstantContent = readonly string[];

type ModelObjectContent = { [key in string]: Model };

type ModelOrContent = Readonly<[PossibleOrModel, PossibleOrModel]>;

type PossibleOrModel = ModelArray | ModelConstant | ModelCustom | ModelObject | ModelPrimitive;

type ModelPrimitiveContent = 'boolean' | 'date' | 'number' | 'string' | 'undefined' | 'void';
