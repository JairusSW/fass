"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Going to use like Yargs or Commander for this later on...
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const source_1 = require("../parser/source");
const parser_1 = require("../parser/parser");
const generator_1 = require("../generator/assemblyscript/generator");
const generator_2 = require("../generator/typescript/generator");
let args = process.argv.slice(3);
const options = [];
for (const arg of args) {
    if (arg[0] == "-") {
        options.push(arg);
        if (arg != "-o")
            args.splice(args.indexOf(arg), 1);
    }
}
let currentLanguage = "";
if (options.includes("--assemblyscript")) {
    currentLanguage = "assemblyscript";
}
else if (process.argv.includes("--typescript")) {
    currentLanguage = "typescript";
}
else {
    console.log("No language selected!");
    process.exit(1);
}
const outputFolder = args.splice(args.indexOf("-o"), 2)[1];
const inputFolder = args[0];
args = process.argv.slice(3);
const inputPath = path.join(process.cwd(), `${inputFolder}/`);
const outputPath = path.join(process.cwd(), `${outputFolder}/${currentLanguage}/`);
const sourceFiles = fs
    .readdirSync(inputPath)
    .filter((file) => file.endsWith(".fass"));
const sources = [];
for (const file of sourceFiles) {
    const source = new source_1.Source(file, fs.readFileSync(inputPath + file).toString());
    sources.push(source);
}
const parser = new parser_1.Parser(sources);
for (const source of parser.sources) {
    let generator = new generator_1.Generator(parser.sources, true);
    if (currentLanguage == "typescript") {
        generator = new generator_2.Generator(parser.sources, true);
    }
    const text = generator.generate(source);
    fs.writeFileSync(outputPath + source.name.replace(".fass", ".ts"), text);
}
