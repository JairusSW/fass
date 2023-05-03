import { Statement } from "./Statement";

export class CommentStatement extends Statement {
    public text!: string;
    public type!: "multi" | "single";
    constructor(text: string, type: "multi" | "single") {
        super();
        this.text = text;
        this.type = type;
    }
}