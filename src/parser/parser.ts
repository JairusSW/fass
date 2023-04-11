import { Declaration } from "./nodes/Declaration";

export class Parser {

}

export class ParserBuilder {
    public rules: ParserRule[];
}

export class ParserRule {
    public rule: string[];
    constructor(rule?: string[]) {
        if (rule) this.rule = rule!;
    }
}