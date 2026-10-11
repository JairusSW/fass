import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
test("SIMD and SWAR validate exact UTF-8 spans and sum unsigned lanes with safe tails", async () => {
  mkdirSync(".test-build", { recursive: true });
  writeFileSync(
    ".test-build/kernels.ts",
    `import {utf8,sumU32Unchecked,sumU32x4Unchecked} from '../assembly/index';export function validate(p:usize,n:u32):bool{return utf8(p,n);}export function sum(p:usize,n:u32):u64{return sumU32Unchecked(p,n);}export function four(p:usize):u64{return sumU32x4Unchecked(p);}`,
  );
  const modules = [];
  for (const feature of ["disable", "enable"]) {
    const path = `.test-build/kernels-${feature}`;
    execFileSync(process.execPath, [
      "node_modules/assemblyscript/bin/asc.js",
      ".test-build/kernels.ts",
      "--outFile",
      path + ".wasm",
      "--textFile",
      path + ".wat",
      "--exportRuntime",
      "--runtime",
      "stub",
      "--optimize",
      `--${feature}`,
      "simd",
    ]);
    const wat = readFileSync(path + ".wat", "utf8");
    assert.equal(wat.includes("v128"), feature === "enable");
    const { instance } = await WebAssembly.instantiate(
      readFileSync(path + ".wasm"),
      {
        env: {
          abort() {
            throw Error("AS abort");
          },
        },
      },
    );
    modules.push(instance.exports);
  }
  const decoder = new TextDecoder("utf-8", { fatal: true }),
    valid = (b) => {
      try {
        decoder.decode(b);
        return true;
      } catch {
        return false;
      }
    };
  let seed = 12345;
  const random = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return seed >>> 0;
  };
  const inputs = [
    new Uint8Array(),
    ...[
      "hello",
      "é".repeat(80),
      "世界".repeat(50),
      "😀".repeat(64),
      "a".repeat(130),
    ].map((s) => new TextEncoder().encode(s)),
  ];
  for (let n = 0; n <= 140; n++) {
    const prefix = new Uint8Array(n).fill(65);
    for (const seq of [
      [0xc2, 0x80],
      [0xc1, 0x80],
      [0xc2, 0x7f],
      [0xe0, 0xa0, 0x80],
      [0xe0, 0x80, 0x80],
      [0xed, 0xa0, 0x80],
      [0xf4, 0x8f, 0xbf, 0xbf],
      [0xf4, 0x90, 0x80, 0x80],
      [0x80],
      [0xf0, 0x90],
    ])
      inputs.push(Uint8Array.from([...prefix, ...seq]));
  }
  // Exercise all four lead lanes in the packed C2..DF SWAR fast path.
  for (let slot = 0; slot < 4; slot++)
    for (let lead = 0xc0; lead <= 0xdf; lead++) {
      const b = Uint8Array.from([
        0xc2, 0x80, 0xc2, 0x80, 0xc2, 0x80, 0xc2, 0x80,
      ]);
      b[slot * 2] = lead;
      inputs.push(b);
    }
  for (let i = 0; i < 1000; i++)
    inputs.push(
      Uint8Array.from({ length: random() % 150 }, () => random() & 255),
    );
  for (const w of modules) {
    const p = w.__new(512, 0);
    for (const b of inputs) {
      new Uint8Array(w.memory.buffer, p, 512).fill(0xff);
      new Uint8Array(w.memory.buffer, p + 1, b.length).set(b);
      assert.equal(
        !!w.validate(p + 1, b.length),
        valid(b),
        `UTF-8 ${Buffer.from(b).toString("hex")}`,
      );
    }
    for (let n = 0; n <= 65; n++) {
      const values = Array.from({ length: n }, () => random()),
        v = new DataView(w.memory.buffer);
      values.forEach((x, i) => v.setUint32(p + 1 + i * 4, x, true));
      const expected = values.reduce((a, x) => a + BigInt(x), 0n);
      assert.equal(w.sum(p + 1, n), expected);
      if (n >= 4)
        assert.equal(
          w.four(p + 1),
          values.slice(0, 4).reduce((a, x) => a + BigInt(x), 0n),
        );
    }
    const end = w.memory.buffer.byteLength;
    for (let n = 0; n <= 67; n++) {
      new Uint8Array(w.memory.buffer, end - n, n).fill(65);
      assert.equal(w.validate(end - n, n), 1);
    }
    assert.equal(w.validate(end - 1, 2), 0);
  }
});
