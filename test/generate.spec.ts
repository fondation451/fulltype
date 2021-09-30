import { ObjectId } from 'mongodb';
import { buildModel } from '../src/typeArchitect/buildModel';
import { generate, generateObject } from '../src/typeArchitect/generate';

const TEST_ITERATION = 5;

describe('generate', () => {
  describe('primitive case', () => {
    it('should generate a random number', () => {
      executeTestSeveralTimes(() => {
        const model = buildModel({
          kind: 'primitive',
          content: 'number',
        } as const);

        const generatedValue = generate({ model });

        // eslint-disable-next-line
        const _typeCheck: number = generatedValue;
        expect(typeof generatedValue).toEqual('number');
      });
    });

    it('should generate a random boolean', () => {
      executeTestSeveralTimes(() => {
        const model = buildModel({
          kind: 'primitive',
          content: 'boolean',
        } as const);

        const generatedValue = generate({ model });

        // eslint-disable-next-line
        const _typeCheck: boolean = generatedValue;
        expect(typeof generatedValue).toEqual('boolean');
      });
    });

    it('should generate a random string', () => {
      executeTestSeveralTimes(() => {
        const model = buildModel({
          kind: 'primitive',
          content: 'string',
        } as const);

        const generatedValue = generate({ model });

        // eslint-disable-next-line
        const _typeCheck: string = generatedValue;
        expect(typeof generatedValue).toEqual('string');
      });
    });

    it('should generate a random undefined', () => {
      executeTestSeveralTimes(() => {
        const model = buildModel({
          kind: 'primitive',
          content: 'undefined',
        } as const);

        const generatedValue = generate({ model });

        // eslint-disable-next-line
        const _typeCheck: undefined = generatedValue;
        expect(generatedValue).toEqual(undefined);
      });
    });

    it('should generate a random date', () => {
      executeTestSeveralTimes(() => {
        const model = buildModel({
          kind: 'primitive',
          content: 'date',
        } as const);

        const generatedValue = generate({ model });

        // eslint-disable-next-line
        const _typeCheck: Date = generatedValue;
        expect(generatedValue instanceof Date).toEqual(true);
      });
    });
  });

  it('should generate a random constant', () => {
    executeTestSeveralTimes(() => {
      const model = buildModel({
        kind: 'constant',
        content: ['CONSTANT_1', 'CONSTANT_2'],
      } as const);

      const generatedValue = generate({ model });

      // eslint-disable-next-line
      const _typeCheck: 'CONSTANT_1' | 'CONSTANT_2' = generatedValue;
      expect(typeof generatedValue).toEqual('string');
      expect(['CONSTANT_1', 'CONSTANT_2'].includes(generatedValue)).toEqual(true);
    });
  });

  describe('custom case', () => {
    it('should generate a random custom string', () => {
      executeTestSeveralTimes(() => {
        const model = buildModel({
          kind: 'custom',
          content: 'CUSTOM_TYPE',
        } as const);

        const generatedValue = generate({
          model,
          customGenerator: { CUSTOM_TYPE: (randomValue) => `CUSTOM_STRING_${randomValue}` },
        });

        // eslint-disable-next-line
        const _typeCheck: string = generatedValue;
        expect(generatedValue.startsWith('CUSTOM_STRING_')).toEqual(true);
      });
    });

    it('should generate a random custom object id', () => {
      executeTestSeveralTimes(() => {
        const model = buildModel({
          kind: 'custom',
          content: 'Mongo_ID',
        } as const);

        const generatedValue = generate({ model, customGenerator: { Mongo_ID: () => new ObjectId() } });

        // eslint-disable-next-line
        const _typeCheck: ObjectId = generatedValue;
        expect(ObjectId.isValid(generatedValue)).toEqual(true);
      });
    });
  });

  it('should generate a random array', () => {
    executeTestSeveralTimes(() => {
      const model = buildModel({
        kind: 'array',
        content: {
          kind: 'primitive',
          content: 'boolean',
        },
      } as const);

      const generatedValue = generate({ model });

      // eslint-disable-next-line
      const _typeCheck: boolean[] = generatedValue;
      expect(Array.isArray(generatedValue)).toEqual(true);
      generatedValue.forEach((value) => expect(typeof value).toEqual('boolean'));
    });
  });

  it('should generate a random object', () => {
    executeTestSeveralTimes(() => {
      const model = buildModel({
        kind: 'object',
        content: {
          field1: { kind: 'primitive', content: 'boolean' },
          field2: { kind: 'primitive', content: 'number' },
          field3: { kind: 'primitive', content: 'string' },
        },
      } as const);

      const generatedValue = generate({ model });

      // eslint-disable-next-line
      const _typeCheck: { field1: boolean; field2: number; field3: string } = generatedValue;
      expect(typeof generatedValue.field1).toEqual('boolean');
      expect(typeof generatedValue.field2).toEqual('number');
      expect(typeof generatedValue.field3).toEqual('string');
      expect(generatedValue.field3.startsWith('field3_')).toEqual(true);
    });
  });

  it('should generate a or conjunction', () => {
    executeTestSeveralTimes(() => {
      const model = buildModel({
        kind: 'or',
        content: [
          { kind: 'primitive', content: 'boolean' },
          { kind: 'primitive', content: 'number' },
        ],
      } as const);

      const generatedValue = generate({ model });

      // eslint-disable-next-line
      const _typeCheck: boolean | number = generatedValue;
      expect(typeof generatedValue === 'boolean' || typeof generatedValue === 'number').toEqual(true);
    });
  });

  it('should generate a random data from model (general case)', () => {
    executeTestSeveralTimes(() => {
      const model = buildModel({
        kind: 'object',
        content: {
          field1: { kind: 'primitive', content: 'boolean' },
          field2: {
            kind: 'array',
            content: {
              kind: 'object',
              content: {
                arraySubField1: {
                  kind: 'primitive',
                  content: 'string',
                },
                arraySubField2: {
                  kind: 'array',
                  content: {
                    kind: 'primitive',
                    content: 'boolean',
                  },
                },
                arraySubField3: {
                  kind: 'constant',
                  content: ['CONSTANT1', 'CONSTANT2'],
                },
              },
            },
          },
          field3: {
            kind: 'array',
            content: {
              kind: 'constant',
              content: ['ANOTHER_CONSTANT1', 'ANOTHER_CONSTANT2'],
            },
          },
        },
      } as const);

      const generatedValue = generate({ model });

      // eslint-disable-next-line
      const _typeCheck: {
        field1: boolean;
        field2: Array<{
          arraySubField1: string;
          arraySubField2: Array<boolean>;
          arraySubField3: 'CONSTANT1' | 'CONSTANT2';
        }>;
        field3: Array<'ANOTHER_CONSTANT1' | 'ANOTHER_CONSTANT2'>;
      } = generatedValue;
      expect(typeof generatedValue.field1).toEqual('boolean');
      expect(Array.isArray(generatedValue.field2)).toEqual(true);
      generatedValue.field2.forEach((value, index) => {
        expect(typeof value.arraySubField1).toEqual('string');
        expect(value.arraySubField1.startsWith(`field2_${index}_arraySubField1_`)).toEqual(true);
        expect(Array.isArray(value.arraySubField2)).toEqual(true);
        value.arraySubField2.forEach((subValue) => {
          expect(typeof subValue).toEqual('boolean');
        });
        expect(typeof value.arraySubField3).toEqual('string');
        expect(['CONSTANT1', 'CONSTANT2'].includes(value.arraySubField3)).toEqual(true);
      });
      expect(Array.isArray(generatedValue.field3)).toEqual(true);
      generatedValue.field3.forEach((value) => {
        expect(typeof value).toEqual('string');
        expect(['ANOTHER_CONSTANT1', 'ANOTHER_CONSTANT2'].includes(value)).toEqual(true);
      });
    });
  });
});

