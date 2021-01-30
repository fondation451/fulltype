# Type Architect

## Introduction

In Typescript, the type definition and the data definition live in different world.
Data schema definition can be very useful when it comes to generate dynamically values.
For example, to derive MongoDb validation rule or GraphQL schema directly from your data definitions.
You need to define the type and the data schema (it breaks the DRY philosophy)

Type Architect is a library to design the shape of your data. It provides powerful tool to
derive the type directly from the model of your data, and to parse JSON with the proper static type and
a dynamic checking according to the given model.

## Example
