import { Expression } from "./Expression";

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
  constructor(text?: string) {
    super();
    if (text) this.text = text!;
  }
}
