import {
  Code,
  Region,
  Kind,
  NO_INDEX as N,
  extent,
  fail,
  bits,
} from "../format.js";
import { Schema } from "./schema.js";
import { RecordView, ValueView, Document } from "./value.js";
/** Explicit selected-path compilation. Caller storage has four words per step:
 * [layout, field, own-presence byte offset, mask]. Inline paths retain no runtime schema walk.
 * Schema bytes must stay immutable; reopening the Schema invalidates resolved handles.
 */
export class U32Path {
  length = 0;
  start = 0;
  schema!: Schema;
  steps!: Uint32Array;
  generation = 0;
  inline = true;
  offset = 0;
  headBytes = 0;
  readOnly = false;
  plan = 0;
  rule = N;
  guardCount = 0;
  resolve(
    schema: Schema,
    path: readonly Uint8Array[],
    steps: Uint32Array,
    start = schema.root,
  ): this {
    if (path.length * 4 > steps.length) fail(Code.NeedScratch, Region.Schema);
    if (!path.length || path.length > 128)
      fail(path.length ? Code.WorkLimit : Code.NotFound, Region.Schema);
    let layout = start,
      inline = true,
      readOnly = false,
      offset = 0,
      plan = 0,
      rule = N,
      guards = 0;
    const root = schema.layout(start),
      head = schema.u32(root),
      anchor = schema.u32(root + 16);
    for (let i = 0; i < path.length; i++) {
      const l = schema.layout(layout),
        fi = schema.byName(layout, path[i]),
        a = schema.access(fi),
        link = schema.entry(3, fi),
        kind = schema.u8(a + 4),
        flags = schema.u8(a + 5),
        presence = schema.u32(link + 4),
        target = schema.u32(link);
      steps[i * 4] = layout;
      steps[i * 4 + 1] = fi;
      steps[i * 4 + 2] = 0;
      steps[i * 4 + 3] = 0;
      readOnly ||= !!(flags & 2);
      if (presence !== N) {
        const p = schema.entry(6, presence),
          at = schema.u32(p);
        extent(schema.u32(l), at, 1, Region.Schema);
        steps[i * 4 + 2] = at;
        steps[i * 4 + 3] = schema.u8(p + 4);
        guards++;
      }
      if (i === path.length - 1) {
        if (kind !== Kind.U32) fail(Code.TypeMismatch, Region.Schema, a);
        plan = target;
        const p = schema.plan(plan);
        if (
          schema.u8(p) !== Kind.U32 ||
          !!(flags & 4) !== (schema.u32(p + 28) !== N)
        )
          fail(Code.Malformed, Region.Schema, p);
        offset = schema.u32(a);
        extent(schema.u32(l), offset, 4, Region.Schema);
        rule = schema.u32(p + 28);
      } else {
        if (kind !== Kind.Record && kind !== Kind.Ref)
          fail(Code.TypeMismatch, Region.Schema, a);
        const child = schema.layout(target);
        if (kind === Kind.Record) {
          if (
            schema.u32(child + 24) !== 2 ||
            schema.u32(child + 20) !== layout ||
            schema.u32(child + 16) !== schema.u32(l + 16) ||
            schema.u32(child) !== schema.u32(l)
          )
            fail(Code.Malformed, Region.Schema, child);
        } else {
          inline = false;
          const size = schema.u32(child),
            d = flags >> 4;
          if (
            schema.u32(child + 24) !== 1 ||
            schema.u8(a + 7) ||
            d !== (size ? Math.ceil(bits(schema.maxBytes - 1) / 8) : 0)
          )
            fail(Code.Malformed, Region.Schema, a);
          extent(schema.u32(l), schema.u32(a), d, Region.Schema);
        }
        layout = target;
      }
    }
    this.schema = schema;
    this.generation = schema.generation;
    this.steps = steps;
    this.length = path.length;
    this.start = start;
    this.inline = inline;
    this.offset = offset;
    this.headBytes = head;
    this.readOnly = readOnly;
    this.plan = plan;
    this.rule = rule;
    this.guardCount = guards;
    return this;
  }
  /** Binds to an established record. Reuse the record view and reference across messages. */
  bindInto(
    record: RecordView,
    out: U32Reference,
    recordScratch?: RecordView,
    valueScratch?: ValueView,
  ): U32Reference {
    if (
      record.doc.schema !== this.schema ||
      record.layout !== this.start ||
      this.schema.generation !== this.generation
    )
      fail(Code.SchemaMismatch, Region.Schema);
    if (this.inline) {
      // The record was bound with its whole head in bounds. Presence remains data-dependent.
      if (this.guardCount)
        for (let i = 0; i < this.length; i++) {
          const mask = this.steps[i * 4 + 3];
          if (
            mask &&
            !(record.doc.bytes[record.anchor + this.steps[i * 4 + 2]] & mask)
          )
            fail(
              Code.Absent,
              Region.Data,
              record.anchor + this.steps[i * 4 + 2],
            );
        }
      out.doc = record.doc;
      out.offset = record.anchor + this.offset;
      out.readOnly = !record.doc.writable || record.readOnly || this.readOnly;
      out.plan = this.plan;
      out.rule = this.rule;
      return out;
    }
    if (!recordScratch || !valueScratch) fail(Code.NeedScratch, Region.Data);
    recordScratch.bind(
      record.doc,
      record.layout,
      record.anchor,
      record.readOnly,
    );
    for (let i = 0; i < this.length; i++) {
      valueScratch.bindField(recordScratch, this.steps[i * 4 + 1]);
      valueScratch.require();
      if (i < this.length - 1) valueScratch.recordInto(recordScratch);
    }
    out.doc = record.doc;
    out.offset = valueScratch.offset;
    out.readOnly = !record.doc.writable || !!(valueScratch.flags & 2);
    out.plan = this.plan;
    out.rule = this.rule;
    return out;
  }
}
/** Valid until relevant presence/structure changes. Caller owns that lifetime. */
export class U32Reference {
  doc!: Document;
  offset = 0;
  readOnly = true;
  plan = 0;
  rule = N;
  private validator = new ValueView();
  get(): number {
    return this.doc.dv.getUint32(this.offset, true);
  }
  set(value: number): void {
    if (this.readOnly) fail(Code.ReadOnly, Region.Data, this.offset);
    if (!Number.isInteger(value) || value < 0 || value > 0xffffffff)
      fail(Code.BoundExceeded, Region.Data, this.offset);
    if (this.rule !== N) {
      const v = this.validator;
      v.doc = this.doc;
      v.kind = Kind.U32;
      v.offset = this.offset;
      v.planIndex = this.plan;
      v.checkScalar(value);
    }
    this.doc.dv.setUint32(this.offset, value, true);
  }
}
export function resolveU32(
  schema: Schema,
  path: string,
  start = schema.root,
): U32Path {
  const names = path.split(".").map((n) => new TextEncoder().encode(n));
  return new U32Path().resolve(
    schema,
    names,
    new Uint32Array(names.length * 4),
    start,
  );
}
