import { TypeExpression } from "./nodes/TypeExpression";
import { Source } from "./source";
import { Statement } from "./nodes/Statement";

import {
  IncludeDeclaration,
  StructDeclaration,
  EnumDeclaration,
  IdentifierExpression,
  MemberStatement,
  EnumMemberStatement,
  IntegerLiteral
} from "./nodes";

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

  parseSource(source: Source): Statement[] {
    const stmts: Statement[] = [];

    this.sources.find((value, index) => {
      if (value.name == source.name) {
        this.currentSourceIndex = index;
        return;
      }
    });

    const tokenizer = source.tokenizer;

    let currentToken: string | null = "";
    while (true) {
      currentToken = tokenizer.seeToken();

      // If the token is "include", parse the included file
      if (currentToken == "include") {
        const includeDecl = this.parseIncludeDeclaration(source);
        stmts.push(includeDecl);
        source.stmts.push(includeDecl);
      } else if (currentToken == "struct") {
        // If the token is "struct", parse the struct declaration
        stmts.push(this.parseStructDeclaration(source)!);
      } else if (currentToken == "enum") {
        // If the token is "enum", parse the enum declaration
        stmts.push(this.parseEnumDeclaration(source)!);
      } else {
        // If the token is not "include", "struct", or "enum", break the loop
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

    // Get the path to the included file
    currentToken = tokenizer.getToken();
    if (!currentToken) throw new Error("Failed to identify token or reached End Of File at \ntoken: " + currentToken + "\npos: " + tokenizer.currentTokenIndex);

    // Set the predicate of the IncludeDeclaration to the path
    includeDecl.predicate = currentToken;

    if (isStringLiteral(currentToken!)) {
      const newSource = this.sources.find((value, index) => {
        if (value.name == currentToken?.slice(1, currentToken.length - 1)) {
          return value;
        }
      });

      if (!newSource) throw new Error("Could not find source that was specified in the includes declaration");

      // Parse the included file and add the exported members to the source's statements
      const parsed = this.parseSource(newSource!);
      //source.stmts = [...parsed, ...source.stmts];

      includeDecl.included = parsed;

      return includeDecl;
    }

    throw new Error("Expected path to included file, but found " + currentToken + " instead.");
    // Instead of throwing everywhere, keep going until a token starter is recognised and warn on invalid content.
  }

  // This function parses a struct declaration
  parseStructDeclaration(source: Source): StructDeclaration {
    const tokenizer = source.tokenizer;
    const structDecl = new StructDeclaration();
    let currentToken: string | null = "";

    // Get the "struct" keyword
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
