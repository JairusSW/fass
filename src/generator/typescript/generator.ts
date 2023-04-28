import { EnumDeclaration, IncludeDeclaration, StructDeclaration } from "../../parser/nodes";
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

export class Generator {
    public text: string = "";
    public source!: Source;
    constructor(source: Source) {
        this.source = source;
    }
    generate(): string {
        for (const decl of this.source.stmts) {
            if (decl instanceof StructDeclaration) {
                this.text += "\n\n" + this.generateStaticStruct(decl);
            } else if (decl instanceof EnumDeclaration) {
                this.text += "\n\n" + this.generateEnum(decl);
            } else if (decl instanceof IncludeDeclaration) {
                this.text += "\n\n" + this.generateIncludeDecl(decl);
            }
        }
        // Slice of first "/n/n"
        return this.text.slice(2);
    }
    generateIncludeDecl(decl: IncludeDeclaration): string {
        const imports: string[] = [];
        for (const stmt of decl.included) {
            const name = getNameOfDecl(stmt);
            if (name) imports.push(name);
        }
        return `import { ${imports.join(", ")} } from "./${decl.predicate.slice(1).replace(".fass", "")};`
    }
    generateStaticStruct(decl: StructDeclaration): string {
        let txt = `export class ${decl.name.value} {`;

        for (const { name: { value }, type: { text } } of decl.members) {
            let type = text;
            const key = value;
            if (type.endsWith("]") && type.indexOf("[") > 0) {
                if (type.startsWith("char")) {
                    type = "string";
                } else {
                    type = `Array<${type.slice(0, type.indexOf("["))}>`
                }
            }
            switch (type) {
                case "u8":
                case "i8":
                case "u16":
                case "i16":
                case "u32":
                case "i32":
                case "f32":
                case "f64": {
                    type = "number";
                    break;
                }
                case "u64":
                case "i64": {
                    type = "bigint";
                    break;
                }
                case "bool": {
                    type = "boolean";
                    break;
                }
            }
            txt += `\n    ${key}!: ${type};`;
        }

        let serialize = [`static __FASS_SERIALIZE(output: DataView, input: ${decl.name.value}): void {`];
        let deserialize = [`static __FASS_DESERIALIZE(input: DataView, output: ${decl.name.value}): void {`];
        // DETECT STATIC STRUCT
        let size = `static __FASS_SIZE: number = `;

        let offset = 0;

        // STAGE: Import and cache
        let members = decl.members;

        for (let i = 0; i < decl.members.length; i++) {
            const member = members[i];
            const namedType = member.type.text;
            const declaredName = member.name.value;
            const scopeElement = this.source.scope.getElement(undefined, member.type.text);
            // If not in scope, must be primitive.
            if (!scopeElement) {
                if (namedType === "bool") {
                    serialize.push(`output.setUint8(${offset}, Number(input.${declaredName}));`);
                    deserialize.push(`output.${declaredName} = Boolean(input.getUint8(${offset}));`);
                    offset += 1;
                } else if (namedType === "u8" || namedType == "char") {
                    serialize.push(`output.setUint8(${offset}, input.${declaredName});`);
                    deserialize.push(`output.${declaredName} = input.getUint8(${offset});`);
                    offset += 1;
                } else if (namedType === "i8") {
                    serialize.push(`output.setInt8(${offset}, input.${declaredName});`);
                    deserialize.push(`output.${declaredName} = input.getInt8(${offset});`);
                    offset += 1;
                } else if (namedType === "u16") {
                    serialize.push(`output.setUint16(${offset}, input.${declaredName}, true);`);
                    deserialize.push(`output.${declaredName} = input.getUint16(${offset}, true);`);
                    offset += 2;
                } else if (namedType === "i16") {
                    serialize.push(`output.setInt16(${offset}, input.${declaredName}, true);`);
                    deserialize.push(`output.${declaredName} = input.getInt16(${offset}, true);`);
                    offset += 2;
                } else if (namedType === "u32") {
                    serialize.push(`output.setUint32(${offset}, input.${declaredName}, true);`);
                    deserialize.push(`output.${declaredName} = input.getUint32(${offset}, true);`);
                    offset += 4;
                } else if (namedType === "i32") {
                    serialize.push(`output.setInt32(${offset}, input.${declaredName}, true);`);
                    deserialize.push(`output.${declaredName} = input.getInt32(${offset}, true);`);
                    offset += 4;
                } else if (namedType === "u64") {
                    serialize.push(`output.setBigUint64(${offset}, input.${declaredName}, true);`);
                    deserialize.push(`output.${declaredName} = input.getBigUint64(${offset}, true);`);
                    offset += 8;
                } else if (namedType === "i64") {
                    serialize.push(`output.setBigInt64(${offset}, input.${declaredName}, true);`);
                    deserialize.push(`output.${declaredName} = input.getBigInt64(${offset}, true);`);
                    offset += 8;
                }
                // FLOAT                
                else if (namedType === "f32") {
                    serialize.push(`output.setFloat32(${offset}, input.${declaredName}, true);`);
                    deserialize.push(`output.${declaredName} = input.getFloat32(${offset}, true);`);
                    offset += 4;
                } else if (namedType === "f64") {
                    serialize.push(`output.setFloat64(${offset}, input.${declaredName}, true);`);
                    deserialize.push(`output.${declaredName} = input.getFloat64(${offset}, true);`);
                    offset += 8;
                }

                if (namedType.endsWith("]")) {
                    // We have either a static or dynamic sequence.
                    const baseType = namedType.slice(0, namedType.indexOf("["));
                    const innerExpression = namedType.slice(namedType.indexOf("[") + 1, namedType.length - 1);

                    const isStatic = innerExpression.length ? true : false;

                    if (isStatic) {
                        // We have a set-length string
                        if (baseType == "char") {
                            let length = parseInt(innerExpression);
                            offset += length;
                            serialize.push(`// STRINGS NOT SUPPORTED YET`);
                            deserialize.push(`// STRINGS NOT SUPPORTED YET`)
                        }
                    }
                }
            } else {
                // Here we have actual structures
                if (scopeElement.node instanceof EnumDeclaration && scopeElement.name == namedType) {
                    serialize.push(`output.setUint8(${offset}, input.${declaredName});`);
                    deserialize.push(`output.${declaredName} = input.getUint8(${offset});`);
                    offset += 1;
                } else if (scopeElement.node instanceof StructDeclaration && scopeElement.name == namedType) {

                }
            }
        }

        txt += "\n    " + (size += offset + ";");

        txt += "\n    " + serialize[0];
        for (let i = 1; i < serialize.length; i++) {
            const serializeText = serialize[i];
            txt += "\n        " + serializeText;
        }
        txt += "\n    }";

        txt += "\n    " + deserialize[0];
        for (let i = 1; i < serialize.length; i++) {
            const deserializeText = deserialize[i];
            txt += "\n        " + deserializeText;
        }
        txt += "\n    }";

        txt += "\n}";

        return txt;
    }
    generateEnum(decl: EnumDeclaration): string {
        let txt = `export enum ${decl.name.value} {`;
        for (const member of decl.members) {
            txt += `\n    ${member.name.value}${member.value ? ` = ${member.value.value}` : ""},`;
        }
        if (txt.endsWith(",")) txt = txt.slice(0, txt.length - 1);
        txt += "\n}";
        return txt;
    }
}

function getNameOfDecl<T>(decl: T): string | null {
    if (decl instanceof StructDeclaration) {
        return decl.name.value;
    } else if (decl instanceof EnumDeclaration) {
        return decl.name.value;
    }
    return null;
}
/*
const sourceVec3 = new Source("Vec3.fass", `struct Vec3 {
    name: char[8]
    quad: Quadrant
    x: i8
    y: i8
    z: i8
}

enum Quadrant {
    TL = 1
    TR = 2
    BL = 3
    BR = 4
}`);

const sourceVec3Wrap = new Source("Wrap.fass", `include "Vec3.fass"
struct Wrap {
    vec: Vec3
}`);

const parser = new Parser([sourceVec3, sourceVec3Wrap]);

parser.parseSource(sourceVec3);

const generator = new Generator(sourceVec3);

console.log(generator.generate());*/