describe('generateObject', () => {
  it('should generate a random data from model with the given field value', () => {
    executeTestSeveralTimes(() => {
      const model = buildModel({
        kind: 'object',
        content: {
          field1: { kind: 'primitive', content: 'boolean' },
          field2: { kind: 'constant', content: ['CONSTANT1', 'CONSTANT2'] },
          field3: { kind: 'primitive', content: 'string' },
          field4: {
            kind: 'array',
            content: {
              kind: 'primitive',
              content: 'number',
            },
          },
        },
      } as const);

      const generatedValue = generateObject({ model, customFields: { field1: true, field2: 'CONSTANT2' } });

      // eslint-disable-next-line
      const _typeCheck: {
        field1: boolean;
        field2: 'CONSTANT1' | 'CONSTANT2';
        field3: string;
        field4: number[];
      } = generatedValue;
      expect(typeof generatedValue.field1).toEqual('boolean');
      expect(generatedValue.field1).toEqual(true);
      expect(typeof generatedValue.field2).toEqual('string');
      expect(generatedValue.field2).toEqual('CONSTANT2');
      expect(typeof generatedValue.field3).toEqual('string');
      expect(Array.isArray(generatedValue.field4)).toEqual(true);
      generatedValue.field4.forEach((value) => expect(typeof value).toEqual('number'));
    });
  });
});

function executeTestSeveralTimes(test: () => void) {
  for (let i = 0; i < TEST_ITERATION; i++) {
    test();
  }
}
