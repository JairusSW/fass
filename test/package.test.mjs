import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
test("packed npm artifact exposes CLI, TypeScript and AssemblyScript without repository-relative imports", () => {
  const dir = mkdtempSync(join(tmpdir(), "fass-package-"));
  const packed = JSON.parse(
    execFileSync("npm", ["pack", "--json", "--pack-destination", dir], {
      encoding: "utf8",
    }),
  );
  execFileSync(
    "npm",
    [
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      join(dir, packed[0].filename),
    ],
    { cwd: dir },
  );
  const output = execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      "import {compile} from 'fass/compiler'; import {openSchema,encode,open} from 'fass'; const s=openSchema(compile('message Root {1 x:u32=7}').schema); console.log(open(encode(s,{}),s).root().field('x').u32());",
    ],
    { cwd: dir, encoding: "utf8" },
  );
  assert.equal(output.trim(), "7");
  const help = execFileSync(join(dir, "node_modules/.bin/fass"), ["help"], {
    cwd: dir,
    encoding: "utf8",
  });
  assert.match(help, /fass compile/);
  writeFileSync(
    join(dir, "consumer.ts"),
    "import {Schema,RecordView,ValueView} from 'fass/assembly'; const s=new Schema(); const r=new RecordView(s); const v=new ValueView(s); export function read(sp:usize,sl:u32,dp:usize,dl:u32):u32 {if(s.open(sp,sl)!=0||r.open(dp,dl)!=0||r.fieldByID(1,v)!=0)return 0;return v.getU32();}",
  );
  execFileSync(
    process.execPath,
    [
      resolve("node_modules/assemblyscript/bin/asc.js"),
      "consumer.ts",
      "--outFile",
      "consumer.wasm",
      "--runtime",
      "stub",
    ],
    { cwd: dir },
  );
  assert.ok(existsSync(join(dir, "consumer.wasm")));
});
