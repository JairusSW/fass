# FASS — wire format, indexed binary schema, and implementation plan

**Status:** consolidated implementation candidate, not a released or benchmarked implementation.  
**Research date:** 2026-10-11.  
**Data ABI:** 1. **Compiled schema ABI:** 3. Magic identifiers remain `FAS2` and `FSC2`.

This document supersedes the earlier design sketches. Schema ABI 3 deliberately does not accept the temporary ABI 1/2 schema images. The packed Player data example is unchanged. Normative words describe the proposed contract, not existing FASS behavior.

## 1. Decision

Compile the schema into an immutable, relocatable collection of directly indexed tables. The tables are the generic runtime's access representation, not a serialized description that must first be reconstructed into that representation.

A consumer passes data bytes and schema bytes. Opening reads fixed headers and the selected root layout. Navigating `A.B` follows A's field link and B's access entry. It neither scans unrelated declarations nor hashes the complete schema. Optional validation follows the same selected path. Whole-schema and whole-message verification are explicit operations.

The message has a fixed, packed head and independently located variable payloads. Nested single-record fields are flattened into the head. Arrays retain fixed-stride element heads. Scalars use their declared widths. Booleans and field presence use bits. Strings, variable arrays, and runtime maps use schema-sized descriptors.

The low-level Go/TinyGo/Wasm APIs MUST NOT allocate host heap memory for opening, lookup, borrowed views, scalar access, or operations supplied sufficient destination and scratch storage. Source-schema compilation is not subject to this restriction. Native object/string conversion is outside the low-level contract.

## 2. Research decisions

These are selected mechanisms, not claims that the proposed implementation outperforms the source projects.

| Source | Useful mechanism | FASS decision |
|---|---|---|
| Protobuf wire format [S1] | Stable field numbers; typed packed repeated values; separation of names from values | Keep stable field IDs and homogeneous array storage. Do not use tagged, arbitrarily ordered records or scalar varints in the direct-access layout. |
| Protobuf upb [S2] | Small MiniTables separated from richer reflection; table-driven runtime | Separate hot access words from reflection. Unlike loading MiniDescriptors to construct MiniTables, borrow the final access tables themselves. |
| FlatBuffers [S3, S4] | Inline fixed structs, offset-based views, binary reflection schema | Retain fixed layouts and binary schema reflection. Move the field-location directory to the shared schema rather than putting a vtable in each data object. |
| Karmem [S5] | Packed layouts, viewers, bounded arrays, Go/TinyGo/Wasm-oriented APIs | Use borrowed views and explicit bounds. Do not require native object construction, restrict nested collections to native slice shapes, or silently turn malformed content into valid-looking defaults. |
| Cap'n Proto [S6] | Compiled offsets, list heads, lazy pointer checks, traversal budgets, separate canonicalization | Apply lazy validation to both schema links and data links. Budget logical work as well as bytes. Do not add segmentation, capability pointers, default XOR, or transport compression to the core. |
| SBE [S7, S8] | Flyweight buffer access, fixed blocks, compiler-produced IR | Use small value-type views and shared compiler output. Do not require a sequential token walk for field discovery. |
| rkyv [S9, S10] | Relocatable archived data; separate checked/unchecked access; explicit format controls | Fix representation independently of native ABI. Borrow the complete image; make trust and validation explicit. |
| Arrow [S11] | Bitmaps, fixed-stride buffers, binary/list views, short-string prefixes | Use bitmaps and fixed-stride views. Do not force a 16-byte short-string descriptor on compact messages. Columnar and string-prefix variants remain outside v1. |
| Avro [S12] | Schema-supplied meaning with no field names on the wire | Keep external schema identity. Add random-access descriptors rather than sequential variable-field traversal. |
| Borsh [S13] | Explicit deterministic map ordering and binary rules | Define an optional canonical image. Preserve all floating-point bits instead of copying Borsh's NaN restriction. |
| Frozen [S14] | Precomputed perfect hashing for immutable key sets | Compile schema-name indexes. Runtime map keys still need a dynamic lookup structure. |
| Swiss tables [S15] | Compact control metadata and fingerprints before full key equality | Use eight-bucket control groups in runtime maps; do not equate a fingerprint match with equality. |

FlatBuffers' maintainer also discussed smaller offset/length fields, removing NUL terminators, packed layouts, and nested vectors as possible changes in a hypothetical new format [S16]. This is design discussion, not the current FlatBuffers specification. FASS adopts the applicable size reductions without assuming unaligned access is equally cheap on all targets.

## 3. Scope and non-goals

Supported values: i8/i16/i32/i64, u8/u16/u32/u64, f32/f64, bool, UTF-8 strings, fixed arrays, variable arrays, nested records, optional record fields, integer enums/ranges, and typed maps with integer or string keys. `bytes` is an alias for `u8[]` without UTF-8 validation.

A schema-known heterogeneous object is a record. A runtime map has a declared value type. A heterogeneous runtime `any` map would require tagged unions; unions are not part of v1. Optional collection elements can be represented by an element record containing an optional field.

V1 does not include automatic sparse records, automatic compression, scalar varints, shared mutable payloads, cyclic value graphs, schema evolution through arbitrary old-reader/new-writer mixing, or unbounded growth. These are not silently added by an encoder.

## 4. Data representation

### 4.1 Address space and framing

A raw message is one contiguous payload of at most `M` bytes, where `1 <= M <= 0xffffffff` is in the schema. The root head starts at payload offset zero. Every nonempty stored reference uses an unsigned byte offset from this same payload base, excluding any envelope. Host implementations may impose smaller limits.

An empty root may have an actual payload length of zero. A root type is always an independent record; a primitive root is represented by a one-field record.

Raw payloads require the caller/transport to supply the exact schema and length. The optional standalone envelope is:

| Offset | Width | Meaning |
|---:|---:|---|
| 0 | 4 | ASCII `FAS2` |
| 4 | 4 | Payload byte length, LE u32 |
| 8 | 16 | Runtime contract ID |
| 24 | length | Raw payload |

Raw versus framed input is explicit in the API, not guessed from magic-looking payload bytes. Transport compression, authentication, encryption, and schema distribution are outside this envelope.

### 4.2 Primitive representation

Integers use exact declared widths, little endian, and two's-complement signed values. f32/f64 use little-endian IEEE 754 bit patterns. The format preserves NaN payloads and signed zero; language arithmetic may not preserve every NaN representation. Bitwise float getters/setters are available when preservation matters.

