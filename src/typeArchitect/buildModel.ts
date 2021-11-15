import { Model } from '../types';

export { buildModel };

function buildModel<modelT extends Model>(model: modelT) {
  return model;
}
