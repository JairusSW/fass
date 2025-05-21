import { Node } from "assemblyscript/dist/assemblyscript.js";
import { Transform } from "assemblyscript/dist/transform.js";
import { Visitor } from "./visitor.js";
import { isStdlib, SimpleParser, toString } from "./util.js";
import * as path from "path";
import { fileURLToPath } from "url";
import { Property, PropertyFlags, Schema } from "./types.js";
import { getClasses, getImportedClass } from "./linker.js";
let indent = "  ";
class FASSTransform extends Visitor {
    static SN = new FASSTransform();
    program;
    baseDir;
    parser;
    schemas = [];
    schema;
    sources = new Set();
    imports = [];
    topStatements = [];
    simdStatements = [];
    visitClassDeclaration(node) {
        if (!node.decorators?.length)
            return;
        if (!node.decorators.some((decorator) => {
            const name = decorator.name.text;
            return name == "fass";
        }))
            return;
        this.schema = new Schema();
        this.schema.node = node;
        this.schema.name = node.name.text;
        this.schemas.push(this.schema);
        if (process.env["DEBUG"])
            console.log("Created schema: " + this.schema.name + " in file " + node.range.source.normalizedPath);
        const members = [...node.members.filter((v) => v.kind === 54 && v.flags !== 32 && v.flags !== 512 && v.flags !== 1024 && !v.decorators?.some((decorator) => decorator.name.text === "omit"))];
        if (node.extendsType) {
            const extendsName = node.extendsType?.name.identifier.text;
            this.schema.parent = this.schemas.find((v) => v.name == extendsName);
            if (!this.schema.parent) {
                const internalSearch = getClasses(node.range.source).find((v) => v.name.text == extendsName);
                if (internalSearch) {
                    if (process.env["DEBUG"])
                        console.log("Found " + extendsName + " internally");
                    this.visitClassDeclaration(internalSearch);
                    this.visitClassDeclaration(node);
                    return;
                }
                const externalSearch = getImportedClass(extendsName, node.range.source, this.parser);
                if (externalSearch) {
                    if (process.env["DEBUG"])
                        console.log("Found " + extendsName + " externally");
                    this.visitClassDeclaration(externalSearch);
                    this.visitClassDeclaration(node);
                    return;
                }
            }
            if (this.schema.parent?.members) {
                for (let i = this.schema.parent.members.length - 1; i >= 0; i--) {
                    const replace = this.schema.members.find((v) => v.name == this.schema.parent?.members[i]?.name);
                    if (!replace) {
                        members.unshift(this.schema.parent?.members[i].node);
                    }
                }
            }
        }
        if (!members.length) {
            this.generateEmptyMethods(node);
            return;
        }
        this.addRequiredImports(node.range.source);
        for (const member of members) {
            if (!member.type)
                throwError("Fields must be strongly typed", node.range);
            const type = toString(member.type);
            const name = member.name;
            const value = member.initializer ? toString(member.initializer) : null;
            if (type.startsWith("(") && type.includes("=>"))
                continue;
            const mem = new Property();
            mem.name = name.text;
            mem.type = type;
            mem.value = value;
            mem.node = member;
            mem.byteSize = sizeof(mem.type);
            this.schema.byteSize += mem.byteSize;
            if (member.decorators) {
                for (const decorator of member.decorators) {
                    const decoratorName = decorator.name.text.toLowerCase().trim();
                    switch (decoratorName) {
                        case "alias": {
                            const arg = decorator.args[0];
                            if (!arg || arg.kind != 16)
                                throwError("@alias must have an argument of type string or number", member.range);
                            mem.alias = arg.value.toString();
                            break;
                        }
                        case "omitif": {
                            let arg = decorator.args[0];
                            if (!decorator.args?.length)
                                throwError("@omitif must have an argument or callback that resolves to type bool", member.range);
                            mem.flags.set(PropertyFlags.OmitIf, arg);
                            this.schema.static = false;
                            break;
                        }
                        case "omitnull": {
                            if (isPrimitive(type)) {
                                throwError("@omitnull cannot be used on primitive types!", member.range);
                            }
                            else if (!member.type.isNullable) {
                                throwError("@omitnull cannot be used on non-nullable types!", member.range);
                            }
                            mem.flags.set(PropertyFlags.OmitNull, null);
                            this.schema.static = false;
                            break;
                        }
                    }
                }
            }
            this.schema.members.push(mem);
        }
        if (!this.schema.static)
            this.schema.members = sortMembers(this.schema.members);
        let SERIALIZE = "__FASS_SERIALIZE(input: usize, output: usize): void {\n";
        let INITIALIZE = "@inline __INITIALIZE(): this {\n";
        let SIZE = "@inline __FASS_SIZE(): i32 {\n  return ";
        let DESERIALIZE = "__FASS_DESERIALIZE(input: usize, output: usize): void {\n";
        indent = "  ";
        let boolBytes = 0;
        this.schema.members = this.schema.members
            .slice()
            .sort((a, b) => {
            const rank = (member) => {
                if (isBoolean(member.type)) {
                    boolBytes++;
                    return 0;
                }
                else if (isPrimitive(member.type)) {
                    return 1;
                }
                else {
                    return 2;
                }
            };
            return rank(a) - rank(b);
        });
        let offset = 0;
        const generate = (schema, n = 0, path = []) => {
            const prettyPath = path.join(".");
            for (const member of schema.members) {
                const memberName = member.alias || member.name;
                const prettyName = n == 0 ? memberName : prettyPath + "." + memberName;
                const structRef = n == 0 ? ["input", "output"] : ["s" + n, "s" + n];
                if (isBoolean(member.type)) {
                    if (boolBytes == 1) {
                        SIZE += member.byteSize + " + ";
                        SERIALIZE += `${indent}store<u8>(output, load<u8>(${structRef[0]}, ${offset}), ${offset});  // ${prettyName}\n`;
                        DESERIALIZE += `${indent}store<u8>(${structRef[1]}, load<u8>(input, ${offset}), ${offset});  // ${prettyName}\n`;
                        offset += member.byteSize;
                    }
                    else {
                        SERIALIZE += `${indent}store<u8>(output, load<u8>(${structRef[0]}, ${offset}), ${offset});  // ${prettyName}\n`;
                        DESERIALIZE += `${indent}store<u8>(${structRef[1]}, load<u8>(input, ${offset}), ${offset});  // ${prettyName}\n`;
                    }
                }
                else if (isPrimitive(member.type)) {
                    SIZE += member.byteSize + " + ";
                    SERIALIZE += `${indent}store<${member.type}>(output, load<${member.type}>(${structRef[0]}, ${offset}), ${offset});  // ${prettyName}\n`;
                    DESERIALIZE += `${indent}store<${member.type}>(${structRef[1]}, load<${member.type}>(input, ${offset}), ${offset});  // ${prettyName}\n`;
                    offset += member.byteSize;
                }
                else if (member.type == "Direction") {
                    console.log("Struct: " + member.type);
                    const struct = this.schemas.find((v) => v.name == member.type);
                    n++;
                    SERIALIZE += `${indent}const s${n} = load<usize>(${structRef[0]}, offsetof<${schema.name}>("${member.name}"));\n`;
                    DESERIALIZE += `${indent}const s${n} = load<usize>(${structRef[1]}, offsetof<${schema.name}>("${member.name}"));\n`;
                    path.push(member.name);
                    generate(struct, n, path);
                    path.pop();
                }
            }
        };
        generate(this.schema, 0);
        indentDec();
        DESERIALIZE += `${indent}}\n`;
        SERIALIZE += `${indent}}\n`;
        SIZE = SIZE.slice(0, SIZE.length - 3) + `;\n${indent}}\n`;
        if (process.env["DEBUG"]) {
            console.log(SERIALIZE);
            console.log(SIZE);
            console.log(DESERIALIZE);
        }
        const SERIALIZE_METHOD = SimpleParser.parseClassMember(SERIALIZE, node);
        const SIZE_METHOD = SimpleParser.parseClassMember(SIZE, node);
        const DESERIALIZE_METHOD = SimpleParser.parseClassMember(DESERIALIZE, node);
        if (!node.members.find((v) => v.name.text == "__FASS_SERIALIZE"))
            node.members.push(SERIALIZE_METHOD);
        if (!node.members.find((v) => v.name.text == "__FASS_SIZE"))
            node.members.push(SIZE_METHOD);
        if (!node.members.find((v) => v.name.text == "__FASS_DESERIALIZE"))
            node.members.push(DESERIALIZE_METHOD);
        super.visitClassDeclaration(node);
    }
    generateEmptyMethods(node) {
        let SERIALIZE_EMPTY = "__FASS_SERIALIZE(input: usize, output: usize): void {}";
        let INITIALIZE_EMPTY = "@inline __INITIALIZE(): this {\n  return this;\n}";
        let SIZE_EMPTY = "@inline __FASS_SIZE(): i32 {\n  return 0;\n}";
        let DESERIALIZE_EMPTY = "__FASS_DESERIALIZE(input: usize, output: usize): void {}";
        if (process.env["DEBUG"]) {
            console.log(SERIALIZE_EMPTY);
            console.log(SIZE_EMPTY);
            console.log(INITIALIZE_EMPTY);
            console.log(DESERIALIZE_EMPTY);
        }
        const SERIALIZE_METHOD_EMPTY = SimpleParser.parseClassMember(SERIALIZE_EMPTY, node);
        const INITIALIZE_METHOD_EMPTY = SimpleParser.parseClassMember(INITIALIZE_EMPTY, node);
        const DESERIALIZE_METHOD_EMPTY = SimpleParser.parseClassMember(DESERIALIZE_EMPTY, node);
        if (!node.members.find((v) => v.name.text == "__SERIALIZE"))
            node.members.push(SERIALIZE_METHOD_EMPTY);
        if (!node.members.find((v) => v.name.text == "__INITIALIZE"))
            node.members.push(INITIALIZE_METHOD_EMPTY);
        if (!node.members.find((v) => v.name.text == "__DESERIALIZE"))
            node.members.push(DESERIALIZE_METHOD_EMPTY);
    }
    visitImportStatement(node) {
        super.visitImportStatement(node);
        this.imports.push(node);
    }
    visitSource(node) {
        this.imports = [];
        super.visitSource(node);
    }
    addRequiredImports(node) {
        const filePath = fileURLToPath(import.meta.url);
        const baseDir = path.resolve(filePath, "..", "..", "..");
        const nodePath = path.resolve(this.baseDir, node.range.source.normalizedPath);
        const bsImport = this.imports.find((i) => i.declarations?.find((d) => d.foreignName.text == "bs" || d.name.text == "bs"));
        const jsonImport = this.imports.find((i) => i.declarations?.find((d) => d.foreignName.text == "JSON" || d.name.text == "JSON"));
        let bsPath = path.posix.join(...path.relative(path.dirname(nodePath), path.join(baseDir, "lib", "as-bs")).split(path.sep)).replace(/^.*node_modules\/json-as/, "json-as");
        let jsonPath = path.posix.join(...path.relative(path.dirname(nodePath), path.join(baseDir, "assembly", "index.ts")).split(path.sep)).replace(/^.*node_modules\/json-as/, "json-as");
        if (!bsImport) {
            if (node.normalizedPath.startsWith("~")) {
                bsPath = "json-as/lib/as-bs";
            }
            const replaceNode = Node.createImportStatement([Node.createImportDeclaration(Node.createIdentifierExpression("bs", node.range, false), null, node.range)], Node.createStringLiteralExpression(bsPath, node.range), node.range);
            this.topStatements.push(replaceNode);
            if (process.env["DEBUG"])
                console.log("Added as-bs import: " + toString(replaceNode) + "\n");
        }
        if (!jsonImport) {
            if (node.normalizedPath.startsWith("~")) {
                jsonPath = "json-as/assembly/index.ts";
            }
            const replaceNode = Node.createImportStatement([Node.createImportDeclaration(Node.createIdentifierExpression("JSON", node.range, false), null, node.range)], Node.createStringLiteralExpression(jsonPath, node.range), node.range);
            this.topStatements.push(replaceNode);
            if (process.env["DEBUG"])
                console.log("Added json-as import: " + toString(replaceNode) + "\n");
        }
    }
}
export default class Transformer extends Transform {
    afterParse(parser) {
        const transformer = FASSTransform.SN;
        const sources = parser.sources
            .filter((source) => {
            const p = source.internalPath;
            if (p.startsWith("~lib/rt") || p.startsWith("~lib/performance") || p.startsWith("~lib/wasi_") || p.startsWith("~lib/shared/")) {
                return false;
            }
            return !isStdlib(source);
        })
            .sort((a, b) => {
            if (a.sourceKind >= 2 && b.sourceKind <= 1) {
                return -1;
            }
            else if (a.sourceKind <= 1 && b.sourceKind >= 2) {
                return 1;
            }
            else {
                return 0;
            }
        })
            .sort((a, b) => {
            if (a.sourceKind === 1) {
                return 1;
            }
            else {
                return 0;
            }
        });
        transformer.baseDir = path.join(process.cwd(), this.baseDir);
        transformer.program = this.program;
        transformer.parser = parser;
        for (const source of sources) {
            transformer.imports = [];
            transformer.currentSource = source;
            transformer.visit(source);
            if (transformer.topStatements.length) {
                source.statements.unshift(...transformer.topStatements);
                transformer.topStatements = [];
            }
            if (transformer.simdStatements.length) {
                for (const simd of transformer.simdStatements)
                    source.statements.unshift(SimpleParser.parseTopLevelStatement(simd));
            }
            transformer.simdStatements = [];
        }
        const schemas = transformer.schemas;
        for (const schema of schemas) {
            if (schema.parent) {
                const parent = schemas.find((v) => v.name == schema.parent?.name);
                if (!parent)
                    throwError(`Class ${schema.name} extends its parent class ${schema.parent}, but ${schema.parent} does not include a @json or @serializable decorator!`, schema.parent.node.range);
            }
        }
    }
}
function sortMembers(members) {
    return members.sort((a, b) => {
        const aMove = a.flags.has(PropertyFlags.OmitIf) || a.flags.has(PropertyFlags.OmitNull);
        const bMove = b.flags.has(PropertyFlags.OmitIf) || b.flags.has(PropertyFlags.OmitNull);
        if (aMove && !bMove) {
            return -1;
        }
        else if (!aMove && bMove) {
            return 1;
        }
        else {
            return 0;
        }
    });
}
function toU16(data, offset = 0) {
    return data.charCodeAt(offset + 0).toString();
}
function toU32(data, offset = 0) {
    return ((data.charCodeAt(offset + 1) << 16) | data.charCodeAt(offset + 0)).toString();
}
function toU48(data, offset = 0) {
    return ((BigInt(data.charCodeAt(offset + 2)) << 32n) | (BigInt(data.charCodeAt(offset + 1)) << 16n) | BigInt(data.charCodeAt(offset + 0))).toString();
}
function toU64(data, offset = 0) {
    return ((BigInt(data.charCodeAt(offset + 3)) << 48n) | (BigInt(data.charCodeAt(offset + 2)) << 32n) | (BigInt(data.charCodeAt(offset + 1)) << 16n) | BigInt(data.charCodeAt(offset + 0))).toString();
}
function toMemCDecl(n, indent) {
    let out = "";
    let offset = 0;
    let index = 0;
    while (n >= 8) {
        out += `${indent}const code${index++} = load<u64>(keyStart, ${offset});\n`;
        offset += 8;
        n -= 8;
    }
    while (n >= 4) {
        out += `${indent}const code${index++} = load<u32>(keyStart, ${offset});\n`;
        offset += 4;
        n -= 4;
    }
    if (n == 1)
        out += `${indent}const code${index++} = load<u16>(keyStart, ${offset});\n`;
    return out;
}
function toMemCCheck(data) {
    let n = data.length << 1;
    let out = "";
    let offset = 0;
    let index = 0;
    while (n >= 8) {
        out += ` && code${index++} == ${toU64(data, offset >> 1)}`;
        offset += 8;
        n -= 8;
    }
    while (n >= 4) {
        out += ` && code${index++} == ${toU32(data, offset >> 1)}`;
        offset += 4;
        n -= 4;
    }
    if (n == 1)
        out += ` && code${index++} == ${toU16(data, offset >> 1)}`;
    return out.slice(4);
}
function strToNum(data, simd = false, offset = 0) {
    const out = [];
    let n = data.length;
    while (n >= 8 && simd) {
        out.push(["v128", "i16x8(" + data.charCodeAt(offset + 0) + ", " + data.charCodeAt(offset + 1) + ", " + data.charCodeAt(offset + 2) + ", " + data.charCodeAt(offset + 3) + ", " + data.charCodeAt(offset + 4) + ", " + data.charCodeAt(offset + 5) + ", " + data.charCodeAt(offset + 6) + ", " + data.charCodeAt(offset + 7) + ")"]);
        offset += 8;
        n -= 8;
    }
    while (n >= 4) {
        const value = (BigInt(data.charCodeAt(offset + 3)) << 48n) | (BigInt(data.charCodeAt(offset + 2)) << 32n) | (BigInt(data.charCodeAt(offset + 1)) << 16n) | BigInt(data.charCodeAt(offset + 0));
        out.push(["u64", value.toString()]);
        offset += 4;
        n -= 4;
    }
    while (n >= 2) {
        const value = (data.charCodeAt(offset + 1) << 16) | data.charCodeAt(offset + 0);
        out.push(["u32", value.toString()]);
        offset += 2;
        n -= 2;
    }
    if (n === 1) {
        const value = data.charCodeAt(offset + 0);
        out.push(["u16", value.toString()]);
    }
    return out;
}
function isPrimitive(type) {
    const primitiveTypes = ["u8", "u16", "u32", "u64", "i8", "i16", "i32", "i64", "f32", "f64", "bool", "boolean"];
    return primitiveTypes.some((v) => type.startsWith(v));
}
function isBoolean(type) {
    return type == "bool" || type == "boolean";
}
function isStruct(type) {
    return FASSTransform.SN.schemas.some((v) => v.name == type);
}
function throwError(message, range) {
    const err = new Error();
    err.stack = `${message}\n  at ${range.source.normalizedPath}:${range.source.lineAt(range.start)}:${range.source.columnAt()}\n`;
    throw err;
}
function indentInc() {
    indent += "  ";
}
function indentDec() {
    indent = indent.slice(0, Math.max(0, indent.length - 2));
}
function sizeof(type) {
    if (type == "u8")
        return 1;
    else if (type == "i8")
        return 1;
    else if (type == "u16")
        return 2;
    else if (type == "i16")
        return 2;
    else if (type == "u32")
        return 4;
    else if (type == "i32")
        return 4;
    else if (type == "u64")
        return 8;
    else if (type == "i64")
        return 8;
    else if (type == "f32")
        return 4;
    else if (type == "f64")
        return 8;
    else if (type == "bool" || type == "boolean")
        return 1;
    else
        return 0;
}
//# sourceMappingURL=index.js.map