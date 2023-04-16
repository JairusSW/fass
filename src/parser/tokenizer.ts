export class Tokenizer {
    private text: string;
    private currentTokenIndex: number = 0;

    constructor(text: string) {
        this.text = text;
    }

    getToken(): string | undefined {
        const token = this.getNextToken();
        return token ? token.value : undefined;
    }

    getTokensUntil(splitter: string): string[] {
        const tokens: string[] = [];
        let token = this.getNextToken();
        while (token && token.value !== splitter) {
            tokens.push(token.value);
            token = this.getNextToken();
        }
        return tokens;
    }

    getAllTokens(): string[] {
        const tokens: string[] = [];
        let token = this.getNextToken();
        while (token) {
            tokens.push(token.value);
            token = this.getNextToken();
        }
        return tokens;
    }

    private getNextToken(): { value: string, index: number } | undefined {
        const tokenRegExp = /[\w]+|:/g;
        const match = tokenRegExp.exec(this.text.slice(this.currentTokenIndex));
        if (match) {
            const value = match[0];
            const index = match.index + this.currentTokenIndex;
            this.currentTokenIndex = index + value.length;
            return { value, index };
        }
        return undefined;
    }
}