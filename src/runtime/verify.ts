import {
  Code,
  Kind,
  Region,
  NO_INDEX as N,
  fail,
  extent,
  width,
  readWord,
} from "../format.js";
import { Schema } from "./schema.js";
import { Document, ValueView, RecordView, Span } from "./value.js";
import { MapView } from "./map.js";
import { verifySemantics } from "./semantic-verify.js";
import { TypeView, FieldDeclaration, nameString } from "./reflection.js";
export interface Limits {
  maxDepth?: number;
  maxNodes?: number;
  maxBytes?: number;
  maxProbes?: number;
  maxKeyBytes?: number;
  maxSchemaSteps?: number;
}
/** Local validation; UTF-8 scanning is explicit. */
export function validateField(value: ValueView): void {
  value.require();
  if (value.kind <= 11) value.checkScalar(value.scalar());
  else if (value.kind === 12) value.string();
  else if (value.kind === 13 || value.kind === 14) value.array();
  else if (value.kind === 15 || value.kind === 16) value.record();
  else if (value.kind === 17) new MapView().bind(value);
}
/** Whole reachable data validation. Scratch is pairs of independently owned [offset,length] extents. */
export function verifyMessage(
  doc: Document,
  scratch: Uint32Array,
  limits: Limits = {},
): number {
  return walk(doc, undefined, scratch, limits);
}
export function validateSubtree(
  value: ValueView,
  scratch: Uint32Array,
  limits: Limits = {},
): number {
  return walk(value.doc, value, scratch, limits);
}
function walk(
  doc: Document,
  selected: ValueView | undefined,
  scratch: Uint32Array,
  limits: Limits,
): number {
  let nodes = 0,
    bytes = 0,
    intervals = 0;
  const maxNodes = limits.maxNodes ?? 1000000,
    maxDepth = limits.maxDepth ?? 128,
    maxBytes = limits.maxBytes ?? 0xffffffff;
  function tick(depth: number, n = 1): void {
    nodes += n;
    if (nodes > maxNodes || depth > maxDepth) fail(Code.WorkLimit, Region.Data);
  }
  function own(at: number, len: number): void {
    if (!len) return;
    bytes += len;
    if (bytes > maxBytes) fail(Code.WorkLimit, Region.Data, at);
    extent(doc.bytes.length, at, len, Region.Data);
    if (intervals * 2 + 2 > scratch.length)
      fail(Code.NeedScratch, Region.Data, at);
    scratch[intervals * 2] = at;
    scratch[intervals * 2 + 1] = len;
    intervals++;
  }
  function record(r: RecordView, depth: number): void {
    tick(depth);
    const s = doc.schema,
      l = s.layout(r.layout),
      count = s.u32(l + 8);
    if (count > maxNodes - nodes) fail(Code.WorkLimit, Region.Schema, l);
    for (let i = 0; i < count; i++) visit(r.atSlot(i), depth + 1);
  }
  function visit(v: ValueView, depth: number): void {
    tick(depth);
    if (!v.isPresent()) return;
    validateField(v);
    const s = doc.schema;
    if (v.kind === 12) {
      const span = v.spanInto(new Span());
      own(span.offset, span.count);
    } else if (v.kind === 13 || v.kind === 14) {
      const a = v.array();
      if (a.count > maxNodes - nodes)
        fail(Code.WorkLimit, Region.Data, a.offset);
      if (v.kind === 13)
        own(a.offset, a.packed ? Math.ceil(a.count / 8) : a.count * a.stride);
      for (let i = 0; i < a.count; i++) visit(a.at(i), depth + 1);
    } else if (v.kind === 15 || v.kind === 16) {
      const r = v.record();
      if (v.kind === 16) own(r.anchor, s.u32(s.layout(r.layout)));
      record(r, depth + 1);
    } else if (v.kind === 17) {
      const m = new MapView().bind(v);
      if (!m.capacity) return;
      const mp = s.entry(5, s.u32(s.plan(v.planIndex) + 20)),
        cw = s.u8(mp + 24);
      own(
        m.offset,
        cw +
          m.buckets +
          (m.placement
            ? m.buckets * m.idWidth + m.capacity * m.stride
            : m.buckets * m.stride),
      );
      if (m.buckets > maxNodes - nodes)
        fail(Code.WorkLimit, Region.Data, m.offset);
      tick(depth, m.buckets);
      const ids = new Set<number>();
      let live = 0,
        probes = 0,
        keyBytes = 0;
      for (let b = 0; b < m.buckets; b++) {
        const c = doc.bytes[m.controls + b];
        if (c < 128) {
          if (c !== 0 && c !== 1)
            fail(Code.Malformed, Region.Data, m.controls + b);
          continue;
        }
        live++;
        const entry = m.entry(b),
          id = (entry.anchor - m.heads) / m.stride;
        if (ids.has(id)) fail(Code.Malformed, Region.Data, entry.anchor);
        ids.add(id);
        const key = entry.atSlot(0);
        let kb: Uint8Array;
        if (key.kind === 12) {
          kb = key.bytesReadOnlyCopy();
          keyBytes += kb.length;
        } else
          kb = doc.bytes.subarray(key.offset, key.offset + width(key.kind));
        if (keyBytes > (limits.maxKeyBytes ?? 1048576))
          fail(Code.WorkLimit, Region.Data);
        const found = m.findBytesInto(
          kb,
          new RecordView(),
          Math.min(
            limits.maxProbes ?? 1000000,
            (limits.maxProbes ?? 1000000) - probes,
          ),
          limits.maxKeyBytes ?? 1048576,
        );
        probes += m.buckets;
        if (probes > (limits.maxProbes ?? 1000000))
          fail(Code.WorkLimit, Region.Data);
        if (found.anchor !== entry.anchor)
          fail(Code.Malformed, Region.Data, entry.anchor);
        record(entry, depth + 1);
      }
      if (live !== m.count) fail(Code.Malformed, Region.Data, m.offset);
    }
  }
  if (selected) visit(selected, 0);
  else {
    const root = doc.root();
    own(0, doc.schema.u32(doc.schema.layout(root.layout)));
    record(root, 0);
  }
  // In-place heapsort of caller scratch keeps overlap checks bounded without a host interval list.
  const swap = (a: number, b: number) => {
    for (let j = 0; j < 2; j++) {
      const n = scratch[a * 2 + j];
      scratch[a * 2 + j] = scratch[b * 2 + j];
      scratch[b * 2 + j] = n;
    }
  };
  function sift(start: number, end: number): void {
    let r = start;
    while (r * 2 + 1 <= end) {
      let c = r * 2 + 1;
      if (c + 1 <= end && scratch[c * 2] < scratch[(c + 1) * 2]) c++;
      if (scratch[r * 2] >= scratch[c * 2]) return;
      swap(r, c);
      r = c;
    }
  }
  for (let i = Math.floor(intervals / 2) - 1; i >= 0; i--)
    sift(i, intervals - 1);
  for (let end = intervals - 1; end > 0; end--) {
    swap(0, end);
    sift(0, end - 1);
  }
  for (let i = 1; i < intervals; i++)
    if (scratch[(i - 1) * 2] + scratch[(i - 1) * 2 + 1] > scratch[i * 2])
      fail(Code.Malformed, Region.Data, scratch[i * 2]);
  return intervals;
}
/** Explicit structural verification, separate from opening. Fingerprint authentication is caller policy. */
export function verifySchema(s: Schema, limits: Limits = {}): void {
  let steps = 0;
  const tick = (n = 1) => {
    steps += n;
    if (steps > (limits.maxSchemaSteps ?? 1000000))
      fail(Code.WorkLimit, Region.Schema);
  };
  const ranges: [number, number][] = [
    [0, 64],
    [s.directory, 256],
  ];
  for (let k = 1; k <= 16; k++) {
    const base = s.table(k),
      count = s.count(k);
    tick(count);
    const len = s.u32(s.directory + (k - 1) * 16 + 8);
    if (len) ranges.push([base, len]);
  }
  if (s.count(10) !== s.count(11) && s.count(11) !== 0)
    fail(Code.Malformed, Region.Schema);
  const aux = s.u32(56),
    ac = s.u32(60);
  extent(s.bytes.length, aux, ac * 16, Region.Schema);
  if (ac) ranges.push([aux, ac * 16]);
  const auxKinds = new Set<number>();
  for (let i = 0; i < ac; i++) {
    const a = aux + i * 16,
      k = s.dv.getUint16(a, true),
      flags = s.dv.getUint16(a + 2, true),
      base = s.u32(a + 4),
      len = s.u32(a + 8);
    if (k < 0x8000 || flags !== 1 || auxKinds.has(k))
      fail(Code.Malformed, Region.Schema, a);
    auxKinds.add(k);
    extent(s.bytes.length, base, len, Region.Schema);
    if (len) {
      if (base % 8) fail(Code.Malformed, Region.Schema, a);
      ranges.push([base, len]);
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);
  let end = 0;
  for (const [at, len] of ranges) {
    if (at < end) fail(Code.Malformed, Region.Schema, at);
    for (let p = end; p < at; p++)
      if (s.bytes[p]) fail(Code.Malformed, Region.Schema, p);
    end = at + len;
  }
  const keySet = new Set<string>();
  for (let i = 0; i < s.count(10); i++) {
    const at = s.entry(10, i);
    let key = "";
    for (let j = 0; j < 16; j++)
      key += s.bytes[at + j].toString(16).padStart(2, "0");
    if (keySet.has(key)) fail(Code.Malformed, Region.Schema, at);
    keySet.add(key);
  }
  for (let i = 0; i < s.count(4); i++) {
    const p = s.plan(i),
      k = s.u8(p),
      flags = s.u32(p + 4),
      head = s.u32(p + 8),
      stride = s.u32(p + 12),
      limit = s.u32(p + 16),
      child = s.u32(p + 20),
      rule = s.u32(p + 28);
    if (k <= 11) {
      if (
        s.u8(p + 1) !== width(k) ||
        head !== width(k) ||
        flags ||
        stride ||
        limit ||
        child !== N
      )
        fail(Code.Malformed, Region.Schema, p);
      if (rule !== N) s.entry(7, rule);
    } else if (k === 15) {
      const l = s.layout(child);
      if (head !== s.u32(l) && !(flags === 2 && head === 0))
        fail(Code.Malformed, Region.Schema, p);
    } else if (k === 16) s.layout(child);
    else if (k === 17) {
      const m = s.entry(5, child);
      s.layout(s.u32(m));
      s.plan(s.u32(m + 4));
      s.plan(s.u32(m + 8));
    } else if (k === 13 || k === 14) {
      const cp = s.plan(child);
      if (flags & 1 ? s.u8(cp) !== 11 : stride !== s.u32(cp + 8))
        fail(Code.Malformed, Region.Schema, p);
      if (
        k === 14 &&
        head !== (flags & 1 ? Math.ceil(limit / 8) : limit * stride)
      )
        fail(Code.Malformed, Region.Schema, p);
    }
  }
  for (let i = 0; i < s.count(1); i++) {
    const l = s.layout(i),
      first = s.u32(l + 4),
      n = s.u32(l + 8);
    if (s.u32(l + 12) >= s.count(10)) fail(Code.Malformed, Region.Schema, l);
    let prev = 0;
    const names = new Set<string>();
    for (let j = 0; j < n; j++) {
      const fi = first + j,
        a = s.access(fi),
        id = s.u32(s.entry(9, fi)),
        link = s.entry(3, fi),
        k = s.u8(a + 4),
        target = s.u32(link);
      if (!id || id >= N || id <= prev) fail(Code.Malformed, Region.Schema, a);
      prev = id;
      if (k === 15) {
        const child = s.layout(target);
        if (
          s.u32(child + 20) !== i ||
          s.u32(child + 16) !== s.u32(l + 16) ||
          s.u32(child) !== s.u32(l) ||
          s.u32(child + 24) !== 2
        )
          fail(Code.Malformed, Region.Schema, child);
      } else if (k === 16) {
        if (s.u32(s.layout(target) + 24) !== 1)
          fail(Code.Malformed, Region.Schema, a);
      } else {
        const p = s.plan(target);
        if (s.u8(p) !== k) fail(Code.Malformed, Region.Schema, p);
        if (k === 12 || k === 13 || k === 17) {
          if (
            s.u8(a + 5) >> 4 !== s.u8(p + 1) ||
            s.u8(a + 6) !== s.u8(p + 2) ||
            s.u8(a + 7) !== s.u8(p + 3)
          )
            fail(Code.Malformed, Region.Schema, p);
        }
      }
      if (s.count(11)) {
        const t = new TypeView(s, s.u32(l + 12)),
          fd = t.field(j);
        if ((s.u32(s.entry(12, fd.index) + 12) & 3) !== (s.u8(a + 5) & 3))
          fail(Code.Malformed, Region.Schema, a);
        if (fd.id !== id) fail(Code.Malformed, Region.Schema, l);
        const name = fd.name();
        if (names.has(name)) fail(Code.Malformed, Region.Schema, l);
        names.add(name);
        if (s.u32(48) && s.byName(i, new TextEncoder().encode(name)) !== fi)
          fail(Code.Malformed, Region.Schema, l);
      }
    }
    if (s.u32(l + 24) === 1) {
      const occupied = new Map<number, number>();
      function occupy(at: number, len: number, mask = 255): void {
        extent(s.u32(l), at, len, Region.Schema);
        tick(len);
        for (let b = 0; b < len; b++) {
          const m = b === 0 ? mask : 255,
            old = occupied.get(at + b) ?? 0;
          if (old & m) fail(Code.Malformed, Region.Schema, l, at + b);
          occupied.set(at + b, old | m);
        }
      }
      function fields(layout: number, depth: number): void {
        tick();
        if (depth > (limits.maxDepth ?? 128))
          fail(Code.WorkLimit, Region.Schema);
        const r = s.layout(layout);
        for (let j = 0; j < s.u32(r + 8); j++) {
          const fi = s.u32(r + 4) + j,
            a = s.access(fi),
            link = s.entry(3, fi),
            p = s.u32(link + 4),
            k = s.u8(a + 4);
          if (p !== N) {
            const pr = s.entry(6, p);
            occupy(s.u32(pr), 1, s.u8(pr + 4));
          }
          if (k === 15) fields(s.u32(link), depth + 1);
          else if (k === 11) occupy(s.u32(a), 1, 1 << s.u8(a + 6));
          else {
            const len =
              k <= 10
                ? width(k)
                : k === 14
                  ? s.u32(s.plan(s.u32(link)) + 8)
                  : s.u8(a + 5) >> 4;
            occupy(s.u32(a), len);
          }
        }
      }
      fields(i, 0);
    }
  }
  const visiting = new Set<number>(),
    done = new Set<number>();
  function literal(i: number, depth: number): void {
    tick();
    if (depth > (limits.maxDepth ?? 128) || visiting.has(i))
      fail(Code.Malformed, Region.Schema);
    if (done.has(i)) return;
    visiting.add(i);
    const a = s.entry(13, i),
      kind = s.u8(a),
      first = s.u32(a + 4),
      count = s.u32(a + 8);
    if (kind < 1 || kind > 6 || s.dv.getUint16(a + 2, true) || s.u32(a + 20))
      fail(Code.Malformed, Region.Schema, a);
    if (kind === 2)
      extent(s.count(15), s.u32(a + 12), s.u32(a + 16), Region.Schema);
    for (let j = 0; j < count; j++) {
      const e = s.entry(14, first + j);
      literal(s.u32(e + 4), depth + 1);
    }
    visiting.delete(i);
    done.add(i);
  }
  for (let i = 0; i < s.count(13); i++) literal(i, 0);
  verifySemantics(s, limits);
}
