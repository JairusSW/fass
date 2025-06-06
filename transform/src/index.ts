import { ClassDeclaration, FieldDeclaration, IdentifierExpression, Parser, Source, NodeKind, CommonFlags, ImportStatement, Node, Tokenizer, SourceKind, NamedTypeNode, Range, FEATURE_SIMD, FunctionExpression, MethodDeclaration, Statement, Program, Feature, IntegerLiteralExpression } from "assemblyscript/dist/assemblyscript.js";
import { Transform } from "assemblyscript/dist/transform.js";
import { Visitor } from "./visitor.js";
import { isStdlib, SimpleParser, toString } from "./util.js";
import * as path from "path";
import { fileURLToPath } from "url";
import { Property, PropertyFlags, Schema } from "./types.js";
import { getClasses, getImportedClass } from "./linker.js";

let indent = "  ";
class FASSTransform extends Visitor {
  static SN: FASSTransform = new FASSTransform();

  public program!: Program;
  public baseDir!: string;
  public parser!: Parser;
  public schemas: Schema[] = [];
  public schema!: Schema;
  public sources = new Set<Source>();
  public imports: ImportStatement[] = [];

  public topStatements: Statement[] = [];
  public simdStatements: string[] = [];

  visitClassDeclaration(node: ClassDeclaration): void {
    if (!node.decorators?.length) return;

    if (
      !node.decorators.some((decorator) => {
        const name = (<IdentifierExpression>decorator.name).text;
        return name == "fass";
      })
    )
      return;

    this.schema = new Schema();
    this.schema.node = node;
    this.schema.name = node.name.text;

    this.schemas.push(this.schema);
    if (process.env["DEBUG"]) console.log("Created schema: " + this.schema.name + " in file " + node.range.source.normalizedPath);

    const members: FieldDeclaration[] = [...(node.members.filter((v) => v.kind === NodeKind.FieldDeclaration && v.flags !== CommonFlags.Static && v.flags !== CommonFlags.Private && v.flags !== CommonFlags.Protected && !v.decorators?.some((decorator) => (<IdentifierExpression>decorator.name).text === "omit")) as FieldDeclaration[])];
    // const serializers: MethodDeclaration[] = [...node.members.filter((v) => v.kind === NodeKind.MethodDeclaration && v.decorators && v.decorators.some((e) => (<IdentifierExpression>e.name).text.toLowerCase() === "serializer"))] as MethodDeclaration[];
    // const deserializers: MethodDeclaration[] = [...node.members.filter((v) => v.kind === NodeKind.MethodDeclaration && v.decorators && v.decorators.some((e) => (<IdentifierExpression>e.name).text.toLowerCase() === "deserializer"))] as MethodDeclaration[];

    // if (serializers.length > 1) throwError("Multiple serializers detected for class " + node.name.text + " but schemas can only have one serializer!", serializers[1].range);
    // if (deserializers.length > 1) throwError("Multiple deserializers detected for class " + node.name.text + " but schemas can only have one deserializer!", deserializers[1].range);

    // if (serializers.length) {
    //   const serializer = serializers[0];
    //   // if (!serializer.signature.parameters.length) throwError("Could not find any parameters in custom serializer for " + this.schema.name + ". Serializers must have one parameter like 'serializer(self: " + this.schema.name + "): string {}'", serializer.range);
    //   if (serializer.signature.parameters.length > 1) throwError("Found too many parameters in custom serializer for " + this.schema.name + ", but serializers can only accept one parameter of type '" + this.schema.name + "'!", serializer.signature.parameters[1].range);
    //   if (serializer.signature.parameters.length > 0 && (<NamedTypeNode>serializer.signature.parameters[0].type).name.identifier.text != node.name.text && (<NamedTypeNode>serializer.signature.parameters[0].type).name.identifier.text != "this") throwError("Type of parameter for custom serializer does not match! It should be 'string'either be 'this' or '" + this.schema.name + "'", serializer.signature.parameters[0].type.range);
    //   if (!serializer.signature.returnType || !(<NamedTypeNode>serializer.signature.returnType).name.identifier.text.includes("string")) throwError("Could not find valid return type for serializer in " + this.schema.name + "!. Set the return type to type 'string' and try again", serializer.signature.returnType.range);

    //   if (!serializer.decorators.some((v) => (<IdentifierExpression>v.name).text == "inline")) {
    //     serializer.decorators.push(Node.createDecorator(Node.createIdentifierExpression("inline", serializer.range), null, serializer.range));
    //   }
    //   let SERIALIZER = "";
    //   SERIALIZER += "  __SERIALIZE_CUSTOM(): void {\n";
    //   SERIALIZER += "    const data = this." + serializer.name.text + "(" + (serializer.signature.parameters.length ? "this" : "") + ");\n";
    //   SERIALIZER += "    const dataSize = data.length << 1;\n";
    //   SERIALIZER += "    memory.copy(bs.offset, changetype<usize>(data), dataSize);\n";
    //   SERIALIZER += "    bs.offset += dataSize;\n";
    //   SERIALIZER += "  }\n";

    //   if (process.env["DEBUG"]) console.log(SERIALIZER);

    //   const SERIALIZER_METHOD = SimpleParser.parseClassMember(SERIALIZER, node);

    //   if (!node.members.find((v) => v.name.text == "__SERIALIZE_CUSTOM")) node.members.push(SERIALIZER_METHOD);
    // }

    // if (deserializers.length) {
    //   const deserializer = deserializers[0];
    //   if (!deserializer.signature.parameters.length) throwError("Could not find any parameters in custom deserializer for " + this.schema.name + ". Deserializers must have one parameter like 'deserializer(data: string): " + this.schema.name + " {}'", deserializer.range);
    //   if (deserializer.signature.parameters.length > 1) throwError("Found too many parameters in custom deserializer for " + this.schema.name + ", but deserializers can only accept one parameter of type 'string'!", deserializer.signature.parameters[1].range);
    //   if ((<NamedTypeNode>deserializer.signature.parameters[0].type).name.identifier.text != "string") throwError("Type of parameter for custom deserializer does not match! It must be 'string'", deserializer.signature.parameters[0].type.range);
    //   if (!deserializer.signature.returnType || !((<NamedTypeNode>deserializer.signature.returnType).name.identifier.text.includes(this.schema.name) || (<NamedTypeNode>deserializer.signature.returnType).name.identifier.text.includes("this"))) throwError("Could not find valid return type for deserializer in " + this.schema.name + "!. Set the return type to type '" + this.schema.name + "' or 'this' and try again", deserializer.signature.returnType.range);

    //   if (!deserializer.decorators.some((v) => (<IdentifierExpression>v.name).text == "inline")) {
    //     deserializer.decorators.push(Node.createDecorator(Node.createIdentifierExpression("inline", deserializer.range), null, deserializer.range));
    //   }
    //   let DESERIALIZER = "";
    //   DESERIALIZER += "  __DESERIALIZE_CUSTOM(data: string): this {\n";
    //   DESERIALIZER += "    return this." + deserializer.name.text + "(data);\n";
    //   DESERIALIZER += "  }\n";

    //   if (process.env["DEBUG"]) console.log(DESERIALIZER);

    //   const DESERIALIZER_METHOD = SimpleParser.parseClassMember(DESERIALIZER, node);

    //   if (!node.members.find((v) => v.name.text == "__DESERIALIZE_CUSTOM")) node.members.push(DESERIALIZER_METHOD);
    // }

    if (node.extendsType) {
      const extendsName = node.extendsType?.name.identifier.text;
      this.schema.parent = this.schemas.find((v) => v.name == extendsName) as Schema | null;
      if (!this.schema.parent) {
        const internalSearch = getClasses(node.range.source).find((v) => v.name.text == extendsName);
        if (internalSearch) {
          if (process.env["DEBUG"]) console.log("Found " + extendsName + " internally");
          this.visitClassDeclaration(internalSearch);
          this.visitClassDeclaration(node);
          return;
        }

        const externalSearch = getImportedClass(extendsName, node.range.source, this.parser);
        if (externalSearch) {
          if (process.env["DEBUG"]) console.log("Found " + extendsName + " externally");
          this.visitClassDeclaration(externalSearch);
          this.visitClassDeclaration(node);
          return;
        }
      }
      if (this.schema.parent?.members) {
        for (let i = this.schema.parent.members.length - 1; i >= 0; i--) {
          const replace = this.schema.members.find((v) => v.name == this.schema.parent?.members[i]?.name);
          if (!replace) {
            members.unshift(this.schema.parent?.members[i]!.node);
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
      if (!member.type) throwError("Fields must be strongly typed", node.range);
      const type = toString(member.type!);
      const name = member.name;
      const value = member.initializer ? toString(member.initializer!) : null;

      // if (!this.isValidType(type, node)) throwError("Invalid Type. " + type + " is not a JSON-compatible type. Either decorate it with @omit, set it to private, or remove it.", member.type.range);

      if (type.startsWith("(") && type.includes("=>")) continue;

      const mem = new Property();
      mem.name = name.text;
      mem.type = type;
      mem.value = value;
      mem.node = member;
      mem.byteSize = sizeof(mem.type);

      this.schema.byteSize += mem.byteSize;

      if (member.decorators) {
        for (const decorator of member.decorators) {
          const decoratorName = (decorator.name as IdentifierExpression).text.toLowerCase().trim();
          switch (decoratorName) {
            case "alias": {
              const arg = decorator.args[0];
              if (!arg || arg.kind != NodeKind.Literal) throwError("@alias must have an argument of type string or number", member.range);
              // @ts-ignore: exists
              mem.alias = arg.value.toString();
              break;
            }
            case "omitif": {
              let arg = decorator.args[0];
              if (!decorator.args?.length) throwError("@omitif must have an argument or callback that resolves to type bool", member.range);
              mem.flags.set(PropertyFlags.OmitIf, arg);
              this.schema.static = false;
              break;
            }
            case "omitnull": {
              if (isPrimitive(type)) {
                throwError("@omitnull cannot be used on primitive types!", member.range);
              } else if (!member.type.isNullable) {
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

    if (!this.schema.static) this.schema.members = sortMembers(this.schema.members);

    let SERIALIZE = "__FASS_SERIALIZE(input: usize, output: usize): void {\n";
    let INITIALIZE = "@inline __FASS_INITIALIZE(): this {\n";
    let SIZE = "@inline __FASS_SIZE(): i32 {\n  return ";
    let DESERIALIZE = "__FASS_DESERIALIZE(input: usize, output: usize): void {\n";

    let offsets: (number | string)[] = [];

    indent = "  ";

    this.schema.members = this.schema.members
      .slice()
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      })
      .sort((a, b) => {
        const rank = (member: Property) => {
          if (isBoolean(member.type)) {
            return 0;
          } else if (isPrimitive(member.type)) {
            return 1;
          } else if (isStruct(member.type)) {
            const struct = this.schema.name == stripNull(member.type) ? this.schema : this.schemas.find((v) => v.name == member.type);
            return 4 - 2 * Number(struct.static);
          } else if (member.node.decorators?.some((v) => (v.name as IdentifierExpression).text == "bytes")) {
            return 3;
          } else {
            return 4;
          }
        };

        return rank(a) - rank(b);
      });

    let offset = 0;

    const nc = new Map<string, number>();

    nc.set("struct", -1); // Struct index
    nc.set("temp", -1); // Temporary variable index 
    nc.set("offset", -1); // Offset variable index

    const generate = (schema: Schema, path: string[] = []) => {
      const prettyPath = path.join(".");

      for (const member of schema.members) {
        const memberName = member.alias || member.name;
        const prettyName = prettyPath ? prettyPath + "." + memberName : memberName;
        if (member.value) {
          INITIALIZE += `  store<${member.type}>(changetype<usize>(this), ${member.value}, offsetof<${schema.name}>("${member.name}"));  // ${prettyName}\n`;
        } else if (isStruct(member.type)) {
          INITIALIZE += `  store<nonnull<${member.type}>>(changetype<usize>(this), changetype<nonnull<${member.type}>>(__new(offsetof<nonnull<${member.type}>>(), idof<nonnull<${member.type}>>())), offsetof<${schema.name}>("${member.name}"));  // ${prettyName}\n`;
        } else if (member.type.startsWith("Map<")) {
          INITIALIZE += `  store<nonnull<${member.type}>>(changetype<usize>(this), new ${member.type}(), offsetof<${schema.name}>("${member.name}"));  // ${prettyName}\n`;
        } else if (member.type.startsWith("StaticArray<") || member.type.startsWith("Array<")) {
          let bodyBytes = 0;
          const hasSize = member.node.decorators ? member.node.decorators.some((v) => {
            if ((v.name as IdentifierExpression).text == "bytes") {
              bodyBytes = parseInt(i64_to_string((v.args[0] as IntegerLiteralExpression).value));
              return true;
            }
            return false;
          }) : false;

          const getSize = (type: string) => {
            if (type.startsWith("Array<")) {
              return getSize(type.slice(6, type.length - 1));
            } else if (type.startsWith("StaticArray<")) {
              return getSize(type.slice(12, type.length - 1));
            } else {
              return sizeof(type);
            }
          }

          INITIALIZE += `  store<nonnull<${member.type}>>(changetype<usize>(this), new ${member.type}(${bodyBytes ? bodyBytes / getSize(member.type) : 0}), offsetof<${schema.name}>("${member.name}"));  // ${prettyName}\n`;
        } else if (isString(member.type)) {
          INITIALIZE += `  store<nonnull<${member.type}>>(changetype<usize>(this), changetype<string>(__new(0, idof<string>())), offsetof<${schema.name}>("${member.name}"));  // ${prettyName}\n`;
        }
      }

      let boolSize = schema.members
        .map((v, i) => (isBoolean(v.type) ? i : -1))
        .reduceRight((acc, curr) => (curr !== -1 && acc === -1 ? curr + 1 : acc), -1);

      let i = 0;
      if (boolSize > 0) {
        for (; i < schema.members.length; i++) {
          const member = schema.members[i];
          if (!isBoolean(member.type)) break;
          const structRef = prettyPath ? ["s" + Math.max(0, nc.get("struct")), "s" + Math.max(0, nc.get("struct"))] : ["input", "output"];

          const getBoolStmts = (n: number) => {
            const tmpName = "b" + (n < 8 ? 8 : n);
            for (let j = 0; j < n; j++, i++) {
              const mem = schema.members[i];
              const prettyName = prettyPath ? `${prettyPath}.${mem.name}` : mem.name;
              const isLast = j === n - 1;
              SERIALIZE += `    ((load<u8>(${structRef[0]}, offsetof<${schema.name}>(${JSON.stringify(mem.name)})) & 1) << ${i})${isLast ? '' : ' |'}  // ${prettyName}\n`;
              DESERIALIZE += `  store<u8>(${structRef[1]}, (${tmpName} >> ${i}) & 1, offsetof<${schema.name}>("${member.name}"));  // ${prettyName}\n`;
            }
          }

          let first = "let ";
          while (boolSize >= 64) {
            DESERIALIZE += `  ${first}b64 = load<u64>(input, ${offset});\n`;
            SERIALIZE += `  store<u16>(output,\n`;
            getBoolStmts(64);
            SERIALIZE += `  , ${offset});\n`;
            offsets.push(64);
            boolSize -= 64;
            offset += 8;
          }
          if (boolSize >= 32) {
            DESERIALIZE += `  let b32 = load<u32>(input, ${offset});\n`;
            SERIALIZE += `  store<u16>(output,\n`;
            getBoolStmts(32);
            SERIALIZE += `  , ${offset});\n`;
            offsets.push(32);
            boolSize -= 32;
            offset += 4;
          }
          if (boolSize >= 16) {
            DESERIALIZE += `  let b16 = load<u16>(input, ${offset});\n`;
            SERIALIZE += `  store<u16>(output,\n`;
            getBoolStmts(16);
            SERIALIZE += `  , ${offset});\n`;
            offsets.push(16);
            boolSize -= 16;
            offset += 2;
          }
          if (boolSize >= 8) {
            DESERIALIZE += `  let b8 = load<u8>(input, ${offset});\n`;
            SERIALIZE += `  store<u8>(output,\n`;
            getBoolStmts(8);
            SERIALIZE += `  , ${offset});\n`;
            offsets.push(8);
            boolSize -= 8;
            offset += 1;
            first = "";
          }
          if (boolSize > 0) {
            DESERIALIZE += `  ${first}b8 = load<u8>(input, ${offset});\n`;
            SERIALIZE += `  store<u8>(output,\n`;
            getBoolStmts(boolSize);
            SERIALIZE += `  , ${offset});\n`;
            offsets.push(8);
            offset += 1;
          }
        }
      }

      for (; i < schema.members.length; i++) {
        const member = schema.members[i];
        const memberName = member.alias || member.name;
        const prettyName = prettyPath ? prettyPath + "." + member.name : member.name;
        const structRef = prettyPath ? ["s" + Math.max(0, nc.get("struct")), "s" + Math.max(0, nc.get("struct"))] : ["input", "output"];
        const memberNullable = member.node.type.isNullable;

        if (isBoolean(member.type)) {
          console.log("bool")
          offsets.push(member.byteSize);
          // SERIALIZE += `  store<u8>(output, load<u8>(${structRef[0]}, offsetof<${schema.name}>("${member.name}")), ${offset});  // ${prettyName}\n`;
          // DESERIALIZE += `  store<u8>(${structRef[1]}, load<u8>(input, ${offset}), offsetof<${schema.name}>("${member.name}"));  // ${prettyName}\n`;
          offset += member.byteSize;
        } else if (isPrimitive(member.type)) {
          console.log("primitive")
          offsets.push(member.byteSize);
          SERIALIZE += `  store<${member.type}>(output, load<${member.type}>(${structRef[0]}, offsetof<${schema.name}>("${member.name}")), ${offset});  // ${prettyName}\n`;
          DESERIALIZE += `  store<${member.type}>(${structRef[1]}, load<${member.type}>(input, ${offset}), offsetof<${schema.name}>("${member.name}"));  // ${prettyName}\n`;
          offset += member.byteSize;
        } else if (isString(member.type)) {
          console.log("string")
          let bodyBytes = 0;
          const hasSize = member.node.decorators ? member.node.decorators.some((v) => {
            if ((v.name as IdentifierExpression).text == "bytes") {
              bodyBytes = 2 * parseInt(i64_to_string((v.args[0] as IntegerLiteralExpression).value));
              return true;
            }
            return false;
          }) : false;

          if (hasSize) {
            member.byteSize = bodyBytes;
            let imOffset = 0;
            offsets.push(bodyBytes);

            while (bodyBytes >= 8) {
              SERIALIZE += `  store<u64>(output, load<u64>(${structRef[0]}, offsetof<${schema.name}>("${member.name}") + ${imOffset}), ${offset}); // ${prettyName}\n`;
              DESERIALIZE += `  store<u64>(${structRef[1]}, load<u64>(input, ${offset}), offsetof<${schema.name}>("${member.name}") + ${imOffset})); // ${prettyName}\n`;
              bodyBytes -= 8;
              imOffset += 8;
              offset += 8;
            }
            if (bodyBytes >= 4) {
              SERIALIZE += `  store<u32>(output, load<u32>(${structRef[0]}, offsetof<${schema.name}>("${member.name}") + ${imOffset}), ${offset}); // ${prettyName}\n`;
              DESERIALIZE += `  store<u32>(${structRef[1]}, load<u32>(input, ${offset}), offsetof<${schema.name}>("${member.name}") + ${imOffset})); // ${prettyName}\n`;
              bodyBytes -= 4;
              imOffset += 4;
              offset += 4;
            }
            if (bodyBytes >= 2) {
              SERIALIZE += `  store<u16>(output, load<u16>(${structRef[0]}, offsetof<${schema.name}>("${member.name}") + ${imOffset}), ${offset}); // ${prettyName}\n`;
              DESERIALIZE += `  store<u16>(${structRef[1]}, load<u16>(input, ${offset}), offsetof<${schema.name}>("${member.name}") + ${imOffset})); // ${prettyName}\n`;
              bodyBytes -= 2;
              imOffset += 2;
              offset += 2;
            }
            if (bodyBytes >= 1) {
              SERIALIZE += `  store<u8>(output, load<u8>(${structRef[0]}, offsetof<${schema.name}>("${member.name}") + ${imOffset}), ${offset}); // ${prettyName}\n`;
              DESERIALIZE += `  store<u8>(${structRef[1]}, load<u8>(input, ${offset}), offsetof<${schema.name}>("${member.name}") + ${imOffset})); // ${prettyName}\n`;
              bodyBytes -= 1;
              imOffset += 1;
              offset += 1;
            }
          } else {
            const prefix = nc.get("temp") == -1 ? "let " : "";

            nc.set("temp", Math.max(0, nc.get("temp")));
            // TODO: Decide if FASS should support 32 bit headers
            SERIALIZE += `  ${prefix}t${nc.get("temp")} = changetype<OBJECT>(load<usize>(${structRef[0]} + offsetof<${schema.name}>("${member.name}")) - TOTAL_OVERHEAD).rtSize;\n`;
            SERIALIZE += `  store<u16>(output, t${nc.get("temp")}, ${offset});\n`
            offset += 2;

            SERIALIZE += `  memory.copy(output + ${offset}, ${structRef[0]} + offsetof<${schema.name}>("${member.name}"), t${nc.get("temp")}); // ${prettyName}\n`;
            DESERIALIZE += `  memory.copy(output + offsetof<${schema.name}>("${member.name}"), ${structRef[0]} + ${offset}, load<u16>(input, ${offset - 2})); // ${prettyName}\n`;
            offsets.push(`changetype<OBJECT>(load<usize>(changetype<usize>(this) + offsetof<${schema.name}>("${member.name}")) - TOTAL_OVERHEAD).rtSize`);
          }
        } else if (isStaticArray(member.type)) {
          {
            console.log("StaticArray")
            let bodyBytes = 0;
            const hasSize = member.node.decorators ? member.node.decorators.some((v) => {
              if ((v.name as IdentifierExpression).text == "bytes") {
                bodyBytes = 2 * parseInt(i64_to_string((v.args[0] as IntegerLiteralExpression).value));
                return true;
              }
              return false;
            }) : false;

            if (hasSize) {
              member.byteSize = bodyBytes;
              let imOffset = 0;
              offsets.push(bodyBytes);

              while (bodyBytes >= 8) {
                SERIALIZE += `  store<u64>(output, load<u64>(${structRef[0]}, offsetof<${schema.name}>("${member.name}") + ${imOffset}), ${offset}); // ${prettyName}\n`;
                DESERIALIZE += `  store<u64>(${structRef[1]}, load<u64>(input, ${offset}), offsetof<${schema.name}>("${member.name}") + ${imOffset})); // ${prettyName}\n`;
                bodyBytes -= 8;
                imOffset += 8;
                offset += 8;
              }
              if (bodyBytes >= 4) {
                SERIALIZE += `  store<u32>(output, load<u32>(${structRef[0]}, offsetof<${schema.name}>("${member.name}") + ${imOffset}), ${offset}); // ${prettyName}\n`;
                DESERIALIZE += `  store<u32>(${structRef[1]}, load<u32>(input, ${offset}), offsetof<${schema.name}>("${member.name}") + ${imOffset})); // ${prettyName}\n`;
                bodyBytes -= 4;
                imOffset += 4;
                offset += 4;
              }
              if (bodyBytes >= 2) {
                SERIALIZE += `  store<u16>(output, load<u16>(${structRef[0]}, offsetof<${schema.name}>("${member.name}") + ${imOffset}), ${offset}); // ${prettyName}\n`;
                DESERIALIZE += `  store<u16>(${structRef[1]}, load<u16>(input, ${offset}), offsetof<${schema.name}>("${member.name}") + ${imOffset})); // ${prettyName}\n`;
                bodyBytes -= 2;
                imOffset += 2;
                offset += 2;
              }
              if (bodyBytes >= 1) {
                SERIALIZE += `  store<u8>(output, load<u8>(${structRef[0]}, offsetof<${schema.name}>("${member.name}") + ${imOffset}), ${offset}); // ${prettyName}\n`;
                DESERIALIZE += `  store<u8>(${structRef[1]}, load<u8>(input, ${offset}), offsetof<${schema.name}>("${member.name}") + ${imOffset})); // ${prettyName}\n`;
                bodyBytes -= 1;
                imOffset += 1;
                offset += 1;
              }
            } else {
              const prefix = nc.get("temp") == -1 ? "let " : "";

              nc.set("temp", Math.max(0, nc.get("temp")));
              // TODO: Decide if FASS should support 32 bit headers
              SERIALIZE += `  ${prefix}t${nc.get("temp")} = changetype<OBJECT>(load<usize>(${structRef[0]} + offsetof<${schema.name}>("${member.name}")) - TOTAL_OVERHEAD).rtSize;\n`;
              SERIALIZE += `  store<u16>(output, t${nc.get("temp")}, ${offset});\n`

              DESERIALIZE += `  ${prefix}t${nc.get("temp")} = load<u16>(input, ${offset});\n`;
              offset += 2;

              SERIALIZE += `  memory.copy(output + ${offset}, ${structRef[0]} + offsetof<${schema.name}>("${member.name}"), t${nc.get("temp")}); // ${prettyName}\n`;
              DESERIALIZE += `  memory.copy(output + offsetof<${schema.name}>("${member.name}"), ${structRef[0]} + ${offset}, t${nc.get("temp")}); // ${prettyName}\n`;

              SERIALIZE += `  output += t${nc.get("temp")};\n`;
              DESERIALIZE += `  input += t${nc.get("temp")};\n`;
              offsets.push(`changetype<OBJECT>(load<usize>(changetype<usize>(this) + offsetof<${schema.name}>("${member.name}")) - TOTAL_OVERHEAD).rtSize`);
            }
          }
        } else {
          console.log("Struct: " + member.type);
          let circular = false;
          const struct = this.schema.name == stripNull(member.type) ? (circular = true, this.schema) : this.schemas.find((v) => v.name == member.type);
          if (!struct.static) this.schema.static = false;
          // this.schema.refs.push(struct);
          // if (!circular) circular = this.schema.refs.some((v) => v.name == stripNull(member.type));
          if (circular) {
            console.log("Circular: " + member.type);
          } else {
            if (!schema.static) {
              nc.set("struct", (nc.get("struct") || 0) + 1);
              SERIALIZE += `  const s${nc.get("struct")} = load<usize>(${structRef[0]}, offsetof<${schema.name}>("${member.name}"));\n`;
              DESERIALIZE += `  const s${nc.get("struct")} = load<usize>(${structRef[1]}, offsetof<${schema.name}>("${member.name}"));\n`;
            } else {
              const prefix = nc.get("struct") == -1 ? "let " : "";

              nc.set("struct", Math.max(0, nc.get("struct")));
              SERIALIZE += `  ${prefix}s${nc.get("struct")} = load<usize>(${structRef[0]}, offsetof<${schema.name}>("${member.name}"));\n`;
              DESERIALIZE += `  ${prefix}s${nc.get("struct")} = load<usize>(${structRef[1]}, offsetof<${schema.name}>("${member.name}"));\n`;
            }
            path.push(member.name);
            generate(struct, path);
            path.pop();
          }
        }
      }
    }

    generate(this.schema);

    indentDec();
    DESERIALIZE += `}\n`; // Close function
    SERIALIZE += `}\n`; // Close function
    SIZE += offsets.join(" + ") + ";\n"
    SIZE += "}\n"; // Close function
    INITIALIZE += `  return this;\n}\n`; // Close function

    if (process.env["DEBUG"]) {
      console.log(SERIALIZE);
      console.log(INITIALIZE);
      console.log(SIZE);
      console.log(DESERIALIZE);
    }

    const SERIALIZE_METHOD = SimpleParser.parseClassMember(SERIALIZE, node);
    const SIZE_METHOD = SimpleParser.parseClassMember(SIZE, node);
    const INITIALIZE_METHOD = SimpleParser.parseClassMember(INITIALIZE, node);
    const DESERIALIZE_METHOD = SimpleParser.parseClassMember(DESERIALIZE, node);

    if (!node.members.find((v) => v.name.text == "__FASS_SERIALIZE")) node.members.push(SERIALIZE_METHOD);
    if (!node.members.find((v) => v.name.text == "__FASS_INITIALIZE")) node.members.push(INITIALIZE_METHOD);
    if (!node.members.find((v) => v.name.text == "__FASS_SIZE")) node.members.push(SIZE_METHOD);
    if (!node.members.find((v) => v.name.text == "__FASS_DESERIALIZE")) node.members.push(DESERIALIZE_METHOD);
    super.visitClassDeclaration(node);
  }
  generateEmptyMethods(node: ClassDeclaration): void {
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

    if (!node.members.find((v) => v.name.text == "__SERIALIZE")) node.members.push(SERIALIZE_METHOD_EMPTY);
    if (!node.members.find((v) => v.name.text == "__INITIALIZE")) node.members.push(INITIALIZE_METHOD_EMPTY);
    if (!node.members.find((v) => v.name.text == "__DESERIALIZE")) node.members.push(DESERIALIZE_METHOD_EMPTY);
  }

  visitImportStatement(node: ImportStatement): void {
    super.visitImportStatement(node);
    this.imports.push(node);
  }
  visitSource(node: Source): void {
    this.imports = [];
    super.visitSource(node);
  }
  addRequiredImports(node: Source): void {
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
      if (process.env["DEBUG"]) console.log("Added as-bs import: " + toString(replaceNode) + "\n");
    }

    if (!jsonImport) {
      if (node.normalizedPath.startsWith("~")) {
        jsonPath = "json-as/assembly/index.ts";
      }
      const replaceNode = Node.createImportStatement(
        [Node.createImportDeclaration(Node.createIdentifierExpression("JSON", node.range, false), null, node.range)],
        Node.createStringLiteralExpression(jsonPath, node.range), // Ensure POSIX-style path for 'assembly'
        node.range,
      );
      this.topStatements.push(replaceNode);
      if (process.env["DEBUG"]) console.log("Added json-as import: " + toString(replaceNode) + "\n");
    }
  }
}

export default class Transformer extends Transform {
  afterParse(parser: Parser): void {
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
        } else if (a.sourceKind <= 1 && b.sourceKind >= 2) {
          return 1;
        } else {
          return 0;
        }
      })
      .sort((a, b) => {
        if (a.sourceKind === SourceKind.UserEntry) {
          return 1;
        } else {
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
        for (const simd of transformer.simdStatements) source.statements.unshift(SimpleParser.parseTopLevelStatement(simd));
      }
      transformer.simdStatements = [];
    }

    const schemas = transformer.schemas;
    for (const schema of schemas) {
      if (schema.parent) {
        const parent = schemas.find((v) => v.name == schema.parent?.name);
        if (!parent) throwError(`Class ${schema.name} extends its parent class ${schema.parent}, but ${schema.parent} does not include a @json or @serializable decorator!`, schema.parent.node.range);
      }
    }
  }
}

function sortMembers(members: Property[]): Property[] {
  return members.sort((a, b) => {
    const aMove = a.flags.has(PropertyFlags.OmitIf) || a.flags.has(PropertyFlags.OmitNull);
    const bMove = b.flags.has(PropertyFlags.OmitIf) || b.flags.has(PropertyFlags.OmitNull);

    if (aMove && !bMove) {
      return -1;
    } else if (!aMove && bMove) {
      return 1;
    } else {
      return 0;
    }
  });
}

function isPrimitive(type: string): boolean {
  const primitiveTypes = ["u8", "u16", "u32", "u64", "i8", "i16", "i32", "i64", "f32", "f64", "bool", "boolean"];
  return primitiveTypes.some((v) => type.startsWith(v));
}

function isBoolean(type: string): boolean {
  return type == "bool" || type == "boolean";
}

function isStruct(type: string): boolean {
  type = stripNull(type);
  return FASSTransform.SN.schemas.some((v) => v.name == type) || FASSTransform.SN.schema.name == type;
}

function isString(type: string) {
  return stripNull(type) == "string" || stripNull(type) == "String";
}

function isStaticArray(type: string): boolean {
  return type.startsWith("StaticArray<");
}

function throwError(message: string, range: Range): never {
  const err = new Error();
  err.stack = `${message}\n  at ${range.source.normalizedPath}:${range.source.lineAt(range.start)}:${range.source.columnAt()}\n`;
  throw err;
}

function indentDec(): void {
  indent = indent.slice(0, Math.max(0, indent.length - 2));
}

function sizeof(type: string): number {
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
  else if (type == "bool" || type == "boolean") return 1;
  else return 0;
}

function stripNull(type: string): string {
  if (type.endsWith(" | null")) {
    return type.slice(0, type.length - 7);
  }
  return type;
}