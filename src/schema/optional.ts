import { or } from './or';
import { Schema } from './schema';
import { undefinedSchema } from './undefinedSchema';

export const optional = <T>(schema: Schema<T>): Schema<T | undefined> => or(schema, undefinedSchema());
