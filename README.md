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

That's all for now, folks!