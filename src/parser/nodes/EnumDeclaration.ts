import { Declaration } from "./Declaration";
import { IdentifierExpression } from "./IdentifierExpression";
import { EnumMemberStatement } from "./EnumMemberStatement";
export class EnumDeclaration extends Declaration {
  public name!: IdentifierExpression;
  public members!: EnumMemberStatement[];
  constructor(name?: IdentifierExpression, members?: EnumMemberStatement[]) {
    super();
    if (name) this.name = name;
    if (!this.members) this.members = [];
    if (members) this.members = members;
  }
}
