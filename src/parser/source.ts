import { Statement } from "./nodes/Statement";

export class Source {
    public name!: string;
    public text!: string;
    public stmts!: Statement[];
    constructor(name: string, text: string) {
        this.name = name;
        this.text = text;
    }
}