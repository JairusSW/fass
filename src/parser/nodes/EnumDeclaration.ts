import { Declaration } from "./Declaration";
import { IdentifierExpression } from "./IdentifierExpression";
import { EnumMemberStatement } from "./EnumMemberStatement";
export class EnumDeclaration extends Declaration {
    public name!: IdentifierExpression;
    public members!: EnumMemberStatement[];
    public grammer: string[] = [
        "enum",
        "name=IdentifierExpression",
        "{",
        "members+=EnumMemberStatement*",
        "}",
    ];
    constructor(name?: IdentifierExpression, members?: EnumMemberStatement[]) {
        super();
        if (name) this.name = name;
        if (!this.members) this.members = [];
        if (members) this.members = members;
    }
    static parse(tokens: string[]): Declaration | null {
        if (tokens.at(0)! == "enum") {
            let startPos = 0;
            const decl = new EnumDeclaration();

            // Parse name (IdentifierExpression)
            if (!IdentifierExpression.validate([tokens.at(startPos + 1)!])) {
                return null;
            }
            decl.name = new IdentifierExpression(tokens.at(startPos + 1)!);

            // Parse Members (MemberStatement)
            let num = 3;
            let index = 0;
            const takenIndexes: number[] = [];
            while (true) {
                const member = EnumMemberStatement.parse(tokens.slice(startPos + num));
                if (member) {
                    decl.members.push(member);
                    if (member.value.value == "NOT_ASSIGNED") {
                        while (takenIndexes.includes(index)) index++;
                        if (index > 255) {
                            throw new Error("Enums cannot have more than 256 elements in them!");
                        }
                        member.value.value = (index++).toString();
                        num++;
                    } else {
                        if (parseInt(member.value.value) > 256) {
                            throw new Error("Enums cannot have a number more than 256 in it!");
                        }
                        takenIndexes.push(parseInt(member.value.value));
                        index++;
                        num += 3;
                    }
                } else {
                    break;
                }
            }
            // Validate last bracket
            //if (tokens.at(num) != "}") return null;
            return decl;
        }
        return null;
    }
}
