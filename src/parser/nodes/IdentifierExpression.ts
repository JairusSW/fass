import { Expression } from "./Expression";

export class IdentifierExpression extends Expression {
    public value: string;
    public grammer: string[] = [
        "value=string"
    ]
    constructor(value?: string) {
        super();
        if (value) this.value = value!;
    }
}