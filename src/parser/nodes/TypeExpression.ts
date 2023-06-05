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

export class TypeExpression extends Expression {
  public text!: string;
  public type!: string;
  public isComplex: boolean = false;
  public args: string = "";
  public less: boolean = false;

  constructor(text?: string) {
    super();
    if (text) {
      this.text = text;
      if (
        this.text.endsWith("]") &&
        this.text.lastIndexOf("[") > 0 &&
        !this.text.startsWith("[")
      ) {
        this.isComplex = true;
        const startIndex = this.text.lastIndexOf("[");
        const endIndex = this.text.lastIndexOf("]");
        const argsText = this.text.substring(startIndex + 1, endIndex);
        if (argsText.length > 0) {
          if (argsText.startsWith("..")) {
            this.args = argsText.slice(2);
            this.less = true;
          } else {
            this.args = argsText;
          }
        }
        this.type = this.text.substring(0, startIndex);
      } else {
        this.type = this.text;
      }
    }
  }
}
