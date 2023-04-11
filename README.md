Fast ass serialization format
See ./schemas for examples and ./src/type/Types.ts for types
Will make this readme and spec later

- fASS will compile to basic load and stores
- It will require zero-calculation when using `struct` type
- `list` is dynamic-length struct. Similar to a classic `Map`
- `arr` is a sequence of values
- fASS will support code generation plugins
- It will support multiple languages

Currently, the parser can parse this

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
}
```

Imports coming soon when scopes are finalized and type resolution is done.