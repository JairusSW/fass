"use strict";
/******************************************************************************
 * This file was generated by langium-cli 1.1.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.FassGeneratedModule = exports.FassGeneratedSharedModule = exports.FassLanguageMetaData = void 0;
const ast_1 = require("./ast");
const grammar_1 = require("./grammar");
exports.FassLanguageMetaData = {
    languageId: 'fass',
    fileExtensions: ['.fass'],
    caseInsensitive: false
};
exports.FassGeneratedSharedModule = {
    AstReflection: () => new ast_1.FassAstReflection()
};
exports.FassGeneratedModule = {
    Grammar: () => (0, grammar_1.FassGrammar)(),
    LanguageMetaData: () => exports.FassLanguageMetaData,
    parser: {}
};
//# sourceMappingURL=module.js.map