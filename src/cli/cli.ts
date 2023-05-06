import * as fs from "fs";
import * as path from "path";
import { Source } from "../parser/source";
import { Parser } from "../parser/parser";
import { Generator as AssemblyScriptGenerator } from "../generator/assemblyscript/generator";
import { Generator as TypeScriptGenerator } from "../generator/typescript/generator";

let currentLanguage = "";
if (process.argv.includes("--assemblyscript")) {
    currentLanguage = "assemblyscript";
} else if (process.argv.includes("--typescript")) {
    currentLanguage = "typescript";
}

const inputPath = path.join(process.cwd(), "./schemas/");
const outputPath = path.join(process.cwd(), `./build/${currentLanguage}/`);

const sourceFiles = fs.readdirSync(inputPath).filter(file => file.endsWith(".fass"));
const sources: Source[] = [];
for (const file of sourceFiles) {
    const source = new Source(file, fs.readFileSync(inputPath + file).toString());
    sources.push(source);
}

const parser = new Parser(sources);

//for (const source of parser.sources) {
    let generator = new AssemblyScriptGenerator(parser.sources, true);
    /*if (currentLanguage == "typescript") {
        generator = new TypeScriptGenerator(parser.sources, true);
    }*/
    const text = generator.generate(parser.sources.find(v => v.name == "Player.fass")!);

fs.writeFileSync(outputPath + parser.sources.find(v => v.name == "Player.fass")!.name.replace(".fass", ".ts"), text);
//}