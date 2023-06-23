import { TypeExpression } from "../parser/nodes";

export enum Offsets {
  u8 = 1,
  i8 = 1,
  bool = 1,
  u16 = 2,
  i16 = 2,
  u32 = 4,
  i32 = 4,
  f32 = 4,
  u64 = 8,
  i64 = 8,
  f64 = 8,
}

export function sizeOfType(type: TypeExpression): number {
  if (!type.isComplex) {
    if (
      type.text == "u8" ||
      type.text == "i8" ||
      type.text == "char" ||
      type.text == "bool"
    ) {
      return 1;
    } else if (type.text == "u16" || type.text == "i16") {
      return 2;
    } else if (type.text == "u16" || type.text == "i16") {
      return 2;
    } else if (type.text == "u32" || type.text == "i32" || type.text == "f32") {
      return 4;
    } else {
      // else is of type u64, i64, or f64
      return 8;
    }
  } else {
    if (type.args && !isNaN(parseInt(type.args))) {
      // set length array or a set length array
      return parseInt(type.args);
    }
    // should resolve the length of dynamic types....
    // will do later though!
    throw new Error(
      "Unsupported: Cannot calculate size of imported structs yet."
    );
  }
}
