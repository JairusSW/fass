import { Statement } from "./Statement";
import { IdentifierExpression } from "./IdentifierExpression";
import { TypeExpression } from "./TypeExpression";

export class MemberStatement extends Statement {
    public name: IdentifierExpression;
    public type: TypeExpression;
    public grammer: string[] = [
        "name=IdentifierExpression", ":", "type=TypeExpression"
    ]
    constructor(name?: IdentifierExpression, type?: TypeExpression) {
        super();
        if (name) this.name = name!;
        if (type) this.type = type!;
    }
    static validate(tokens: string[]): MemberStatement | null {
        let pos = 0;
        let member = new MemberStatement();
        while (true) {
            const id = IdentifierExpression.validate(tokens);
            if (!id) {
                tokens = tokens.slice(++pos);
            } else {
                member.name = id;
                break;
            }
        }
        if (tokens.at(pos++) != ":") return null;
        member.type = TypeExpression.validate(tokens.slice(pos))!;
        return null;
    }
}