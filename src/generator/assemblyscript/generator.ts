import { EnumDeclaration, StructDeclaration } from "../../parser/nodes";
import { Parser } from "../../parser/parser";
import { Source } from "../../parser/source";

export class Generator {
    public text!: string;
    public source!: Source;
    constructor(source: Source) {
        this.source = source;
    }
    generate(): string {
        for (const decl of this.source.stmts) {
            if (decl instanceof StructDeclaration) {
                this.text += this.generateStruct(decl);
            } else if (decl instanceof EnumDeclaration) {
                this.text += this.generateEnum(decl);
            }
        }
        return this.text + "\n}";
    }
    generateStruct(decl: StructDeclaration): string {
        let txt = `export class ${decl.name.value} {`;
        let serialize = `@inline __FASS_SERIALIZE(output: ArrayBuffer, input: ${decl.name.value}): void {`;
        let deserialize = `@inline __FASS_DESERIALIZE(input: ArrayBuffer, output: ${decl.name.value}): void {`;
        // DETECT STATIC STRUCT
        let size = `public __FASS_SIZE(): u32 = `;

        let offset = 0;

        for (const member of decl.members) {
            // DYNAMICALLY DETECT ENUM
            if (member.type.text == "Quadrant") {
                serialize += `\n\tstore<u8>(changetype<usize>(output), input.${member.name.value});`;
                deserialize += `\n\toutput.${member.name.value} = load<u8>(changetype<usize>(input));`;
                offset += 1;
            } else if (member.type.text === "f32") {
                serialize += `\n\tstore<f32>(changetype<usize>(output), input.${member.name.value}, ${offset})`;
                deserialize += `\n\toutput.${member.name.value} = load<f32>(changetype<usize>(input), ${offset});`;
                offset += 4;
            }
        }
        
        size += offset + ";";
        serialize += "\n}";
        deserialize += "\n}";

        txt += "\n" + serialize;
        txt += "\n" + deserialize;

        return txt;
    }
    generateEnum(decl: EnumDeclaration): string {
        let txt = `\nenum ${decl.name.value} {`;
        for (const member of decl.members) {
            txt += `\n\t${member.name.value}${member.value ? ` = ${member.value.value}` : ""}`;
        }
        return txt + "\n}";
    }
}

const source = new Source("Vec3.fass", `struct Vec3 {
    quad: Quadrant
    x: f32
    y: f32
    z: f32
}

enum Quadrant {
    TL = 1
    TR = 2
    BL = 3
    BR = 4
}`);

const parser = new Parser([source]);

parser.parseSource(source);

const generator = new Generator(source);

console.log(generator.generate());