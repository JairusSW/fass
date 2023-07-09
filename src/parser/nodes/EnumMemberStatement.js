"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumMemberStatement = void 0;
const Statement_1 = require("./Statement");
class EnumMemberStatement extends Statement_1.Statement {
    constructor(name, value) {
        super();
        if (name)
            this.name = name;
        if (value)
            this.value = value;
    }
}
exports.EnumMemberStatement = EnumMemberStatement;
