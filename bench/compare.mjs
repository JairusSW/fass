import { performance } from "node:perf_hooks";
import { readFileSync, writeFileSync } from "node:fs";
import { Builder, ByteBuffer } from "flatbuffers";
import { Packet } from "../.bench-build/flatbuffers/generated/bench/packet.js";
import { Point } from "../.bench-build/flatbuffers/generated/bench/point.js";
import {
  RootView as GeneratedPacket,
  Layout1 as GeneratedPoint,
  ArrayPlan7 as GeneratedPoints,
  ArrayPlan9 as GeneratedValues,
  PointView as GeneratedArrayPoint,
} from "../.bench-build/packet-generated.js";
import { compile } from "../dist/compiler/index.js";
import {
  openSchema,
  open,
  encode,
  RecordView,
  ValueView,
  U32Reference,
  resolveU32,
  ArrayView,
  Schema,
  Document,
  U32ArrayView,
  resolveArrayU32,
} from "../dist/index.js";
const schema = openSchema(
  compile(readFileSync("bench/flatbuffers/packet.fass", "utf8")).schema,
);
export function flatEncode(value, builder = new Builder(4096)) {
  builder.clear();
  const label = builder.createString(value.label),
    values = Packet.createValuesVector(builder, value.values);
  Packet.startPointsVector(builder, value.points.length);
  for (let i = value.points.length - 1; i >= 0; i--) {
    const p = value.points[i];
    Point.createPoint(builder, p.x, p.y, p.z);
  }
  const points = builder.endVector();
  Packet.startPacket(builder);
  Packet.addLabel(builder, label);
  Packet.addValues(builder, values);
  Packet.addPoints(builder, points);
  Packet.addPoint(
    builder,
    Point.createPoint(builder, value.point.x, value.point.y, value.point.z),
  );
  builder.finish(Packet.endPacket(builder));
  return builder.asUint8Array();
}
const input = Array.from({ length: 32 }, (_, i) => ({
  point: { x: (i * 991 + 17) >>> 0, y: i + 11, z: 77 - i },
  points: Array.from({ length: 128 }, (_, j) => ({
    x: (i * 991 + j * 17) >>> 0,
    y: j,
    z: i,
  })),
  values: Array.from({ length: 128 }, (_, j) => (i * 991 + j * 71) >>> 0),
  label: "borrowed packet",
}));
const data = input.map((v) => encode(schema, v)),
  docs = data.map((d) => open(d, schema)),
  flatData = input.map((v) => flatEncode(v).slice()),
  flatPackets = flatData.map((d) => Packet.getRootAsPacket(new ByteBuffer(d))),
  flatBound = flatPackets.map((p) => p.point(new Point()));
const roots = docs.map((d) => d.root());
const path = resolveU32(schema, "point.x"),
  record = new RecordView(),
  value = new ValueView(),
  refs = docs.map((d) =>
    path.bindInto(d.root(), new U32Reference(), record, value),
  );
const points = docs.map((d) => d.root().field("points").array()),
  values = docs.map((d) => d.root().field("values").array()),
  flatValues = flatPackets.map((p) => p.valuesArray()),
  fbPoint = new Point();
for (let i = 0; i < 32; i++) {
  if (refs[i].get() !== flatBound[i].x())
    throw Error("scalar fixture mismatch");
  for (let j = 0; j < 128; j++)
    if (
      points[i].at(j).record().field("x").u32() !==
        flatPackets[i].points(j, fbPoint).x() ||
      values[i].at(j).u32() !== flatValues[i][j]
    )
      throw Error("array fixture mismatch");
}
const typedValues = values.map((a) => new U32ArrayView().bind(a)),
  typedPoints = points.map((a) => resolveArrayU32(a, "x"));
const generatedPackets = data.map((d) => new GeneratedPacket().open(d)),
  generatedPoints = generatedPackets.map((p) =>
    p.getPointInto(new GeneratedPoint()),
  ),
  generatedArrays = generatedPackets.map((p) =>
    p.getPointsInto(new GeneratedPoints()),
  ),
  generatedValues = generatedPackets.map((p) =>
    p.getValuesInto(new GeneratedValues()),
  ),
  generatedPointScratch = new GeneratedPoint(),
  generatedArrayPointScratch = new GeneratedArrayPoint();
