import { Statement } from "./Statement";
import { IdentifierExpression } from "./IdentifierExpression";
import { IntegerLiteral } from "./IntegerLiteral";

export class EnumMemberStatement extends Statement {
  public name!: IdentifierExpression;
  public value!: IntegerLiteral;
  constructor(name?: IdentifierExpression, value?: IntegerLiteral) {
    super();
    if (name) this.name = name!;
    if (value) this.value = value!;
  }
}
