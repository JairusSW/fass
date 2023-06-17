import {
  CommentStatement,
  EnumDeclaration,
  IncludeDeclaration,
  MemberStatement,
  StructDeclaration,
} from "../../parser/nodes";
import { Source } from "../../parser/source";
import { sizeOfType } from "../util";

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
  f64 = 8,
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
        this.text += this.generateIncludeDecl(decl) + "\n";
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
      if (name && this.source.usedTypes.find((v) => v.type == name))
        imports.push(name);
    }
    return `import { ${imports.join(", ")} } from "./${decl.predicate
      .slice(1)
      .replace(".fass", "")};`;
  }
  generateStructMember(
    member: MemberStatement,
    accessors: string[],
    offset: number,
    shift: string = ""
  ): {
    serialize: string[];
    deserialize: string[];
    offset: number;
    shift: string;
  } {
    const type = member.type;
    const typeText = member.type.text;
    const name = member.name.value;

    const accessor = accessors.length ? accessors.join(".") + "." + name : name;
    const scopeElement = this.source.scope.getElement(
      undefined,
      member.type.text
    );

    let serialize: string[] = [];
    let deserialize: string[] = [];

    if (!scopeElement) {
      if (typeText === "bool") {
        serialize = [
          `output.setUint8(${offset}${shift}, Number(input.${accessor}));`,
        ];
        deserialize = [
          `output.${accessor} = Boolean(input.getUint8(${offset}${shift}));`,
        ];
        offset += 1;
        return { serialize, deserialize, offset, shift };
      } else if (typeText === "u8" || typeText == "char") {
        serialize = [
          `output.setUint8(${offset}${shift}, input.${accessor});`,
        ];
        deserialize = [
          `output.${accessor} = input.getUint8(${offset}${shift});`,
        ];
        offset += 1;
        return { serialize, deserialize, offset, shift };
      } else if (typeText === "i8") {
        serialize = [
          `output.setInt8(${offset}${shift}, input.${accessor});`,
        ];
        deserialize = [
          `output.${accessor} = input.getInt8(${offset}${shift});`,
        ];
        offset += 1;
        return { serialize, deserialize, offset, shift };
      } else if (typeText === "u16") {
        serialize = [
          `output.setUint16(${offset}${shift}, input.${accessor}, true);`,
        ];
        deserialize = [
          `output.${accessor} = input.getUint16(${offset}${shift}, true);`,
        ];
        offset += 2;
        return { serialize, deserialize, offset, shift };
      } else if (typeText === "i16") {
        serialize = [
          `output.setInt16(${offset}${shift}, input.${accessor}, true);`,
        ];
        deserialize = [
          `output.${accessor} = input.getInt16(${offset}${shift}, true);`,
        ];
        offset += 2;
        return { serialize, deserialize, offset, shift };
      } else if (typeText === "u32") {
        serialize = [
          `output.setUint32(${offset}${shift}, input.${accessor}, true);`,
        ];
        deserialize = [
          `output.${accessor} = input.getUint32(${offset}${shift}, true);`,
        ];
        offset += 4;
        return { serialize, deserialize, offset, shift };
      } else if (typeText === "i32") {
        serialize = [
          `output.setInt32(${offset}${shift}, input.${accessor}, true);`,
        ];
        deserialize = [
          `output.${accessor} = input.getInt32(${offset}${shift}, true);`,
        ];
        offset += 4;
        return { serialize, deserialize, offset, shift };
      } else if (typeText === "u64") {
        serialize = [
          `output.setBigUint64(${offset}${shift}, input.${accessor}, true);`,
        ];
        deserialize = [
          `output.${accessor} = input.getBigUint64(${offset}${shift}, true);`,
        ];
        offset += 8;
        return { serialize, deserialize, offset, shift };
      } else if (typeText === "i64") {
        serialize = [
          `output.setBigInt64(${offset}${shift}, input.${accessor}, true);`,
        ];
        deserialize = [
          `output.${accessor} = input.getBigInt64(${offset}${shift}, true);`,
        ];
        offset += 8;
        return { serialize, deserialize, offset, shift };
      }
      // FLOAT
      else if (typeText === "f32") {
        serialize = [
          `output.setFloat32(${offset}${shift}, input.${accessor}, true);`,
        ];
        deserialize = [
          `output.${accessor} = input.getFloat32(${offset}${shift}, true);`,
        ];
        offset += 4;
        return { serialize, deserialize, offset, shift };
      } else if (typeText === "f64") {
        serialize = [
          `output.setFloat64(${offset}${shift}, input.${accessor}, true);`,
        ];
        deserialize = [
          `output.${accessor} = input.getFloat64(${offset}${shift}, true);`,
        ];
        offset += 8;
        return { serialize, deserialize, offset, shift };
      }

      if (type.isComplex) {
        // We have either a static or dynamic sequence.
        if (type.args.length && !type.less) {
          // We have a set-length string
          if (type.type == "char") {
            serialize = [
              `String.UTF8.encodeUnsafe(changetype<usize>(input.${accessor}), ${type.args}, changetype<usize>(output) + <usize>${offset}${shift});`,
            ];
            deserialize = [
              `output.${accessor} = String.UTF8.decodeUnsafe(changetype<usize>(input) + <usize>${offset}${shift}, ${type.args});`,
            ];
            offset += parseInt(type.args);
            return { serialize, deserialize, offset, shift };
          } else if (type.type === "u8") {
            // Set length arrays
            let length = parseInt(type.args);
            if (length === 4) {
              serialize = [
                `store<u32>(changetype<usize>(output), load<u32>(changetype<usize>(input.${accessor})), ${offset}${shift});`,
              ];
              deserialize = [
                `store<u32>(changetype<usize>(output.${accessor}), load<u32>(changetype<usize>(input), ${offset}${shift}));`,
              ];
              offset += length;
              return { serialize, deserialize, offset, shift };
            }
          }
        } else {
          if (type.type == "char") {
            serialize = [
              `store<u16>(changetype<usize>(output), input.${accessor}.length, ${offset}${shift});`,
              `String.UTF8.encodeUnsafe(changetype<usize>(input.${accessor}), input.${accessor}.length, changetype<usize>(output) + <usize>${offset}${shift});`,
            ];
            deserialize = [
              `output.${accessor} = String.UTF8.decodeUnsafe(changetype<usize>(input) + <usize>${offset}${shift}, load<u16>(changetype<usize>(input), ${offset}${shift}));`,
            ];
            offset += 2;
            shift += ` + <usize>input.${accessor}.length`;
            return { serialize, deserialize, offset, shift };
          } else {
            // Handle normal arrays here
          }
        }
      }
    } else {
      if (
        scopeElement.node instanceof EnumDeclaration &&
        scopeElement.name == typeText
      ) {
        serialize = [
          `store<u${
            sizeOfType(scopeElement.node.storageType) * 8
          }>(changetype<usize>(output), input.${accessor}, ${offset}${shift});`,
        ];
        deserialize = [
          `output.${accessor} = load<u${
            sizeOfType(scopeElement.node.storageType) * 8
          }>(changetype<usize>(input), ${offset}${shift});`,
        ];
        offset += sizeOfType(scopeElement.node.storageType);
        return { serialize, deserialize, offset, shift };
      } else if (
        scopeElement.node instanceof StructDeclaration &&
        scopeElement.name == typeText
      ) {
        for (const memberStmt of scopeElement.node.members) {
          const oldOffset = offset;
          const generated = this.generateStructMember(
            memberStmt,
            [accessor],
            offset
          );
          serialize.push(...generated.serialize);
          deserialize.push(...generated.deserialize);
          offset += generated.offset - oldOffset;
        }
        return { serialize, deserialize, offset, shift };
      }
    }
    return {
      serialize: [],
      deserialize: [],
      offset: offset,
      shift: shift
    };
  }
  generateStaticStruct(decl: StructDeclaration): string {
    let txt = `export class ${decl.name.value} {`;
    let constr = `\n    constructor(`;
    let type: string | null;
    for (const {
      name: { value },
      type: ty,
    } of decl.members) {
      type = null;
      const key = value;
      if (ty.isComplex) {
        if (ty.type == "char") {
          type = "string";
        } else if (ty.type == "u8" && ty.args?.length) {
          type = `Array<${typeToTS(ty.type)}>`;
        }
      }
      if (!type) type = typeToTS(ty.text);
      txt += `\n    public ${key}: ${type};`;
      constr += `${key}: ${type}, `;
    }

    constr =
      constr.slice(0, constr.length - 2) +
      `) {${decl.members
        .map((v) => `\n        this.${v.name.value} = ${v.name.value};`)
        .join("")}\n    }`;
    txt += constr;

    let serialize = [
      `static __FASS_SERIALIZE(output: DataView, input: ${decl.name.value}): void {`,
    ];
    let deserialize = [
      `static __FASS_DESERIALIZE(input: DataView, output: ${decl.name.value}): void {`,
    ];
    const generatedMembers: {
      serialize: string[];
      deserialize: string[];
      offset: number;
    }[] = [];

    // DETECT STATIC STRUCT
    let sizeText = `static __FASS_SIZE: number = `;

    // This is used to count optimizations until like 2 32 bits can be 64.
    let size = 0;

    let shift = "";

    let offset = 0;
    // STAGE: Import and cache
    let members = decl.members;
    for (let i = 0; i < decl.members.length; i++) {
      const member = members[i];
      const oldOffset = offset;
      const generated = this.generateStructMember(member, [], oldOffset, shift);
      shift = generated.shift.replace("<usize>input", "this!");
      
      if (!member.type.isComplex) {
        size += generated.offset - oldOffset;
        if (size == 8) {
        }
      } else {
        size = 0;
      }

      generatedMembers.push(generated);

      serialize.push(...generated.serialize);
      deserialize.push(...generated.deserialize);
      offset += generated.offset - oldOffset;
    }

    txt += "\n    " + (sizeText += offset + shift + ";");

    txt += "\n    " + serialize[0];
    for (let i = 1; i < serialize.length; i++) {
      const serializeText = serialize[i];
      txt += "\n        " + serializeText;
    }
    txt += "\n    }";

    txt += "\n    " + deserialize[0];
    for (let i = 1; i < deserialize.length; i++) {
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
      txt += `\n    ${member.name.value}${
        member.value ? ` = ${member.value.value}` : ""
      },`;
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

function typeToTS(type: string): string {
  switch (type) {
    case "u8":
    case "i8":
    case "u16":
    case "i16":
    case "u32":
    case "i32":
    case "f32":
    case "f64": {
      return "number";
    }
    case "u64":
    case "i64": {
      return "bigint";
    }
    case "bool": {
      return "boolean";
    }
  }

  if (type.includes("[") && type.endsWith("]")) {
    const startIndex = type.indexOf("[");
    //const innerType = type.slice(startIndex, type.length - 1);
    let outerType = type.slice(0, startIndex);
    if (outerType == "char") {
      return "string";
    }
    outerType = typeToTS(outerType);
    return `Array<${outerType}>`;
  }

  return type;
}