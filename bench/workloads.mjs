import { execFileSync } from "node:child_process";
import { cpus } from "node:os";
import { performance } from "node:perf_hooks";
import { readFileSync, writeFileSync } from "node:fs";
import { Builder, ByteBuffer, Encoding } from "flatbuffers";
import protobuf from "protobufjs";
import { encode as msgEncode, decode as msgDecode } from "@msgpack/msgpack";
import { Rows } from "../.bench-build/flatbuffers/generated/bench/rows.js";
import { Row } from "../.bench-build/flatbuffers/generated/bench/row.js";
import {
  RootView,
  RowView,
  ArrayPlan6,
  schema,
  Encoder,
} from "../.bench-build/rows-generated.js";
import { encode, Span } from "../dist/index.js";
const count = Number(process.env.FASS_BENCH_ROWS ?? 256),
  fixtures = 16,
  iterations = Number(process.env.FASS_BENCH_MESSAGES ?? 1000),
  samples = Number(process.env.FASS_BENCH_SAMPLES ?? 9);
const input = Array.from({ length: fixtures }, (_, f) => ({
  rows: Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    x: (f * 991 + i * 17 + 1) >>> 0,
    y: i + 7,
    z: (i * 13 + f + 1) >>> 0,
    name: `player-${String(i).padStart(4, "0")}`,
  })),
}));
function flatEncode(input, builder = new Builder(16384)) {
  builder.clear();
  const offsets = input.rows.map((r) =>
    Row.createRow(builder, r.id, r.x, r.y, r.z, builder.createString(r.name)),
  );
  const rows = Rows.createRowsVector(builder, offsets);
  Rows.startRows(builder);
  Rows.addRows(builder, rows);
  builder.finish(Rows.endRows(builder));
  return builder.asUint8Array();
}
const proto = protobuf
  .parse(readFileSync("bench/flatbuffers/rows.proto", "utf8"))
  .root.lookupType("Rows");
proto.setup();
const data = input.map((v) => encode(schema, v)),
  flatData = input.map((v) => flatEncode(v).slice()),
  protoData = input.map((v) => proto.encode(v).finish()),
  msgData = input.map((v) => msgEncode(v)),
  json = input.map((v) => JSON.stringify(v));
const fbBuffer = flatData.map((v) => new ByteBuffer(v)),
  fbRoot = new Rows(),
  fbRow = new Row(),
  fassRoot = new RootView(),
  fassArray = new ArrayPlan6(),
  fassRow = new RowView(),
  span = new Span();
