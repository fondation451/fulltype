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

```js
import { ObjectId } from 'mongoDb'
import { buildModel, buildType } from 'type-architect'


const userModel = buildModel({
  kind: 'object',
  content: {
    _id_: { kind: 'custom', content: 'ObjectId' },
    email: { kind: 'primitive', content: 'string' },
    name: { kind: 'primitive', content: 'string' },
    passwordHash: { kind: 'primitive', content: 'string' },
  }
} as const)
// "as const" is mandatory, Type Architecte can only work with const type

type userType = buildType<typeof userModel, { ObjectId: ObjectId }>
```
