import { test } from "node:test";
import assert from "node:assert/strict";
import { compile } from "../dist/compiler/index.js";
import {
  openSchema,
  open,
  encode,
  resolveU32,
  U32Reference,
  RecordView,
  ValueView,
  Code,
  U32ArrayView,
  resolveArrayU32,
} from "../dist/index.js";
const schema = (s) => openSchema(compile(s).schema);
test("compiled inline path has no schema reads when binding established records", () => {
  const s = schema("message Root {1 A:Child} struct Child {1 B:u32}"),
    d = open(encode(s, { A: { B: 7 } }), s, true),
    r = d.root(),
    path = resolveU32(s, "A.B");
  s.layout =
    s.entry =
    s.access =
    s.plan =
    s.u32 =
    s.u8 =
      () => {
        throw Error("unexpected runtime schema read");
      };
  const ref = path.bindInto(r, new U32Reference());
  assert.equal(ref.get(), 7);
  ref.set(9);
  assert.equal(ref.get(), 9);
});
test("compiled paths keep own/ancestor presence, readonly and schema generation", () => {
  const s = schema("message Root {1 A?:Child} struct Child {1 B?:u32}"),
    path = resolveU32(s, "A.B");
  const absent = open(encode(s, {}), s),
    parent = open(encode(s, { A: {} }), s),
    present = open(encode(s, { A: { B: 2 } }), s);
  assert.throws(
    () => path.bindInto(absent.root(), new U32Reference()),
    (e) => e.code === Code.Absent,
  );
  assert.throws(
    () => path.bindInto(parent.root(), new U32Reference()),
    (e) => e.code === Code.Absent,
  );
  const ref = path.bindInto(present.root(), new U32Reference());
  assert.equal(ref.get(), 2);
  assert.throws(
    () => ref.set(1),
    (e) => e.code === Code.ReadOnly,
  );
  s.open(s.bytes);
  assert.throws(
    () => path.bindInto(present.root(), new U32Reference()),
    (e) => e.code === Code.SchemaMismatch,
  );
});
test("typed record/scalar arrays retain index checks, optional guards and constraints", () => {
  const s = schema(
      "message Root {1 rows:Row[] 2 values:u32[] @max_count(10)} struct Row {1 x?:u32 @range(1,100)}",
    ),
    d = open(encode(s, { rows: [{ x: 7 }, {}], values: [3, 4] }), s, true),
    rows = resolveArrayU32(d.root().field("rows").array(), "x"),
    values = new U32ArrayView().bind(d.root().field("values").array());
  assert.equal(rows.get(0), 7);
  rows.set(0, 99);
  assert.equal(rows.get(0), 99);
  assert.throws(
    () => rows.set(0, 101),
    (e) => e.code === Code.BoundExceeded,
  );
  assert.throws(
    () => rows.get(1),
    (e) => e.code === Code.Absent,
  );
  for (const i of [-1, 2, 0.5, NaN])
    assert.throws(
      () => values.get(i),
      (e) => e.code === Code.BoundExceeded,
    );
  values.set(1, 8);
  assert.equal(values.get(1), 8);
});
test("path compilation rejects selected malformed plans and projection links", () => {
  const s = schema("message Root {1 A:Child} struct Child {1 B:u32}"),
    d = open(encode(s, {}), s),
    b = d.root().field("A").record().field("B");
  s.dv.setUint32(s.plan(b.planIndex) + 8, 0, true);
  assert.throws(
    () => resolveU32(s, "A.B"),
    (e) => e.code === Code.Malformed,
  );
});
