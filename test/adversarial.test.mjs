import { test } from "node:test";
import assert from "node:assert/strict";
import { compile } from "../dist/compiler/index.js";
import {
  openSchema,
  open,
  encode,
  verifySchema,
  verifyMessage,
  FassError,
  Code,
  MapView,
  resolveU32,
  U32Reference,
  RecordView,
  ValueView,
  canonicalizeInto,
  FloatBits,
} from "../dist/index.js";
test("seeded malformed images return bounded numeric errors, never native bounds exceptions", () => {
  const source =
      "message Root {1 A:Child 2 values:u32[] 3 text:string} struct Child {1 B:u32}",
    original = compile(source).schema;
  let seed = 123;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed;
  };
  for (let i = 0; i < 500; i++) {
    const bytes = original.slice(),
      at = random() % bytes.length;
    bytes[at] ^= 1 << (random() % 8);
    try {
      const s = openSchema(bytes);
      verifySchema(s, { maxSchemaSteps: 10000 });
    } catch (e) {
      assert.ok(e instanceof FassError, `iteration ${i}: ${e}`);
    }
  }
});
test("selected scalar plan cannot claim a smaller extent; UTF-8 rejects overlong and surrogate bytes", () => {
  const c = compile("message Root {1 values:u32[] 2 text:string}"),
    s = openSchema(c.schema),
    data = encode(s, { values: [7], text: "a" }),
    doc = open(data, s, true),
    array = doc.root().field("values").array(),
    p = s.plan(array.child);
  s.dv.setUint32(p + 8, 0, true);
  assert.throws(
    () => array.at(0),
    (e) => e.code === Code.Malformed,
  );
  for (const b of [
    [0xc0, 0x80],
    [0xed, 0xa0, 0x80],
    [0xf4, 0x90, 0x80, 0x80],
  ]) {
    const s = openSchema(compile("message Root {1 text:string}").schema),
      data = encode(s, { text: "x".repeat(b.length) }),
      doc = open(data, s),
      value = doc.root().field("text");
    value.bytes().set(b);
    assert.throws(
      () => verifyMessage(doc, new Uint32Array(20)),
      (e) => e.code === Code.Malformed,
    );
  }
});
test("resolved paths retain ancestor presence and exact schema identity", () => {
  const s = openSchema(
      compile("message Root {1 child?:Child={x:7}} struct Child {1 x:u32}")
        .schema,
    ),
    d = open(encode(s, {}), s, true),
    path = resolveU32(s, "child.x"),
    ref = path.bindInto(
      d.root(),
      new U32Reference(),
      new RecordView(),
      new ValueView(),
    );
  assert.equal(ref.get(), 7);
  ref.set(9);
  assert.equal(d.root().field("child").record().field("x").u32(), 9);
  const another = openSchema(s.bytes);
  assert.throws(
    () =>
      path.bindInto(
        open(d.bytes, another).root(),
        new U32Reference(),
        new RecordView(),
        new ValueView(),
      ),
    (e) => e.code === Code.SchemaMismatch,
  );
});
test("canonicalization preserves NaN payloads and signed zero", () => {
  const s = openSchema(
      compile("message Root {1 a:f32 2 b:f64 3 arr:f32[]}").schema,
    ),
    d = open(
      encode(s, {
        a: new FloatBits(9, 0x7fc00042n),
        b: new FloatBits(10, 0x8000000000000000n),
        arr: [new FloatBits(9, 0x7fc00055n)],
      }),
      s,
    ),
    out = new Uint8Array(100),
    n = canonicalizeInto(d, out, new Uint32Array(20)),
    copy = open(out.subarray(0, n), s);
  assert.equal(copy.root().field("a").scalarBits(), 0x7fc00042n);
  assert.equal(copy.root().field("b").scalarBits(), 0x8000000000000000n);
  assert.equal(
    copy.root().field("arr").array().at(0).scalarBits(),
    0x7fc00055n,
  );
});
test("schema verifier checks typed default bounds and auxiliary provenance", () => {
  const s = openSchema(
      compile('message Root {1 x:u8=1 2 text:string @max_bytes(4)="hi"}')
        .schema,
    ),
    first = s.entry(13, 0);
  s.dv.setBigUint64(first + 24, 300n, true);
  assert.throws(
    () => verifySchema(s),
    (e) => e.code === Code.Malformed,
  );
  const names = openSchema(compile("message Root {1 x:u32}").schema),
    aux = names.u32(56);
  names.dv.setUint32(aux + 4, names.u32(aux + 4) + 8, true);
  assert.throws(
    () => verifySchema(names),
    (e) => e.code === Code.Malformed,
  );
});
