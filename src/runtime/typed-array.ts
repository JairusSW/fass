import { Code, Region, Kind, NO_INDEX as N, fail } from "../format.js";
import { ArrayView, Document, ValueView } from "./value.js";
import { U32Path, resolveU32 } from "./path.js";
/** Established scalar array view: representation and whole extent checked at binding. */
export class U32ArrayView {
  doc!: Document;
  offset = 0;
  count = 0;
  readOnly = true;
  plan = 0;
  rule = N;
  private validator = new ValueView();
  bind(array: ArrayView): this {
    const s = array.doc.schema,
      p = s.plan(array.child);
    if (s.u8(p) !== Kind.U32 || array.packed || array.stride !== 4)
      fail(Code.TypeMismatch, Region.Schema, p);
    this.doc = array.doc;
    this.offset = array.offset;
    this.count = array.count;
    this.readOnly = array.readOnly || !array.doc.writable;
    this.plan = array.child;
    this.rule = s.u32(p + 28);
    return this;
  }
  get(index: number): number {
    if (!Number.isInteger(index) || index < 0 || index >= this.count)
      fail(Code.BoundExceeded, Region.Data, this.offset, index);
    return this.doc.dv.getUint32(this.offset + index * 4, true);
  }
  set(index: number, value: number): void {
    if (this.readOnly) fail(Code.ReadOnly, Region.Data, this.offset);
    if (!Number.isInteger(index) || index < 0 || index >= this.count)
      fail(Code.BoundExceeded, Region.Data, this.offset, index);
    if (!Number.isInteger(value) || value < 0 || value > 0xffffffff)
      fail(Code.BoundExceeded, Region.Data, this.offset);
    const at = this.offset + index * 4;
    if (this.rule !== N) {
      const v = this.validator;
      v.doc = this.doc;
      v.kind = Kind.U32;
      v.offset = at;
      v.planIndex = this.plan;
      v.checkScalar(value);
    }
    this.doc.dv.setUint32(at, value, true);
  }
}
/** Requested inline scalar projection over fixed-stride record heads; no per-element schema walk. */
export class RecordArrayU32View {
  doc!: Document;
  offset = 0;
  count = 0;
  stride = 0;
  readOnly = true;
  path!: U32Path;
  private validator = new ValueView();
  bind(array: ArrayView, path: U32Path): this {
    const s = array.doc.schema,
      p = s.plan(array.child);
    if (
      s.u8(p) !== Kind.Record ||
      array.packed ||
      !path.inline ||
      path.schema !== s ||
      path.generation !== s.generation ||
      path.start !== s.u32(p + 20) ||
      path.headBytes !== array.stride
    )
      fail(Code.TypeMismatch, Region.Schema, p);
    this.doc = array.doc;
    this.path = path;
    this.offset = array.offset + path.offset;
    this.count = array.count;
    this.stride = array.stride;
    this.readOnly = array.readOnly || !array.doc.writable || path.readOnly;
    return this;
  }
  get(index: number): number {
    if (!Number.isInteger(index) || index < 0 || index >= this.count)
      fail(Code.BoundExceeded, Region.Data, this.offset, index);
    if (this.path.guardCount) this.checkPresence(index);
    return this.doc.dv.getUint32(this.offset + index * this.stride, true);
  }
  set(index: number, value: number): void {
    if (this.readOnly) fail(Code.ReadOnly, Region.Data, this.offset);
    if (!Number.isInteger(index) || index < 0 || index >= this.count)
      fail(Code.BoundExceeded, Region.Data, this.offset, index);
    if (this.path.guardCount) this.checkPresence(index);
    if (!Number.isInteger(value) || value < 0 || value > 0xffffffff)
      fail(Code.BoundExceeded, Region.Data, this.offset);
    const at = this.offset + index * this.stride;
    if (this.path.rule !== N) {
      const v = this.validator;
      v.doc = this.doc;
      v.kind = Kind.U32;
      v.offset = at;
      v.planIndex = this.path.plan;
      v.checkScalar(value);
    }
    this.doc.dv.setUint32(at, value, true);
  }
  private checkPresence(index: number): void {
    const anchor = this.offset - this.path.offset + index * this.stride,
      steps = this.path.steps;
    for (let i = 0; i < this.path.length; i++) {
      const mask = steps[i * 4 + 3];
      if (mask && !(this.doc.bytes[anchor + steps[i * 4 + 2]] & mask))
        fail(Code.Absent, Region.Data, anchor + steps[i * 4 + 2]);
    }
  }
}
export function resolveArrayU32(
  array: ArrayView,
  path: string,
): RecordArrayU32View {
  const s = array.doc.schema,
    p = s.plan(array.child);
  if (s.u8(p) !== Kind.Record) fail(Code.TypeMismatch, Region.Schema, p);
  return new RecordArrayU32View().bind(
    array,
    resolveU32(s, path, s.u32(p + 20)),
  );
}
