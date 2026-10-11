import { execFileSync } from "node:child_process";
const run = (cmd, args) => execFileSync(cmd, args, { stdio: "inherit" }),
  pkg = (...names) =>
    execFileSync("pkg-config", ["--cflags", "--libs", ...names], {
      encoding: "utf8",
    })
      .trim()
      .split(/\s+/);
run(process.execPath, ["bench/native/prepare.mjs"]);
for (const feature of ["enable", "disable"])
  run(process.execPath, [
    "node_modules/assemblyscript/bin/asc.js",
    "bench/assembly.ts",
    "--outFile",
    `.bench-build/assembly-${feature === "enable" ? "simd" : "scalar"}.wasm`,
    "--exportRuntime",
    "--runtime",
    "stub",
    "--optimize",
    "--noAssert",
    `--${feature}`,
    "simd",
  ]);
run(process.env.CXX ?? "clang++", [
  "-O3",
  "-DNDEBUG",
  "-std=c++17",
  "bench/native/cpp.cpp",
  "bench/native/rows.pb.cc",
  ...pkg("flatbuffers", "protobuf", "simdjson"),
  "-o",
  ".bench-build/native-cpp",
]);
run(process.env.CC ?? "clang", [
  "-O3",
  "-DNDEBUG",
  "bench/native/c-json.c",
  ...pkg("json-c"),
  "-o",
  ".bench-build/native-c",
]);
run("cargo", [
  "build",
  "--release",
  "--locked",
  "--manifest-path",
  "bench/native/rust/Cargo.toml",
]);
