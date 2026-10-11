import { readFileSync, writeFileSync } from "node:fs";
import { compile, generateTypescript } from "../dist/compiler/index.js";
for (const name of ["packet", "rows"])
  writeFileSync(
    `bench/${name}-generated.ts`,
    generateTypescript(
      compile(readFileSync(`bench/flatbuffers/${name}.fass`, "utf8")).schema,
    ),
  );
