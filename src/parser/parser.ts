import { Declaration } from "./nodes/Declaration";
import { Statement } from "./nodes/Statement";
import { StructDeclaration } from "./nodes/StructDeclaration";
import { Tokenizer } from "./tokenizer";

export class Parser {
  public text!: string;
  public statements: Statement[] = [];
  public files!: ProgramData[];
  public currentProgram!: ProgramData;
  constructor(files: ProgramData[]) {
    this.files = files;
    this.currentProgram = files.at(0)!;
  }
  parseOne(): Statement | null {
    const id = this.currentProgram.tokens.at(0)!;

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
  constructor(name: string, text: string) {
    this.name = name;
    this.text = text;
    this.tokens = new Tokenizer(text).getAllTokens();
  }
}

const Vec3 = new ProgramData("Vec3", `struct Vec3 {
    x: f32
    y: f32
    z: f32
}`)

const parser = new Parser([Vec3]);
console.log(parser.parseOne());