function nativeSum(v) {
  let sum = 0;
  for (let i = 0; i < v.rows.length; i++) {
    const r = v.rows[i];
    sum += r.id + r.x + r.y + r.z + r.name.length + r.name.charCodeAt(0);
  }
  return sum;
}
const read = {
  FASS: (i) => {
    const r = fassRoot.open(data[i]).getRowsInto(fassArray);
    let sum = 0;
    for (let j = 0; j < r.count; j++) {
      r.atInto(j, fassRow);
      fassRow.getNameBytesInto(span);
      sum +=
        fassRow.getId() +
        fassRow.getX() +
        fassRow.getY() +
        fassRow.getZ() +
        span.count +
        data[i][span.offset];
    }
    return sum;
  },
  FlatBuffers: (i) => {
    const r = Rows.getRootAsRows(fbBuffer[i], fbRoot);
    let sum = 0;
    for (let j = 0, n = r.rowsLength(); j < n; j++) {
      r.rows(j, fbRow);
      const name = fbRow.name(Encoding.UTF8_BYTES);
      sum +=
        fbRow.id() + fbRow.x() + fbRow.y() + fbRow.z() + name.length + name[0];
    }
    return sum;
  },
  Protobuf: (i) => nativeSum(proto.decode(protoData[i])),
  MessagePack: (i) => nativeSum(msgDecode(msgData[i])),
  JSON: (i) => nativeSum(JSON.parse(json[i])),
};
for (let i = 0; i < fixtures; i++) {
  const expect = nativeSum(input[i]);
  for (const [name, fn] of Object.entries(read))
    if (fn(i) !== expect) throw Error(`${name} checksum mismatch`);
}
let checksum = 0;
const results = {};
function group(title, methods, n) {
  const timings = Object.fromEntries(Object.keys(methods).map((k) => [k, []]));
  for (const fn of Object.values(methods))
    for (let j = 0; j < 200; j++) checksum += fn(j % fixtures);
  for (let sample = 0; sample < samples; sample++) {
    const names = Object.keys(methods);
    for (let k = 0; k < names.length; k++) {
      const name = names[(k + sample) % names.length],
        fn = methods[name],
        start = performance.now();
      for (let i = 0; i < n; i++) checksum += fn(i % fixtures);
      timings[name].push(((performance.now() - start) * 1e6) / n);
    }
  }
  results[title] = Object.fromEntries(
    Object.entries(timings).map(([name, t]) => [
      name,
      {
        median: t.slice().sort((a, b) => a - b)[Math.floor(samples / 2)],
        samples: t,
      },
    ]),
  );
  console.log(`\n${title} (ns/message)`);
  const base = results[title].FASS?.median;
  for (const [name, v] of Object.entries(results[title]))
    console.log(
      `${name.padEnd(15)} ${v.median.toFixed(1).padStart(10)}${base ? `  ${(v.median / base).toFixed(2)}× FASS` : ""}`,
    );
}
console.log(
  `Node ${process.version}, ${process.platform}/${process.arch}; ${count} rows, ${fixtures} varying buffers; ${samples} samples × ${iterations} messages; warm`,
);
console.log(
  "Identical checksum: id+x+y+z+UTF-8 byte length+first byte for every row; borrow where available, decode otherwise. No whole-message verification in timed reads.",
);
group("read", read, iterations);
const builder = new Builder(32768),
  generatedEncoder = new Encoder(),
  output = new Uint8Array(65536);
for (let i = 0; i < fixtures; i++) {
  const n = generatedEncoder.encodeInto(input[i], output);
  if (!Buffer.from(output.subarray(0, n)).equals(Buffer.from(data[i])))
    throw Error("generated encoder fixture mismatch");
}
group(
  "encode",
  {
    FASS: (i) => generatedEncoder.encodeInto(input[i], output),
    FlatBuffers: (i) => flatEncode(input[i], builder).length,
    Protobuf: (i) => proto.encode(input[i]).finish().length,
    MessagePack: (i) => msgEncode(input[i]).length,
    JSON: (i) => JSON.stringify(input[i]).length,
  },
  Math.min(iterations, 200),
);
const bytes = {
  FASS: data[0].length,
  FlatBuffers: flatData[0].length,
  Protobuf: protoData[0].length,
  MessagePack: msgData[0].length,
  JSON: Buffer.byteLength(json[0]),
  schema: schema.bytes.length,
};
console.log("\nBytes:", bytes, "checksum:", checksum);
const report = {
  source: {
    revision: execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
    }).trim(),
    trackedChanges: execFileSync(
      "git",
      ["status", "--porcelain", "--untracked-files=no"],
      { encoding: "utf8" },
    ).trim(),
  },
  environment: {
    node: process.version,
    v8: process.versions.v8,
    cpu: cpus()[0]?.model,
    platform: process.platform,
    arch: process.arch,
    count,
    fixtures,
    iterations,
    samples,
    flatbuffers: "25.9.23",
    flatc: "25.12.19",
    protobufjs: "8.8.1",
    msgpack: "3.1.3",
  },
  results,
  bytes,
  checksum,
};
if (process.env.FASS_BENCH_OUTPUT)
  writeFileSync(
    process.env.FASS_BENCH_OUTPUT,
    JSON.stringify(report, null, 2) + "\n",
  );
if (process.env.FASS_REQUIRE_SPEEDUP) {
  const factor = Number(process.env.FASS_REQUIRE_SPEEDUP);
  for (const [name, v] of Object.entries(results.read))
    if (name !== "FASS" && v.median < results.read.FASS.median * factor) {
      console.error(
        `read gate failed: ${name} / FASS = ${(v.median / results.read.FASS.median).toFixed(2)} < ${factor}`,
      );
      process.exitCode = 1;
    }
}
