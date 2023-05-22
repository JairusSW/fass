// Going to use like Yargs or Commander for this later on...
import * as fs from "fs";
import * as path from "path";
import { Source } from "../parser/source";
import { Parser } from "../parser/parser";
import { Generator as AssemblyScriptGenerator } from "../generator/assemblyscript/generator";

let args = process.argv.slice(3);

const options = [];
for (const arg of args) {
  if (arg[0] == "-") {
    options.push(arg);
    if (arg != "-o") args.splice(args.indexOf(arg), 1);
  }
}

let currentLanguage = "";
if (options.includes("--assemblyscript")) {
  currentLanguage = "assemblyscript";
} else if (process.argv.includes("--typescript")) {
  currentLanguage = "typescript";
} else {
  console.log("No language selected!");
  process.exit(1);
}

const outputFolder = args.splice(args.indexOf("-o"), 2)[1];
const inputFolder = args[0];
args = process.argv.slice(3);

const inputPath = path.join(process.cwd(), `${inputFolder}/`);
const outputPath = path.join(
  process.cwd(),
  `${outputFolder}/${currentLanguage}/`
);

const sourceFiles = fs
  .readdirSync(inputPath)
  .filter((file) => file.endsWith(".fass"));
const sources: Source[] = [];
for (const file of sourceFiles) {
  const source = new Source(file, fs.readFileSync(inputPath + file).toString());
  sources.push(source);
}

const parser = new Parser(sources);

for (const source of parser.sources) {
  let generator = new AssemblyScriptGenerator(parser.sources, true);
  /*if (currentLanguage == "typescript") {
        generator = new TypeScriptGenerator(parser.sources, true);
    }*/
  const text = generator.generate(source);

  fs.writeFileSync(outputPath + source.name.replace(".fass", ".ts"), text);
}
