import {
  Schema,
  RecordView,
  ValueView,
  ArrayView,
  MapView,
  Verifier,
  U32Reference,
  Arena,
  xxh64,
  Code,
} from "../assembly/index";
const schema = new Schema(),
  record = new RecordView(schema),
  value = new ValueView(schema),
  array = new ArrayView(schema),
  map = new MapView(schema),
  key = new ValueView(schema),
  entry = new RecordView(schema),
  verifier = new Verifier(schema),
  ref = new U32Reference();
export function open(s: usize, sl: u32, d: usize, dl: u32): i32 {
  let c = schema.open(s, sl);
  return c == 0 ? record.open(d, dl, true) : c;
}
export function field(id: u32): i32 {
  return record.fieldByID(id, value);
}
export function named(p: usize, n: u32): i32 {
  return record.field(p, n, value);
}
export function enter(): i32 {
  return value.record(record);
}
export function root(): i32 {
  return record.open(record.data, record.length, true);
}
export function get(): u64 {
  return value.getBits();
}
export function getU32(): u32 {
  return value.getU32();
}
export function getFloat(): f32 {
  return value.getF32();
}
export function set(n: u64): i32 {
  return value.setBits(n);
}
export function bindRef(): i32 {
  return ref.bind(value);
}
export function refGet(): u32 {
  return ref.get();
}
export function refSet(n: u32): i32 {
  return ref.set(n);
}
export function arrayBind(): i32 {
  return array.bind(value);
}
export function arrayAt(i: u32): i32 {
  return array.at(i, value);
}
export function boolGet(): bool {
  return value.getBool();
}
export function boolSet(v: bool): i32 {
  return value.setBool(v);
}
export function span(): i32 {
  return value.span();
}
export function offset(): u32 {
  return value.spanOffset;
}
export function count(): u32 {
  return value.count;
}
export function utf8(): i32 {
  return value.validateUtf8();
}
export function mapBind(): i32 {
  return map.bind(value);
}
export function mapFind(p: usize, n: u32): i32 {
  return map.find(p, n, record, key);
}
export function verify(stack: usize, sl: u32, intervals: usize, il: u32): i32 {
  return verifier.verify(record, stack, sl, intervals, il);
}
export function hash(p: usize, n: u32, seed: u64): u64 {
  return xxh64(p, n, seed);
}
export function marker(): usize {
  return __new(0, 0);
}
export function replace(p: usize, n: u32, used: u32): i32 {
  const arena = new Arena(schema, record.data, record.length, used);
  return arena.replaceBytes(value, p, n);
}
import { Builder } from "../assembly/index";
const builder = new Builder(schema);
export function build(
  data: usize,
  capacity: u32,
  stack: usize,
  stackBytes: u32,
): i32 {
  return builder.build(data, capacity, stack, stackBytes);
}
export function builtLength(): u32 {
  return builder.used;
}
import {
  MapWriter,
  reserveMap,
  U32Path,
  openEnvelope,
  envelopeInto,
} from "../assembly/index";
const arena = new Arena(schema, 0, 0),
  writer = new MapWriter(map, arena),
  path = new U32Path(schema),
  pathRecord = new RecordView(schema);
export function mapReserve(cap: u32, used: u32): i32 {
  arena.data = record.data;
  arena.capacity = record.length;
  arena.used = used;
  arena.status = Code.Ok;
  return reserveMap(arena, value, cap, map);
}
export function mapPrepare(p: usize, n: u32, ids: usize, idBytes: u32): i32 {
  return writer.prepare(p, n, ids, idBytes, record);
}
export function mapPublish(
  stack: usize,
  sl: u32,
  intervals: usize,
  il: u32,
): i32 {
  return writer.publish(verifier, stack, sl, intervals, il);
}
export function mapDelete(p: usize, n: u32): i32 {
  return writer.delete(p, n);
}
export function pathResolve(names: usize, n: u32, steps: usize, sl: u32): i32 {
  return path.resolve(names, n, steps, sl);
}
export function pathBind(): i32 {
  return path.bind(record, ref, pathRecord, value);
}
export function frame(p: usize, n: u32): i32 {
  return envelopeInto(record, p, n);
}
export function openFrame(p: usize, n: u32): i32 {
  return openEnvelope(schema, p, n, record, true);
}
import { Compactor } from "../assembly/index";
const compactor = new Compactor(schema);
export function compact(
  data: usize,
  capacity: u32,
  stack: usize,
  stackBytes: u32,
  sort: usize,
  sortBytes: u32,
): i32 {
  return compactor.compact(
    record,
    data,
    capacity,
    stack,
    stackBytes,
    sort,
    sortBytes,
  );
}
export function compactLength(): u32 {
  return compactor.used;
}
