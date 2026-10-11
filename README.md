# fass

Packed messages with a directly navigable binary schema, for TypeScript and
AssemblyScript. This is a breaking replacement of the original experiment:
there are no decorators, transforms, native struct casts, or old-format readers.

The compiler emits `.fsc` tables that the runtime borrows directly. Opening a
schema checks its header and directory range. Reading `A.B` follows only the
selected layouts, field entries, presence bits, rules, and data. Whole-schema
and whole-message verification are separate operations.

## Build and test

```sh
npm install
npm test
npm run bench
```

Tests compile and execute WebAssembly in Node. They include the exact 42-byte
Player image, malformed selected and unrelated metadata, compact descriptor
boundaries, UTF-8, defaults, composed arrays, maps, mutations, ownership,
resource limits, float bit preservation, and allocation probes in the actual
AssemblyScript binding. Benchmarks report separate warm operations on the
current machine, without comparing borrowed reads with complete object decoding.

## Schema syntax

```fass
message Player @max_bytes(65536) {
  1 id: u64
  2 position: Vec3
  3 health: u16 @range(0, 1000) = 1000
  4 name: string @max_bytes(255)
  5 scores: u16[] @max_count(255)
  6 active: bool = true
  7 note?: string
}
struct Vec3 { 1 x: f32; 2 y: f32; 3 z: f32; }
```

Every field has a stable positive ID. Fields are ordered by ID in the schema;
slots are ordinals in an exact compiled layout. Bounds default to 255 for
strings, arrays and maps, and 65,536 bytes for the message. Specify production
bounds explicitly. Scalars retain their declared width. Range annotations do
not compress integers.

Supported types are `i8/u8/i16/u16/i32/u32/i64/u64/f32/f64/bool`, `string`, `bytes`,
inline records, `ref<Record>`, `T[N]`, `T[]`, nested collections, and
`map<integer|string, Value>`. Arrays of booleans are packed bits. Map placement
is indexed by default; `@inline()` chooses inline buckets. `@descriptor(N)`
pads a string/array/map descriptor to N bytes. An annotation before `[]`
applies to its element; an annotation after `[]` applies to the array.

```fass
enum Mode: u8 { 1 Off = 0; 2 On = 2; }
message Request {
  1 mode: Mode = 2
  2 headers: map<string, string> @max_count(32)
  3 words: string @max_bytes(40) [] @max_count(10)
}
```

Defaults are typed literals: numbers, booleans, strings, record objects, arrays,
map entry pairs, or `null` for an optional field. Construction applies them;
existing data reads never substitute defaults. Zero must satisfy a required
scalar's rules, or construction needs an explicit value/default.

Records may have `@id("128-bit-hex-identity")` to retain type identity through
renaming. Without it, identity derives from the name. Manage retired field IDs
in the source; this release does not maintain an evolution lockfile. Recursive
references, variable arrays and maps are supported; positive-size inline
recursion is rejected. There are no unions, implicit includes or unknown
layout-affecting annotations.

## CLI

Build once with `npm run build`, then run `node dist/cli.js`, or install the
package to obtain the `fass` command.

```sh
fass compile examples/player.fass -o player.fsc --report player.layout.txt
fass inspect player.fsc
fass encode player.fsc player.json -o player.bin
fass verify player.fsc player.bin
fass decode player.fsc player.bin -o decoded.json
fass compact player.fsc player.bin -o compact.bin
fass generate player.fsc -o player.ts --target typescript
fass generate player.fsc -o player.as.ts --target assemblyscript
fass migrate old.fsc new.fsc old.bin -o new.bin
```

`compile --strip` emits the numeric-only runtime core. Stripped schemas support
borrowed slot/ID access and message verification; native-object construction,
reflection, decoding and migration require the full schema. Generated modules
embed the compiler's exact schema and layout/slot constants. They do not repeat
the packing algorithm.

