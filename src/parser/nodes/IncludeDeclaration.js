"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncludeDeclaration = void 0;
const Declaration_1 = require("./Declaration");
class IncludeDeclaration extends Declaration_1.Declaration {
    constructor() {
        super(...arguments);
        this.predicate = "";
        this.included = [];
    }
}
exports.IncludeDeclaration = IncludeDeclaration;
