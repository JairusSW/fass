import { EnumDeclaration, StructDeclaration } from "../../parser/nodes";
import { Parser } from "../../parser/parser";
import { Source } from "../../parser/source";

enum Offsets {
    u8 = 1,
    i8 = 1,
    bool = 1,
    u16 = 2,
    i16 = 2,
    u32 = 4,
    i32 = 4,
    f32 = 4,
    u64 = 8,
    i64 = 8,
    f64 = 8
}
/**
 * FASS Code Generator for the AssemblyScript Language
 * 
 * Stages:
 * - Codegen
 * - Sorting
 * - Optimization
 * - Output
 * 
 * Codegen:
 * A bunch of load and store ops that push and pull data from a said buffer
 * 
 * Sorting:
 * Perhaps we can have dynamic-length sequences at the end and static structs aligned to the start,
 * so that there is no need to load a length-prefixed length of the sequence and add that to the offset.
 * 
 * Optimization:
 * Many of these operations can be combined into a single 64-bit load/store or a SIMD v128 load/store.
 * Take advantage of that to decrease overhead.
 * 
 * Output:
 * Should be formatted correctly and be conherent.
 */
export class Generator {
    public text: string = "";
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
        let serialize = [`@inline __FASS_SERIALIZE(output: ArrayBuffer, input: ${decl.name.value}): void {`];
        let deserialize = [`@inline __FASS_DESERIALIZE(input: ArrayBuffer, output: ${decl.name.value}): void {`];
        // DETECT STATIC STRUCT
        let size = `public __FASS_SIZE(): u32 = `;

        let offset = 0;

        for (const member of decl.members) {
            const namedType = member.type.text;
            const declaredName = member.name.value;
            const scopeElement = this.source.scope.getElement(undefined, member.type.text);
            // If not in scope, must be primitive.
            if (!scopeElement) {
                if (member.type.text === "bool") {
                    serialize.push(`\n\tstore<bool>(changetype<usize>(output), input.${declaredName}, ${offset});`);
                    deserialize.push(`\n\toutput.${declaredName} = load<bool>(changetype<usize>(input), ${offset});`);
                    offset += 1;
                } else if (member.type.text === "u8") {
                    serialize.push(`\n\tstore<u8>(changetype<usize>(output), input.${declaredName}, ${offset});`);
                    deserialize.push(`\n\toutput.${declaredName} = load<u8>(changetype<usize>(input), ${offset});`);
                    offset += 1;
                } else if (member.type.text === "i8") {
                    serialize.push(`\n\tstore<i8>(changetype<usize>(output), input.${declaredName}, ${offset});`);
                    deserialize.push(`\n\toutput.${declaredName} = load<i8>(changetype<usize>(input), ${offset});`);
                    offset += 1;
                } else if (member.type.text === "u16") {
                    serialize.push(`\n\tstore<u16>(changetype<usize>(output), input.${declaredName}, ${offset});`);
                    deserialize.push(`\n\toutput.${declaredName} = load<u16>(changetype<usize>(input), ${offset});`);
                    offset += 2;
                } else if (member.type.text === "i16") {
                    serialize.push(`\n\tstore<i16>(changetype<usize>(output), input.${declaredName}, ${offset});`);
                    deserialize.push(`\n\toutput.${declaredName} = load<i16>(changetype<usize>(input), ${offset});`);
                    offset += 2;
                } else if (member.type.text === "u32") {
                    serialize.push(`\n\tstore<u32>(changetype<usize>(output), input.${declaredName}, ${offset});`);
                    deserialize.push(`\n\toutput.${declaredName} = load<u32>(changetype<usize>(input), ${offset});`);
                    offset += 4;
                } else if (member.type.text === "i32") {
                    serialize.push(`\n\tstore<i32>(changetype<usize>(output), input.${declaredName}, ${offset});`);
                    deserialize.push(`\n\toutput.${declaredName} = load<i32>(changetype<usize>(input), ${offset});`);
                    offset += 4;
                } else if (member.type.text === "u64") {
                    serialize.push(`\n\tstore<u64>(changetype<usize>(output), input.${declaredName}, ${offset});`);
                    deserialize.push(`\n\toutput.${declaredName} = load<u64>(changetype<usize>(input), ${offset});`);
                    offset += 8;
                } else if (member.type.text === "i64") {
                    serialize.push(`\n\tstore<i64>(changetype<usize>(output), input.${declaredName}, ${offset});`);
                    deserialize.push(`\n\toutput.${declaredName} = load<i64>(changetype<usize>(input), ${offset});`);
                    offset += 8;
                }
                // FLOAT                
                else if (member.type.text === "f32") {
                    serialize.push(`\n\tstore<f32>(changetype<usize>(output), input.${declaredName}, ${offset});`);
                    deserialize.push(`\n\toutput.${declaredName} = load<f32>(changetype<usize>(input), ${offset});`);
                    offset += 4;
                } else if (member.type.text === "f64") {
                    serialize.push(`\n\tstore<f64>(changetype<usize>(output), input.${declaredName}, ${offset});`);
                    deserialize.push(`\n\toutput.${declaredName} = load<f64>(changetype<usize>(input), ${offset});`);
                    offset += 8;
                }
            } else {
                // Here we have actual structures
                if (scopeElement.node instanceof EnumDeclaration && scopeElement.name == namedType) {
                    serialize.push(`\n\tstore<u8>(changetype<usize>(output), input.${declaredName});`);
                    deserialize.push(`\n\toutput.${declaredName} = load<u8>(changetype<usize>(input));`);
                    offset += 1;
                }
            }

            // Optimization stage

        }
        
        size += offset + ";";
        serialize.push("\n}");
        deserialize.push("\n}");

        txt += "\n" + serialize.join("");
        txt += "\n" + deserialize.join("");

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