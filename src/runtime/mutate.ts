import {
  Code,
  Kind,
  Region,
  NO_INDEX as N,
  fail,
  extent,
  power2,
  width,
  writeWord,
  writeSpan,
  readWord,
} from "../format.js";
import { Arena } from "./build.js";
import { MapView } from "./map.js";
import { RecordView, ValueView, Scalar } from "./value.js";
import { validateSubtree, Limits } from "./verify.js";
import { xxh64 } from "../hash.js";
/** Publish an optional scalar only after its value satisfies the selected rules. */
export function initializeScalar(value: ValueView, scalar: Scalar): void {
  value.writable();
  value.checkScalar(scalar);
  const presence = value.presence;
  value.presence = N;
  try {
    value.setScalar(scalar);
  } finally {
    value.presence = presence;
  }
  publishPresence(value);
}
function publishPresence(value: ValueView): void {
  if (value.presence !== N) {
    const s = value.doc.schema,
      p = s.entry(6, value.presence);
    value.doc.bytes[value.anchor + s.u32(p)] |= s.u8(p + 4);
  }
}
export function clearOptional(value: ValueView): void {
  value.writable();
  if (value.presence === N) fail(Code.TypeMismatch, Region.Data, value.offset);
  const s = value.doc.schema,
    p = s.entry(6, value.presence);
  value.doc.bytes[value.anchor + s.u32(p)] &= ~s.u8(p + 4);
}
/** Initializes a selected absent or present UTF-8 field; ancestors must already be present. */
export function initializeBytes(
  arena: Arena,
  value: ValueView,
  bytes: Uint8Array,
): void {
  const presence = value.presence;
  value.presence = N;
  try {
    arena.replaceBytes(value, bytes);
  } finally {
    value.presence = presence;
  }
  publishPresence(value);
}
/** Prepare a reserved map block, then publish its descriptor. The field's own presence is published last. */
export function reserveMap(
  arena: Arena,
  value: ValueView,
  capacity: number,
): MapView {
  value.writable();
  if (
    value.kind !== Kind.Map ||
    value.doc.schema !== arena.schema ||
    value.doc.bytes.buffer !== arena.bytes.buffer ||
    value.doc.bytes.byteOffset !== arena.bytes.byteOffset
  )
    fail(Code.TypeMismatch, Region.Data, value.offset);
  const s = arena.schema,
    p = s.plan(value.planIndex),
    mp = s.entry(5, s.u32(p + 20)),
    limit = s.u32(mp + 12);
  if (!Number.isInteger(capacity) || capacity < 0 || capacity > limit)
    fail(Code.BoundExceeded, Region.Data, value.offset);
  if (!capacity) {
    writeSpan(
      arena.bytes,
      value.offset,
      s.u8(p + 1),
      s.u8(p + 2),
      s.u8(p + 3),
      0,
      0,
      limit,
    );
    publishPresence(value);
    return new MapView().bind(value);
  }
  const cw = s.u8(mp + 24),
    iw = s.u8(mp + 25),
    placement = s.u8(mp + 26),
    stride = s.u32(mp + 16),
    buckets = power2(Math.ceil(capacity / 7)) * 8,
    size =
      cw +
      buckets +
      (placement ? buckets * iw + capacity * stride : buckets * stride),
    saved = arena.used;
  try {
    const at = arena.reserve(size);
    writeWord(arena.bytes, at, cw, BigInt(capacity));
    writeSpan(
      arena.bytes,
      value.offset,
      s.u8(p + 1),
      s.u8(p + 2),
      s.u8(p + 3),
      at,
      0,
      limit,
    );
    publishPresence(value);
    return new MapView().bind(value);
  } catch (e) {
    arena.bytes.fill(0, saved, arena.used);
    arena.used = saved;
    throw e;
  }
}
/** Caller prepares an unreachable entry before publication. Caller must abandon it after failed publish.
 * Key/value payloads must be exclusively owned arena allocations. Incoming messages need whole validation.
 */
