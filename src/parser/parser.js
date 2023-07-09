"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const TypeExpression_1 = require("./nodes/TypeExpression");
const nodes_1 = require("./nodes");
const scope_1 = require("./scope");
// Reserved words
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
    "f64",
];
const SYMBOLS = ["{", "}", ":"];
class Parser {
    constructor(sources) {
        this.sources = sources;
        for (const source of this.sources) {
            this.parseSource(source);
        }
    }
    parseSource(source) {
        if (source.parsed)
            return;
        const tokenizer = source.tokenizer;
        let currentToken = "";
        while (true) {
            currentToken = tokenizer.seeToken();
            if (currentToken == "include") {
                const includeDecl = this.parseIncludeDeclaration(source);
                source.stmts.push(includeDecl);
            }
            else if (currentToken == "struct") {
                source.stmts.push(this.parseStructDeclaration(source));
            }
            else if (currentToken == "enum") {
                source.stmts.push(this.parseEnumDeclaration(source));
            }
            else if (currentToken === null || currentToken === void 0 ? void 0 : currentToken.startsWith("//")) {
                source.stmts.push(new nodes_1.CommentStatement(currentToken.slice(2), "single"));
                source.tokenizer.getToken();
            }
            else {
                break;
            }
        }
        source.parsed = true;
    }
    parseIncludeDeclaration(source) {
        const tokenizer = source.tokenizer;
        const includeDecl = new nodes_1.IncludeDeclaration();
        let currentToken = "";
        currentToken = tokenizer.getToken();
        if (currentToken != "include")
            throw new Error("Could not parse IncludesDeclaration because it starts with the token " +
                currentToken +
                '. Expected "include".');
        // Get the path to the included file
        currentToken = tokenizer.getToken();
        if (!currentToken)
            throw new Error("Failed to identify token or reached End Of File at \ntoken: " +
                currentToken +
                "\npos: " +
                tokenizer.currentTokenIndex);
        // Set the predicate of the IncludeDeclaration to the path
        includeDecl.predicate = currentToken;
        if (isStringLiteral(currentToken)) {
            const newSource = this.sources.find((value, index) => {
                if (value.name == (currentToken === null || currentToken === void 0 ? void 0 : currentToken.slice(1, currentToken.length - 1))) {
                    return value;
                }
            });
            if (!newSource)
                throw new Error("Could not find source that was specified in the includes declaration");
            // Parse the included file and add the exported members to the source's statements
            if (!newSource.parsed) {
                this.parseSource(newSource);
            }
            includeDecl.included = newSource.stmts;
            for (const stmt of newSource.stmts) {
                if (stmt instanceof nodes_1.StructDeclaration ||
                    stmt instanceof nodes_1.EnumDeclaration)
                    source.scope.addElement(new scope_1.ScopeElement(stmt.name.value, stmt));
            }
            return includeDecl;
        }
        throw new Error("Expected path to included file, but found " + currentToken + " instead.");
        // Instead of throwing everywhere, keep going until a token starter is recognized and warn on invalid content.
    }
    // This function parses a struct declaration
    parseStructDeclaration(source) {
        const tokenizer = source.tokenizer;
        const structDecl = new nodes_1.StructDeclaration();
        let currentToken = "";
        // Get the "struct" keyword
        currentToken = tokenizer.getToken();
        if (currentToken != "struct")
            throw new Error("Could not parse StructDeclaration because it starts with the token " +
                currentToken +
                '. Expected "struct".');
        currentToken = tokenizer.getToken();
        if (!currentToken)
            throw new Error("Failed to identify token or reached End Of File at \ntoken: " +
                currentToken +
                "\npos: " +
                tokenizer.currentTokenIndex);
        const name = currentToken;
        if (KEYWORDS.includes(currentToken) || SYMBOLS.includes(currentToken))
            throw new Error("Expected to find name of struct, but found " +
                currentToken +
                " instead.");
        structDecl.name = new nodes_1.IdentifierExpression(name);
        currentToken = tokenizer.getToken();
        if (!currentToken)
            throw new Error("Failed to identify token or reached End Of File at \ntoken: " +
                currentToken +
                "\npos: " +
                tokenizer.currentTokenIndex);
        if (currentToken != "{")
            throw new Error("Expected to find opening brace {, but found " +
                currentToken +
                " instead.");
        currentToken = tokenizer.getToken();
        if (!currentToken)
            throw new Error("Failed to identify token or reached End Of File at \ntoken: " +
                currentToken +
                "\npos: " +
                tokenizer.currentTokenIndex);
        // Iterate over members
        while (true) {
            const memberStmt = new nodes_1.MemberStatement();
            if (currentToken == "}")
                break;
            memberStmt.name = new nodes_1.IdentifierExpression(currentToken);
            currentToken = tokenizer.getToken();
            if (!currentToken)
                throw new Error("Failed to identify token or reached End Of File at \ntoken: " +
                    currentToken +
                    "\npos: " +
                    tokenizer.currentTokenIndex);
            if (currentToken != ":")
                break;
            currentToken = tokenizer.getToken();
            if (!currentToken)
                throw new Error("Failed to identify token or reached End Of File at \ntoken: " +
                    currentToken +
                    "\npos: " +
                    tokenizer.currentTokenIndex);
            memberStmt.type = new TypeExpression_1.TypeExpression(currentToken);
            source.usedTypes.push(memberStmt.type);
            structDecl.members.push(memberStmt);
            currentToken = tokenizer.getToken();
        }
        // Add to scope
        source.scope.addElement(new scope_1.ScopeElement(structDecl.name.value, structDecl));
        return structDecl;
    }
    parseEnumDeclaration(source) {
        const tokenizer = source.tokenizer;
        let currentToken = "";
        currentToken = tokenizer.getToken();
        if (currentToken != "enum")
            throw new Error("Could not parse EnumDeclaration because it starts with the token " +
                currentToken +
                '. Expected "enum".');
        currentToken = tokenizer.getToken();
        if (!currentToken)
            throw new Error("Failed to identify token or reached End Of File at \ntoken: " +
                currentToken +
                "\npos: " +
                tokenizer.currentTokenIndex);
        const name = currentToken;
        if (KEYWORDS.includes(currentToken) || SYMBOLS.includes(currentToken))
            throw new Error("Expected to find name of enum, but found " + currentToken + " instead.");
        const enumName = new nodes_1.IdentifierExpression(name);
        let enumMembers = [];
        currentToken = tokenizer.getToken();
        if (!currentToken)
            throw new Error("Failed to identify token or reached End Of File at \ntoken: " +
                currentToken +
                "\npos: " +
                tokenizer.currentTokenIndex);
        if (currentToken != "{")
            throw new Error("Expected to find opening brace {, but found " +
                currentToken +
                " instead.");
        currentToken = tokenizer.getToken();
        if (!currentToken)
            throw new Error("Failed to identify token or reached End Of File at \ntoken: " +
                currentToken +
                "\npos: " +
                tokenizer.currentTokenIndex);
        // Iterate over members
        while (true) {
            const memberStmt = new nodes_1.EnumMemberStatement();
            if (currentToken == "}")
                break;
            memberStmt.name = new nodes_1.IdentifierExpression(currentToken);
            const pos = tokenizer.currentTokenIndex;
            const oldToken = tokenizer.currentToken;
            currentToken = tokenizer.getToken();
            if (currentToken == "=") {
                currentToken = tokenizer.getToken();
                memberStmt.value = new nodes_1.IntegerLiteral(currentToken);
                enumMembers.push(memberStmt);
            }
            else {
                tokenizer.currentTokenIndex = pos;
                currentToken = oldToken.value;
                tokenizer.currentToken = oldToken;
            }
            currentToken = tokenizer.getToken();
        }
        const enumDecl = new nodes_1.EnumDeclaration(enumName, enumMembers);
        // Add to scope
        source.scope.addElement(new scope_1.ScopeElement(enumDecl.name.value, enumDecl));
        return enumDecl;
    }
}
exports.Parser = Parser;
function isStringLiteral(text) {
    return text[0] == '"' && text[text.length - 1] == '"';
}
