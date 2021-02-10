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
import { buildModel, buildType } from 'type-architect';

const userModel = buildModel({
  kind: 'object',
  content: {
    _id: { kind: 'custom', content: 'ObjectId' },
    email: { kind: 'primitive', content: 'string' },
    name: { kind: 'primitive', content: 'string' },
    passwordHash: { kind: 'primitive', content: 'string' },
  },
} as const);
// "as const" is mandatory, Type Architecte can only work with const type

type userType = buildType<typeof userModel, { ObjectId: ObjectId }>;
```

The only prerequisites with Type Architect is that all model should be defined `as const` (with a const type).

You can easily parseJson with proper type (static type) and with dynamic type checking.

```ts
import { parseJson } from 'type-architect';

const userJson = `{
  "_id": "507f1f77bcf86cd799439011",
  "email": "email@email.email",
  "name": "NAME",
  "passwordHash": "qiyh4XPJGsOZ2MEAyLkfWqeQ",
}`;

// parsedUser is already typed with the type buildType<typeof userModel, { ObjectId: ObjectId }>
const parsedUser = parseJson({ userModel, json, customMapping: { ObjectId: (idStr) => new ObjectId(idStr) } });
```

## Documentation

### The model type

A model can be built with the function `buildModel`.

The model type use an ADT style approach, each model looks like this:

```ts
{
  kind: ..., // kind of model
  content: ... // the actual content of the model
}
```

There are 5 differents model kind in Type Architect: `'primitive'`, `'constant'`, `'custom'`, `'object'`, `'array'`.

#### `'primitive'` kind

The primitive kind of model allows you to represent primitive type.

For now, the supported primitives types are:

- `'boolean'`
- `'date'`
- `'string'`
- `'number'`
- `'void'`

For example, for a model representing a string, we will have:

```ts
{
  kind: 'primitive',
  content: 'string'
}
```
