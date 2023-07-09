"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentStatement = void 0;
const Statement_1 = require("./Statement");
class CommentStatement extends Statement_1.Statement {
    constructor(text, type) {
        super();
        this.text = text;
        this.type = type;
    }
}
exports.CommentStatement = CommentStatement;
