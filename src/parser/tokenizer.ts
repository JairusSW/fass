export class Tokenizer {
    private text: string;
    public currentToken: {
        value: string,
        index: number
    } | null = null;
    public currentTokenIndex: number = 0;
    private isComment: boolean = false;
    constructor(text: string) {
        this.text = text;
    }

    getToken(): string | null {
        this.currentToken = this.getNextToken();
        return this.currentToken ? this.currentToken.value : null;
    }

    seeToken(): string | null {
        const pos = this.currentTokenIndex;
        const currentToken = this.getNextToken();
        this.currentTokenIndex = pos;
        return currentToken ? currentToken.value : null;
    }

    getTokensUntil(splitter: string): string[] {
        const tokens: string[] = [];
        this.currentToken = this.getNextToken();
        while (this.currentToken && this.currentToken.value !== splitter) {
            tokens.push(this.currentToken.value);
            this.currentToken = this.getNextToken();
        }
        return tokens;
    }

    getAllTokens(): string[] {
        const tokens: string[] = [];
        this.currentToken = this.getNextToken();
        while (this.currentToken) {
            tokens.push(this.currentToken.value);
            this.currentToken = this.getNextToken();
        }
        return tokens;
    }

    private getNextToken(): { value: string, index: number } | null {

        let text = this.text.slice(this.currentTokenIndex);
        const tokenRegExp = /[^\n\s:]+|:/g;
        const match = tokenRegExp.exec(text);
        if (match) {
            const value = match[0];
            if (value == "//") {
                const comment = text.slice(match.index, text.indexOf("\n", match.index));
                this.currentTokenIndex = match.index + comment.length + this.currentTokenIndex
                return {
                    value: comment,
                    index: this.currentTokenIndex
                }
            }
            let index = match.index + this.currentTokenIndex;
            this.currentTokenIndex = index + value.length;
            return { value, index };
        }
        return null;
    }
}

const tokenizer = new Tokenizer(`struct Vec3 {
    // This is a comment
    quad: Quadrant
    x: f32
    y: f32
    z: f32
}
enum Quadrant {
    TL = 1
    TR = 2
    BL = 3
    BR = 4
}`);

console.log(tokenizer.getAllTokens())