Scalar ranges restrict legal values but do not change declared storage width. An enum uses its declared underlying integer width and a closed set of allowed bit patterns. Narrower numeric storage must be explicit in the source type. This avoids a range annotation silently changing arithmetic or the wire layout.

Booleans are bits, numbered least-significant-bit first. Record booleans are pooled with presence bits within the containing flattened head. A boolean read is a byte load and mask; writing is a masked read-modify-write, not an independent atomic bit store.

### 4.3 Fixed heads and layout algorithm

Every record has a fixed-size head, including records that contain strings, arrays, or maps. The compiler resolves all bounds and layouts.

For each independent head:

1. Expand ordinary single-instance inline record fields recursively. Keep arrays as blocks and references as descriptors. Reject positive-size by-value recursion.
2. Order scalar leaves by descending byte width, then lexicographic stable field-ID path.
3. Place fixed-array blocks in stable field-ID path order.
4. Place variable descriptors and explicit reference descriptors in stable field-ID path order.
5. Place boolean/presence bits in stable field-ID path order; a field's presence bit precedes its boolean value bit.
6. Use no inter-slot padding or trailing head padding.

An optional inline field retains its storage. Its absence never shifts another field. An optional record can instead be explicitly referenced to avoid reserving a large inline head.

Flags of inline children can share bytes with other children. A child is consequently a contextual projection over its containing head, not necessarily an independent contiguous byte slice. Entering a projection keeps the same head anchor. Its leaf offsets are already relative to that anchor.

Arrays use independent element layouts. Their flags are not pooled across elements. The ordinary record-array stride equals the independent element head size, with no trailing alignment padding. A `bool[]` is bit-packed; an array of `{flag: bool}` has a one-byte record stride.

Packed bytes MUST be accessed using portable little-endian load/store operations. Implementations MUST NOT assume a native struct cast is valid. A future aligned profile would be an explicitly different layout, not an undocumented backend variation.

### 4.4 Compact spans

For a variable field with maximum count `C > 0`:

```
O = bit_length(M - 1)
L = bit_length(C)
minimum_D = ceil((O + L) / 8)
span = offset | (count << O)
```

String count is UTF-8 byte length. Array count is element count. Map count is live entry count. O and L are at most 32, and their sum at most 64. D is the exact byte width stored in the compiled schema, from minimum_D through 8. Default D is minimum_D; an explicitly padded descriptor is allowed. Padding occupies zero high bits. Width never depends on the particular message instance.

`C=0` strings/variable arrays/maps are statically empty and omit the descriptor. Optionality still has its presence bit. A fixed array of length zero also occupies zero bytes. Explicit references to a schema-proven finite zero-byte record omit their offset. Other nonempty references store `ceil(O/8)` bytes, with zero unused high bits.

For ordinary strings/arrays, count zero requires offset zero. Positive arrays of zero-byte elements also use offset zero, retaining the count. Such elements have no address identity. A runtime map with reserved capacity is the explicit exception: its block can have nonzero offset and zero live count.

All declared bounds apply exactly. A maximum of 100 is not widened to 127 because seven bits were reserved. Full-width masks and shifts need explicit handling; do not evaluate a shift by 64 in languages where it is invalid or wraps the shift count.

Exact read recipes:

| D | Logical read |
|---:|---|
| 1, 2, 4, 8 | One supported-width load |
| 3 | u16 + u8 |
| 5 | u32 + u8 |
| 6 | u32 + u16 |
| 7 | u32 at p and u32 at p+3, combined as `u64(lo) | (u64(hi) << 24)` |

The seven-byte recipe overlaps one byte but reads only the seven stored bytes. Stores use matching pieces. Descriptor writes are not atomic.

For every span, compute extents using checked wide arithmetic. A safe bounds form is `offset <= length && bytes <= length-offset`. Validate the containing descriptor slot before loading it.

### 4.5 Strings and collections

UTF-8 strings have no terminator, local length prefix, encoding tag, or native string header. Embedded NUL is permitted. Borrowing a byte span is separate from scanning UTF-8 or constructing a native UTF-16/native-owned string.

| Type | Head/block layout |
|---|---|
| Scalar T[N] | Inline N exact-width elements |
| Scalar T[] | Span + contiguous elements |
| bool[N] | Inline ceil(N/8) bytes |
| bool[] | Span + ceil(count/8) bytes |
| Record[N] | Inline contiguous independent record heads |
| Record[] | Span + contiguous independent record heads |
| string[] | Span + contiguous string descriptors |
| T[][] | Span + contiguous inner-array descriptors |
| ref<Record> | Offset to independent target head |

Array element addressing is `elementBase + index*stride`. A variable element can have a fixed head: the element head is its descriptor or record head. No ordinary record array requires a pointer per element. An index check remains necessary even for a verified array.

Zero-width value expansion must be finite. The compiler/whole-schema verifier rejects cycles through zero-width references and positive-count zero-width expansion. A zero-length fixed array contributes no expansion. A finite path lookup still uses depth/work limits on an unverified schema.

## 5. Runtime maps

### 5.1 Data model

Keys are unconditional integers of one declared type or exact UTF-8 byte strings. Duplicate keys are errors. Integer equality uses the declared signed/unsigned type. String equality performs no normalization or case folding. Keys become immutable on publication. Rename is remove-plus-insert.

Schema-known keys are never encoded as a runtime map. They use record slots and the shared schema-name index.

### 5.2 Block

A map's span contains the block offset and live count n. A present block stores positive entry capacity E in a schema-fixed unsigned width cw. `n <= E <= C`. A null map is offset/count zero with no block. A reserved empty map has nonzero offset, n=0, and E>0. An actual nonempty map block cannot overlap the root.

```
G = bitceil(ceil(E / 7))
B = 8 * G
```

Each group has eight buckets. G and B are derived, not stored. Arithmetic is wide and checked against message limits. No requirement to use SIMD is imposed.

Two schema-selected placements share lookup semantics:

```
INLINE:
  capacity[cw]
  controls[B]
  entry_heads[B * S]

INDEXED:
  capacity[cw]
  controls[B]
  entry_ids[B * w]
  entry_heads[E * S]
```

S is the compiled synthetic entry-head size. Its local slot 0 is key (stable ID 1); local slot 1 is value (stable ID 2). A record value can be a projection within this head. Descendant payloads are separate ordinary allocations.

