"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructDeclaration = void 0;
const Declaration_1 = require("./Declaration");
class StructDeclaration extends Declaration_1.Declaration {
    constructor(name, members) {
        super();
        if (name)
            this.name = name;
        if (!this.members)
            this.members = [];
        if (members)
            this.members = members;
    }
}
exports.StructDeclaration = StructDeclaration;
