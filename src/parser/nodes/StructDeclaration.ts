import { Tokenizer } from "../tokenizer";
import { Declaration } from "./Declaration";
import { IdentifierExpression } from "./IdentifierExpression";
import { MemberStatement } from "./MemberStatement";
export class StructDeclaration extends Declaration {
    public name: IdentifierExpression;
    public members: MemberStatement[];
    public grammer: string[] = [
        "struct", "name=IdentifierExpression", "{",
            "members+=MemberStatement*",
        "}"
    ]
    constructor(name?: IdentifierExpression, members?: MemberStatement[]) {
        super();
        if (name) this.name = name;
        if (members) this.members = members;
    }
    static validate(tokens: string[]): Declaration | null {
        if (tokens.includes("struct") && tokens.at(tokens.indexOf("struct") + 2) == "{") {
            let startPos = tokens.indexOf("struct") - 1;
            tokens = tokens.slice(startPos);
            const decl = new StructDeclaration();
            decl.name = IdentifierExpression.validate(tokens.slice(startPos + 1))!;
            let num = 3;
            while (true) {
                const member = MemberStatement.validate(tokens.slice(startPos + num));
                if (member) {
                    decl.members.push(member);
                    num++;
                } else {
                    break;
                }
            }
            // Validate last bracket
            return decl;
        }
        return null;
    }
}