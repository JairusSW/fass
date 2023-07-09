"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifierExpression = void 0;
const Expression_1 = require("./Expression");
class IdentifierExpression extends Expression_1.Expression {
    constructor(value) {
        super();
        if (value)
            this.value = value;
    }
}
exports.IdentifierExpression = IdentifierExpression;
