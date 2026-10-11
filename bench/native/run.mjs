import { cpus } from "node:os";
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { performance } from "node:perf_hooks";
const iterations = Number(process.env.FASS_NATIVE_MESSAGES ?? 20000),
  samples = 9;
const results = {};
let checksum;
for (const feature of ["simd", "scalar"]) {
  const { instance } = await WebAssembly.instantiate(
      readFileSync(`.bench-build/assembly-${feature}.wasm`),
      {
        env: {
          abort() {
            throw Error("AssemblyScript abort");
          },
        },
      },
    ),
    w = instance.exports;
  const put = (bytes) => {
    const p = w.__new(bytes.length, 0);
    new Uint8Array(w.memory.buffer, p, bytes.length).set(bytes);
    return p;
  };
  const entries = put(new Uint8Array(16 * 8)),
    expected = JSON.parse(readFileSync(".bench-build/fixtures/checksums.json"));
  for (let i = 0; i < 16; i++) {
    const bytes = readFileSync(`.bench-build/fixtures/fass-${i}.bin`),
      p = put(bytes);
    new DataView(w.memory.buffer).setUint32(entries + i * 8, p, true);
    new DataView(w.memory.buffer).setUint32(
      entries + i * 8 + 4,
      bytes.length,
      true,
    );
    if (
      w.sum(p, bytes.length) !== BigInt(expected[i]) ||
      w.sumViews(p, bytes.length) !== BigInt(expected[i])
    )
      throw Error("Wasm checksum mismatch");
  }
  for (const [api, fn] of [
    ["bulk scalar blocks", w.batch],
    ["reusable views", w.batchViews],
  ]) {
    let total = fn(entries, 16, 2000);
    const times = [];
    for (let i = 0; i < samples; i++) {
      const start = performance.now();
      total += fn(entries, 16, iterations);
      times.push(((performance.now() - start) * 1e6) / iterations);
    }
    results[`AssemblyScript FASS ${feature} / ${api}`] = {
      samples: times,
      median: times.slice().sort((a, b) => a - b)[4],
      checksum: total.toString(),
    };
    checksum = total;
  }
}
for (const cmd of [
  ".bench-build/native-cpp",
  ".bench-build/native-c",
  "bench/native/rust/target/release/fass-native-bench",
])
  Object.assign(
    results,
    JSON.parse(execFileSync(cmd, [String(iterations)], { encoding: "utf8" })),
  );
for (const value of Object.values(results)) {
  if (value.median === undefined)
    value.median = value.samples.slice().sort((a, b) => a - b)[4];
  if (BigInt(value.checksum) !== checksum)
    throw Error("native batch checksum mismatch");
}
const base = results["AssemblyScript FASS simd / bulk scalar blocks"].median;
for (const [name, result] of Object.entries(results))
  console.log(
    `${name.padEnd(32)} ${result.median.toFixed(1).padStart(10)} ns/message ${(result.median / base).toFixed(2)}× FASS`,
  );
const version = (cmd) =>
  execFileSync(cmd[0], cmd.slice(1), { encoding: "utf8" }).trim();
const report = {
  source: {
    revision: version(["git", "rev-parse", "HEAD"]),
    trackedChanges: version([
      "git",
      "status",
      "--porcelain",
      "--untracked-files=no",
    ]),
  },
  environment: {
    node: process.version,
    cpu: cpus()[0]?.model,
    v8: process.versions.v8,
    platform: process.platform,
    arch: process.arch,
    iterations,
    samples,
    fixtures: 16,
    rows: Number(process.env.FASS_BENCH_ROWS ?? 256),
    clang: version(["clang++", "--version"]),
    rustc: version(["rustc", "--version"]),
    flatc: version(["flatc", "--version"]),
    protobuf: version(["protoc", "--version"]),
    simdjson: version(["pkg-config", "--modversion", "simdjson"]),
    jsonc: version(["pkg-config", "--modversion", "json-c"]),
    assemblyscript: JSON.parse(
      readFileSync("node_modules/assemblyscript/package.json"),
    ).version,
    flags: {
      cpp: "-O3 -DNDEBUG -std=c++17",
      c: "-O3 -DNDEBUG",
      rust: "release opt-level=3 lto=thin codegen-units=1",
      assemblyscript:
        "--runtime stub --optimize --noAssert --enable/--disable simd",
    },
  },
  workload:
    "Same 16 varying buffers, full row checksum; one batched Wasm call per sample. Native FlatBuffers unchecked and verified variants labeled; FASS follows local checked descriptors.",
  results,
};
if (process.env.FASS_BENCH_OUTPUT)
  writeFileSync(
    process.env.FASS_BENCH_OUTPUT,
    JSON.stringify(report, null, 2) + "\n",
  );
if (process.env.FASS_REQUIRE_SPEEDUP) {
  const factor = Number(process.env.FASS_REQUIRE_SPEEDUP);
  for (const [name, result] of Object.entries(results))
    if (!name.startsWith("AssemblyScript") && result.median < base * factor) {
      console.error(
        `native gate failed: ${name} / FASS ${(result.median / base).toFixed(2)} < ${factor}`,
      );
      process.exitCode = 1;
    }
}
