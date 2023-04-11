import { IdentifierExpression } from "./IdentifierExpression";

export class IntegerLiteral extends IdentifierExpression {
    constructor(value?: string) {
        super();
        if (value) this.value = value!;
    }
}