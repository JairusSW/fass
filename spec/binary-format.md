Binary Format Rules
-------------------

1. **Field Ordering**
   Fields are serialized in the following order:
   - **Fixed-length primitive fields** (e.g. `bool`, `i32`, `f32`, etc.)
   - **Dynamic-length fields** (e.g. `string`, arrays, nullable types)
   - This helps optimize deserialization and memory access patterns.

2. **Booleans**
   Booleans are stored as 1 byte:
   ```
   false → 0x00
   true  → 0x01
   ```

3. **Numbers**
   All numbers use standard binary representation:
   | Type  | Size (Bytes) | Encoding       |
   |-------|--------------|----------------|
   | u8    | 1            | unsigned       |
   | i32   | 4            | little-endian  |
   | f32   | 4            | IEEE 754       |

4. **Strings**
   Strings are encoded as:
   ```
   [u32 byteLength][UTF-8 bytes]
   ```
   - Length is the number of bytes, not characters
   - Uses UTF-8 encoding

5. **Arrays**
   Arrays are length-prefixed:
   ```
   [u32 count][elements...]
   ```
   - Each element is encoded based on its type
   - For `i32[]`, this would be `count × 4 bytes`

6. **Inline Structs**
   Fixed-size nested classes can be inlined directly:
   ```
   class Vec3 {
     x: u8;
     y: u8;
     z: u8;
   }
   // Serialized as: [x: u8][y: u8][z: u8] → 3 bytes total
   ```
   Nested struct fields are placed in sequence, as if part of the parent object.

7. **Optional Fields via Header Bitfields**
   If a field is conditionally omitted, its presence is indicated by a bit in a header byte.
   Example:
   ```
   class Player {
     age: i32; // only included if age >= 18
     pos: Vec3 | null; // omitted if null
   }
   ```
   Header byte layout:
   ```
   bit 0 → age present?
   bit 1 → pos present?
   ```
   This header is the first byte in the serialized buffer.

8. **@omitif**
   Conditionally omits a field if a runtime condition is true.
   ```
   @omitif((self: Player) => self.age < 18)
   age!: i32;
   ```
   - The field is skipped if `age < 18`
   - Tracked via bitflag in the header

9. **@omitnull**
   Omit a field if its value is `null`.
   ```
   @omitnull()
   pos!: Vec3 | null;
   ```
   - Useful for optional objects and references
   - Bitflag in the header indicates presence

10. **Custom Serialization**
    Each class may implement:
    ```
    __FASS_SIZE(): i32              // Total byte size (statically known)
    __FASS_SERIALIZE(input, output) // How to copy data from instance memory
    __FASS_DESERIALIZE(input, output) // How to populate memory from bytes
    ```
    Use `load<T>(ptr, offset)` and `store<T>(ptr, value, offset)` to read/write fields manually.

Optimized Serialization Layout
------------------------------
In an optimized serialization format, fields are grouped in a way that fixed-length fields come first, followed by dynamic-length fields.

**Example Layout:**

For the following `Player` class:
```
@json
class Player {
  firstName!: string;
  lastName!: string;
  lastActive!: i32[];

  @omitif((self: Player) => self.age < 18)
  age!: i32;

  @omitnull()
  pos!: Vec3 | null;

  isVerified!: bool;
}
```

1. **Header**:
   The first byte (or more) will indicate the presence of optional fields:
   ```
   [header: 0b00000011]
   ```
   The header byte encodes presence flags for fields like `age` and `pos`.

2. **Fixed-Length Fields** (Primitive types):
   These fields are serialized at the beginning.
   - `isVerified` (bool)
   - `age` (i32) - only if `age >= 18`

3. **Dynamic-Length Fields**:
   - `firstName` (string): [u32 byteLength][UTF-8 bytes]
   - `lastName` (string): [u32 byteLength][UTF-8 bytes]
   - `lastActive` (i32[]): [u32 count][i32 elements...]
   - `pos` (Vec3 | null): [u32 byteLength][3 bytes for Vec3 or omitted if null]

**Binary Layout:**

For a `Player` with the following:
- `age = 25`
- `pos = Vec3(1, 2, 3)`
- `lastActive = [123, 456]`

The binary layout could be:
```
┌────────────┬──────────────────────────────┐
│ Byte Index │ Description                  │
├────────────┼──────────────────────────────┤
│ 0          │ Header = 0b00000011          │
│ 1–4        │ firstName byte length (u32)  │
│ 5–...      │ UTF-8 bytes of firstName     │
│ ...        │ lastName length + bytes      │
│ ...        │ lastActive length (u32)      │
│ ...        │ 123, 456 (2 x i32)           │
│ ...        │ age (i32)                    │
│ ...        │ pos.x, y, z (u8 × 3)         │
│ ...        │ isVerified (1 byte)          │
└────────────┴──────────────────────────────┘
```
