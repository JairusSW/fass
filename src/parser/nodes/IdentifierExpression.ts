import { Tokenizer } from "../tokenizer";
import { Expression } from "./Expression";

const KEYWORDS = [
    "struct",
    "list",
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
    "f64"
]
export class IdentifierExpression extends Expression {
    public value: string;
    public grammer: string[] = [
        "value=ID"
    ]
    constructor(value?: string) {
        super();
        if (value) this.value = value!;
    }
    static validate(tokens: string[]): IdentifierExpression | null {
        if (tokens.length && !KEYWORDS.includes(tokens.at(0)!)) {
            return new IdentifierExpression(tokens.at(0)!);
        }
        return null;
    }
}