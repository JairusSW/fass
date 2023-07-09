"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Source = void 0;
const scope_1 = require("./scope");
const tokenizer_1 = require("./tokenizer");
class Source {
    constructor(name, text) {
        this.stmts = [];
        this.scope = new scope_1.Scope();
        this.parsed = false;
        this.usedTypes = [];
        this.name = name;
        this.text = text;
        this.tokenizer = new tokenizer_1.Tokenizer(this.text);
    }
}
exports.Source = Source;
