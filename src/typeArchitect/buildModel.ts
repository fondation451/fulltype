import { Model } from '../types';

export { buildModel };

function buildModel<ModelT extends Model>(model: ModelT) {
  return model;
}
