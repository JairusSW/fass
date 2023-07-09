"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumDeclaration = void 0;
const Declaration_1 = require("./Declaration");
const TypeExpression_1 = require("./TypeExpression");
class EnumDeclaration extends Declaration_1.Declaration {
    constructor(name, members) {
        super();
        if (name)
            this.name = name;
        if (!this.members)
            this.members = [];
        if (members) {
            this.members = members;
            if (members.length <= 2 ** 8) {
                this.storageType = new TypeExpression_1.TypeExpression("u8");
            }
            else if (members.length <= 2 ** 16) {
                this.storageType = new TypeExpression_1.TypeExpression("u16");
            }
            else if (members.length <= 2 ** 32) {
                this.storageType = new TypeExpression_1.TypeExpression("u32");
                // Enums can grow in length from 8-32 bit integer representation. Over 32 bits would simply be massive.
            }
            else {
                throw new Error("Enum is over " +
                    2 ** 32 +
                    " elements long. Cannot be over 32-bit representation.");
            }
        }
    }
}
exports.EnumDeclaration = EnumDeclaration;
