"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegerLiteral = void 0;
const IdentifierExpression_1 = require("./IdentifierExpression");
class IntegerLiteral extends IdentifierExpression_1.IdentifierExpression {
    constructor(value) {
        super();
        if (value)
            this.value = value;
    }
}
exports.IntegerLiteral = IntegerLiteral;
