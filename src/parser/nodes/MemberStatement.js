"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberStatement = void 0;
const Statement_1 = require("./Statement");
class MemberStatement extends Statement_1.Statement {
    constructor(name, type) {
        super();
        if (name)
            this.name = name;
        if (type)
            this.type = type;
    }
}
exports.MemberStatement = MemberStatement;
