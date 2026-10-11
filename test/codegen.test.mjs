import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import { compile, generateTypescript } from "../dist/compiler/index.js";
import { openSchema, encode, open, Span, Code } from "../dist/index.js";
const cases = [
  [
    "scalar",
    "enum Mode:u8 {Off=0;On=2} message Root {1 a:i8 2 b:u8 3 c:i16 4 d:u16 5 e:i32 6 f:u32 7 g:i64 8 h:u64 9 i:f32 10 j:f64 11 flag:bool 12 n:i16 @range(-100,100) 13 mode:Mode=2}",
    [
      {
        a: -128,
        b: 255,
        c: -32768,
        d: 65535,
        e: -2147483648,
        f: 4294967295,
        g: -(1n << 63n),
        h: (1n << 64n) - 1n,
        i: -0,
        j: Infinity,
        flag: true,
        n: -100,
      },
      { i: NaN, j: -0, n: 100 },
      {},
    ],
  ],
  [
    "compound",
    "message Root {1 words:string[] 2 matrix:u16[][] 3 rows:Row[] 4 flags:bool[] 5 fixed:bool[10] 6 child:ref<Row> 7 texts:string[2]} struct Row {1 number:u32 2 text:string}",
    [
      {
        words: ["", "é", "😀", "\ud800"],
        matrix: [[1, 65535], [], [3]],
        rows: [
          { number: 7, text: "one" },
          { number: 8, text: "二" },
        ],
        flags: [true, false, true, false, true, false, true, false, true],
        fixed: [
          true,
          false,
          false,
          true,
          false,
          false,
          false,
          false,
          false,
          true,
        ],
        child: { number: 9, text: "ref" },
        texts: ["hi", "世界"],
      },
      {},
    ],
  ],
  [
    "defaults",
    'message Root {1 A?:Bar={B:1} 2 C:Bar={B:2} 3 absent?:u8 4 words:string[]=["one","two"] 5 rows:Bar[]=[{B:3}]} struct Bar {1 B:u32}',
    [{}, { A: null, C: { B: 9 }, words: [], rows: [] }],
  ],
  [
    "recursive",
    "message Node {1 n:u32 2 next?:ref<Node> 3 children:Node[]}",
    [{ n: 1, next: { n: 2 }, children: [{ n: 3, children: [{ n: 4 }] }] }, {}],
  ],
  [
    "map",
    "message Root {1 entries:map<string,u32> @max_count(10)}",
    [
      {
        entries: [
          ["a", 1],
          ["b", 2],
        ],
      },
      {},
    ],
  ],
  [
    "string24",
    "message Root @max_bytes(16777216) {1 text:string @max_bytes(255) 2 rows:Row[]} struct Row {1 x:u32 2 text:string @max_bytes(255)}",
    [{ text: "hello", rows: [{ x: 1, text: "world" }] }, {}],
  ],
];
test("generated views and encoders agree with the reference implementation", async () => {
  const dir = mkdtempSync(resolve(".test-build/codegen-"));
  try {
    for (const [name, source] of cases)
      writeFileSync(
        `${dir}/${name}.ts`,
        generateTypescript(compile(source).schema),
      );
    writeFileSync(
      `${dir}/tsconfig.json`,
      JSON.stringify({
        compilerOptions: {
          target: "ES2022",
          module: "NodeNext",
          moduleResolution: "NodeNext",
          strict: true,
          skipLibCheck: true,
          rootDir: ".",
          outDir: "js",
        },
        include: ["*.ts"],
      }),
    );
    execFileSync(
      "node",
      ["node_modules/typescript/bin/tsc", "-p", `${dir}/tsconfig.json`],
      { stdio: "inherit" },
    );
    const modules = {};
    for (const [name, source, values] of cases) {
      const mod = (modules[name] = await import(
          pathToFileURL(`${dir}/js/${name}.js`).href
        )),
        schema = openSchema(compile(source).schema),
        encoder = new mod.Encoder();
      for (const value of values) {
        const expected = encode(schema, value),
          actual = encoder.encode(value);
        assert.deepEqual(actual, expected, `${name} bytes`);
        assert.equal(encoder.measure(value), actual.length);
        const storage = new Uint8Array(actual.length + 15).fill(0xaa),
          dst = storage.subarray(7, 7 + actual.length);
        assert.equal(encoder.encodeInto(value, dst), actual.length);
        assert.deepEqual(dst, expected);
        assert.equal(storage[0], 0xaa);
        assert.equal(storage.at(-1), 0xaa);
        const root = new mod.RootView().open(dst, true);
        assert.equal(root.doc.bytes, dst);
      }
    }
    const scalar = modules.scalar,
      root = new scalar.RootView().open(
        new scalar.Encoder().encode(cases[0][2][0]),
        true,
      );
    assert.equal(root.getA(), -128);
    assert.equal(root.getH(), (1n << 64n) - 1n);
    assert.ok(Object.is(root.getI(), -0));
    root.setN(20);
    assert.equal(root.getN(), 20);
    assert.throws(
      () => root.setN(101),
      (e) => e.code === Code.BoundExceeded,
    );
    assert.throws(
      () => root.setMode(1),
      (e) => e.code === Code.BoundExceeded,
    );
    const defaults = modules.defaults,
      dr = new defaults.RootView().open(new defaults.Encoder().encode({}));
    assert.equal(dr.getAInto(new defaults.Layout1()).getB(), 1);
    assert.throws(
      () => dr.getAbsent(),
      (e) => e.code === Code.Absent,
    );
    assert.throws(
      () => dr.setAbsent(2),
      (e) => e.code === Code.Absent,
    );
    const s24 = modules.string24,
      r24 = new s24.RootView().open(new s24.Encoder().encode(cases[5][2][0]));
    assert.equal(r24.getText(), "hello");
    const sp = new Span();
    r24.getTextBytesInto(sp);
    assert.equal(sp.count, 5);
    // Corruption is checked when the selected variable field is followed.
    const text = open(r24.doc.bytes, s24.schema).root().field("text");
    r24.doc.dv.setUint32(text.offset, 0xff000000, true);
    assert.throws(
      () => r24.getTextBytesInto(sp),
      (e) => e.code === Code.Malformed,
    );
    const enc = new scalar.Encoder(),
      dst = new Uint8Array(100).fill(0xab);
    assert.throws(
      () => enc.encodeInto({ a: 128 }, dst),
      (e) => e.code === Code.BoundExceeded,
    );
    assert.ok(dst.every((b) => b === 0xab));
    assert.throws(
      () => enc.encodeInto({}, new Uint8Array(0)),
      (e) => e.code === Code.NeedCapacity,
    );
    const rec = new modules.recursive.Encoder();
    const cycle = {};
    cycle.next = cycle;
    assert.throws(
      () => rec.encode(cycle),
      (e) => e.code === Code.WorkLimit,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
