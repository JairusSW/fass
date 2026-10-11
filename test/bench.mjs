import { performance } from "node:perf_hooks";
import { compile } from "../dist/compiler/index.js";
import {
  Schema,
  Document,
  RecordView,
  ValueView,
  U32Reference,
  resolveU32,
  encode,
  verifyMessage,
  validateField,
  canonicalizeInto,
} from "../dist/index.js";
const bytes = compile("message Foo {1 A:Bar} struct Bar {1 B:u32}").schema,
  schema = new Schema().open(bytes),
  data = encode(schema, { A: { B: 7 } }),
  doc = new Document().open(data, schema),
  root = doc.root(),
  field = root.field("A").record().field("B"),
  path = resolveU32(schema, "A.B"),
  recordScratch = new RecordView(),
  valueScratch = new ValueView(),
  ref = path.bindInto(root, new U32Reference(), recordScratch, valueScratch),
  schemaScratch = new Schema(),
  documentScratch = new Document(),
  verifyScratch = new Uint32Array(100),
  destination = new Uint8Array(100);
let sum = 0;
const iterations = Number(process.env.FASS_BENCH_ITERATIONS ?? 100000);
function bench(name, count, fn) {
  for (let i = 0; i < Math.min(count, 1000); i++) fn();
  const t = performance.now();
  for (let i = 0; i < count; i++) fn();
  const ns = ((performance.now() - t) * 1e6) / count;
  console.log(
    `${name.padEnd(30)} ${ns.toFixed(1)} ns/op (${count} iterations)`,
  );
}
console.log(
  `Node ${process.version}; ${process.platform}/${process.arch}; warm metadata; ${data.length}-byte A.B payload`,
);
bench("schema open (reused view)", iterations, () => schemaScratch.open(bytes));
bench("document open (reused view)", iterations, () =>
  documentScratch.open(data, schema),
);
bench(
  "named A.B (ergonomic)",
  iterations,
  () => (sum += doc.root().field("A").record().field("B").u32()),
);
bench(
  "slot B (reused view)",
  iterations,
  () =>
    (sum += field.doc
      .rootInto(recordScratch)
      .atSlotInto(0, valueScratch)
      .recordInto(recordScratch)
      .atSlotInto(0, valueScratch)
      .u32()),
);
bench(
  "cached path bind + get",
  iterations,
  () => (sum += path.bindInto(root, ref, recordScratch, valueScratch).get()),
);
bench("bound scalar get", iterations, () => (sum += ref.get()));
bench("selected scalar validation", iterations, () => validateField(field));
bench("whole message verification", Math.min(iterations, 10000), () =>
  verifyMessage(doc, verifyScratch),
);
bench("native object construction", Math.min(iterations, 10000), () =>
  encode(schema, { A: { B: 7 } }),
);
bench("canonical compaction (TS)", Math.min(iterations, 10000), () =>
  canonicalizeInto(doc, destination, verifyScratch),
);
console.log(
  `checksum ${sum}; opening and borrowed work are separate from native conversion; no competitor comparison`,
);