`cw=max(1,ceil(bit_length(C)/8))`. Indexed ID width is `w=max(1,ceil(bit_length(C-1)/8))`. For C=256, capacity needs two bytes and IDs need one. Vacant/tombstone entry IDs and heads are ignored by ordinary readers, and zeroed in canonical output. Indexed readers scan controls rather than assuming live entries occupy roots 0..n-1.

Default placement is INDEXED. INLINE is an explicit schema layout choice for small/hot entries. Excluding the common header and descendants:

```
inline bytes  = B * (1 + S)
indexed bytes = B * (1 + w) + E * S
```

These are size formulas, not performance predictions. Placement is never selected independently by each encoder.

### 5.3 Hash and probes

Use XXH64, seed zero, exactly as specified in [S17], over UTF-8 bytes or declared-width little-endian integer bytes. Use the numerical hash result, not the displayed byte order of a digest.

```
fingerprint = h & 127
first_group = (h >> 7) & (G - 1)
group(i) = (first_group + i*(i+1)/2) & (G-1), 0 <= i < G
```

Controls: 0 empty; 1 tombstone; 0x80..0xff occupied with the low seven bits as fingerprint. Other values are invalid.

In a group, compare all fingerprint candidates using complete keys before using an empty bucket as a terminating miss. Visit candidate slots in increasing bucket index for deterministic behavior. Tombstones do not terminate misses. Probe at most G groups and also obey caller work budgets. Limit exhaustion is an error, not NotFound.

Insertion remembers the first free/tombstone bucket while ruling out duplicate keys. It publishes a prepared entry only after all capacity, key, and value checks succeed. Deletion marks a tombstone and decrements n. Index reuse and payload capacity accounting belong to the writer, not hidden per-entry allocation. A tombstone rebuild uses supplied scratch/storage.

This public hash is not collision-attack protection. Key-byte and probe-work limits remain mandatory. A lookup in an unverified malformed map can be memory-safe without proving directory completeness; full verification checks routing and duplicates.

## 6. Ownership, mutation, and canonicalization

Each nonempty out-of-line allocation has exactly one owning path in a valid v1 message. Sharing and overlapping independently owned extents are invalid. Inline fields and array heads inside a containing block are not separate allocations. Empty values have no storage ownership.

Ordinary layout permits holes and retired payloads, making bounded arena replacement possible. The caller keeps schema bytes immutable and data backing storage valid. Writers require exclusive access, including exclusion of concurrent readers. Raw writes invalidate applicable validation guarantees. Structural changes invalidate affected child/array/entry/presence-dependent references.

Fixed scalar mutation writes its slot. Boolean mutation uses read-modify-write. Constrained setters enforce the scalar rule. Map-key setters are prohibited. Clearing an optional inline record can touch multiple scattered leaves; no constant-store claim applies.

The low-level builder receives destination storage and scratch. It MUST NOT grow storage implicitly. Variable replacement may reuse capacity explicitly owned by the writer or reserve fresh space, fill it, and publish a descriptor. Ordinary wire spans do not encode string/array capacity. Received bytes therefore do not authorize reusing arbitrary gaps as spare capacity.

Fallible operations preflight and prepare unreachable storage before publication. Failure preserves the previous logical value. A direct producer overwriting live bytes has a separate explicitly destructive contract unless rollback storage is supplied. Length/content replacement necessarily writes the supplied bytes; one descriptor update is not the whole operation.

Canonicalization is an explicit `CompactInto`/`CanonicalizeInto` operation over caller output and scratch:

- Emit the root head, then owned payloads in depth-first stable field-ID order.
- Reserve complete array-head blocks before writing descendants in element order.
- Sort map keys by declared numeric order or unsigned UTF-8 byte lexicographic order. Reject duplicates; set E=n; omit empty map blocks; rebuild controls with the specified hash and insertion order. Indexed IDs are sorted-key ranks. Emit external key payload before that entry's value descendants.
- Remove holes/retired storage. Zero absent field storage, unused flag/descriptor bits, and vacant map buckets/IDs/heads. Preserve live scalar bit patterns.

Canonical identity is defined over bit-level values, including NaN payloads and signed zero. Ordinary valid messages need not be canonical. Sensitive abandoned/reserved bytes MUST be zeroed or omitted before transmission, even in a noncanonical image.

## 7. Compiled schema header and directories

The schema is a byte image with no native pointers. Core-table bodies use little endian and fixed record sizes. Schema-image offsets and message-payload offsets are distinct address spaces.

The 64-byte header is:

| Offset | Width | Field |
|---:|---:|---|
| 0 | 4 | ASCII FSC2 |
| 4 | 2 | Schema ABI = 3 |
| 6 | 2 | Data ABI = 1 |
| 8 | 4 | Total schema byte length |
| 12 | 4 | Required feature bits; zero for this candidate |
| 16 | 16 | Runtime contract ID |
| 32 | 4 | Root Layout index |
| 36 | 4 | Core directory byte offset |
| 40 | 4 | Core slot count, exactly 16 |
| 44 | 4 | Maximum data payload M |
| 48 | 4 | Direct NameLookup array byte offset, or zero |
| 52 | 4 | NameLookup entry count |
| 56 | 4 | Auxiliary directory byte offset, or zero |
| 60 | 4 | Auxiliary directory entry count |

Every directory descriptor has `kind:u16, flags:u16, offset:u32, byteLength:u32, count:u32` (16 bytes). Core kind k resides at `coreDirectory + 16*(k-1)`. All sixteen descriptors exist even when their table bodies are empty. An empty body has zero offset/length/count and its normal kind. Core flags are zero.

Opening checks the fixed header, supported versions/features, declared image length, and addressability of the fixed directory range. It does not read every directory entry, check every table, or hash the image.

The first access to a table checks its expected descriptor kind, count*recordSize, and extent. The selected record is then addressed as `base + index*recordSize`, using checked arithmetic. Bounds validation of a range does not scan that range.

Nonempty table bodies and directories are eight-byte-offset aligned within the schema, but the caller's base address need not be aligned. Portable readers use appropriate unaligned-safe operations. Whole-schema verification checks global overlap and zero inter-table padding. Auxiliary kinds are >=0x8000, use flags=1, and have distinct kinds. Unknown auxiliary data is not automatically interpreted.

## 8. Schema core tables

