# FASS

FASS is a schema-driven serialization format designed for minimal overhead, performance, and usability. It aims to be as fast as possible while maintaining as little overhead as possible.

## Purpose

FASS was made to allow languages to represent complex structures in compact binary form with minimal overhead. Its purpose is to enable programs to share data in a compact and performant way.

## Features

- Powerful schema format with custom user-defined types
- Multiple flavors of data serialization to fit the user's specific needs
- The ability to retrieve data without the extra overhead of parsing
- A compact sorted data structure that omits the need for lookup keys
- A inbuilt optimization pass in the compiler


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
- array
- list
- map
- custom

## Schema Format

FASS Schemas are designed to be readable and minimal.

A basic example of 3D Vector representation.

*Vec3.fass*

```
struct Vec3 {
    x: f32
    y: f32
    z: f32
}
```

Example of a complex data structure.

*Player.fass*

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