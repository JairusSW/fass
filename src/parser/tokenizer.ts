export class Tokenizer {
    private text: string;
    public currentToken: {
        value: string,
        index: number
    } | undefined = undefined;
    public currentTokenIndex: number = 0;

    constructor(text: string) {
        this.text = text;
    }

    getToken(): string | undefined {
        this.currentToken = this.getNextToken();
        return this.currentToken ? this.currentToken.value : undefined;
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

    private getNextToken(): { value: string, index: number } | undefined {

        let text = this.text.slice(this.currentTokenIndex);
        const tokenRegExp = /[^\n\s:]+|:/g;
        const match = tokenRegExp.exec(text);
        if (match) {
            const value = match[0];
            let index = match.index + this.currentTokenIndex;
            this.currentTokenIndex = index + value.length;
            return { value, index };
        }
        return undefined;
    }
}

/*const tokenizer = new Tokenizer(`include "./Vec3.fass"
include "./Movement.fass"

struct Player {
    name: char[8]
    id: i32
    pos: Vec3
    movement: Movement
    data: u8[5]
}`);

console.log(tokenizer.getAllTokens());*/