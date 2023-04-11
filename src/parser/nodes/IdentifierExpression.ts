import { Expression } from "./Expression";

export class IdentifierExpression extends Expression {
    value: string
    constructor(value?: string) {
        super();
        if (value) this.value = value!;
    }
}