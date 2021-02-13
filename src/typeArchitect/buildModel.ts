import { modelType } from '../types';

export { buildModel };

function buildModel<modelT extends modelType>(model: modelT) {
  return model;
}