| Kind | Table | Record bytes | Function |
|---:|---|---:|---|
| 1 | Layouts | 32 | Independent heads and contextual inline projections |
| 2 | AccessWords | 8 | Hot field access |
| 3 | FieldLinks | 8 | Direct child/value targets and own presence |
| 4 | ValuePlans | 32 | Scalar rules, descriptor parameters, compound layouts |
| 5 | MapPlans | 32 | Runtime-map physical representation |
| 6 | Presence | 8 | Own-presence byte and mask |
| 7 | ScalarRules | 32 | Inclusive integer range or closed integer enum |
| 8 | EnumValues | 8 | Allowed integer bit patterns |
| 9 | FieldIDs | 4 | Stable ID parallel to each physical field entry |
| 10 | TypeKeys | 16 | Stable identity of each normalized logical type |
| 11 | TypeDecls | 32 | Full logical schema, aligned with TypeKeys |
| 12 | FieldDecls | 32 | Declared fields and enum members |
| 13 | Literals | 32 | Defaults/annotations as typed constant nodes |
| 14 | LiteralEdges | 8 | Record/array/map constant children |
| 15 | LiteralBytes | 1 | Constant UTF-8/byte payloads |
| 16 | Annotations | 16 | Indexed linked annotation entries |

Tables 1–10 are runtime core. Tables 11–16 are cold semantic metadata: present in the default full compiler output, optional in an explicitly stripped image. Stripping does not remove runtime constraints, stable IDs, type keys, or layouts. A stripped image cannot promise defaults or full source-level reflection. No reader needs to load cold tables merely to access existing data.

`NO_INDEX = 0xffffffff`. Declared field/member IDs are in 1..0xfffffffe, scoped to their declaring type; retired IDs are reserved and never reused. Enum member numeric values need not equal their IDs and are unique in v1. The AccessWords, FieldLinks, and FieldIDs tables have parallel counts. Local fields are ordered by stable field ID. A slot is not a stable field ID. Stable-ID lookup can binary-search the selected record's ID range without parsing names. On an unverified index, a miss does not certify global sortedness/completeness.

### 8.1 Layout (32 bytes)

```
head_bytes:     u32
first_field:    u32
field_count:    u32
logical_type:   u32
anchor_layout:  u32
parent_layout:  u32
flags:          u32
reserved:       u32 = 0
```

Flags: 1 independent, 2 projection; exactly one is set. An independent layout anchors itself and has parent_layout=NO_INDEX. A projection anchors the enclosing independent head, records its immediate containing layout, and repeats the anchor's complete head_bytes for bounds. It does not claim a standalone child byte extent.

A bound record caches its selected layout/table ranges and current data anchor. Entering a projection verifies parent/anchor relationships and keeps the data anchor. References and array elements establish independent head anchors. Public binding cannot simply fabricate a projection at a root without its containing path conditions.

### 8.2 AccessWord (8 bytes)

```
data_offset: u32
kind:        u8
flags:       u8
p0:          u8
p1:          u8
```

Kinds: 1 I8, 2 U8, 3 I16, 4 U16, 5 I32, 6 U32, 7 I64, 8 U64, 9 F32, 10 F64, 11 BOOL, 12 UTF8, 13 ARRAY, 14 FIXED_ARRAY, 15 RECORD, 16 RECORD_REF, 17 MAP. Others are invalid.

Low flag bits: bit 0 OPTIONAL (this field only); bit 1 READ_ONLY (map key); bit 2 HAS_RULE (integer scalar); bit 3 reserved zero. The high nibble is stored descriptor width D. Numeric scalar D/p0/p1 are zero. BOOL uses p0 as bit index, p1/D zero. Spans use p0=O, p1=L, D as stored. RECORD_REF uses p0=O, p1=0. Inline RECORD has zero data_offset, p0/p1/D; its children already have final anchored offsets. FIXED_ARRAY has zero p0/p1/D.

For example U32 at offset zero is the u64 `0x0000000600000000` in LE. U16 at offset 20 is `0x0000000400000014`.

### 8.3 FieldLink and own presence

```
FieldLink: target:u32, presence:u32
Presence:  byte_offset:u32, mask:u8, reserved[3]=0
```

RECORD/RECORD_REF target a Layout directly. Other field kinds target a ValuePlan. Presence is NO_INDEX for required fields, otherwise an in-range Presence index. A presence mask has exactly one bit. Offsets use the current data-head anchor.

Ancestor guards are not duplicated into every descendant. Navigating A checks A's own presence before exposing A's record view. The resulting view carries the established ancestor condition for its structural lifetime. A resolved path retains all presence checks it crossed; a bound reference can omit their repetition only while those conditions remain unchanged.

This reduces schema duplication compared with storing a complete ancestor guard list on every leaf. Checking a parent never depends on an unverified leaf claiming to repeat that parent's condition.

### 8.4 ValuePlan (32 bytes)

```
kind:          u8
wire_bytes:    u8
offset_bits:   u8
count_bits:    u8
flags:         u32
head_bytes:    u32
stride:        u32
limit_count:   u32
child:         u32
reserved:      u32 = 0
rule:          u32
```

Flags: bit 0 packed boolean array; bit 1 projected record plan; others zero. Unused numeric fields are zero; unused index fields are NO_INDEX.

- Numeric: wire_bytes=head_bytes=declared width; rule optional integer ScalarRule; stride/limit zero.
- BOOL: standalone head_bytes/wire_bytes=1; field bit location remains in AccessWord.
- UTF8: descriptor parameters, head_bytes=D, limit_count=max bytes.
- ARRAY: descriptor parameters, head_bytes=D, limit_count=max count, child=element ValuePlan, stride=element head_bytes unless packed bool.
- FIXED_ARRAY: child/stride as above, limit_count=fixed count, head_bytes=count*stride (or ceil(count/8) for bool), wire_bytes=0.
- RECORD: child=Layout; independent head_bytes equals child head size; projected record plans have head_bytes=0 and flag 2. Such projections may describe a map value, but not an array element.
- RECORD_REF: child=independent Layout, descriptor width/head_bytes; count_bits=0.
- MAP: child=MapPlan, descriptor parameters/head_bytes, limit_count=maximum entry capacity.

Zero-width cases follow the data rules. Nonpacked stride zero requires a finite zero-byte element representation. Runtime validation MUST NOT recursively prove arbitrary zero-size expansion without work limits.

