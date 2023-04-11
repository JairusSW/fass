import { Types } from "../../type/Types";

export function getType(type: string): Types {
  switch (type) {
    case "i8":
      return Types.i8;
    case "u8":
      return Types.u8;
    case "i16":
      return Types.i16;
    case "u16":
      return Types.u16;
    case "i32":
      return Types.i32;
    case "u32":
      return Types.u32;
    case "i64":
      return Types.i64;
    case "u64":
      return Types.u64;
    case "f32":
      return Types.f32;
    case "f64":
      return Types.f64;
    case "bool":
      return Types.bool;
    case "string":
      return Types.string;
    default:
      return Types.struct;
  }
}
