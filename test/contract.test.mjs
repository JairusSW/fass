import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { compile } from "../dist/compiler/index.js";
import {
  openBuffers,
  openSchema,
  Kind,
  Code,
  readSpan,
  writeSpan,
  xxh64,
} from "../dist/index.js";
const hex =
  "2a000000000000000000803f0000004000004040e803021e0006240003014a61697275736400c8002c01";
test("Player has exact packed head and borrowed values", () => {
  const c = compile(readFileSync("examples/player.fass", "utf8"));
  const bytes = Uint8Array.from(Buffer.from(hex, "hex"));
  assert.match(c.report, /Player head: 30 bytes/);
  const doc = openBuffers(bytes, c.schema, true),
    r = doc.root();
  assert.equal(r.field("id").scalar(), 42n);
  assert.equal(r.field("position").record().field("y").scalar(), 2);
  assert.equal(r.field("name").string(), "Jairus");
  assert.equal(r.field("scores").array().at(2).scalar(), 300);
  r.field("health").setScalar(123);
  assert.equal(bytes[20], 123);
  assert.equal(r.field("active").scalar(), true);
});
test("A.B stays local and selected corruption is rejected", () => {
  const c = compile(
    "message Foo { 1 A: Bar = {B:1} } struct Bar { 1 B: u32 } struct Unrelated {1 C:u32}",
  );
  const schema = c.schema.slice(),
    s = openSchema(schema),
    v = s.dv;
  const last = s.entry(1, s.count(1) - 1);
  v.setUint32(last, 0xffffffff, true);
  const doc = openBuffers(new Uint8Array([1, 0, 0, 0]), schema);
  assert.equal(doc.root().field("A").record().field("B").u32(), 1);
  const b = doc.root().field("A").record().field("B");
  v.setUint32(s.entry(2, b.field), 100, true);
  assert.throws(
    () => doc.root().field("A").record().field("B"),
    (e) => e.code === Code.Malformed,
  );
});
test("unknown perfect-hash names are verified; stable IDs differ from slots", () => {
  const fields = Array.from(
      { length: 32 },
      (_, i) => `${i * 3 + 1} field${i}:u32`,
    ).join("\n"),
    c = compile(`message Many {${fields}}`),
    doc = openBuffers(new Uint8Array(128), c.schema, true),
    r = doc.root();
  for (let i = 0; i < 32; i++) {
    r.field(`field${i}`).setU32(i);
    assert.equal(r.fieldByID(i * 3 + 1).u32(), i);
    assert.equal(r.atSlot(i).u32(), i);
  }
  for (let i = 0; i < 50; i++)
    assert.throws(
      () => r.field(`missing${i}`),
      (e) => e.code === Code.NotFound,
    );
});
test("descriptor width, full masks, exact bounds and high padding", () => {
  for (let o = 0; o <= 32; o++)
    for (let l = 0; l <= 32; l++) {
      const d = Math.ceil((o + l) / 8),
        max = 2 ** l - 1,
        at = 2 ** o - 1,
        b = new Uint8Array(d);
      writeSpan(b, 0, d, o, l, at, max, max);
      assert.deepEqual(readSpan(b, 0, d, o, l, max), [at, max]);
    }
  const b = new Uint8Array(3);
  writeSpan(b, 0, 3, 16, 7, 1, 100, 100);
  assert.throws(
    () => writeSpan(b, 0, 3, 16, 7, 1, 101, 100),
    (e) => e.code === Code.BoundExceeded,
  );
  b[2] = 255;
  assert.throws(() => readSpan(b, 0, 3, 16, 7, 100));
});
test("XXH64 independent published vectors", () => {
  assert.equal(xxh64(new Uint8Array()), 0xef46db3751d8e999n);
  assert.equal(xxh64(new TextEncoder().encode("a")), 0xd24ec4f1a98c6e5bn);
  assert.equal(xxh64(new TextEncoder().encode("abc")), 0x44bc2cf5ad770999n);
});
