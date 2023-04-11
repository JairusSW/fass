Fast ASS Serialization Format Specification

Schema format

FASS supports three structures.
    1. Struct is the fastest and most compact data structure and cannot change in size (besides strings/dynamic arrays). The number of keys cannot change.
    2. Enum is well... a enum.
    3. List is like a map, but is similar in schema-syntax to a struct. It may have optional and required fields along with extra arbitrary fields appended to the bottom. This will be the slowest (still blazing fast though!)
It also supports primitive types.

    u8

    i8

    u16

    i16

    u32

    i32

    u64

    i64

    f32

    f64

    bool

Also supports strings

    str (Defaults to UTF-8)

Also supports up to 246 user-defined types. That means that

    - You can add support for 128 or greater integers with hi and low bits
    - You may add any string encoding you like
    - You can pass binary data through FASS with a type attached to it

FASS will compile to loads and stores (hopefully) utilizing SIMD for speedups with copying and other methods.

FASS will rely on code generation in multiple languages. (AssemblyScript, Zig, Rust, C, Grain, and Whacko are planned)

FASS will be fast

Here are some examples of schemas.

Vec3.fass

```
struct Vec3 {
    quad: Quadrant
    x: f32
    y: f32
    z: f32
}

enum Quadrant {
    TL = 1
    TR = 2
    BL = 3
    BR = 4
    // No greater than 256. User can define to use a 16-bit integer though.
}
```

Movement.fass

```
struct Movement {
    moving: bool
    speed: f32
    direction: Direction
}

enum Direction {
    n
    ne
    e
    se
    s
    sw
    w
    nw
}
```

Player.fass

```
include "./Vec3.fass"
include "./Movement.fass"

struct Player {
    name: string
    id: i32
    pos: Vec3
    movment: Movement
    data: u8[5]
}
```