### 8.5 ScalarRule (32 bytes)

```
rule_kind:u8, scalar_kind:u8, flags:u16=0
first_member:u32, member_count:u32, reserved:u32=0
lower_bits:u64, upper_bits:u64
```

Rule 1 is an inclusive integer range, using lower/upper and zero member fields. Rule 2 is a nonempty closed enum, using an EnumValues range and zero lower/upper. Integers occupy low declared-width bits in these u64 containers; unused high bits are zero. Comparisons use the declared signedness, including signed extrema. EnumValues are sorted in numeric order with no duplicates.

A positive enum membership result can be checked against a selected member. A conclusive miss based on binary search assumes validated sortedness or trusted compiler output; strict validation of an unverified selected rule can inspect its member set under a budget. It never needs an unrelated type.

### 8.6 MapPlan (32 bytes)

```
entry_layout:u32, key_plan:u32, value_plan:u32
capacity_limit:u32, entry_stride:u32, flags:u32=0
capacity_bytes:u8, entry_id_bytes:u8, placement:u8, hash_kind:u8
reserved:u32=0
```

Placement 0 INLINE, 1 INDEXED. hash_kind=1 is XXH64 seed zero. The synthetic entry layout has exactly key/value slots as specified earlier. Entry stride matches that head's size. Record fields route directly to the layout described by their corresponding value plan; other fields route to that value plan. Key READ_ONLY is enforced through all writable-view APIs, including string payload exposure.

## 9. Complete schema metadata and defaults

TypeKeys cover normalized logical types, including anonymous compound types. Named types retain compiler-lockfile or explicitly declared 128-bit identities. Primitive keys and anonymous constructor keys are deterministic compiler conventions; anonymous keys derive from constructor parameters and already-resolved child keys, treating named references as identity boundaries. Runtime readers do not regenerate these keys. Full verification checks uniqueness and relationships.

TypeDecls and TypeKeys have matching counts in a full image. A Layout's logical_type selects both. This is normalized semantic reflection, not a promise to reproduce source whitespace or every syntactic alias. Optional source text can be retained for that purpose.

TypeDecl (32 bytes):

```
kind:u8, flags:u8=0, scalar_kind:u8, reserved:u8=0
name_ref:u32, first_field:u32, field_count:u32
child0:u32, child1:u32, param:u32, annotations:u32
```

Declaration kinds: 1 primitive, 2 record, 3 string, 4 array, 5 fixed array, 6 map, 7 reference, 8 integer enum. Named/anonymous values use name_ref or NO_INDEX. Record/enum first_field/count select FieldDecls; unused first_field/count are zero. Arrays/references use child0 as TypeDecl index; maps use child0 key and child1 value. param is string/array bound, fixed count, map capacity, or ScalarRule index for primitive/enum (NO_INDEX for no rule). Unused child indices are NO_INDEX. scalar_kind is only set for primitive/enum. annotations is a linked list head or NO_INDEX.

FieldDecl (32 bytes):

```
field_id:u32, name_ref:u32, logical_type:u32, flags:u32
default_literal:u32, annotations:u32, doc_name_ref:u32, reserved:u32=0
```

Flags bit 0 optional, bit 1 read-only; others zero. Each record's declarations use stable-ID order. Enum member declarations use stable member identity and store their underlying value as a scalar default_literal. Their logical_type is the underlying integer declaration; flags zero. Full verification relates field declaration types/bounds to physical plans without requiring those declarations during ordinary data access.

Literal (32 bytes):

```
kind:u8, scalar_kind:u8, flags:u16=0
first_edge:u32, edge_count:u32, payload_offset:u32, payload_length:u32
reserved:u32=0, scalar_bits:u64
```

Kinds: 1 scalar, 2 UTF8/bytes payload (context determines validation), 3 record, 4 array, 5 map, 6 null. Scalars use low declared-width bit patterns. Payload offset is relative to LiteralBytes. Unused fields are zero. LiteralEdges are `label:u32, child_literal:u32`.

Record labels are stable field IDs, sorted and unique. Array labels are consecutive indices. A map literal's edges are consecutive entry indices; each child is a two-field record literal with labels 1 key/2 value. Compiler-produced map literals use typed key order and unique keys. Literal graphs are finite and acyclic. All literal bounds and types are checked against their use context before initialization from untrusted metadata.

Annotations are 16-byte records: `name_ref:u32, value_literal:u32, next:u32, flags:u32=0`. Unknown annotations are descriptive only. An annotation that changes layout or validation MUST lower to known runtime metadata and required feature handling, not remain an ignored annotation.

Defaults are field-specific. `A: Bar={B:1}` and `C: Bar={B:2}` can have the same logical type and different default_literal values. Defaults are applied by explicit initialization/migration; existing data reads do not XOR with defaults, fall back to schema bytes, or treat missing required bytes as a default.

A required scalar with no declared initializer can use zero only when zero satisfies its rules. Otherwise the builder requires a value before successful Finish. An optional field begins absent unless an explicit initializer says otherwise. Null remains distinct from an empty string/array and from zero. `GetOrDefault` is an explicit convenience, not the raw read contract.

## 10. Compiled schema-name lookup

The default full schema retains names. Numeric-only builds may strip the name index. Header fields 48/52 locate the NameLookup array directly by logical_type, without an auxiliary-directory scan.

NameLookup (32 bytes):

```
mode:u32, field_count:u32, name_refs_offset:u32, bucket_count:u32
buckets_offset:u32, slot_count:u32, slots_offset:u32, seed:u32
```

All offsets here are schema-image offsets. A NameRef is `byte_offset:u32, byte_length:u32`; byte_offset is absolute within the schema. NameRefs for one record's fields form a contiguous array in local slot order. No NUL is needed. Type names and documentation can use other entries in the same global NameRef table, found through the auxiliary directory when explicitly requested.

Auxiliary kinds: 0x8001 NameLookup; 0x8002 NameRefs; 0x8003 NameBytes; 0x8004 NameBuckets; 0x8005 NameSlots. NameBuckets are i32; NameSlots are u32. Direct references are locally checked against the image; full verification also checks table provenance and header/directory agreement.

Modes:

- 0: no name lookup; every other word zero.
- 1: tiny linear lookup, at most four fields; bucket/slot counts/offsets and seed zero. Compare length and full bytes. This avoids allocating a separate hash structure for one-field Foo/Bar.
- 2: compiler-produced perfect hash. Buckets and slots are nonempty powers of two. Hash is XXH64 using the stored u32 seed promoted to u64.

