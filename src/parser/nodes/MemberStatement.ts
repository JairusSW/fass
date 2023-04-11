import { Statement } from "./Statement";
import { IdentifierExpression } from "./IdentifierExpression";
import { TypeExpression } from "./TypeExpression";
import { getType } from "../util/getType";

export class MemberStatement extends Statement {
    public name!: IdentifierExpression;
    public type!: TypeExpression;
    public grammer: string[] = [
        "name=IdentifierExpression", ":", "type=TypeExpression"
    ]
    constructor(name?: IdentifierExpression, type?: TypeExpression) {
        super();
        if (name) this.name = name!;
        if (type) this.type = type!;
    }
    static validate(tokens: string[]): boolean {
        if (!IdentifierExpression.validate([tokens.at(0)!])) return false;
        if (tokens.at(1) != ":") return false;
        if (!TypeExpression.validate([tokens.at(2)!])) return false;
        return true;
    }
    static parse(tokens: string[]): MemberStatement | null {
        if (!MemberStatement.validate(tokens)) return null;
        const member = new MemberStatement();
        member.name = new IdentifierExpression(tokens.at(0)!);
        member.type = new TypeExpression(tokens.at(2)!, getType(tokens.at(2)!));
        return member;
    }
}