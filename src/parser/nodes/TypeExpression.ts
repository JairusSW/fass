import { Expression } from "./Expression";
import { Types } from "../../type/Types";
export class TypeExpression extends Expression {
    public text: string;
    public type: Types;
    constructor(text?: string, type?: Types) {
        super();
        if (text) this.text = text!;
        if (type) this.type = type!;
    }
}