JSON maps use `[[key, value], ...]`. Encode large integer values as decimal
strings to avoid JSON number precision loss; decoded 64-bit integers are
strings. NaN payloads need the library's `FloatBits` API, since JSON cannot
represent them. Raw messages are the default. `--framed` explicitly selects the
24-byte `FAS2` envelope for encode/decode/verify. `compact` emits raw bytes.
`verify` checks schema structure, cold defaults, the runtime fingerprint and,
when provided, message ownership and values. `--scratch N` supplies N u32 words
for message verification.

## TypeScript

```ts
import { compile } from "fass/compiler";
import {
  openSchema,
  encode,
  open,
  resolveU32,
  U32Reference,
  RecordView,
  ValueView,
} from "fass";

const { schema: schemaBytes } = compile(`
  message Foo { 1 A: Bar = { B: 1 } }
  struct Bar { 1 B: u32 }
`);
const schema = openSchema(schemaBytes);
const bytes = encode(schema, {}); // exactly 01 00 00 00
const doc = open(bytes, schema, true);
const b = doc.root().field("A").record().field("B");
console.log(b.u32());
b.setU32(2);

const path = resolveU32(schema, "A.B");
const ref = path.bindInto(
  doc.root(),
  new U32Reference(),
  new RecordView(),
  new ValueView(),
);
console.log(ref.get());
ref.set(3);
```

`openSchema`, `open`, `field`, `record`, `array`, `string`, `encode` and `decode`
are convenience APIs. They allocate JavaScript views or native values.
`Schema.open`, `Document.open`, `rootInto`, `atSlotInto`, `fieldBytesInto`,
`fieldByIDInto`, `recordInto`, `arrayInto` and `atInto` reuse caller views.
Name bytes can be encoded once. JavaScript's DataView/BigInt machinery is not
claimed to provide a universal zero-heap-allocation guarantee.

`ValueView.scalar()` preserves signed integer interpretation; 64-bit integers
are BigInts. `scalarBits()` / `setScalarBits()` preserve float bits.
`ValueView.bytes()` borrows mutable UTF-8 bytes for ordinary fields;
`string()` materializes and validates UTF-8. Published map keys expose strings
or explicit `bytesReadOnlyCopy()` values, never a writable key span through
that API. Raw backing-buffer writes bypass these protections.

`TypeView`, `FieldDeclaration`, `LiteralView`, and `declaration(value)` provide
cold schema reflection. `declaration(value).default()` returns a borrowed
literal graph; `materializeDefault()` explicitly creates native values.
`FassError` carries numeric `code`, `region`, `offset`, and `detail`. Absent,
NotFound, invalid input, type mismatch, capacity exhaustion, scratch exhaustion,
work limits and read-only access are distinct.

## Caller-owned construction and mutation

`measure(schema, nativeValue)` determines message size. `encodeInto` preflights
before changing caller output; it never grows the destination. These native
conversion operations may allocate traversal objects. `Arena` reserves from
supplied storage and returns capacity errors rather than growing it.

```ts
import {
  Arena,
  Document,
  encodeInto,
  reserveMap,
  MapWriter,
  RecordView,
  initializeBytes,
} from "fass";

const storage = new Uint8Array(schema.maxBytes);
const used = encodeInto(schema, initialValue, storage);
const doc = new Document().open(storage, schema, true);
const arena = new Arena(storage, schema, used);
initializeBytes(arena, doc.root().field("note"), encodedNote);
const map = reserveMap(arena, doc.root().field("headers"), 16);
const writer = new MapWriter(map, arena, new Uint8Array(2));
const entry = new RecordView();
writer.prepareInto("content-length", entry);
entry.field("value").setU32(42); // example map<string,u32>
writer.publish(new Uint32Array(128));
```

