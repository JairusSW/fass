import { Statement } from "./Statement";
import { IdentifierExpression } from "./IdentifierExpression";
import { TypeExpression } from "./TypeExpression";

export class MemberStatement extends Statement {
  public name!: IdentifierExpression;
  public type!: TypeExpression;
  constructor(name?: IdentifierExpression, type?: TypeExpression) {
    super();
    if (name) this.name = name!;
    if (type) this.type = type!;
  }
}
