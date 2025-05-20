if (typeof console === 'undefined') {
  console = {
    log: print,
    error: print,
    warn: print,
  };
}

export function bench(description: string, routine: () => void, ops: number = 1_000_000): void {
  console.log(" - Benchmarking " + description);
  let warmup = ops/10;
  while (--warmup) {
    routine();
  }
  const start = Date.now();
  let count = ops;
  while (count !== 0) {
    routine();
    count--;
  }
  const elapsed = Date.now() - start;

  const opsPerSecond = Math.round((ops * 1000) / elapsed);
  const format = new Intl.NumberFormat("en-US");

  console.log(`   Completed benchmark in ${format.format(elapsed)}ms at ${format.format(opsPerSecond)} ops/s\n`);
}