# Delivery status

The implementation is named **fass**. The old experiment and its transform,
codegen paths, stale build output and benchmarks were removed intentionally.
Wire identifiers/ABI numbers follow the supplied candidate; no old input is accepted.

| Area              | Implemented and tested                                                                                                                                                                                                                                                                                                                | Remaining acceptance work                                                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Contract/compiler | Fixed heads, projection anchors, scalar widths, bit flags, descriptors, all array compositions, recursive descriptor boundaries, references, exact bounds, stable IDs, typed literals/defaults, enum member declarations, deterministic identities, tiny/perfect names, both map placements, readable layout reports, stripped images | Identity/retirement lockfiles; documentation/annotation frontends; complete normalized schema roundtrip export                                                     |
| TypeScript        | Lazy schema/data access; reusable borrowed views; explicit native conversion; cold reflection; rules/defaults; paths; bounded arenas; prepared map mutation; selected/subtree/schema/message verification; canonicalization preserving float bits; ID-based migration through records/arrays/maps/references                          | Zero-allocation claims for JS are deliberately absent; full formal/global verifier audit; in-place parent-record initialization and general array mutation helpers |
| AssemblyScript    | Pointer/schema views; numeric statuses; scalar/record/array/map access; UTF-8 and rule checks; caller-buffer default builder; cached u32 paths; bounded string updates; reserved map mutation; reachable-message verifier; canonical compactor; explicit framing                                                                      | Separate whole-schema verifier, migration and rich cold-reflection convenience APIs; constrained bound u32 reference specialization; wider runtime/GC coverage     |
| CLI               | Compile/strip/report/inspect/encode/decode/verify/compact/migrate/generate; raw/framed selection; explicit scratch size; nonzero exit on errors                                                                                                                                                                                       | Streaming transport integrations; custom annotation/source include adapters                                                                                        |
| Conformance       | Exact 42-byte Player fixture; independent TS/Wasm byte agreement; 480 cross-language XXH64 comparisons; selected-vs-unrelated corruption; descriptor boundaries; ownership, UTF-8, defaults, map ID holes, numeric constraints, seeded malformed images, float bit preservation                                                       | Sustained fuzzing and independent implementation audit; systematic every-gate corpus from the research package                                                     |
| Performance       | Warm opening, named/slot/path/bound access, selected/whole validation, construction and compaction benchmark runner; actual Wasm allocation probes                                                                                                                                                                                    | Cold caches, production workloads, SIMD/specialization and compiler code inspection; amd64/arm64/Wasm engine matrix; fair competitor comparisons                   |

No Go/TinyGo binding is included; the requested language targets are TypeScript
and AssemblyScript. Generated modules embed the authoritative binary schema
and slot constants. They do not compute their own layouts.

The TypeScript whole-schema verifier covers tables, selected hot/cold agreement,
layout/flag overlaps, identities, names, scalar rules, literal cycles and typed
literal bounds. It is a structural checker, not schema authentication, and the
remaining global audit should examine every semantic/physical correspondence
and zero-width expansion proof. The CLI additionally recomputes the runtime
contract ID. Ordinary opening does neither whole-schema verification nor
fingerprint computation.

The low-level AssemblyScript workspace model is the no-hidden-allocation path.
TypeScript convenience operations (including native construction,
canonicalization, migration and verification traversal) may allocate native
objects. Destination growth is never hidden in either language. Prepared writer
scratch/output must remain private until a successful operation; source buffers
and schema metadata must remain immutable during verification or reading.