For mode 2:

```
b = H(name, seed) & (bucket_count-1)
g = signed_i32(buckets[b])
if g == 0: NotFound
if g < 0: pos = -i64(g)-1
else:     pos = H(name, u64(seed)+u64(g)) & (slot_count-1)
slot_plus_one = slots[pos]
if slot_plus_one == 0: NotFound
slot = slot_plus_one-1
check slot < field_count
check nameRefs[slot].length and complete bytes equal input
```

Every array index and referenced name range is checked before use. Unknown names can hash to a valid candidate: complete equality is mandatory. A negative g identifies one directly assigned singleton position. Positive g is the bucket's secondary seed, not a probe loop. Runtime lookup has no collision chain.

Compiler construction: bucket known names by the primary hash; process multi-key buckets by decreasing size, tie-breaking on bucket index; search positive secondary seeds for distinct unused positions; assign singleton buckets to remaining positions; leave empty buckets zero. Begin with bucket_count=bitceil(max(1,ceil(n/4))) and slot_count=bitceil(max(1,n)). Retry with larger slot tables/another primary seed under a fixed compiler work budget. Failure is a compile resource error, never a silently invalid index. This is perfect, not necessarily minimal, hashing.

Name indexing is a schema-size/startup tradeoff paid once. It does not alter message layout or runtime-map hashing. Name misses from arbitrary unverified schema bytes do not prove that a malformed table has hidden no declarations. Full-schema verification establishes global completeness/uniqueness.

## 11. Lazy API and validation scopes

Conceptual APIs (names are proposed):

```
OpenSchema(schemaBytes)                   -> SchemaView, Status
Open(dataBytes, schemaView)               -> Document, Status
OpenBuffers(dataBytes, schemaBytes)       -> Document, Status
Document.Root().Field(name)               -> ValueView, Status
Record.FieldByID(id) / Record.AtSlot(slot) -> ValueView, Status
ValueView.Record()/Array()/Bytes()         -> borrowed view, Status
ValueView.U32() / SetU32(v)               -> value/status

ValidateField(value, limits)              -> Status
ValidateSubtree(value, scratch, limits)   -> Status
VerifySchema(schema, scratch, limits)    -> VerifiedSchema, Status
VerifyMessage(doc, scratch, limits)      -> VerifiedDocument, Status
```

Errors use fixed-size numeric status values (for example code, schema/data region, byte offset, and detail), not implicitly formatted strings. Absent, NotFound, TypeMismatch, BoundExceeded, NeedCapacity, NeedScratch, WorkLimit, ReadOnly, SchemaMismatch, and malformed input are distinct outcomes.

`OpenSchema` is the lazy fixed-header operation; it replaces earlier eager naming. `VerifySchema` is never an implicit part of Open, Resolve, or the first field access.

Local access checks only reached schema records, links, widths/kinds, current own presence, descriptor extents, and data slots. The first strict field validation may read the selected FieldLink and ValuePlan to verify hot/cold agreement. Repeated use can retain that established metadata. No opaque parsed AST, symbol table, native dictionary, or whole-schema hash is built.

For `A.B`, the selected records are the root, Foo layout, A access/link/presence if any, Bar-in-Foo layout, and B access/link/value rule. An unrelated invalid type remains unread. Checking a range's end is not reading every item in that range.

Validation scopes are explicit:

| Scope | Guarantee |
|---|---|
| Local access | Reached metadata is addressable and checked for this operation; accessed bytes in bounds; applicable ancestor presence established |
| Field validation | Selected scalar/string/span and its specified local rules are valid |
| Subtree validation | Selected descendants and their applicable schema records are valid within the checked scope |
| Whole schema | Global index/layout/identity/default consistency established |
| Whole message | Reachable values plus global ownership/non-overlap and map consistency established |

Validating a string scans that string when UTF-8 validity has not been established. Validating an entire array visits its elements. A subtree cannot prove it does not alias a sibling outside the subtree without inspecting broader ownership information.

A stored schema-ID match is just a stored-ID comparison. Untrusted schemas are themselves specifications of what to read: local checks do not authenticate their claimed meaning or show that they correspond to a trusted application schema.

Local scalar setters can enforce bounds, selected constraints, and permissions. Preserving all unrelated fields additionally requires globally valid layout and ownership, supplied by trusted compiler provenance, checked construction, or full verification. In particular, raw bounds checks alone do not prove that writing into an aliased malformed payload preserves another field.

### 11.1 Whole-message verification

Collect nonempty independently owned physical extents in caller scratch: root head, entire array-head block, explicit reference head, string payload, map block. Do not collect contained inline fields or individual heads already covered by an array/map block as new allocations. Sort and reject overlap; adjacency is allowed.

Enforce depth, logical-node/element count, bytes visited, allocation-interval count, key bytes, hash probes, schema steps, and scratch limits during traversal. This bounds cycles/repeated aliases before eventual overlap detection. Empty-element collections still consume logical budgets. No budget exhaustion becomes a success or miss.

Map verification checks controls/counts, capacity/extent, entry IDs/ranges/uniqueness, key validity, correct fingerprint/routing, duplicate keys, and values. Indexed-ID verification can use a scratch bitmap. Per-entry relookup must resolve to that exact active entry. Canonical checking additionally verifies order and zero unused storage.

A verified data result is tied to the exact immutable schema instance and records which schema guarantees have been established. Verifying data does not silently promote an unverified schema to a globally verified one. Strong whole-document validity requires trusted/verified runtime metadata or validation of all reached metadata relationships needed for that claim; unused declarations need not be traversed.

Schema verification checks each table/index, exact flags, hot/cold equality, positive-size inline acyclicity, finite zero-width expansion, field/flag overlap, immediate projection-parent relationships, semantic/physical consistency, default literal acyclicity/types, names, and contract fingerprint. It is not a prerequisite for reading an independent local path.

### 11.2 Cached paths

`ResolveU32("A.B")` walks only that path and returns a handle bound to the immutable schema instance and the starting physical layout. Pure inline paths collapse to final anchored offset and type; optional ancestor tests are retained. No complete path index is generated for every possible path. This avoids path-count/schema-size explosion.

