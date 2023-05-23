import { Declaration } from "./Declaration";
import { IdentifierExpression } from "./IdentifierExpression";
import { EnumMemberStatement } from "./EnumMemberStatement";
import { TypeExpression } from "./TypeExpression";
export class EnumDeclaration extends Declaration {
  public name!: IdentifierExpression;
  public members!: EnumMemberStatement[];
  public storageType!: TypeExpression;
  constructor(name?: IdentifierExpression, members?: EnumMemberStatement[]) {
    super();
    if (name) this.name = name;
    if (!this.members) this.members = [];
    if (members) {
      this.members = members;
      if (members.length <= 2**8) {
        this.storageType = new TypeExpression("u8");
      } else if (members.length <= 2**16) {
        this.storageType = new TypeExpression("u16");
      } else if (members.length <= 2**32) {
        this.storageType = new TypeExpression("u32");
        // Enums can grow in length from 8-32 bit integer representation. Over 32 bits would simply be massive.
      } else {
        throw new Error("Enum is over " + 2**32 + " elements long. Cannot be over 32-bit representation.")
      }
    }
  }
}
