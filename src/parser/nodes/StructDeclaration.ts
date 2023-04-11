import { Declaration } from "./Declaration";
import { IdentifierExpression } from "./IdentifierExpression";
import { MemberStatement } from "./MemberStatement";
export class StructDeclaration extends Declaration {
  public name!: IdentifierExpression;
  public members!: MemberStatement[];
  public grammer: string[] = [
    "struct",
    "name=IdentifierExpression",
    "{",
    "members+=MemberStatement*",
    "}",
  ];
  constructor(name?: IdentifierExpression, members?: MemberStatement[]) {
    super();
    if (name) this.name = name;
    if (!this.members) this.members = [];
    if (members) this.members = members;
  }
  static parse(tokens: string[]): Declaration | null {
    if (tokens.at(0)! == "struct") {
      let startPos = 0;
      const decl = new StructDeclaration();

      // Parse name (IdentifierExpression)
      if (!IdentifierExpression.validate([tokens.at(startPos + 1)!]))
        return null;
      decl.name = new IdentifierExpression(tokens.at(startPos + 1)!);

      // Parse Members (MemberStatement)
      let num = 3;
      while (true) {
        const member = MemberStatement.parse(tokens.slice(startPos + num));
        if (member) {
          decl.members.push(member);
          num += 3;
        } else {
          break;
        }
      }
      // Validate last bracket
      if (tokens.at(num) != "}") return null;
      return decl;
    }
    return null;
  }
}
