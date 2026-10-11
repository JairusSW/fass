import { Code, Region, Kind, extent, fail, readWord } from "../format.js";
import { Schema } from "./schema.js";
import { Document, Span } from "./value.js";
const decoder = new TextDecoder("utf-8", { fatal: true });
/** Binding support for compiler-emitted views. Layout values come from the emitted artifact. */
export function openCompiledInto(
  bytes: Uint8Array,
  schema: Schema,
  head: number,
  writable: boolean,
  out: Document,
): Document {
  if (bytes.length > schema.maxBytes) fail(Code.BoundExceeded, Region.Data);
  extent(bytes.length, 0, head, Region.Data);
  out.schema = schema;
  out.bytes = bytes;
  out.dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  out.writable = writable;
  return out;
}
/** Exact compact descriptors, without BigInt or an allocated tuple on the <=48-bit path. */
export function compiledSpanInto(
  doc: Document,
  at: number,
  d: number,
  o: number,
  l: number,
  limit: number,
  stride: number,
  packed: boolean,
  out: Span,
): Span {
  extent(doc.bytes.length, at, d, Region.Data);
  const v = doc.dv;
  let offset: number, count: number;
  if (d <= 6) {
    let n: number;
    switch (d) {
      case 0:
        n = 0;
        break;
      case 1:
        n = v.getUint8(at);
        break;
      case 2:
        n = v.getUint16(at, true);
        break;
      case 3:
        n = v.getUint16(at, true) + v.getUint8(at + 2) * 65536;
        break;
      case 4:
        n = v.getUint32(at, true);
        break;
      case 5:
        n = v.getUint32(at, true) + v.getUint8(at + 4) * 4294967296;
        break;
      default:
        n = v.getUint32(at, true) + v.getUint16(at + 4, true) * 4294967296;
    }
    if (n >= 2 ** (o + l)) fail(Code.Malformed, Region.Data, at);
    const base = 2 ** o;
    offset = n % base;
    count = Math.floor(n / base);
  } else {
    const n = readWord(doc.bytes, at, d);
    if (n >> BigInt(o + l)) fail(Code.Malformed, Region.Data, at);
    offset = Number(n & ((1n << BigInt(o)) - 1n));
    count = Number(n >> BigInt(o));
  }
  if (count > limit) fail(Code.BoundExceeded, Region.Data, at, count);
  const bytes = packed ? Math.ceil(count / 8) : count * stride;
  if (((!count || !bytes) && offset !== 0) || (bytes > 0 && offset === 0))
    fail(Code.Malformed, Region.Data, at);
  extent(doc.bytes.length, offset, bytes, Region.Data);
  out.offset = offset;
  out.count = count;
  return out;
}
/** Common packed string descriptor. The enclosing generated head already establishes its extent. */
export function compiledString24Into(
  doc: Document,
  at: number,
  limit: number,
  out: Span,
): Span {
  const word = doc.dv.getUint32(at, true),
    offset = word & 0xffffff,
    count = word >>> 24;
  if (count > limit) fail(Code.BoundExceeded, Region.Data, at, count);
  if (
    (count === 0 && offset !== 0) ||
    (count !== 0 && offset === 0) ||
    offset > doc.bytes.length - count
  )
    fail(Code.Malformed, Region.Data, at);
  out.offset = offset;
  out.count = count;
  return out;
}
export function compiledReference(
  doc: Document,
  at: number,
  d: number,
  o: number,
  head: number,
): number {
  extent(doc.bytes.length, at, d, Region.Data);
  const v = doc.dv;
  let n = 0;
  switch (d) {
    case 0:
      break;
    case 1:
      n = v.getUint8(at);
      break;
    case 2:
      n = v.getUint16(at, true);
      break;
    case 3:
      n = v.getUint16(at, true) + v.getUint8(at + 2) * 65536;
      break;
    case 4:
      n = v.getUint32(at, true);
      break;
    default:
      fail(Code.Malformed, Region.Schema);
  }
  if (n >= 2 ** o || (head && !n)) fail(Code.Malformed, Region.Data, at);
  extent(doc.bytes.length, n, head, Region.Data);
  return n;
}
export function compiledString(doc: Document, span: Span): string {
  try {
    return decoder.decode(
      doc.bytes.subarray(span.offset, span.offset + span.count),
    );
  } catch {
    fail(Code.Malformed, Region.Data, span.offset);
  }
}
/** Host-native vector exposure is explicit and only possible with little-endian aligned backing bytes. */
const nativeLittleEndian = new Uint8Array(new Uint32Array([1]).buffer)[0] === 1;
export function borrowedU32(
  doc: Document,
  offset: number,
  count: number,
): Uint32Array {
  extent(doc.bytes.length, offset, count * 4, Region.Data);
  const at = doc.bytes.byteOffset + offset;
  if (!nativeLittleEndian || at & 3)
    fail(Code.TypeMismatch, Region.Data, offset);
  return new Uint32Array(doc.bytes.buffer, at, count);
}
/** UTF-8 byte length with the same lone-surrogate replacement behavior as TextEncoder. */
export function utf8Length(value: string): number {
  let bytes = value.length;
  for (let i = 0; i < value.length; i++) {
    const c = value.charCodeAt(i);
    if (c < 128) continue;
    if (c < 2048) bytes++;
    else if (c >= 0xd800 && c <= 0xdbff && i + 1 < value.length) {
      const next = value.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        bytes += 2;
        i++;
      } else bytes += 2;
    } else bytes += 2;
  }
  return bytes;
}
const encoder = new TextEncoder();
/** ASCII takes a direct byte loop; other strings use the native UTF-8 encoder into caller output. */
export function writeUtf8Into(
  value: string,
  destination: Uint8Array,
  at: number,
  limit: number,
): number {
  if (value.length > limit) fail(Code.BoundExceeded, Region.Data, at);
  if (value.length > destination.length - at)
    fail(Code.NeedCapacity, Region.Data, at);
  for (let i = 0; i < value.length; i++) {
    const c = value.charCodeAt(i);
    if (c >= 128) {
      const size = utf8Length(value);
      if (size > limit) fail(Code.BoundExceeded, Region.Data, at);
      extent(destination.length, at, size, Region.Data);
      const result = encoder.encodeInto(
        value,
        destination.subarray(at, at + size),
      );
      if (result.read !== value.length || result.written !== size)
        fail(Code.NeedCapacity, Region.Data, at);
      return size;
    }
    destination[at + i] = c;
  }
  return value.length;
}
export function compiledWriteSpan(
  doc: Document,
  at: number,
  d: number,
  o: number,
  offset: number,
  count: number,
): void {
  if (d <= 6) {
    const n = offset + count * 2 ** o;
    switch (d) {
      case 0:
        break;
      case 1:
        doc.dv.setUint8(at, n);
        break;
      case 2:
        doc.dv.setUint16(at, n, true);
        break;
      case 3:
        doc.dv.setUint16(at, n, true);
        doc.bytes[at + 2] = Math.floor(n / 65536);
        break;
      case 4:
        doc.dv.setUint32(at, n, true);
        break;
      case 5:
        doc.dv.setUint32(at, n, true);
        doc.bytes[at + 4] = Math.floor(n / 4294967296);
        break;
      case 6:
        doc.dv.setUint32(at, n, true);
        doc.dv.setUint16(at + 4, Math.floor(n / 4294967296), true);
        break;
    }
  } else {
    let n = BigInt(offset) | (BigInt(count) << BigInt(o));
    for (let i = 0; i < d; i++) {
      doc.bytes[at + i] = Number(n & 255n);
      n >>= 8n;
    }
  }
}