const methods = {
  "nested FASS generated": (n) => {
    let s = 0;
    for (let i = 0; i < n; i++)
      s += generatedPackets[i & 31].getPointInto(generatedPointScratch).getX();
    return s;
  },
  "bound FASS generated": (n) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += generatedPoints[i & 31].getX();
    return s;
  },
  "record-array FASS generated": (n) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += generatedArrays[i & 31].getX(i & 127);
    return s;
  },
  "scalar-array FASS generated": (n) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += generatedValues[i & 31].get(i & 127);
    return s;
  },
  "nested FASS compiled bind": (n) => {
    let s = 0;
    for (let i = 0; i < n; i++)
      s += path.bindInto(roots[i & 31], refs[i & 31]).get();
    return s;
  },
  "record-array FASS typed": (n) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += typedPoints[i & 31].get(i & 127);
    return s;
  },
  "scalar-array FASS typed": (n) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += typedValues[i & 31].get(i & 127);
    return s;
  },
  "nested FASS named": (n) => {
    let s = 0;
    for (let i = 0; i < n; i++)
      s += docs[i & 31].root().field("point").record().field("x").u32();
    return s;
  },
  "nested FASS slots": (n) => {
    let s = 0;
    for (let i = 0; i < n; i++)
      s += docs[i & 31]
        .rootInto(record)
        .atSlotInto(0, value)
        .recordInto(record)
        .atSlotInto(0, value)
        .u32();
    return s;
  },
  "nested FASS path": (n) => {
    let s = 0;
    for (let i = 0; i < n; i++)
      s += path
        .bindInto(docs[i & 31].rootInto(record), refs[i & 31], record, value)
        .get();
    return s;
  },
  "nested FlatBuffers generated": (n) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += flatPackets[i & 31].point(fbPoint).x();
    return s;
  },
  "bound FASS": (n) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += refs[i & 31].get();
    return s;
  },
  "bound FlatBuffers": (n) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += flatBound[i & 31].x();
    return s;
  },
  "record-array FASS": (n) => {
    let s = 0;
    for (let i = 0; i < n; i++)
      s += points[i & 31]
        .atInto(i & 127, value)
        .recordInto(record)
        .atSlotInto(0, value)
        .u32();
    return s;
  },
  "record-array FlatBuffers": (n) => {
    let s = 0;
    for (let i = 0; i < n; i++)
      s += flatPackets[i & 31].points(i & 127, fbPoint).x();
    return s;
  },
  "scalar-array FASS": (n) => {
    let s = 0;
    for (let i = 0; i < n; i++)
      s += values[i & 31].atInto(i & 127, value).u32();
    return s;
  },
  "scalar-array FlatBuffers": (n) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += flatPackets[i & 31].values(i & 127);
    return s;
  },
  "scalar-array FlatBuffers borrowed": (n) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += flatValues[i & 31][i & 127];
    return s;
  },
};
const iterations = Number(process.env.FASS_BENCH_ITERATIONS ?? 200000),
  samples = Number(process.env.FASS_BENCH_SAMPLES ?? 7);
let checksum = 0;
const times = new Map(Object.keys(methods).map((k) => [k, []]));
for (const fn of Object.values(methods))
  for (let i = 0; i < 3; i++) checksum += fn(20000);
for (let sample = 0; sample < samples; sample++) {
  const keys = Object.keys(methods);
  for (let j = 0; j < keys.length; j++) {
    const name = keys[(j + sample) % keys.length],
      t = performance.now();
    checksum += methods[name](iterations);
    times.get(name).push(((performance.now() - t) * 1e6) / iterations);
  }
}
const results = Object.fromEntries(
  [...times].map(([k, t]) => [
    k,
    {
      median: t.slice().sort((a, b) => a - b)[Math.floor(samples / 2)],
      samples: t,
    },
  ]),
);
console.log(
  `Node ${process.version}, ${process.platform}/${process.arch}; flatbuffers 25.9.23 / flatc 25.12.19; ${samples} samples × ${iterations} operations; 32 varying buffers, warm`,
);
console.log(
  `Payload: FASS ${data[0].length} bytes; FlatBuffers ${flatData[0].length} bytes; shared schema ${schema.bytes.length} bytes (excluded from payload)`,
);
for (const [k, v] of Object.entries(results))
  console.log(`${k.padEnd(38)} ${v.median.toFixed(2)} ns/op`);
console.log(`checksum ${checksum}`);
if (process.env.FASS_BENCH_OUTPUT)
  writeFileSync(
    process.env.FASS_BENCH_OUTPUT,
    JSON.stringify(
      {
        environment: {
          node: process.version,
          platform: process.platform,
          arch: process.arch,
          flatbuffers: "25.9.23",
          flatc: "25.12.19",
          iterations,
          samples,
        },
        bytes: {
          fass: data[0].length,
          flatbuffers: flatData[0].length,
          schema: schema.bytes.length,
        },
        results,
        checksum,
      },
      null,
      2,
    ) + "\n",
  );
if (process.env.FASS_REQUIRE_SPEEDUP) {
  const factor = Number(process.env.FASS_REQUIRE_SPEEDUP);
  for (const [a, b] of [
    ["nested FASS slots", "nested FlatBuffers generated"],
    ["record-array FASS", "record-array FlatBuffers"],
    ["scalar-array FASS", "scalar-array FlatBuffers"],
  ])
    if (results[a].median * factor > results[b].median) {
      console.error(`${a} does not meet ${factor}× gate`);
      process.exitCode = 1;
    }
}