export class MapWriter {
  private bucket = -1;
  private id = -1;
  private count = 0;
  private anchor = 0;
  private key = new ValueView();
  private entryValue = new ValueView();
  private entry = new RecordView();
  constructor(
    public readonly map: MapView,
    public readonly arena: Arena,
    public readonly idScratch: Uint8Array,
  ) {}
  prepareInto(
    key: string | number | bigint,
    out: RecordView,
    maxProbes = 65536,
  ): RecordView {
    const m = this.map;
    m.value.writable();
    if (
      m.value.doc.schema !== this.arena.schema ||
      m.value.doc.bytes.buffer !== this.arena.bytes.buffer ||
      m.value.doc.bytes.byteOffset !== this.arena.bytes.byteOffset
    )
      fail(Code.TypeMismatch, Region.Data);
    if (m.count >= m.capacity) fail(Code.NeedCapacity, Region.Data, m.offset);
    const s = this.arena.schema,
      l = s.layout(m.layout),
      a = s.access(s.u32(l + 4)),
      kind = s.u8(a + 4);
    let keyBytes: Uint8Array;
    if (kind === 12) {
      if (typeof key !== "string") fail(Code.TypeMismatch, Region.Data);
      keyBytes = new TextEncoder().encode(key);
      const p = s.plan(s.u32(s.entry(3, s.u32(l + 4))));
      if (keyBytes.length > s.u32(p + 16))
        fail(Code.BoundExceeded, Region.Data);
    } else {
      if (typeof key === "string") fail(Code.TypeMismatch, Region.Data);
      keyBytes = new Uint8Array(width(kind));
      this.key.doc = m.value.doc;
      this.key.kind = kind;
      this.key.planIndex = s.u32(s.entry(3, s.u32(l + 4)));
      this.key.checkScalar(key);
      writeWord(
        keyBytes,
        0,
        keyBytes.length,
        BigInt.asUintN(keyBytes.length * 8, BigInt(key)),
      );
    }
    try {
      m.findBytesInto(keyBytes, this.entry, maxProbes);
      fail(Code.Malformed, Region.Data, m.offset);
    } catch (e) {
      if ((e as { code: number }).code !== Code.NotFound) throw e;
    }
    const h = xxh64(keyBytes),
      first = Number((h >> 7n) & BigInt(m.groups - 1));
    let bucket = -1,
      probes = 0;
    for (let i = 0; i < m.groups && bucket < 0; i++) {
      const group = (first + (i * (i + 1)) / 2) & (m.groups - 1);
      for (let j = 0; j < 8; j++) {
        if (++probes > maxProbes) fail(Code.WorkLimit, Region.Data);
        const b = group * 8 + j,
          c = m.value.doc.bytes[m.controls + b];
        if (c <= 1) {
          bucket = b;
          break;
        }
        if (c < 128) fail(Code.Malformed, Region.Data, m.controls + b);
      }
    }
    if (bucket < 0) fail(Code.NeedCapacity, Region.Data);
    let id = bucket;
    if (m.placement) {
      if (this.idScratch.length < Math.ceil(m.capacity / 8))
        fail(Code.NeedScratch, Region.Data);
      this.idScratch.fill(0);
      for (let b = 0; b < m.buckets; b++)
        if (m.value.doc.bytes[m.controls + b] >= 128) {
          const n = Number(
            readWord(m.value.doc.bytes, m.ids + b * m.idWidth, m.idWidth),
          );
          if (n >= m.capacity) fail(Code.Malformed, Region.Data);
          this.idScratch[Math.floor(n / 8)] |= 1 << (n % 8);
        }
      id = -1;
      for (let i = 0; i < m.capacity; i++)
        if (!(this.idScratch[Math.floor(i / 8)] & (1 << (i % 8)))) {
          id = i;
          break;
        }
      if (id < 0) fail(Code.NeedCapacity, Region.Data);
    }
    const anchor = m.heads + id * m.stride;
    this.arena.bytes.fill(0, anchor, anchor + m.stride);
    out.bind(m.value.doc, m.layout, anchor, false);
    out.atSlotInto(0, this.key);
    this.key.flags &= ~2;
    if (kind === 12) initializeBytes(this.arena, this.key, keyBytes);
    else this.key.setScalar(key as Scalar);
    this.bucket = bucket;
    this.id = id;
    this.count = m.count;
    this.anchor = anchor;
    return out;
  }
  publish(scratch: Uint32Array, limits: Limits = {}): void {
    const m = this.map;
    if (
      this.bucket < 0 ||
      m.count !== this.count ||
      m.value.doc.bytes[m.controls + this.bucket] > 1
    )
      fail(Code.Malformed, Region.Data, m.offset);
    this.entry.bind(m.value.doc, m.layout, this.anchor, false);
    const s = this.arena.schema,
      l = s.layout(m.layout);
    this.entryValue.doc = m.value.doc;
    this.entryValue.kind = Kind.Record;
    this.entryValue.target = m.layout;
    this.entryValue.anchor = this.anchor;
    this.entryValue.offset = this.anchor;
    validateSubtree(this.entryValue, scratch, limits);
    const key = this.entry.atSlot(0),
      keyBytes =
        key.kind === 12
          ? key.bytesReadOnlyCopy()
          : m.value.doc.bytes.subarray(
              key.offset,
              key.offset + width(key.kind),
            );
    // No new caller-visible controls exist until every fallible check has succeeded.
    const h = xxh64(keyBytes);
    if (m.placement)
      writeWord(
        m.value.doc.bytes,
        m.ids + this.bucket * m.idWidth,
        m.idWidth,
        BigInt(this.id),
      );
    m.value.doc.bytes[m.controls + this.bucket] = Number(h & 127n) | 128;
    m.count++;
    const p = s.plan(m.value.planIndex);
    writeSpan(
      m.value.doc.bytes,
      m.value.offset,
      s.u8(p + 1),
      s.u8(p + 2),
      s.u8(p + 3),
      m.offset,
      m.count,
      s.u32(p + 16),
    );
    this.bucket = -1;
  }
}
