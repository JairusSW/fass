import { RootView, RowView, ArrayPlan6, Span } from "./rows-assembly";
import { Code, validateStringDescriptors24x4 } from "../assembly/index";
const root = new RootView(),
  rows = new ArrayPlan6(),
  row = new RowView(),
  name = new Span();
export function sum(data: usize, length: u32): u64 {
  if (root.open(data, length) != Code.Ok || root.getRowsInto(rows) != Code.Ok)
    unreachable();
  let total: u64 = 0;
  const count = rows.count;
  if (ASC_FEATURE_SIMD) {
    let acc = i64x2.splat(0);
    let i: u32 = 0;
    for (; count - i >= 4; i += 4) {
      const head = rows.atBlockPointer(i, 4);
      if (rows.status != Code.Ok) unreachable();
      const words = RowView.loadNameDescriptors4Unchecked(head);
      if (validateStringDescriptors24x4(words, length, 255) != Code.Ok)
        unreachable();
      const v0 = RowView.loadU32Block0Unchecked(head),
        v1 = RowView.loadU32Block0Unchecked(head + ArrayPlan6.STRIDE),
        v2 = RowView.loadU32Block0Unchecked(head + 2 * ArrayPlan6.STRIDE),
        v3 = RowView.loadU32Block0Unchecked(head + 3 * ArrayPlan6.STRIDE);
      acc = i64x2.add(
        acc,
        i64x2.add(i64x2.extend_low_i32x4_u(v0), i64x2.extend_high_i32x4_u(v0)),
      );
      acc = i64x2.add(
        acc,
        i64x2.add(i64x2.extend_low_i32x4_u(v1), i64x2.extend_high_i32x4_u(v1)),
      );
      acc = i64x2.add(
        acc,
        i64x2.add(i64x2.extend_low_i32x4_u(v2), i64x2.extend_high_i32x4_u(v2)),
      );
      acc = i64x2.add(
        acc,
        i64x2.add(i64x2.extend_low_i32x4_u(v3), i64x2.extend_high_i32x4_u(v3)),
      );
      const w0 = <u32>i32x4.extract_lane(words, 0),
        w1 = <u32>i32x4.extract_lane(words, 1),
        w2 = <u32>i32x4.extract_lane(words, 2),
        w3 = <u32>i32x4.extract_lane(words, 3);
      total +=
        <u64>(w0 >>> 24) +
        (w1 >>> 24) +
        (w2 >>> 24) +
        (w3 >>> 24) +
        (w0 >>> 24 ? load<u8>(data + (w0 & 0xffffff)) : 0) +
        (w1 >>> 24 ? load<u8>(data + (w1 & 0xffffff)) : 0) +
        (w2 >>> 24 ? load<u8>(data + (w2 & 0xffffff)) : 0) +
        (w3 >>> 24 ? load<u8>(data + (w3 & 0xffffff)) : 0);
    }
    for (; i < count; i++) {
      const head = rows.atPointer(i),
        name = RowView.getNameSpanAt(head, data, length);
      if (rows.status != Code.Ok || name >> 32 == 0xffffffff) unreachable();
      total +=
        RowView.sumU32FieldsUnchecked(head) +
        (name >> 32) +
        (name >> 32 ? load<u8>(<usize>name) : 0);
    }
    total += <u64>i64x2.extract_lane(acc, 0) + <u64>i64x2.extract_lane(acc, 1);
  } else {
    for (let i: u32 = 0; i < count; i++) {
      const head = rows.atPointer(i),
        name = RowView.getNameSpanAt(head, data, length);
      if (rows.status != Code.Ok || name >> 32 == 0xffffffff) unreachable();
      total +=
        RowView.sumU32FieldsUnchecked(head) +
        (name >> 32) +
        (name >> 32 ? load<u8>(<usize>name) : 0);
    }
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
