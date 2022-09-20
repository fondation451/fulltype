import { Schema } from './schema';

export const custom = <InputT, OutputT>(
  inputSchema: Schema<InputT>,
  customization: {
    parseCustomization: (input: InputT) => OutputT;
    generate: (custom?: Partial<OutputT>) => OutputT;
    stringifyCustomization: (value: OutputT) => InputT;
  },
): Schema<OutputT> => {
  return {
    parse: (json) => customization.parseCustomization(inputSchema.parse(json)),
    generate: customization.generate,
    stringify: (value) => inputSchema.stringify(customization.stringifyCustomization(value)),
  };
};
