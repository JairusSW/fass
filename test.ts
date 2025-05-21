import { Generator } from "./src/generator/assemblyscript/generator";
import { Parser } from "./src/parser/parser";
import { Source } from "./src/parser/source";

const txt = `struct Vec3 {
    //quad: Quadrant
    x: u8
    y: u8
    z: u8
}

enum Quadrant {
    TL = 1
    TR = 2
    BL = 3
    BR = 4
}`;
const source = new Source("vec3.fass", txt);
const parser = new Parser([source]);
parser.parseSource(source)
const gen = new Generator([source], true);

console.log(gen.generate(source));