This example assumes those fields exist with the shown types and bounds.
`initializeScalar`, `initializeBytes` and `clearOptional` explicitly change a
field's own presence. An absent inline ancestor must be initialized by message
construction before navigating through it. Writers prepare map entries outside
the published directory, then validate and publish them. Keys become immutable.
Deletion leaves tombstones; compaction rebuilds the directory in caller output.
Only owned arena reservations may be reused. Writers need exclusive access.

A failed string update or map publication preserves the old logical value;
unreachable prepared storage can still consume arena capacity. Scalar/reference
handles remain valid only while their relevant structural and presence state
is unchanged. A stored contract ID identifies an exact layout; it is not
source authentication.

## AssemblyScript

Import the pointer library from `fass/assembly`. Set up reusable views once;
operations then use caller bytes and numeric status codes.

```ts
import { Schema, RecordView, ValueView, Code } from "fass/assembly";
const schema = new Schema();
const root = new RecordView(schema);
const a = new ValueView(schema);
const child = new RecordView(schema);
const b = new ValueView(schema);

export function readB(sp: usize, sl: u32, dp: usize, dl: u32): u32 {
  if (schema.open(sp, sl) != Code.Ok) return 0;
  if (root.open(dp, dl) != Code.Ok) return 0;
  if (root.fieldByID(1, a) != Code.Ok) return 0;
  if (a.record(child) != Code.Ok) return 0;
  if (child.fieldByID(1, b) != Code.Ok) return 0;
  return b.getU32(); // check b.status to distinguish an error from zero
}
```

`getBits`/`setBits` cover exact-width integers and floats, `getI64` sign-extends,
and `getF32/getF64/getBool/setBool` provide typed access. Arrays and maps fill
caller `ValueView`/`RecordView` objects. `U32Path` resolves caller name spans into
caller step storage; `U32Reference` binds an unconstrained scalar for direct
loads/stores. `Builder` applies full-schema defaults into caller-private storage
with a caller task stack. `Arena` supports bounded string replacement.
`reserveMap` and `MapWriter` support prepared insertion/deletion.

`Verifier` traverses reachable data with caller task and interval scratch,
checking bounds, UTF-8, rules, map routing/IDs/duplicates and allocation overlap.
`Compactor` uses caller output, a task stack and map-sort scratch to produce
canonical bytes; verify the input first. Its output preserves float bits.
Workspace objects allocate during setup; measured borrowed access, default
construction and compaction allocate no additional heap objects in the tested
Wasm stub runtime.

The AssemblyScript runtime accepts schemas trusted by compiler provenance or
verified externally with the TypeScript library/CLI. It has lazy selected-path
schema checks and whole-message verification, but no separate whole-schema
verifier or migration backend. Those operations currently live in TypeScript.
The complete zero-allocation contract has not been established for every
AssemblyScript GC runtime or target. Go/TinyGo are outside this delivery.

## Contract and validation

The schema has a 64-byte header and sixteen fixed directory slots. All values
are little-endian; packed heads and descriptors are independent of native
alignment. The wire identifiers remain `FSC2` (schema ABI 3) and `FAS2` (data ABI
1), as specified in the design. The product and command are simply `fass`.
The normal artifact includes declarations, typed defaults, stable identities
and name indexes. Name lookup uses tiny arrays for up to four fields and
compiler-built two-level perfect hashes for larger records; unknown candidates
always need full byte equality.

`validateField`, `validateSubtree`, `verifySchema`, and `verifyMessage` have
separate scopes. Whole verification enforces work limits during traversal;
caller interval scratch catches independently owned payload overlap. Local
access does not prove that an unrelated layout or map directory is valid.
Compaction removes retired payloads, unused capacity, tombstones and unused
bits. Migration uses stable IDs and target defaults, rejecting incompatible
value kinds or target constraints.

[Wire design](spec/format.md) records the reference ABI. [Delivery status](spec/status.md)
distinguishes implemented behavior from remaining acceptance gates. This code
has conformance tests, not a completed production audit or cross-platform
performance study.
