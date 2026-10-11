import {
  Code,
  Kind,
  Region,
  extent,
  fail,
  power2,
  readWord,
  writeWord,
} from "../format.js";
import { xxh64 } from "../hash.js";
import { ValueView, RecordView, Span } from "./value.js";
/** Borrowed map directory. Keys exposed through this view are always read-only. */
export class MapView {
  value!: ValueView;
  offset = 0;
  count = 0;
  capacity = 0;
  groups = 0;
  buckets = 0;
  controls = 0;
  ids = 0;
  heads = 0;
  stride = 0;
  idWidth = 0;
  layout = 0;
  placement = 1;
  bind(value: ValueView): this {
    if (value.kind !== Kind.Map)
      fail(Code.TypeMismatch, Region.Data, value.offset);
    const s = value.doc.schema,
      p = s.plan(value.planIndex),
      mp = s.entry(5, s.u32(p + 20));
    this.value = value;
    const span = value.spanInto(new Span());
    this.offset = span.offset;
    this.count = span.count;
    this.layout = s.u32(mp);
    this.stride = s.u32(mp + 16);
    this.idWidth = s.u8(mp + 25);
    this.placement = s.u8(mp + 26);
    const cw = s.u8(mp + 24),
      limit = s.u32(mp + 12);
    const l = s.layout(this.layout);
    if (
      s.u32(mp + 20) ||
      s.u8(mp + 27) !== 1 ||
      s.u32(mp + 28) ||
      this.placement > 1 ||
      cw < 1 ||
      cw > 4 ||
      this.idWidth < 1 ||
      this.idWidth > 4 ||
      s.u32(l + 8) !== 2 ||
      this.stride !== s.u32(l) ||
      limit !== s.u32(p + 16)
    )
      fail(Code.Malformed, Region.Schema, mp);
    if (this.offset === 0) {
      if (this.count !== 0) fail(Code.Malformed, Region.Data, value.offset);
      this.capacity = 0;
      this.groups = 0;
      this.buckets = 0;
      return this;
    }
    this.capacity = Number(readWord(value.doc.bytes, this.offset, cw));
    if (!this.capacity || this.capacity > limit || this.count > this.capacity)
      fail(Code.Malformed, Region.Data, this.offset);
    this.groups = power2(Math.ceil(this.capacity / 7));
    this.buckets = this.groups * 8;
    this.controls = this.offset + cw;
    this.ids = this.controls + this.buckets;
    this.heads = this.ids + (this.placement ? this.buckets * this.idWidth : 0);
    extent(
      value.doc.bytes.length,
      this.offset,
      cw +
        this.buckets +
        (this.placement
          ? this.buckets * this.idWidth + this.capacity * this.stride
          : this.buckets * this.stride),
      Region.Data,
    );
    return this;
  }
  entryInto(bucket: number, out: RecordView): RecordView {
    if (!Number.isInteger(bucket) || bucket < 0 || bucket >= this.buckets)
      fail(Code.BoundExceeded, Region.Data, this.offset, bucket);
    const bytes = this.value.doc.bytes,
      c = bytes[this.controls + bucket];
    if (c < 0x80)
      fail(
        c <= 1 ? Code.NotFound : Code.Malformed,
        Region.Data,
        this.controls + bucket,
      );
    const id = this.placement
      ? Number(readWord(bytes, this.ids + bucket * this.idWidth, this.idWidth))
      : bucket;
    if (this.placement && id >= this.capacity)
      fail(Code.Malformed, Region.Data, this.ids + bucket * this.idWidth);
    return out.bind(
      this.value.doc,
      this.layout,
      this.heads + id * this.stride,
      false,
    );
  }
  entry(bucket: number): RecordView {
    return this.entryInto(bucket, new RecordView());
  }
  findBytesInto(
    key: Uint8Array,
    out: RecordView,
    maxProbes = 65536,
    maxKeyBytes = 1048576,
  ): RecordView {
    const s = this.value.doc.schema,
      l = s.layout(this.layout),
      fi = s.u32(l + 4),
      kind = s.u8(s.access(fi) + 4);
    if (kind !== Kind.Utf8 && key.length !== [0, 1, 1, 2, 2, 4, 4, 8, 8][kind])
      fail(Code.TypeMismatch, Region.Data);
    if (key.length > maxKeyBytes) fail(Code.WorkLimit, Region.Data);
    if (!this.capacity) fail(Code.NotFound, Region.Data);
    const h = xxh64(key),
      fp = Number(h & 127n) | 128,
      first = Number((h >> 7n) & BigInt(this.groups - 1));
    let probes = 0,
      keyWork = key.length;
    const candidate = new ValueView();
    for (let i = 0; i < this.groups; i++) {
      const g = (first + (i * (i + 1)) / 2) & (this.groups - 1);
      let empty = false;
      for (let j = 0; j < 8; j++) {
        if (++probes > maxProbes) fail(Code.WorkLimit, Region.Data);
        const bucket = g * 8 + j,
          c = this.value.doc.bytes[this.controls + bucket];
        if (c === 0) empty = true;
        else if (c !== 1 && c < 128)
          fail(Code.Malformed, Region.Data, this.controls + bucket);
        if (c !== fp) continue;
        this.entryInto(bucket, out).atSlotInto(0, candidate);
        candidate.require();
        let match = true;
        if (kind === Kind.Utf8) {
          const span = candidate.spanInto(new Span());
          keyWork += span.count;
          if (keyWork > maxKeyBytes) fail(Code.WorkLimit, Region.Data);
          if (span.count !== key.length) match = false;
          else
            for (let k = 0; k < key.length; k++)
              if (this.value.doc.bytes[span.offset + k] !== key[k]) {
                match = false;
                break;
              }
        } else
          for (let k = 0; k < key.length; k++)
            if (this.value.doc.bytes[candidate.offset + k] !== key[k]) {
              match = false;
              break;
            }
        if (match) return out;
      }
      if (empty) fail(Code.NotFound, Region.Data);
    }
    fail(Code.NotFound, Region.Data);
  }
  find(key: string | number | bigint, maxProbes = 65536): RecordView {
    const s = this.value.doc.schema,
      l = s.layout(this.layout),
      k = s.u8(s.access(s.u32(l + 4)) + 4);
    let bytes: Uint8Array;
    if (k === Kind.Utf8) {
      if (typeof key !== "string") fail(Code.TypeMismatch, Region.Data);
      bytes = new TextEncoder().encode(key);
    } else {
      if (typeof key === "string") fail(Code.TypeMismatch, Region.Data);
      const w = [0, 1, 1, 2, 2, 4, 4, 8, 8][k];
      bytes = new Uint8Array(w);
      const signed = k % 2 === 1,
        n = BigInt(key),
        min = signed ? -(1n << BigInt(w * 8 - 1)) : 0n,
        max = signed
          ? (1n << BigInt(w * 8 - 1)) - 1n
          : (1n << BigInt(w * 8)) - 1n;
      if (n < min || n > max) fail(Code.BoundExceeded, Region.Data);
      writeWord(bytes, 0, w, BigInt.asUintN(w * 8, n));
    }
    return this.findBytesInto(bytes, new RecordView(), maxProbes);
  }
  deleteBytes(key: Uint8Array, scratch: RecordView, maxProbes = 65536): void {
    this.value.writable();
    this.findBytesInto(key, scratch, maxProbes);
    const id = (scratch.anchor - this.heads) / this.stride;
    let bucket = -1;
    for (let b = 0; b < this.buckets; b++)
      if (
        this.value.doc.bytes[this.controls + b] >= 128 &&
        (this.placement
          ? Number(
              readWord(
                this.value.doc.bytes,
                this.ids + b * this.idWidth,
                this.idWidth,
              ),
            )
          : b) === id
      ) {
        bucket = b;
        break;
      }
    if (bucket < 0) fail(Code.Malformed, Region.Data);
    this.value.doc.bytes[this.controls + bucket] = 1;
    this.count--;
    const s = this.value.doc.schema,
      p = s.plan(this.value.planIndex);
    const n = BigInt(this.offset) | (BigInt(this.count) << BigInt(s.u8(p + 2)));
    writeWord(this.value.doc.bytes, this.value.offset, s.u8(p + 1), n);
  }
}
