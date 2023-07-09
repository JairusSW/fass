"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcreteType = exports.TypeID = void 0;
var TypeID;
(function (TypeID) {
    // Primitive 0-11
    TypeID[TypeID["u8"] = 0] = "u8";
    TypeID[TypeID["i8"] = 1] = "i8";
    TypeID[TypeID["u16"] = 2] = "u16";
    TypeID[TypeID["i16"] = 3] = "i16";
    TypeID[TypeID["u32"] = 4] = "u32";
    TypeID[TypeID["i32"] = 5] = "i32";
    TypeID[TypeID["u64"] = 6] = "u64";
    TypeID[TypeID["i64"] = 7] = "i64";
    TypeID[TypeID["f32"] = 8] = "f32";
    TypeID[TypeID["f64"] = 9] = "f64";
    TypeID[TypeID["bool"] = 10] = "bool";
    TypeID[TypeID["char"] = 11] = "char";
    // Structure Types
    TypeID[TypeID["enum"] = 12] = "enum";
    TypeID[TypeID["struct"] = 13] = "struct";
    TypeID[TypeID["list"] = 14] = "list";
    TypeID[TypeID["sequence"] = 15] = "sequence";
    // Dynamic length
    TypeID[TypeID["array"] = 16] = "array";
})(TypeID = exports.TypeID || (exports.TypeID = {}));
class ConcreteType {
    constructor(name, id, reference) { }
}
exports.ConcreteType = ConcreteType;
