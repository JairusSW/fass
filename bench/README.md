# Performance evidence

Run from the repository root after `npm ci`:

```sh
npm run bench:workloads
npm run bench:generate
node bench/compare.mjs
npm run bench:native
```

`bench:workloads` compares generated TypeScript FASS with generated FlatBuffers,
protobufjs, @msgpack/msgpack, and native JSON. `compare.mjs` separates opening,
named lookup, slot access, compiled paths, bound scalar access and array access.
The original generic-runtime results are retained in `baseline.json`.

`bench:native` compares generated AssemblyScript on V8 Wasm against native
C++ FlatBuffers/Protobuf/simdjson, C json-c, and Rust FlatBuffers/prost/rmp-serde/
serde_json. It needs clang/clang++, Cargo, pkg-config, FlatBuffers 25.12.19,
Protobuf 35.1, simdjson, and json-c development libraries. On macOS these can be
installed with Homebrew. Committed native bindings were emitted by flatc
25.12.19 and protoc 35.1. Regenerate for a different installed compiler/runtime:

```sh
flatc --cpp --rust -o bench/native bench/flatbuffers/rows.fbs
protoc -I bench/flatbuffers --cpp_out=bench/native bench/flatbuffers/rows.proto
```

Cargo.lock pins the Rust dependency versions. FASS benchmarks regenerate from
the same binary-schema compiler used by the CLI. No independent benchmark
layout algorithm is used.

The row workload has 256 records containing four uint32s and one ASCII string,
in 16 varying buffers. Every reader computes the same sum of all four numbers,
UTF-8 byte count, and first string byte. It reads every field; it does not scan
every string byte. Checksums are independently checked before timing. Buffers,
schema compilation, code generation, fixture writing, and Wasm/native startup
are outside timing. Results are warm medians; all raw samples are retained.
Native loops and Wasm loops process many messages per sample. Wasm crosses the
host boundary once per sample; input copies occur before timing.

FASS and FlatBuffers borrow values. Protobuf, MessagePack and ordinary JSON
implementations decode into native objects because those are their respective
APIs. simdjson uses its borrowed on-demand API. Native C++ FlatBuffers and the
Rust unchecked variant skip verification, whereas the Rust safe root API
verifies the complete buffer; both Rust modes are reported explicitly. FASS
checks followed descriptors and their payload extents, without full validation
or UTF-8 scans. This does not establish global ownership or authenticate input.

AssemblyScript is reported with SIMD enabled and disabled, and with both
reusable views and scalar-block reductions on established heads. The latter
uses generated `atPointer`, `getNameSpanAt` and `sumU32FieldsUnchecked`: head
extents were established by the checked array bind, and string payload bounds
are checked when followed. These are distinct API paths. SIMD widens unsigned
lanes before adding, preserving sums that overflow uint32. The scalar build
removes v128 code through `ASC_FEATURE_SIMD` dead-code elimination.

TypeScript encoding uses a reusable generated Encoder with caller output;
FlatBuffers reuses a Builder. Protobuf/MessagePack produce owned bytes, JSON
produces a UTF-16 JS string. Encoding results retain those ownership/output
differences. The generic FASS builder remains available for reflection/maps;
generated map encoders currently fall back to it. Native benchmarks currently
measure reading, not encoding or whole-message validation.

`FASS_BENCH_OUTPUT=path.json` saves reports. `FASS_REQUIRE_SPEEDUP=2` makes the
row-read gate exit nonzero if any competitor is less than 2× slower. The native
gate includes unchecked C++ FlatBuffers. It is deliberately allowed to fail;
the implementation does not claim a universal 2× advantage. Identical bound
loads and native borrowed vectors are especially inappropriate for that claim.

`FASS_BENCH_ROWS`, `FASS_BENCH_MESSAGES`, and `FASS_BENCH_SAMPLES` configure the
TypeScript row workload. Native runs use `FASS_BENCH_ROWS` and
`FASS_NATIVE_MESSAGES` (nine samples). Regenerate native fixtures before changing
row count. Recorded reports identify the engine, versions, flags and workload.
Cold caches, x86, additional Wasm engines, large inputs and production workloads
remain separate measurements.

## Saved warm run

These reports measured revision `cdead40` on Apple M4 Max, v26.4.0 / V8 14.6.202.34-node.21. Nine samples and 16 varying 256-row inputs; native loops use 20,000 messages per sample.

| Native read path                                | ns/message | Competitor time / FASS SIMD time |
| ----------------------------------------------- | ---------: | -------------------------------: |
| AssemblyScript FASS simd / bulk scalar blocks   |      366.2 |                            1.00× |
| AssemblyScript FASS simd / reusable views       |      744.0 |                            2.03× |
| AssemblyScript FASS scalar / bulk scalar blocks |      413.2 |                            1.13× |
| AssemblyScript FASS scalar / reusable views     |      745.4 |                            2.04× |
| C++ FlatBuffers unchecked                       |      505.8 |                            1.38× |
| C++ Protobuf fresh                              |    11653.1 |                           31.83× |
| C++ Protobuf reused                             |     4960.0 |                           13.55× |
| C++ simdjson ondemand                           |     6778.3 |                           18.51× |
| C json-c DOM                                    |   149584.5 |                          408.53× |
| Rust FlatBuffers unchecked                      |      787.6 |                            2.15× |
| Rust FlatBuffers verified                       |    10287.5 |                           28.10× |
| Rust prost                                      |    10400.0 |                           28.40× |
| Rust rmp-serde                                  |    14580.2 |                           39.82× |
| Rust serde_json                                 |    24984.6 |                           68.24× |

The 2× native gate **fails on unchecked C++ FlatBuffers**. The generated
TypeScript row-read gate passes all four formats in this run. Encoding remains
below 2× against JSON and Protobuf; direct native vector access is also faster
than some FASS single-element access paths.

[Native raw samples](native/results.json), [TypeScript row samples](results-typescript.json),
[access-path samples](results-access.json), and [original baseline](baseline.json)
include the evidence; they are not cross-platform performance guarantees.
