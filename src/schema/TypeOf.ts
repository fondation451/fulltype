import { GenericSchema } from './schema';

export type TypeOf<SchemaT extends GenericSchema> = ReturnType<SchemaT['parse']>;