A path crossing references or arrays retains those data-dependent steps; indexing needs current index/count. A bound scalar reference caches one message's established location. Repeated unconstrained access needs only the logical value load/store. A resolved schema handle survives changing messages; a bound data reference does not survive relevant relocation or presence changes.

Simple handles are small values. Larger reusable traversal plans use caller-provided storage or report NeedScratch. Do not allocate hidden closures or per-field wrapper objects.

## 12. Identity and schema evolution

The 16-byte runtime contract ID is the first 16 bytes of SHA-256 over:

```
ASCII "FASS2-RUNTIME-3" + zero byte
schemaABI:u16, dataABI:u16, requiredFeatures:u32, M:u32, rootLayout:u32
for k = 1..10:
  kind:u16, reserved:u16=0, count:u32, byteLength:u32, exact table body
```

All integers are LE. This identifies the exact runtime core, including its physical table numbering, not every semantically equivalent encoding. The compiler emits deterministic numbering. Section placement and names/defaults/docs are excluded; the whole schema image can have a separate external cryptographic digest when complete artifact identity/authentication is needed. Changing initialization defaults does not change how existing raw data is interpreted, but does change that complete artifact digest.

The compiler computes the ID. Ordinary opening reads it without recomputation. VerifySchema optionally recomputes it. Neither a bare ID nor successful structural verification is source authentication.

Known IDs select the exact compiled layout once. Stable field/type IDs support migration, but do not make arbitrarily repacked data backward compatible. Changing field locations, widths, bounds, presence, map layout, or runtime constraints produces a different contract. Renamed fields retaining their IDs do not affect the runtime core when the compiler's deterministic numbering remains stable.

V1 uses explicit migrations into caller-provided output. Do not add per-object size/vtable metadata merely to imply transparent evolution. A future evolvable table type would carry and document that cost separately.

## 13. Worked data example

Illustrative front-end syntax:

```
message Player @max_bytes(65536) {
  1 id: u64
  2 position: Vec3
  3 health: u16
  4 team: u8
  5 active: bool
  6 admin: bool
  7 name: string @max_bytes(255)
  8 scores: u16[] @max_count(255)
}
struct Vec3 { 1 x: f32; 2 y: f32; 3 z: f32; }
```

| Offset | Bytes | Field |
|---:|---:|---|
| 0 | 8 | id |
| 8, 12, 16 | 4 each | position.x/y/z |
| 20 | 2 | health |
| 22 | 1 | team |
| 23 | 3 | name: offset16 + length8 |
| 26 | 3 | scores: offset16 + count8 |
| 29 | 1 | active bit 0, admin bit 1 |
| 30 | 6 | UTF-8 Jairus |
| 36 | 6 | u16 scores 100, 200, 300 |

id=42, position=(1,2,3), health=1000, team=2, active=true, admin=false:

```
2a 00 00 00 00 00 00 00 00 00 80 3f 00 00 00 40
00 00 40 40 e8 03 02 1e 00 06 24 00 03 01 4a 61
69 72 75 73 64 00 c8 00 2c 01
```

Raw message: 42 bytes. Head: 30 bytes. Optional envelope: total 66 bytes. The schema is additional reusable storage, not included in 42 bytes. Two padded four-byte descriptors make this particular payload 44 bytes. No measured speed comparison is implied.

For `Foo { A: Bar { B:u32 } }`, the raw initialized value B=1 is `01 00 00 00`. A is a schema link/projection, not a data pointer. The direct field lookup ends at payload offset zero. Making B a u8 produces one data byte; its declared value width is not inferred from the value 1.

## 14. Implementation architecture

```
compiler/
  frontend/       source schema -> normalized declarations
  identities/     stable IDs, lockfile, reserved retired IDs
  layout/         heads, projections, flags, descriptors, plans
  names/          tiny/perfect name indexes
  defaults/       typed finite literal graphs and initialization plans
  emit/           FSC2 image, manifest, contract ID
runtime/
  schema/         lazy byte views, local record checks
  value/          typed scalars, records, arrays, UTF-8 spans
  maps/           controls, probes, entries, iterator
  verify/         field/subtree/schema/message verification
  build/          caller arenas, transactional publication
  compact/        clone, canonical output, migration
codegen/
  go/             optional ergonomic bindings
  assemblyscript/ optional ergonomic bindings
conformance/      byte fixtures, differential and property tests
bench/            isolated access and end-to-end workloads
```

The binary layout compiler is authoritative. Generated bindings consume its output rather than independently recomputing layouts. A human-readable manifest reports each field's stable ID, physical offset/bit, descriptor widths, array stride, head size, and schema metadata size.

The core Go implementation uses explicit byte operations and value types. Avoid reflection, interface-boxed scalar results, heap wrappers, hidden caches, and unchecked native-ABI casts. Establish escape/allocation behavior with compiler diagnostics and tests. TinyGo consumes the same wire/schema images. AssemblyScript's lowest-level path uses numeric offsets/pointers and caller-filled views; native string materialization is separate.

For host/Wasm integration, pass schema address/length and data address/length once per operation or batch. How those bytes become addressable to a guest is the host runtime's responsibility. The serialization format neither grants shared-memory access nor bypasses instance isolation.

## 15. Delivery plan and acceptance gates

### P0 — Reference contract

Freeze byte rules before optimized bindings: primitive codes, spans, presence, empty values, anchors, maps, schema descriptors, names, literal metadata, IDs, and canonicalization. Produce readable reference code and golden fixtures. Source syntax is an adapter; don't let decorator/native-object layout become the wire definition.

Acceptance: all worked vectors, scalar extrema, masks, descriptor widths 0..8, array strides, optional distinctions, and map rules agree independently.

### P1 — The two-buffer A.B path

Implement lazy OpenSchema/OpenBuffers, fixed-directory access, root binding, direct record routes, own presence, primitive reads/writes, stable-ID and tiny-name lookup. Keep full verification entirely outside opening.

Acceptance: an instrumented read of A.B succeeds without touching deliberately malformed unrelated schema records; corruption on its selected offset/route is rejected. Repeat with no names and with a nonzero message subview. Opening/query work does not scale with added unrelated declarations.

### P2 — Variable data and construction

Add UTF-8 spans, all fixed/variable array compositions, finite empty values, explicit references, caller-buffer builders, literal defaults, and failure-safe publication. Add general name perfect hashing and path handles.

