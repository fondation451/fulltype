import { buildSchema } from './buildSchema';
import { Schema } from './schema';

export const custom = <InputT, OutputT>(
  inputSchema: Schema<InputT>,
  customization: {
    deserialize: (intput: InputT) => OutputT;
    serialize: (value: OutputT) => InputT;
    generate: (custom?: Partial<OutputT>) => OutputT;
    isType: (value: any) => value is OutputT;
  },
): Schema<OutputT> =>
  buildSchema({
    deserialize: (value) => customization.deserialize(inputSchema.deserialize(value)),
    serialize: (value) => inputSchema.serialize(customization.serialize(value)),
    generate: customization.generate,
    isType: customization.isType,
  });
