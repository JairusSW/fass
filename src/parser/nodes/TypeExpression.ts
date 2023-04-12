import { Expression } from "./Expression";
import { Types } from "../../type/Types";

export const TYPES = [
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

const DEFAULTTYPES = [
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

export class TypeExpression extends Expression {
  public text!: string;
  public type!: Types;
  constructor(text?: string, type?: Types) {
    super();
    if (text) this.text = text!;
    if (type) this.type = type!;
  }
  static validate(tokens: string[]): boolean {
    if (tokens.length && TYPES.includes(tokens.at(0)!)) {
      return true;
    }
    return false;
  }
}