Acceptance: no hidden destination growth; array-of-string/array/record cross-language fixtures; unknown-name candidate verification; compiler hash-search budget; failed replacement preserves old logical values.

### P3 — Maps and complete verification

Add INDEXED then INLINE maps, all key types, read-only key enforcement, insertion/deletion/rebuild, iteration, own-extent checking, subtree/schema/message verification, and configured budgets.

Acceptance: collision tests, duplicates, tombstone saturation, occupied candidate after an empty slot in a group, ID holes after deletion, cross-language XXH64 vectors, alias/cycle detection or bounded errors, UTF-8 errors, resource limits, zero-size logical amplification.

### P4 — Canonical output and interoperability

Add canonicalization/compaction, migration by stable identity, Go and AssemblyScript backends, TinyGo build/test coverage, deterministic complete images, and full metadata round trips. Preserve native-independent layout and explicit defaults.

Acceptance: Go-written bytes read in Wasm and the reverse; canonical output independent of ordinary allocation/insertion order; runtime ID stable under auxiliary name/index changes but changes for core-layout changes. Complete-image digest changes for changed defaults/names.

### P5 — Measured optimization

Compare generated access, generic slot access, named lookup, cached path, and bound scalar separately. Optimize plan caching, field dispatch, boolean stores, bulk initialization, descriptor padding, map placement, and optional SIMD only after correctness fixtures pass.

Measurements must include schema open, first named A.B read, repeated bound A.B read, UTF-8 scanning, checked versus trusted/verified modes, arrays of variable records, map hit/miss/update, build, compact, full verification, scratch peaks, output bytes, and allocations. Report warm and cold metadata/data. Separate caller setup and source compilation from runtime allocation assertions.

Run representative amd64, arm64, Wasm32, and practical TinyGo targets. Inspect actual emitted code instead of interpreting a logical load count as universal machine-instruction count. Compare equivalent work with FASS, Protobuf/upb where available, FlatBuffers, Karmem, Cap'n Proto, and SBE. Do not compare a borrowed scalar getter with a competitor's complete native-object decode.

## 16. Load-count and complexity contract

| Operation | Core work after the relevant view is established |
|---|---|
| Scalar by established slot | One hot-word load plus one payload load |
| Unconstrained scalar write by established slot | One hot-word load plus one payload store |
| Bound typed scalar reference | One logical payload load/store |
| Boolean | Load/mask; write is read-modify-write |
| Optional | Presence work unless established for reference lifetime |
| String span with bound field metadata | One/two descriptor loads plus span arithmetic |
| Primitive element of bound array | Index check/arithmetic plus one payload load/store |
| First named A.B | Two name resolutions, reached layouts/fields/rules, and payload access |
| General path | Work proportional to its steps plus selected constraints and name byte work |
| Full selected string/array validation | Work proportional to selected content |
| Whole verification | Explicit whole-scope work and scratch |

The first locally validated arbitrary field can also read its link/value plan. Safe generic checks, name hashing, view-state loads, compiler bounds checks, unaligned access, and 32-bit decomposition add instructions. No unconditional 1–2 machine-load promise applies to cold named traversal, map lookup, or arbitrary variable-size writes.

## 17. Executed byte-level checks

The accompanying limited Python model passed 949 descriptor arithmetic/read-recipe checks, 225 XXH64 comparisons against an independently installed native library, the exact 42-byte Player vector, named A.B lookup, selected-path corruption rejection, own-presence checks, four perfect-hash key sets plus unknown-name checks, and selected indexed-map lookup/mutation/extent checks. The schema fixture is 800 bytes with a four-byte Foo payload; it intentionally omits full declaration/default metadata.

The recorded read ranges show that an unrelated malformed layout is not visited during A.B lookup. These checks establish the exercised representation properties only. They do not constitute a full schema verifier, complete interoperability suite, zero-allocation proof, or latency benchmark.

## 18. Deferred changes

Do not add these before the above gates: per-record vtables/evolvable tables; scalar varints; automatic integer bitpacking; compressed direct-access claims; immutable interned payload sharing; mandatory short-string prefixes; 64-bit message offsets; schema JIT compilation; automatic columnar arrays; a general constraint bytecode VM; precomputed indexes for every possible nested path.

Each could serve a different workload. Each also changes either storage, access cost, mutability, validation, portability, or implementation size. Start with one auditable representation.

## Sources

All comparisons above rely on primary project documentation or source material. Retrieved on the research date; this is not a claim that each page is a newly released specification.

- [S1] Protocol Buffers, Encoding: https://protobuf.dev/programming-guides/encoding/
- [S2] Protobuf upb, wrapping-upb.md: https://github.com/protocolbuffers/protobuf/blob/main/docs/upb/wrapping-upb.md
- [S3] FlatBuffers Internals: https://flatbuffers.dev/internals/
- [S4] FlatBuffers Intermediate Representation: https://flatbuffers.dev/intermediate_representation/
- [S5] Karmem project documentation: https://github.com/inkeliz/karmem
- [S6] Cap'n Proto Encoding Spec, including pointer validation and traversal limits: https://capnproto.org/encoding.html
- [S7] SBE Design Principles: https://github.com/aeron-io/simple-binary-encoding/wiki/Design-Principles
- [S8] SBE Intermediate Representation: https://github.com/aeron-io/simple-binary-encoding/wiki/Intermediate-Representation
- [S9] rkyv Relative Pointers: https://rkyv.org/architecture/relative-pointers.html
- [S10] rkyv Validation and format controls: https://rkyv.org/validation.html and https://docs.rs/rkyv/latest/rkyv/
- [S11] Apache Arrow Columnar Format: https://arrow.apache.org/docs/format/Columnar.html
- [S12] Apache Avro 1.12.0 Specification: https://avro.apache.org/docs/1.12.0/specification/
- [S13] Borsh Specification: https://github.com/near/borsh#specification
- [S14] Frozen: https://github.com/serge-sans-paille/frozen
- [S15] Swiss Tables Design Notes: https://abseil.io/about/design/swisstables
- [S16] FlatBuffers maintainer's hypothetical format discussion, issue 5875: https://github.com/google/flatbuffers/issues/5875
- [S17] XXH64 Specification: https://github.com/Cyan4973/xxHash/blob/dev/doc/xxhash_spec.md
- Existing FASS README and runtime were also inspected through GitHub: https://github.com/JairusSW/FASS and https://github.com/JairusSW/fass/blob/master/assembly/index.ts
