import { RootView, RowView, ArrayPlan6, Span } from "./rows-assembly";
import { Code } from "../assembly/index";
const root = new RootView(),
  rows = new ArrayPlan6(),
  row = new RowView(),
  name = new Span();
export function sum(data: usize, length: u32): u64 {
  if (root.open(data, length) != Code.Ok || root.getRowsInto(rows) != Code.Ok)
    unreachable();
  let total: u64 = 0;
  const count = rows.count;
  for (let i: u32 = 0; i < count; i++) {
    const head = rows.atPointer(i),
      name = RowView.getNameSpanAt(head, data, length);
    if (rows.status != Code.Ok || name >> 32 == 0xffffffff) unreachable();
    total +=
      RowView.sumU32FieldsUnchecked(head) +
      (name >> 32) +
      (name >> 32 ? load<u8>(<usize>name) : 0);
  }
  return total;
}
export function batch(entries: usize, fixtures: u32, iterations: u32): u64 {
  let total: u64 = 0;
  for (let i: u32 = 0; i < iterations; i++) {
    const p = entries + (i % fixtures) * 8;
    total += sum(load<usize>(p), load<u32>(p + 4));
  }
  return total;
}
export function sumViews(data: usize, length: u32): u64 {
  if (root.open(data, length) != Code.Ok || root.getRowsInto(rows) != Code.Ok)
    unreachable();
  let total: u64 = 0;
  for (let i: u32 = 0; i < rows.count; i++) {
    if (rows.atInto(i, row) != Code.Ok || row.getNameBytesInto(name) != Code.Ok)
      unreachable();
    total +=
      <u64>row.getId() +
      row.getX() +
      row.getY() +
      row.getZ() +
      name.count +
      (name.count ? load<u8>(name.data + name.offset) : 0);
  }
  return total;
}
export function batchViews(
  entries: usize,
  fixtures: u32,
  iterations: u32,
): u64 {
  let total: u64 = 0;
  for (let i: u32 = 0; i < iterations; i++) {
    const p = entries + (i % fixtures) * 8;
    total += sumViews(load<usize>(p), load<u32>(p + 4));
  }
  return total;
}
