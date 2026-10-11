const MASK = (1n << 64n) - 1n;
const P1 = 11400714785074694791n,
  P2 = 14029467366897019727n,
  P3 = 1609587929392839161n,
  P4 = 9650029242287828579n,
  P5 = 2870177450012600261n;
const rot = (n: bigint, r: bigint) => ((n << r) | (n >> (64n - r))) & MASK;
const round = (a: bigint, b: bigint) =>
  (rot((a + b * P2) & MASK, 31n) * P1) & MASK;
export function xxh64(bytes: Uint8Array, seed = 0n): bigint {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let p = 0,
    h: bigint;
  if (bytes.length >= 32) {
    let a = (seed + P1 + P2) & MASK,
      b = (seed + P2) & MASK,
      c = seed & MASK,
      d = (seed - P1) & MASK;
    while (p <= bytes.length - 32) {
      a = round(a, dv.getBigUint64(p, true));
      b = round(b, dv.getBigUint64(p + 8, true));
      c = round(c, dv.getBigUint64(p + 16, true));
      d = round(d, dv.getBigUint64(p + 24, true));
      p += 32;
    }
    h = (rot(a, 1n) + rot(b, 7n) + rot(c, 12n) + rot(d, 18n)) & MASK;
    for (const v of [a, b, c, d]) h = ((h ^ round(0n, v)) * P1 + P4) & MASK;
  } else h = (seed + P5) & MASK;
  h = (h + BigInt(bytes.length)) & MASK;
  while (p <= bytes.length - 8) {
    h = (rot(h ^ round(0n, dv.getBigUint64(p, true)), 27n) * P1 + P4) & MASK;
    p += 8;
  }
  if (p <= bytes.length - 4) {
    h =
      (rot(h ^ ((BigInt(dv.getUint32(p, true)) * P1) & MASK), 23n) * P2 + P3) &
      MASK;
    p += 4;
  }
  while (p < bytes.length) {
    h = (rot(h ^ ((BigInt(bytes[p++]) * P5) & MASK), 11n) * P1) & MASK;
  }
  h ^= h >> 33n;
  h = (h * P2) & MASK;
  h ^= h >> 29n;
  h = (h * P3) & MASK;
  return (h ^ (h >> 32n)) & MASK;
}
