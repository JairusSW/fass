import { Statement } from "./Statement";
import { IdentifierExpression } from "./IdentifierExpression";
import { IntegerLiteral } from "./IntegerLiteral";

export class EnumMemberStatement extends Statement {
    public name!: IdentifierExpression;
    public value!: IntegerLiteral;
    public grammer: string[] = [
        "name=IdentifierExpression",
        "=",
        "value=IntegerLiteral",
    ];
    constructor(name?: IdentifierExpression, value?: IntegerLiteral) {
        super();
        if (name) this.name = name!;
        if (value) this.value = value!;
    }
    static validate(tokens: string[]): boolean {
        if (!IdentifierExpression.validate([tokens.at(0)!])) return false;
        return true;
    }
    static parse(tokens: string[]): EnumMemberStatement | null {
        if (!EnumMemberStatement.validate(tokens)) return null;
        const member = new EnumMemberStatement();
        member.name = new IdentifierExpression(tokens.at(0)!);
        if (tokens.at(1) == "=" && IntegerLiteral.validate([tokens.at(2)!])) {
            member.value = new IntegerLiteral(tokens.at(2)!);
        } else {
            member.value = new IntegerLiteral("NOT_ASSIGNED");
        }
        return member;
    }
}
