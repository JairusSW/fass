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
            if (this.text.charAt(endPos) == " " || this.text.charAt(endPos) == "\n") {
                this.pos = endPos;
                return this.text.slice(startPos, endPos);
            } else {
                endPos++;
            }
        }
        this.pos = endPos;
        return this.text.slice(startPos, endPos);
    }
    getNextTokens(amount: number): string[] {
        const result = new Array<string>(amount);
        while (amount--) result.push(this.getToken());
        return result;
    }
}

const text = `struct Vec3 {
    quad: Quadrant
    x: f32
    y: f32
    z: f32
}

enum Quadrant {
    TL
    TR
    BL
    BR
}`

const tk = new Tokenizer(text);

console.log(tk.getToken());
console.log(tk.getToken());
console.log(tk.getToken());
console.log(tk.getToken());
console.log(tk.getToken());
console.log(tk.getToken());
console.log(tk.getToken());
console.log(tk.getToken());
console.log(tk.getToken());
console.log(tk.getToken());
console.log(tk.getToken());
console.log(tk.getToken());
console.log(tk.getToken());
console.log(tk.getToken());
console.log(tk.getToken());
console.log(tk.getToken());
console.log(tk.getToken());
console.log(tk.getToken());
console.log(tk.getToken());
console.log(tk.getToken());