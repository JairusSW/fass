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
}