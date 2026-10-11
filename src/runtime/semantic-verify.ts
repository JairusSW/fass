import { Schema } from "./schema.js";
import {
  Code,
  Region,
  Kind,
  NO_INDEX as N,
  fail,
  extent,
  width,
  readWord,
} from "../format.js";
import { Limits } from "./verify.js";
import { compareBytes } from "./build.js";
/** Cold metadata validation, invoked only by whole-schema verification. */
export function verifySemantics(s: Schema, limits: Limits): void {
  let work = 0;
  const tick = (n = 1) => {
    work += n;
    if (work > (limits.maxSchemaSteps ?? 1000000))
      fail(Code.WorkLimit, Region.Schema);
  };
  function numeric(kind: number, n: bigint): bigint {
    const w = width(kind);
    if (kind < 1 || kind > 8 || n >> BigInt(w * 8))
      fail(Code.Malformed, Region.Schema);
    return kind % 2 === 1 ? BigInt.asIntN(w * 8, n) : n;
  }
  function rule(index: number, kind: number, n?: bigint): void {
    const r = s.entry(7, index),
      rk = s.u8(r);
    if (s.u8(r + 1) !== kind || s.dv.getUint16(r + 2, true) || s.u32(r + 12))
      fail(Code.Malformed, Region.Schema, r);
    if (rk === 1) {
      const lo = numeric(kind, readWord(s.bytes, r + 16, 8, Region.Schema)),
        hi = numeric(kind, readWord(s.bytes, r + 24, 8, Region.Schema));
      if (lo > hi || s.u32(r + 4) || s.u32(r + 8))
        fail(Code.Malformed, Region.Schema, r);
      if (n !== undefined && (n < lo || n > hi))
        fail(Code.BoundExceeded, Region.Schema, r);
    } else if (rk === 2) {
      const first = s.u32(r + 4),
        count = s.u32(r + 8);
      if (
        !count ||
        readWord(s.bytes, r + 16, 8, Region.Schema) ||
        readWord(s.bytes, r + 24, 8, Region.Schema)
      )
        fail(Code.Malformed, Region.Schema, r);
      let previous: bigint | undefined,
        found = false;
      tick(count);
      for (let i = 0; i < count; i++) {
        const v = numeric(
          kind,
          readWord(s.bytes, s.entry(8, first + i), 8, Region.Schema),
        );
        if (previous !== undefined && v <= previous)
          fail(Code.Malformed, Region.Schema, r);
        previous = v;
        if (n === v) found = true;
      }
      if (n !== undefined && !found) fail(Code.BoundExceeded, Region.Schema, r);
    } else fail(Code.Malformed, Region.Schema, r);
  }
  for (let i = 0; i < s.count(7); i++) {
    tick();
    const r = s.entry(7, i);
    rule(i, s.u8(r + 1));
  }
  const aux = s.u32(56),
    ac = s.u32(60);
  let refs = 0,
    refCount = 0,
    nameBase = 0,
    nameLen = 0;
  for (let i = 0; i < ac; i++) {
    const a = aux + i * 16,
      k = s.dv.getUint16(a, true),
      base = s.u32(a + 4),
      len = s.u32(a + 8),
      count = s.u32(a + 12),
      size =
        k === 0x8001
          ? 32
          : k === 0x8002
            ? 8
            : k === 0x8003
              ? 1
              : k === 0x8004 || k === 0x8005
                ? 4
                : 0;
    if (size && count * size !== len) fail(Code.Malformed, Region.Schema, a);
    if (k === 0x8001 && (base !== s.u32(48) || count !== s.u32(52)))
      fail(Code.Malformed, Region.Schema, a);
    if (k === 0x8002) {
      refs = base;
      refCount = count;
    }
    if (k === 0x8003) {
      nameBase = base;
      nameLen = len;
    }
  }
  const decoder = new TextDecoder("utf-8", { fatal: true });
  for (let i = 0; i < refCount; i++) {
    tick();
    const ref = refs + i * 8,
      off = s.u32(ref),
      len = s.u32(ref + 4);
    extent(nameLen, off - nameBase, len, Region.Schema);
    try {
      decoder.decode(s.bytes.subarray(off, off + len));
    } catch {
      fail(Code.Malformed, Region.Schema, ref);
    }
  }
  const name = (index: number) => {
    if (index === N) return;
    if (index >= refCount) fail(Code.Malformed, Region.Schema);
  };
  for (let i = 0; i < s.count(11); i++) {
    tick();
    const t = s.entry(11, i),
      k = s.u8(t),
      scalar = s.u8(t + 2),
      first = s.u32(t + 8),
      count = s.u32(t + 12),
      c0 = s.u32(t + 16),
      c1 = s.u32(t + 20),
      param = s.u32(t + 24);
    if (k < 1 || k > 8 || s.u8(t + 1) || s.u8(t + 3))
      fail(Code.Malformed, Region.Schema, t);
    name(s.u32(t + 4));
    if (k === 1 || k === 8) {
      if (scalar < 1 || scalar > 11) fail(Code.Malformed, Region.Schema, t);
      if (param !== N) rule(param, scalar);
    } else if (scalar) fail(Code.Malformed, Region.Schema, t);
    if (k === 4 || k === 5 || k === 6 || k === 7) s.entry(11, c0);
    else if (c0 !== N) fail(Code.Malformed, Region.Schema, t);
    if (k === 6) s.entry(11, c1);
    else if (c1 !== N) fail(Code.Malformed, Region.Schema, t);
    if (k === 2 || k === 8) {
      tick(count);
      let last = 0;
      const names = new Set<number>();
      for (let j = 0; j < count; j++) {
        const f = s.entry(12, first + j),
          id = s.u32(f);
        if (!id || id >= N || id <= last)
          fail(Code.Malformed, Region.Schema, f);
        last = id;
        name(s.u32(f + 4));
        s.entry(11, s.u32(f + 8));
        if (s.u32(f + 12) & ~3 || s.u32(f + 28))
          fail(Code.Malformed, Region.Schema, f);
        const d = s.u32(f + 16);
        if (d !== N) typedLiteral(d, s.u32(f + 8), !!(s.u32(f + 12) & 1), 0);
        if (s.u32(f + 20) !== N) s.entry(16, s.u32(f + 20));
        name(s.u32(f + 24));
      }
    } else if (first || count) fail(Code.Malformed, Region.Schema, t);
    if (s.u32(t + 28) !== N) s.entry(16, s.u32(t + 28));
  }
  function typedLiteral(
    index: number,
    type: number,
    optional: boolean,
    depth: number,
  ): void {
    tick();
    if (depth > (limits.maxDepth ?? 128)) fail(Code.WorkLimit, Region.Schema);
    const l = s.entry(13, index),
      t = s.entry(11, type),
      lk = s.u8(l),
      tk = s.u8(t),
      count = s.u32(l + 8),
      first = s.u32(l + 4);
    if (lk === 6) {
      if (!optional) fail(Code.TypeMismatch, Region.Schema, l);
      return;
    }
    if (tk === 1 || tk === 8) {
      const kind = s.u8(t + 2);
      if (lk !== 1 || s.u8(l + 1) !== kind)
        fail(Code.TypeMismatch, Region.Schema, l);
      const n = readWord(s.bytes, l + 24, 8, Region.Schema);
      if (kind === 11) {
        if (n > 1n) fail(Code.Malformed, Region.Schema, l);
      } else if (kind <= 8) {
        const x = numeric(kind, n),
          r = s.u32(t + 24);
        if (r !== N) rule(r, kind, x);
      } else if (kind === 9 && n >> 32n) fail(Code.Malformed, Region.Schema, l);
      return;
    }
    if (tk === 3) {
      if (lk !== 2 || s.u32(l + 16) > s.u32(t + 24))
        fail(Code.TypeMismatch, Region.Schema, l);
      const off = s.u32(l + 12),
        len = s.u32(l + 16);
      extent(s.count(15), off, len, Region.Schema);
      const base = s.table(15);
      try {
        decoder.decode(s.bytes.subarray(base + off, base + off + len));
      } catch {
        fail(Code.Malformed, Region.Schema, l);
      }
      return;
    }
    if (tk === 7) {
      typedLiteral(index, s.u32(t + 16), false, depth + 1);
      return;
    }
    tick(count);
    if (tk === 2) {
      if (lk !== 3) fail(Code.TypeMismatch, Region.Schema, l);
      let prev = 0;
      for (let i = 0; i < count; i++) {
        const e = s.entry(14, first + i),
          id = s.u32(e);
        if (id <= prev) fail(Code.Malformed, Region.Schema, e);
        prev = id;
        let found = N;
        for (let j = 0; j < s.u32(t + 12); j++) {
          tick();
          const f = s.entry(12, s.u32(t + 8) + j);
          if (s.u32(f) === id) {
            found = f;
            break;
          }
        }
        if (found === N) fail(Code.Malformed, Region.Schema, e);
        typedLiteral(
          s.u32(e + 4),
          s.u32(found + 8),
          !!(s.u32(found + 12) & 1),
          depth + 1,
        );
      }
      return;
    }
    if (tk === 4 || tk === 5) {
      if (
        lk !== 4 ||
        count > s.u32(t + 24) ||
        (tk === 5 && count !== s.u32(t + 24))
      )
        fail(Code.BoundExceeded, Region.Schema, l);
      for (let i = 0; i < count; i++) {
        const e = s.entry(14, first + i);
        if (s.u32(e) !== i) fail(Code.Malformed, Region.Schema, e);
        typedLiteral(s.u32(e + 4), s.u32(t + 16), false, depth + 1);
      }
      return;
    }
    if (tk === 6) {
      if (lk !== 5 || count > s.u32(t + 24))
        fail(Code.BoundExceeded, Region.Schema, l);
      let previous: bigint | Uint8Array | undefined;
      const kt = s.entry(11, s.u32(t + 16)),
        keyKind = s.u8(kt + 2);
      for (let i = 0; i < count; i++) {
        const edge = s.entry(14, first + i);
        if (s.u32(edge) !== i) fail(Code.Malformed, Region.Schema, edge);
        const entry = s.entry(13, s.u32(edge + 4));
        if (s.u8(entry) !== 3 || s.u32(entry + 8) !== 2)
          fail(Code.Malformed, Region.Schema, entry);
        const ke = s.entry(14, s.u32(entry + 4)),
          ve = s.entry(14, s.u32(entry + 4) + 1);
        if (s.u32(ke) !== 1 || s.u32(ve) !== 2)
          fail(Code.Malformed, Region.Schema, entry);
        typedLiteral(s.u32(ke + 4), s.u32(t + 16), false, depth + 1);
        typedLiteral(s.u32(ve + 4), s.u32(t + 20), false, depth + 1);
        const kl = s.entry(13, s.u32(ke + 4));
        let key: bigint | Uint8Array;
        if (s.u8(kt) === 3) {
          const base = s.table(15) + s.u32(kl + 12);
          key = s.bytes.subarray(base, base + s.u32(kl + 16));
        } else
          key = numeric(keyKind, readWord(s.bytes, kl + 24, 8, Region.Schema));
        if (
          previous !== undefined &&
          (typeof key === "bigint"
            ? key <= (previous as bigint)
            : compareBytes(previous as Uint8Array, key) >= 0)
        )
          fail(Code.Malformed, Region.Schema, entry);
        previous = key;
      }
      return;
    }
    fail(Code.TypeMismatch, Region.Schema, l);
  }
  for (let i = 0; i < s.count(16); i++) {
    tick();
    const a = s.entry(16, i);
    name(s.u32(a));
    s.entry(13, s.u32(a + 4));
    if (s.u32(a + 12)) fail(Code.Malformed, Region.Schema, a);
    const seen = new Set<number>();
    let next = i;
    while (next !== N) {
      tick();
      if (seen.has(next)) fail(Code.Malformed, Region.Schema, a);
      seen.add(next);
      next = s.u32(s.entry(16, next) + 8);
    }
  }
}
