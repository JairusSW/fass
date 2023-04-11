import { MemberStatement } from "./nodes/MemberStatement";
import { StructDeclaration } from "./nodes/StructDeclaration";

export const SEPARATORS = [
    ":"
]
export class Tokenizer {
    public pos: number = 0;
    constructor(public text: string) {

    }
    getToken(): string {
        let startPos = this.pos;
        // Skip whitespace and newlines
        while (this.text.charAt(startPos) == " " || this.text.charAt(startPos) == "\n") startPos++;
        let endPos = startPos;
        // Find next whitespace or EOF
        while (endPos < this.text.length) {
            if (this.text.charAt(endPos) == " " || this.text.charAt(endPos) == "\n" || SEPARATORS.includes(this.text.charAt(endPos))) {
                this.pos = endPos;
                return this.text.slice(startPos, endPos);
            } else {
                endPos++;
            }
        }
        this.pos = endPos;
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
            } else if (SEPARATORS.includes(this.text.charAt(endPos)) || this.text.charAt(endPos) == " ") {
                if (this.text.slice(startPos, endPos).trim()) result.push(this.text.slice(startPos, endPos));
                if (SEPARATORS.includes(this.text.charAt(endPos))) {
                    result.push(this.text.charAt(endPos));
                }
                startPos = ++endPos;
            } else {
                endPos++;
            }
        }
        this.pos = ++endPos;
        result.push(this.text.slice(startPos, endPos - 1));
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
            const tok = this.getToken();
            if (!tok) break;
            result.push(this.getToken());
        }
        return result;
    }
}

const text = `struct Vec3 {
    x: f32
    y: f32
    z: f32
}`

const tk = new Tokenizer(text);

console.log(tk.getTokensUntilNewLine());
console.log(tk.getTokensUntilNewLine());
console.log(tk.getTokensUntilNewLine());
console.log(tk.getTokensUntilNewLine());
console.log(tk.getTokensUntilNewLine());

tk.pos = 0;

console.log(MemberStatement.validate(["x", ":", "f32"]));

console.log(MemberStatement.parse(["x", ":", "f32"]));

console.log(JSON.stringify(StructDeclaration.parse([
    'struct', 'Vec3', '{',
    'x', ':', 'f32',
    'y', ':', 'f32',
    'z', ':', 'f32',
    '}'
]), null, 2));