"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeExpression = exports.TYPES = void 0;
const Expression_1 = require("./Expression");
exports.TYPES = [
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
class TypeExpression extends Expression_1.Expression {
    constructor(text) {
        super();
        this.isComplex = false;
        this.args = "";
        this.less = false;
        if (text) {
            this.text = text;
            if (this.text.endsWith("]") &&
                this.text.lastIndexOf("[") > 0 &&
                !this.text.startsWith("[")) {
                this.isComplex = true;
                const startIndex = this.text.lastIndexOf("[");
                const endIndex = this.text.lastIndexOf("]");
                const argsText = this.text.substring(startIndex + 1, endIndex);
                if (argsText.length > 0) {
                    if (argsText.startsWith("..")) {
                        this.args = argsText.slice(2);
                        this.less = true;
                    }
                    else {
                        this.args = argsText;
                    }
                }
                this.type = this.text.substring(0, startIndex);
            }
            else {
                this.type = this.text;
            }
        }
    }
}
exports.TypeExpression = TypeExpression;
