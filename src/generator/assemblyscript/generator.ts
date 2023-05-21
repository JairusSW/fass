import { CommentStatement, EnumDeclaration, IncludeDeclaration, MemberStatement, StructDeclaration } from "../../parser/nodes";
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
    public sources!: Source[];
    public source!: Source;
    public debug: boolean = false;
    constructor(sources: Source[], debug?: boolean) {
        this.sources = sources;
        if (debug) this.debug = debug;
    }
    generate(source: Source): string {
        this.source = source;
        for (const decl of this.source.stmts) {
            if (decl instanceof StructDeclaration) {
                this.text += this.generateStaticStruct(decl) + "\n\n";
            } else if (decl instanceof EnumDeclaration) {
                this.text += this.generateEnum(decl) + "\n\n";
            } else if (decl instanceof IncludeDeclaration) {
                this.text += this.generateIncludeDecl(decl) + "\n\n";
            } else if (decl instanceof CommentStatement && this.debug) {
                this.text += "//" + decl.text + "\n";
            }
        }
        return this.text.trimEnd();
    }
    generateIncludeDecl(decl: IncludeDeclaration): string {
        const imports: string[] = [];
        for (const stmt of decl.included) {
            const name = getNameOfDecl(stmt);
            console.log(this.source.usedTypes);
            if (name && this.source.usedTypes.find(v => v.type == name)) imports.push(name);
        }
        return `import { ${imports.join(", ")} } from "./${decl.predicate.slice(1).replace(".fass", "")};`
    }
    generateStructMember(member: MemberStatement, accessors: string[], offset: number): {
        serialize: string[],
        deserialize: string[],
        offset: number
    } {
        const type = member.type.text;
        const name = member.name.value;

        const accessor = accessors.length ? accessors.join(".") + "." + name : name;
        const scopeElement = this.source.scope.getElement(undefined, member.type.text);

        let serialize: string[] = [];
        let deserialize: string[] = [];

        if (!scopeElement) {
            if (type === "bool") {
                serialize = [`store<bool>(changetype<usize>(output), input.${accessor}, ${offset});`];
                deserialize = [`output.${accessor} = load<bool>(changetype<usize>(input), ${offset});`];
                offset += 1;
                return { serialize, deserialize, offset };
            } else if (type === "u8" || type == "char") {
                serialize = [`store<u8>(changetype<usize>(output), input.${accessor}, ${offset});`];
                deserialize = [`output.${accessor} = load<u8>(changetype<usize>(input), ${offset});`];
                offset += 1;
                return { serialize, deserialize, offset };
            } else if (type === "i8") {
                serialize = [`store<i8>(changetype<usize>(output), input.${accessor}, ${offset});`];
                deserialize = [`output.${accessor} = load<i8>(changetype<usize>(input), ${offset});`];
                offset += 1;
                return { serialize, deserialize, offset };
            } else if (type === "u16") {
                serialize = [`store<u16>(changetype<usize>(output), input.${accessor}, ${offset});`];
                deserialize = [`output.${accessor} = load<u16>(changetype<usize>(input), ${offset});`];
                offset += 2;
                return { serialize, deserialize, offset };
            } else if (type === "i16") {
                serialize = [`store<i16>(changetype<usize>(output), input.${accessor}, ${offset});`];
                deserialize = [`output.${accessor} = load<i16>(changetype<usize>(input), ${offset});`];
                offset += 2;
                return { serialize, deserialize, offset };
            } else if (type === "u32") {
                serialize = [`store<u32>(changetype<usize>(output), input.${accessor}, ${offset});`];
                deserialize = [`output.${accessor} = load<u32>(changetype<usize>(input), ${offset});`];
                offset += 4;
                return { serialize, deserialize, offset };
            } else if (type === "i32") {
                serialize = [`store<i32>(changetype<usize>(output), input.${accessor}, ${offset});`];
                deserialize = [`output.${accessor} = load<i32>(changetype<usize>(input), ${offset});`];
                offset += 4;
                return { serialize, deserialize, offset };
            } else if (type === "u64") {
                serialize = [`store<u64>(changetype<usize>(output), input.${accessor}, ${offset});`];
                deserialize = [`output.${accessor} = load<u64>(changetype<usize>(input), ${offset});`];
                offset += 8;
                return { serialize, deserialize, offset };
            } else if (type === "i64") {
                serialize = [`store<i64>(changetype<usize>(output), input.${accessor}, ${offset});`];
                deserialize = [`output.${accessor} = load<i64>(changetype<usize>(input), ${offset});`];
                offset += 8;
                return { serialize, deserialize, offset };
            }
            // FLOAT                
            else if (type === "f32") {
                serialize = [`store<f32>(changetype<usize>(output), input.${accessor}, ${offset});`];
                deserialize = [`output.${accessor} = load<f32>(changetype<usize>(input), ${offset});`];
                offset += 4;
                return { serialize, deserialize, offset };
            } else if (type === "f64") {
                serialize = [`store<f64>(changetype<usize>(output), input.${accessor}, ${offset});`];
                deserialize = [`output.${accessor} = load<f64>(changetype<usize>(input), ${offset});`];
                offset += 8;
                return { serialize, deserialize, offset };
            }

            if (type.endsWith("]")) {
                // We have either a static or dynamic sequence.
                const baseType = type.slice(0, type.indexOf("["));
                const innerExpression = type.slice(type.indexOf("[") + 1, type.lastIndexOf("]"));

                const isStatic = innerExpression.length ? true : false;

                if (isStatic) {
                    // We have a set-length string
                    if (baseType == "char") {
                        let length = parseInt(innerExpression);
                        serialize = [`String.UTF8.encodeUnsafe(changetype<usize>(input.${accessor}), ${length}, changetype<usize>(output) + <usize>${offset});`];
                        deserialize = [`output.${accessor} = String.UTF8.decodeUnsafe(changetype<usize>(input) + <usize>${offset}, ${length});`];
                        offset += length;
                        return { serialize, deserialize, offset };
                    } else if (baseType === "u8") {
                        let length = parseInt(innerExpression);
                        if (length === 4) {
                            serialize = [`store<u32>(changetype<usize>(output), load<u32>(changetype<usize>(input.${accessor})), ${offset});`];
                            deserialize = [`store<u32>(changetype<usize>(output.${accessor}), load<u32>(changetype<usize>(input), ${offset}));`];
                            offset += length;
                            return { serialize, deserialize, offset };
                        }
                    }
                }
            }
        } else {
            if (scopeElement.node instanceof EnumDeclaration && scopeElement.name == type) {
                serialize = [`store<u8>(changetype<usize>(output), input.${accessor}, ${offset});`];
                deserialize = [`output.${accessor} = load<u8>(changetype<usize>(input), ${offset});`];
                offset += 1;
                return { serialize, deserialize, offset };
            } else if (scopeElement.node instanceof StructDeclaration && scopeElement.name == type) {
                for (const memberStmt of scopeElement.node.members) {
                    const oldOffset = offset;
                    const generated = this.generateStructMember(memberStmt, [accessor], offset);
                    serialize.push(...generated.serialize);
                    deserialize.push(...generated.deserialize);
                    offset += generated.offset - oldOffset;
                }
                return { serialize, deserialize, offset };
            }
        }
        return {
            serialize: [],
            deserialize: [],
            offset: offset
        }
    }
    generateStaticStruct(decl: StructDeclaration): string {
        let txt = `export class ${decl.name.value} {`;
        let constr = `\n    constructor(`;
        for (const { name: { value }, type: { text } } of decl.members) {
            let type = text;
            const key = value;
            if (type.endsWith("]") && type.indexOf("[") > 0) {
                if (type.startsWith("char")) {
                    type = "string";
                } else {
                    type = `StaticArray<${type.slice(0, type.indexOf("["))}>`
                }
            }
            txt += `\n    public ${key}: ${type};`;
            constr += `${key}: ${type}, `;
        }

        constr = constr.slice(0, constr.length - 2) + `) {${decl.members.map(v => `\n        this.${v.name.value} = ${v.name.value};`).join("")}\n    }`
        txt += constr;

        let serialize = [`@inline __FASS_SERIALIZE(output: ArrayBuffer, input: ${decl.name.value}): void {`];
        let deserialize = [`@inline __FASS_DESERIALIZE(input: ArrayBuffer, output: ${decl.name.value}): void {`];
        const generatedMembers: {
            serialize: string[],
            deserialize: string[],
            offset: number
        }[] = [];

        // DETECT STATIC STRUCT
        let sizeText = `public __FASS_SIZE: u32 = `;

        // This is used to count optimizations until like 2 32 bits can be 64.
        let size = 0;

        let offset = 0;
        // STAGE: Import and cache
        let members = decl.members;
        for (let i = 0; i < decl.members.length; i++) {
            const member = members[i];
            const oldOffset = offset;
            const generated = this.generateStructMember(member, [], oldOffset);
            size += generated.offset - oldOffset;

            generatedMembers.push(generated);

            serialize.push(...generated.serialize);
            deserialize.push(...generated.deserialize);
            offset += generated.offset - oldOffset;
        }

        txt += "\n    " + (sizeText += offset + ";");

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