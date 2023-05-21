import { TypeExpression } from "./nodes";
import { Statement } from "./nodes/Statement";
import { Scope } from "./scope";
import { Tokenizer } from "./tokenizer";

export class Source {
    public name!: string;
    public text!: string;
    public tokenizer!: Tokenizer;
    public stmts: Statement[] = [];
    public scope: Scope = new Scope();
    public parsed: boolean = false;
    public usedTypes: TypeExpression[] = [];
    constructor(name: string, text: string) {
        this.name = name;
        this.text = text;
        this.tokenizer = new Tokenizer(this.text);
    }
}