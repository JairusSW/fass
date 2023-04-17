import { Tokenizer } from "./tokenizer";
import { TYPES, TypeExpression } from "./nodes/TypeExpression";
import { Source } from "./source";
import { Statement } from "./nodes/Statement";

import { IncludeDeclaration } from "./nodes/IncludeDeclaration";
import { StructDeclaration } from "./nodes/StructDeclaration";
import { EnumDeclaration } from "./nodes/EnumDeclaration";
import { IdentifierExpression } from "./nodes/IdentifierExpression";
import { MemberStatement } from "./nodes/MemberStatement";
import { EnumMemberStatement } from "./nodes/EnumMemberStatement";
import { IntegerLiteral } from "./nodes/IntegerLiteral";
import { ScopeElement } from "./scope";

const KEYWORDS = [
  "struct",
  "list",
  "string",
  "i8",
  "u8",
  "i16",
  "u16",
  "i32",
  "u32",
  "i64",
  "u64",
  "f32",
  "f64"
];

const SYMBOLS = ["{", "}", ":"];

export class Parser {
  public sources!: Source[];
  public currentSourceIndex: number = 0;
  constructor(sources: Source[]) {
    this.sources = sources;
  }
  // This pretty much creates a Scope and parses each valid statement.
  parseSource(source: Source): Statement[] {
    const stmts: Statement[] = [];
    this.sources.find((value, index) => {
      if (value.name == source.name) {
        this.currentSourceIndex = index;
        return;
      }
    });

    // Parse each declaration
    const tokenizer = source.tokenizer;
    
    let currentToken: string | null = "";
    while (true) {
      currentToken = tokenizer.seeToken();
      if (currentToken == "include") {
        stmts.push(this.parseIncludeDeclaration(source).included);
      } else if (currentToken == "struct") {
        stmts.push(this.parseStructDeclaration(source)!);
      } else if (currentToken == "enum") {
        stmts.push(this.parseEnumDeclaration(source)!);
      } else {
        break;
      }
    }
    return stmts;
  }
  parseIncludeDeclaration(source: Source): IncludeDeclaration {
    const tokenizer = source.tokenizer;
    const includeDecl = new IncludeDeclaration();
    let currentToken: string | null = "";

    currentToken = tokenizer.getToken();
    if (currentToken != "include") throw new Error("Could not parse IncludesDeclaration because it starts with the token " + currentToken + ". Expected \"include\".");

    currentToken = tokenizer.getToken();
    if (!currentToken) throw new Error("Failed to identify token or reached End Of File at \ntoken: " + currentToken + "\npos: " + tokenizer.currentTokenIndex);
    includeDecl.predicate = currentToken;
    if (isStringLiteral(currentToken!)) {
      const newSource = this.sources.find((value, index) => {
        if (value.name == currentToken?.slice(1, currentToken.length - 1)) {
          return value;
        }
      });
      if (!newSource) throw new Error("Could not find source that was specified in the includes declaration");
      // Find Exported members
      // Add to IncludeDeclaration.prototype.included
      const parsed = this.parseSource(newSource!);
      source.stmts = [...parsed, ...source.stmts];
      // Remove include declaration and replace with the included stuff.
      // Make sure to specify between structs with the same names, but in different files to avoid conflicts.

      includeDecl.included = parsed;
      return includeDecl;
    }
    throw new Error("Expected path to included file, but found " + currentToken + " instead.");
    // Instead of throwing everywhere, keep going until a token starter is recognised and warn on invalid content.
  }
  parseStructDeclaration(source: Source): StructDeclaration {
    const tokenizer = source.tokenizer;
    const structDecl = new StructDeclaration();
    let currentToken: string | null = "";
    currentToken = tokenizer.getToken();
    if (currentToken != "struct") throw new Error("Could not parse StructDeclaration because it starts with the token " + currentToken + ". Expected \"struct\".");
    currentToken = tokenizer.getToken();
    if (!currentToken) throw new Error("Failed to identify token or reached End Of File at \ntoken: " + currentToken + "\npos: " + tokenizer.currentTokenIndex);

    const name = currentToken;
    if (KEYWORDS.includes(currentToken) ||
      SYMBOLS.includes(currentToken)
    ) throw new Error("Expected to find name of struct, but found " + currentToken + " instead.");

    structDecl.name = new IdentifierExpression(name);

    currentToken = tokenizer.getToken();
    if (!currentToken) throw new Error("Failed to identify token or reached End Of File at \ntoken: " + currentToken + "\npos: " + tokenizer.currentTokenIndex);
    if (currentToken != "{") throw new Error("Expected to find opening brace {, but found " + currentToken + " instead.");

    currentToken = tokenizer.getToken();
    if (!currentToken) throw new Error("Failed to identify token or reached End Of File at \ntoken: " + currentToken + "\npos: " + tokenizer.currentTokenIndex);
    // Iterate over members
    while (true) {
      const memberStmt = new MemberStatement();
      if (currentToken == "}") break;
      memberStmt.name = new IdentifierExpression(currentToken!);
      currentToken = tokenizer.getToken();
      if (!currentToken) throw new Error("Failed to identify token or reached End Of File at \ntoken: " + currentToken + "\npos: " + tokenizer.currentTokenIndex);

      if (currentToken != ":") break;

      currentToken = tokenizer.getToken();
      if (!currentToken) throw new Error("Failed to identify token or reached End Of File at \ntoken: " + currentToken + "\npos: " + tokenizer.currentTokenIndex);
      memberStmt.type = new TypeExpression(currentToken);
      structDecl.members.push(memberStmt);
      currentToken = tokenizer.getToken();
    }

    // Add to scope
    source.scope.addElement(new ScopeElement(structDecl.name.value, structDecl));
    source.stmts.push(structDecl);
    return structDecl;
  }
  parseEnumDeclaration(source: Source): EnumDeclaration {
    const tokenizer = source.tokenizer;
    const enumDecl = new EnumDeclaration();
    let currentToken: string | null = "";

    currentToken = tokenizer.getToken();
    if (currentToken != "enum") throw new Error("Could not parse EnumDeclaration because it starts with the token " + currentToken + ". Expected \"enum\".");

    currentToken = tokenizer.getToken();
    if (!currentToken) throw new Error("Failed to identify token or reached End Of File at \ntoken: " + currentToken + "\npos: " + tokenizer.currentTokenIndex);

    const name = currentToken;
    if (KEYWORDS.includes(currentToken) ||
      SYMBOLS.includes(currentToken)
    ) throw new Error("Expected to find name of enum, but found " + currentToken + " instead.");

    enumDecl.name = new IdentifierExpression(name);

    currentToken = tokenizer.getToken();
    if (!currentToken) throw new Error("Failed to identify token or reached End Of File at \ntoken: " + currentToken + "\npos: " + tokenizer.currentTokenIndex);
    if (currentToken != "{") throw new Error("Expected to find opening brace {, but found " + currentToken + " instead.");

    currentToken = tokenizer.getToken();
    if (!currentToken) throw new Error("Failed to identify token or reached End Of File at \ntoken: " + currentToken + "\npos: " + tokenizer.currentTokenIndex);
    // Iterate over members
    while (true) {
      const memberStmt = new EnumMemberStatement();
      if (currentToken == "}") break;
      memberStmt.name = new IdentifierExpression(currentToken!);
      const pos = tokenizer.currentTokenIndex;
      const oldToken: {
        value: string,
        index: number
      } = tokenizer.currentToken!;
      currentToken = tokenizer.getToken();
      if (currentToken == "=") {
        currentToken = tokenizer.getToken();
        memberStmt.value = new IntegerLiteral(currentToken!);
        enumDecl.members.push(memberStmt);
      } else {
        tokenizer.currentTokenIndex = pos;
        currentToken = oldToken.value;
        tokenizer.currentToken = oldToken;
      }
      currentToken = tokenizer.getToken();
    }
    // Add to scope
    source.scope.addElement(new ScopeElement(enumDecl.name.value, enumDecl));
    source.stmts.push(enumDecl);
    return enumDecl;
  }
}

function isStringLiteral(text: string): boolean {
  return text[0] == "\"" && text[text.length - 1] == "\"";
}

const player = new Source("Player.fass", `include "Vec3.fass"
include "Movement.fass"

struct Player {
    name: char[8]
    id: i32
    pos: Vec3
    movement: Movement
    data: u8[5]
}`);

const vec3 = new Source("Vec3.fass", `struct Vec3 {
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

const movement = new Source("Movement.fass", `struct Movement {
    moving: bool
    speed: f32
    direction: Direction
}

struct Direction {
    pitch: f32
    yaw: f32
    facing: f32
}`);

const parser = new Parser([
  player,
  vec3,
  movement
]);

console.log(JSON.stringify(parser.parseSource(player), null, 2));
