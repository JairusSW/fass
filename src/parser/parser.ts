import { Statement } from "./nodes/Statement";
import { StructDeclaration } from "./nodes/StructDeclaration";
import { EnumDeclaration } from "./nodes/EnumDeclaration";
import { EnumMemberStatement } from "./nodes/EnumMemberStatement";
import { Tokenizer } from "./tokenizer";
import { TYPES } from "./nodes/TypeExpression";

export class Parser {
  public text!: string;
  public statements: Statement[] = [];
  public programs!: ProgramData[];
  public currentProgram!: ProgramData;
  public currentProgramIndex: number = 0;
  constructor(files: ProgramData[]) {
    this.programs = files;
    this.currentProgram = files.at(0)!;
  }
  
  parseOne(): Statement | null {
    let pos = 0;
    const id = this.currentProgram.tokens.slice(this.currentProgramIndex).find((v, i) => {
      pos = i;
      return [
        "struct",
        "enum",
        "list",
        "import"
      ].includes(v);
    });

    if (!id) return null;

    this.currentProgramIndex = pos + 1;
    if (this.currentProgram.offset > 0) this.currentProgram.offset = pos + 1;
    else this.currentProgram.offset = pos;

    if (id == "struct") {
      const initialOffset = this.currentProgram.offset;
      const tokens = this.currentProgram.tokens.slice(initialOffset);
      const struct = StructDeclaration.parse(tokens);
      if (!struct) {
        console.error("Could not parse struct");
        return null;
      }
      this.statements.push(struct);
      return struct;
    } else if (id == "enum") {
      const initialOffset = this.currentProgram.offset + 1;
      const tokens = this.currentProgram.tokens.slice(initialOffset);
      const struct = EnumDeclaration.parse(tokens);
      if (!struct) {
        console.error("Could not parse enum", tokens);
        return null;
      }
      this.statements.push(struct);
      return struct;
    }
    return null;
  }
  parseAll(): Statement[] {
    const stmts: Statement[] = [];
    while (true) {
      const stm = this.parseOne();
      if (stm) stmts.push(stm);
      else break;
    }
    return stmts;
  }
}

export class ProgramData {
  public name!: string;
  public tokens!: string[];
  public text!: string;
  public offset = 0;
  public declaredTypes: string[] = [];
  constructor(name: string, text: string) {
    this.name = name;
    this.text = text;
    this.tokens = new Tokenizer(text).getAllTokens();

    // Per-file scope
    for (let i = 0; i < this.tokens.length; i++) {
      const tok = this.tokens.at(i)!;
      if (
        tok == "struct" ||
        tok == "enum" ||
        tok == "list"
      ) {
        console.log(`Adding ${this.tokens.at(i + 1)!} to the scope!`)
        this.declaredTypes.push(this.tokens.at(i + 1)!);
      }

      if (tok == "import") {
        i++; // Skip {
        for (; i < this.tokens.length; i++) {
          // Add import types
          if (this.tokens.at(i)! != "}") this.declaredTypes.push(this.tokens.at(i)!);
        }
      }
    }

    TYPES.push(...this.declaredTypes);
  }
}

const Vec3 = new ProgramData("Vec3", `struct Vec3 {
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
}`)

const parser = new Parser([Vec3]);
console.log(JSON.stringify(parser.parseOne(), null, 2));
console.log(JSON.stringify(parser.parseOne(), null, 2));

//console.log(EnumMemberStatement.parse(['TL', 'TR', 'BL', 'BR']))