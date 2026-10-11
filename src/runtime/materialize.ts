import { Code, Kind, Region, fail, NO_INDEX as N } from "../format.js";
import { Document, RecordView, ValueView } from "./value.js";
import { MapView } from "./map.js";
import { TypeView } from "./reflection.js";
import { encodeInto, BuildOptions, FloatBits } from "./build.js";
import { verifyMessage, Limits } from "./verify.js";
/** Explicit conversion to native strings, arrays, records and Map objects. */
export function decode(
  doc: Document,
  limits: Limits = {},
  absentAsNull = false,
): Record<string, unknown> {
  let nodes = 0;
  function tick(depth: number): void {
    if (
      ++nodes > (limits.maxNodes ?? 1000000) ||
      depth > (limits.maxDepth ?? 128)
    )
      fail(Code.WorkLimit, Region.Data);
  }
  function record(r: RecordView, depth: number): Record<string, unknown> {
    tick(depth);
    const s = doc.schema,
      l = s.layout(r.layout),
      t = new TypeView(s, s.u32(l + 12)),
      out: Record<string, unknown> = {};
    for (let i = 0; i < s.u32(l + 8); i++) {
      const v = r.atSlot(i);
      if (v.isPresent()) out[t.field(i).name()] = value(v, depth + 1);
      else if (absentAsNull) out[t.field(i).name()] = null;
    }
    return out;
  }
  function value(v: ValueView, depth: number): unknown {
    tick(depth);
    if (v.kind <= 11) return v.scalar();
    if (v.kind === 12) return v.string();
    if (v.kind === 15 || v.kind === 16) return record(v.record(), depth + 1);
    if (v.kind === 13 || v.kind === 14) {
      const a = v.array();
      if (a.count > (limits.maxNodes ?? 1000000) - nodes)
        fail(Code.WorkLimit, Region.Data);
      return Array.from({ length: a.count }, (_, i) =>
        value(a.at(i), depth + 1),
      );
    }
    if (v.kind === 17) {
      const m = new MapView().bind(v),
        out = new Map();
      if (m.buckets > (limits.maxNodes ?? 1000000) - nodes)
        fail(Code.WorkLimit, Region.Data);
      for (let b = 0; b < m.buckets; b++)
        if (doc.bytes[m.controls + b] >= 128) {
          const e = m.entry(b);
          out.set(value(e.atSlot(0), depth + 1), value(e.atSlot(1), depth + 1));
        }
      return out;
    }
    fail(Code.TypeMismatch, Region.Data);
  }
  return record(doc.root(), 0);
}
/** Canonical construction from bit-level data. Uses supplied output; native conversion is explicit here. */
export function canonicalizeInto(
  doc: Document,
  destination: Uint8Array,
  scratch: Uint32Array,
  limits: Limits = {},
): number {
  if (doc.bytes.buffer === destination.buffer)
    fail(Code.NeedCapacity, Region.Data);
  verifyMessage(doc, scratch, limits);
  const native = decode(doc, limits, true),
    size = encodeInto(doc.schema, native, destination, limits as BuildOptions);
  // Keep float payload bits (including NaNs) through the materializing reference implementation.
  const target = new Document().open(
    destination.subarray(0, size),
    doc.schema,
    true,
  );
  function copyRecords(a: RecordView, b: RecordView, depth: number): void {
    if (depth > (limits.maxDepth ?? 128)) fail(Code.WorkLimit, Region.Data);
    const s = doc.schema,
      l = s.layout(a.layout);
    for (let i = 0; i < s.u32(l + 8); i++) {
      const av = a.atSlot(i),
        bv = b.atSlot(i);
      if (av.isPresent()) copyValues(av, bv, depth + 1);
    }
  }
  function copyValues(a: ValueView, b: ValueView, depth: number): void {
    if (depth > (limits.maxDepth ?? 128)) fail(Code.WorkLimit, Region.Data);
    if (a.kind === 9 || a.kind === 10) b.setScalarBits(a.scalarBits());
    else if (a.kind === 15 || a.kind === 16)
      copyRecords(a.record(), b.record(), depth + 1);
    else if (a.kind === 13 || a.kind === 14) {
      const aa = a.array(),
        bb = b.array();
      for (let i = 0; i < aa.count; i++)
        copyValues(aa.at(i), bb.at(i), depth + 1);
    } else if (a.kind === 17) {
      const am = new MapView().bind(a),
        bm = new MapView().bind(b);
      for (let i = 0; i < am.buckets; i++)
        if (doc.bytes[am.controls + i] >= 128) {
          const e = am.entry(i),
            key = e.atSlot(0);
          copyValues(
            e.atSlot(1),
            bm
              .find(
                key.kind === 12
                  ? key.string()
                  : (key.scalar() as number | bigint),
              )
              .atSlot(1),
            depth + 1,
          );
        }
    }
  }
  copyRecords(doc.root(), target.root(), 0);
  return size;
}
/** Explicit migration by stable field IDs. New defaults are initialized by the destination builder. */
export function migrateInto(
  doc: Document,
  targetSchema: Document["schema"],
  destination: Uint8Array,
  limits: Limits = {},
): number {
  let nodes = 0;
  const s = targetSchema;
  function tick(depth: number): void {
    if (
      ++nodes > (limits.maxNodes ?? 1000000) ||
      depth > (limits.maxDepth ?? 128)
    )
      fail(Code.WorkLimit, Region.Data);
  }
  function record(
    source: RecordView,
    targetLayout: number,
    depth: number,
  ): Record<string, unknown> {
    tick(depth);
    const l = s.layout(targetLayout),
      t = new TypeView(s, s.u32(l + 12)),
      out: Record<string, unknown> = {};
    for (let i = 0; i < s.u32(l + 8); i++) {
      const fd = t.field(i);
      let old: ValueView;
      try {
        old = source.fieldByID(fd.id);
      } catch (e) {
        if ((e as { code: number }).code === Code.NotFound) continue;
        throw e;
      }
      if (!old.isPresent()) {
        if (s.u32(s.entry(12, fd.index) + 12) & 1) out[fd.name()] = null;
        continue;
      }
      const fi = s.slot(targetLayout, i),
        a = s.access(fi),
        kind = s.u8(a + 4),
        link = s.entry(3, fi);
      out[fd.name()] = value(old, kind, s.u32(link), depth + 1);
    }
    return out;
  }
  function value(
    old: ValueView,
    kind: number,
    target: number,
    depth: number,
  ): unknown {
    tick(depth);
    if (old.kind !== kind) fail(Code.TypeMismatch, Region.Data, old.offset);
    if (kind === 15 || kind === 16)
      return record(old.record(), target, depth + 1);
    if (kind === 9 || kind === 10) return new FloatBits(kind, old.scalarBits());
    if (kind <= 11) return old.scalar();
    if (kind === 12) return old.string();
    if (kind === 13 || kind === 14) {
      const a = old.array(),
        p = s.plan(target),
        child = s.u32(p + 20),
        cp = s.plan(child),
        ck = s.u8(cp);
      if (a.count > (limits.maxNodes ?? 1000000) - nodes)
        fail(Code.WorkLimit, Region.Data);
      return Array.from({ length: a.count }, (_, i) =>
        value(
          a.at(i),
          ck,
          ck === 15 || ck === 16 ? s.u32(cp + 20) : child,
          depth + 1,
        ),
      );
    }
    if (kind === 17) {
      const m = new MapView().bind(old),
        mp = s.entry(5, s.u32(s.plan(target) + 20)),
        entryLayout = s.layout(s.u32(mp)),
        first = s.u32(entryLayout + 4),
        ka = s.access(first),
        va = s.access(first + 1),
        kt = s.u32(s.entry(3, first)),
        vt = s.u32(s.entry(3, first + 1)),
        out: unknown[][] = [];
      if (m.buckets > (limits.maxNodes ?? 1000000) - nodes)
        fail(Code.WorkLimit, Region.Data);
      for (let i = 0; i < m.buckets; i++)
        if (doc.bytes[m.controls + i] >= 128) {
          const e = m.entry(i);
          out.push([
            value(e.atSlot(0), s.u8(ka + 4), kt, depth + 1),
            value(e.atSlot(1), s.u8(va + 4), vt, depth + 1),
          ]);
        }
      return out;
    }
    fail(Code.TypeMismatch, Region.Data, old.offset);
  }
  return encodeInto(
    targetSchema,
    record(doc.root(), targetSchema.root, 0),
    destination,
    limits,
  );
}
