import { MemberStatement } from "./nodes/MemberStatement";
import { StructDeclaration } from "./nodes/StructDeclaration";

export const SEPARATORS = [
    ":"
];
export class Tokenizer {
    public pos: number = 0;
    constructor(public text: string) { }
    getToken(): string {
        let startPos = this.pos;
        // Skip whitespace and newlines
        while (this.text.charAt(startPos) == " " || this.text.charAt(startPos) == "\n") startPos++;
        let endPos = startPos;
        // Find next whitespace or EOF
        while (endPos < this.text.length) {
            if (
                this.text.charAt(endPos) == " " ||
                this.text.charAt(endPos) == "\n"
            ) {
                this.pos = endPos;
                return this.text.slice(startPos, endPos);
            } else {
                endPos++;
            }
        }
        this.pos = ++endPos;
        return this.text.slice(startPos, endPos);
    }
    getTokensUntilNewLine(): string[] {
        const result: string[] = [];
        let startPos = this.pos;
        // Skip whitespace and newlines
        while (this.text.charAt(startPos) == " ") startPos++;
        let endPos = startPos;
        // Find next whitespace or EOF
        while (endPos < this.text.length) {
            if (this.text.charAt(endPos) == "\n") {
                break;
            } else if (
                SEPARATORS.includes(this.text.charAt(endPos)) ||
                this.text.charAt(endPos) == " "
            ) {
                if (this.text.slice(startPos, endPos).trim().length)
                    result.push(this.text.slice(startPos, endPos));
                if (SEPARATORS.includes(this.text.charAt(endPos))) {
                    result.push(this.text.charAt(endPos));
                }
                startPos = ++endPos;
            } else {
                endPos++;
            }
        }
        this.pos = ++endPos;
        if (this.text.slice(startPos, endPos - 1).trim().length) result.push(this.text.slice(startPos, endPos - 1));
        return result;
    }
    getNextTokens(amount: number): string[] {
        const result = new Array<string>(amount);
        while (amount--) result.push(this.getToken());
        return result;
    }
    getAllTokens(): string[] {
        const result: string[] = [];
        while (true) {
            const tk = this.getTokensUntilNewLine();
            if (tk.length) result.push(...tk);
            else break;
        }
        return result;
    }
}