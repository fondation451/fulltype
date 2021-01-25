import { modelType } from './modelType';

export { buildModel };

function buildModel<modelT extends modelType>(model: modelT) {
  return model;
}
