import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { compile, generateAssemblyscript } from "../../dist/compiler/index.js";
import { openSchema, encode } from "../../dist/index.js";
import { Builder } from "flatbuffers";
import protobuf from "protobufjs";
import { encode as msgEncode } from "@msgpack/msgpack";
import { Rows } from "../../.bench-build/flatbuffers/generated/bench/rows.js";
import { Row } from "../../.bench-build/flatbuffers/generated/bench/row.js";
const schemaBytes = compile(
    readFileSync("bench/flatbuffers/rows.fass", "utf8"),
  ).schema,
  schema = openSchema(schemaBytes);
writeFileSync(
  "bench/rows-assembly.ts",
  generateAssemblyscript(schemaBytes).replace(
    "from 'fass/assembly'",
    "from '../assembly/index'",
  ),
);
mkdirSync(".bench-build/fixtures", { recursive: true });
const proto = protobuf
  .parse(readFileSync("bench/flatbuffers/rows.proto", "utf8"))
  .root.lookupType("Rows");
const count = Number(process.env.FASS_BENCH_ROWS ?? 256);
let sums = [];
for (let f = 0; f < 16; f++) {
  const input = {
    rows: Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      x: (f * 991 + i * 17 + 1) >>> 0,
      y: i + 7,
      z: (i * 13 + f + 1) >>> 0,
      name: `player-${String(i).padStart(4, "0")}`,
    })),
  };
  const b = new Builder(16384),
    offsets = input.rows.map((r) =>
      Row.createRow(b, r.id, r.x, r.y, r.z, b.createString(r.name)),
    ),
    v = Rows.createRowsVector(b, offsets);
  Rows.startRows(b);
  Rows.addRows(b, v);
  b.finish(Rows.endRows(b));
  const values = {
    fass: encode(schema, input),
    flat: b.asUint8Array(),
    proto: proto.encode(input).finish(),
    msg: msgEncode(input),
    json: Buffer.from(JSON.stringify(input)),
  };
  for (const [k, v] of Object.entries(values))
    writeFileSync(`.bench-build/fixtures/${k}-${f}.bin`, v);
  sums.push(
    input.rows.reduce(
      (a, r) =>
        a + r.id + r.x + r.y + r.z + r.name.length + r.name.charCodeAt(0),
      0,
    ),
  );
}
writeFileSync(".bench-build/fixtures/checksums.json", JSON.stringify(sums));
