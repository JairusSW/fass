# FASS

FASS is a schema-driven serialization format designed for minimal overhead, high performance, and ease of use. It aims to be as fast as possible while maintaining as little overhead as possible.

## Purpose

FASS is a lightweight serialization format meant to efficiently store complex data structures into a comprehensive binary form. Designed for minimal overhead, FASS compiles down to a few memory loads and stores without any need for parsing in order to achieve its blazing fast speed. Because of its ordered structure sequence, it eliminates the need for key storage and computation, bringing a considerable size difference.

## Features

- Schema Driven: FASS uses its own schema format and compiler to generate and optimize complex structures in any supported language.
- User Defined Types: FASS allows the user to define up to 200 custom data types.
- Read Without Parsing: FASS eliminates the need for a parser allowing the user to access any section of data without the need to parse first.

## Differences compared to other serialization formats

- The FASS `struct` type is inspired by [Apache Avro](https://avro.apache.org/)'s binary format and eliminates the need for keys.
- Similar to [FlatBuffers](https://github.com/google/flatbuffers), FASS implements per-key serialization and deserialization, but experiences less overhead due to its optimizing code generator.
- It is much more performant than [JSON](https://www.json.org/json-en.html) because it takes advantage of the strongly typed schema driven nature to produce much more compact stripped down binary buffers, at the cost of being less dynamic (FASS is not a direct replacement or competitor for JSON).
- P.S. Need to compare stuff when FASS has a MVP.

## Codegen

Take a look at the current codegen in https://github.com/JairusSW/fass/tree/master/examples

AssemblyScript is supported, and TypeScript development is on pause for now.

## Types

**Primitive Types**

- char
- u8
- i8
- u16
- i16
- u32
- i32
- u64
- i64
- f32
- f64

**Structure Types**

- struct
- enum

## Schema Format

FASS Schemas are designed to be readable and minimal.

A basic example of 3D Vector representation.

_Vec3.fass_

```
struct Vec3 {
    x: f32
    y: f32
    z: f32
}
```

Example of a complex data structure.

_Player.fass_

```
include "./Vec3.fass"

struct Player {
    team: Team
    name: char[]
    id: i32
    pos: Vec3
    data: u8[5]
}

enum Team {
    red
    blue
}
```

## Schema Features

**Strings**

Strings are declared as a array of `char`

`char[]`

**Arrays**

There are two flavors of arrays--fixed and variable length arrays.

A variable length array is a array who's length may vary. These are usually less performant than fixed arrays.

`type[]`

A fixed array does not change in size and is much more performant.

`type[LENGTH_OF_ARRAY]`

The same may be applied for strings (`char[]`)

`char[LENGTH_OF_STRING]`

Many more features will be implemented later :)

## Usage (AssemblyScript)

Install from GitHub (While in development)

`npm i JairusSW/fass -g`

Write your schemas and build the files.
We are using a Vector 3 schema for this example.

```
struct Vec3 {
    x: u8
    y: u8
    z: u8
}```

`fass build INPUT_FOLDER --assemblyscript -o OUTPUT_FOLDER`

Take a look at the generated files, and use the provided classes.

Now, in AssemblyScript, import it

```js
import { Vec3 } from "PATH-TO-VEC3.TS"
```