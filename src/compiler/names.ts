import { power2 } from "../format.js";
import { xxh64 } from "../hash.js";
export interface NameIndex {
  mode: number;
  seed: number;
  buckets: number[];
  slots: number[];
}
export function compileNames(names: Uint8Array[], budget = 1000000): NameIndex {
  if (names.length <= 4) return { mode: 1, seed: 0, buckets: [], slots: [] };
  const bc = power2(Math.ceil(names.length / 4));
  let work = 0;
  for (let sc = power2(names.length); sc <= power2(names.length) * 16; sc *= 2)
    for (let seed = 0; seed < 64; seed++) {
      const groups: number[][] = Array.from({ length: bc }, () => []);
      names.forEach((n, i) =>
        groups[Number(xxh64(n, BigInt(seed)) & BigInt(bc - 1))].push(i),
      );
      const order = groups
        .map((g, i) => i)
        .sort((a, b) => groups[b].length - groups[a].length || a - b);
      const buckets = new Array<number>(bc).fill(0),
        slots = new Array<number>(sc).fill(0);
      let failed = false;
      for (const b of order) {
        const g = groups[b];
        if (g.length <= 1) continue;
        let found = false;
        for (let s = 1; s < 10000; s++) {
          if ((work += g.length) > budget)
            throw Error("Perfect-hash compiler work limit");
          const pos = g.map((i) =>
            Number(xxh64(names[i], BigInt(seed) + BigInt(s)) & BigInt(sc - 1)),
          );
          if (new Set(pos).size !== g.length || pos.some((i) => slots[i]))
            continue;
          pos.forEach((x, i) => (slots[x] = g[i] + 1));
          buckets[b] = s;
          found = true;
          break;
        }
        if (!found) {
          failed = true;
          break;
        }
      }
      if (failed) continue;
      let free = 0;
      for (const b of order)
        if (groups[b].length === 1) {
          while (slots[free]) free++;
          buckets[b] = -free - 1;
          slots[free] = groups[b][0] + 1;
        }
      return { mode: 2, seed, buckets, slots };
    }
  throw Error("Cannot construct perfect name index within limits");
}
