import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { compile, generateAssemblyscript } from "../dist/compiler/index.js";
import { openSchema, open, encode, Code } from "../dist/index.js";
test("generated four-head SIMD projections match scalar reads, tails and corruption checks", async () => {
  const source = readFileSync("bench/flatbuffers/rows.fass", "utf8"),
    c = compile(source),
    s = openSchema(c.schema),
    dir = mkdtempSync(resolve(".test-build/project-"));
  try {
    writeFileSync(
      `${dir}/generated.ts`,
      generateAssemblyscript(c.schema).replace(
        "from 'fass/assembly'",
        "from '../../assembly/index'",
      ),
    );
    const program = readFileSync("bench/assembly.ts", "utf8")
      .replace("./rows-assembly", "./generated")
      .replace("../assembly/index", "../../assembly/index");
    writeFileSync(
      `${dir}/main.ts`,
      program +
        "\nexport function block(index:u32,n:u32):i32{rows.atBlockPointer(index,n);return rows.status;}",
    );
    let seed = 123;
    const random = () => {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return seed >>> 0;
    };
    for (const feature of ["enable", "disable"]) {
      execFileSync(process.execPath, [
        "node_modules/assemblyscript/bin/asc.js",
        `${dir}/main.ts`,
        "--outFile",
        `${dir}/test.wasm`,
        "--exportRuntime",
        "--runtime",
        "stub",
        "--optimize",
        `--${feature}`,
        "simd",
      ]);
      const { instance } = await WebAssembly.instantiate(
          readFileSync(`${dir}/test.wasm`),
          {
            env: {
              abort() {
                throw Error("AS abort");
              },
            },
          },
        ),
        w = instance.exports,
        utf = new TextEncoder();
      const put = (b) => {
        const p = w.__new(b.length, 0);
        new Uint8Array(w.memory.buffer, p, b.length).set(b);
        return p;
      };
      for (const n of [0, 1, 2, 3, 4, 5, 7, 8, 9, 255, 256, 257]) {
        const rows = Array.from({ length: n }, (_, i) => ({
            id: i % 3 ? random() : 0xffffffff,
            x: random(),
            y: random(),
            z: random(),
            name: ["", "hé", "😀", "plain"][i % 4],
          })),
          b = encode(s, { rows }),
          p = put(b);
        const expected = rows.reduce((sum, r) => {
          const name = utf.encode(r.name);
          return (
            sum +
            BigInt(r.id) +
            BigInt(r.x) +
            BigInt(r.y) +
            BigInt(r.z) +
            BigInt(name.length + (name[0] ?? 0))
          );
        }, 0n);
        assert.equal(w.sum(p, b.length), expected);
        assert.equal(w.sumViews(p, b.length), expected);
      }
      for (let lane = 0; lane < 4; lane++) {
        const b = encode(s, {
            rows: Array.from({ length: 5 }, () => ({
              id: 1,
              x: 2,
              y: 3,
              z: 4,
              name: "hello",
            })),
          }),
          a = open(b, s).root().field("rows").array(),
          field = a.at(lane).record().field("name");
        for (const word of [0xff000000, 7, (255 << 24) | (b.length - 254)]) {
          const broken = b.slice();
          new DataView(broken.buffer).setUint32(field.offset, word >>> 0, true);
          assert.throws(
            () => w.sum(put(broken), broken.length),
            WebAssembly.RuntimeError,
          );
        }
      }
      const b = encode(s, { rows: [{}, {}, {}, {}] });
      w.sum(put(b), b.length);
      assert.equal(w.block(1, 4), Code.BoundExceeded);
      w.sum(put(b), b.length);
      assert.equal(w.block(4, 0), Code.Ok);
      w.sum(put(b), b.length);
      assert.equal(w.block(0, 0xffffffff), Code.BoundExceeded);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
