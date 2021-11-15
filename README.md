# Type Architect

## Introduction

In Typescript, the type definition and the data definition live in different world.
Data schema definition can be very useful when it comes to generate dynamically values.
For example, to derive MongoDb validation rule or GraphQL schema directly from your data definitions.
You need to define the type and the data schema (it breaks the DRY philosophy)

Type Architect is a library to design the shape of your data. It provides powerful tool to
derive the type directly from the model of your data, and to parse JSON with the proper static type and
a dynamic checking according to the given model. You data model is defined, so you can use it to derive
other data schema like a mongo validation table

## Installation

```js
yarn install type-architect
```

## Example

Here is an example with an user data model with a mongoDb ID:

```ts
import { ObjectId } from 'mongoDb';
import { typeArchitect, Type } from 'type-architect';

const userModel = typeArchitect.buildModel({
  kind: 'object',
  content: {
    _id: { kind: 'custom', content: 'ObjectId' },
    email: { kind: 'primitive', content: 'string' },
    name: { kind: 'primitive', content: 'string' },
    passwordHash: { kind: 'primitive', content: 'string' },
  },
} as const);
// "as const" is mandatory, Type Architecte can only work with const type

type userType = Type<typeof userModel, { ObjectId: ObjectId }>;
```

The only prerequisites with Type Architect is that all model should be defined `as const` (with a const type).

You can easily parseJson with proper type (static type) and with dynamic type checking.

```ts
import { typeArchitect } from 'type-architect';

const userJson = `{
  "_id": "507f1f77bcf86cd799439011",
  "email": "email@email.email",
  "name": "NAME",
  "passwordHash": "qiyh4XPJGsOZ2MEAyLkfWqeQ"
}`;

// parsedUser is already typed with the type Type<typeof userModel, { ObjectId: ObjectId }>
const parsedUser = typeArchitect.parseJson({
  model: userModel,
  json: userJson,
  customMapping: { ObjectId: (idStr) => new ObjectId(idStr) },
});
```

## Documentation

### The model type

A model can be built with the function `typeArchitect.buildModel`.

The model type use an ADT style approach, each model looks like this:

```ts
{
  kind: ..., // kind of model
  content: ... // the actual content of the model
}
```

There are 5 differents model kind in Type Architect: `'primitive'`, `'constant'`, `'array'`, `'object'`, `'or`, `'custom'`.

#### `'primitive'` kind

The primitive kind allows you to represent primitive type.

For now, the supported primitives types are:

- `'boolean'`
- `'date'`
- `'number'`
- `'string'`
- `'undefined'`
- `'void'`

For example, for a model representing a string, we will have:

```ts
const primitiveModel = typeArchitect.buildModel({
  kind: 'primitive',
  content: 'string',
} as const);
```

#### `'constant'` kind

The constant kind allows you to represent constant. A constant will be represented by a set of possible string values.

For example, to represent the following constant : `'FREE' | 'PENDING' | 'DONE'`, we will have:

```ts
const constantModel = typeArchitect.buildModel({
  kind: 'constant',
  content: ['FREE', 'PENDING', 'DONE'],
} as const);
```

#### `'array'` kind

The array kind allows you to represent an array of some type. It is done by combining a model with an array model.

For example, if we want to represent an array of string, we will have:

```ts
const arrayModel = typeArchitect.buildModel({
  kind: 'array',
  content: {
    kind: 'primitive',
    content: 'string',
  },
} as const);
```

#### `'object'` kind

The object kind allows you to represent object. It is done by combining model in different fields with an objec model.

For example, if we want to define an object position with two fields, we will have:

```ts
const objectModel = typeArchitect.buildModel({
  kind: 'object',
  content: {
    positionX: {
      kind: 'primitive',
      content: 'number',
    },
    positionY: {
      kind: 'primitive',
      content: 'number',
    },
  },
} as const);
```

#### `'or'` kind

The or kind allows you to represent conjoction. It is done by combining two models.

For example, if we want to define an value which is boolean or a number, we will have:

```ts
const orModel = typeArchitect.buildModel({
  kind: 'or',
  content: [
    {
      kind: 'primitive',
      content: 'boolean',
    },
    {
      kind: 'primitive',
      content: 'number',
    },
  ],
} as const);
```

#### `'custom'` kind

The custom kind allows you to express type that can not be represented with the other structure of model.
It can be usefull to express a model deriving from an existing class.

The content of a custom kind model is the name you want to give to this custom type.

For example, if we want to define the model of an error, we will have:

```ts
const objectModel = typeArchitect.buildModel({
  kind: 'custom',
  content: 'someError',
} as const);
```

If you want to compute the type of a model where there are custom kind model, you need to give
a mapping of the custom kind model present from its name to an actual type:

```ts
type objectModelWithCustomType = Type<typeof objectModel, { someError: Error }>;
```

In the same way, for JSON parsing, when there are custom kind model in your model, you need to
provide a `customMapping` to check and map the parsed string to the proper type:

```ts
const jsonWithCustom = 'SOME ERROR TEXT';

const parsedObjectWithCustom = typeArchitect.parseJson({
  model: objectModel,
  json: jsonWithCustom,
  customMapping: { someError: (errorMessage) => new Error(errorMessage) },
});
```

### `buildModel`

The `typeArchitect.buildModel` function allows to build model with the proper structure.
Its parameter should always be define as a **const type**

### `Type`

`Type` is a generic type which can derive a type from a model.
It can take two parameters:

- the type of the model to type: `typeof yourModel` (mandatory)
- a `CustomMapping` for the custom kind present in the model. It should be the type
  of an object the name of the custom kind of the model as key and their actual type as value

### `parseJson`

The `typeArchitect.parseJson` function allows you to parse a JSON according to a model.
The parsed value is statically type to the type derived from the model.
During the parsing, there will also be some dynamic check performed.

### `generate`

The `typeArchitect.generate` function allows you to generate a random data from a model.

### `generateObject`

The `typeArchitect.generateObject` function allows you to generate a random data from an object kind model.
You can provide with the field parameter `customFields` specific value for some fields of the generated object.
