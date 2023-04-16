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
        const text = this.text.slice(this.currentTokenIndex);
        const len = text.length;
        let value = "";
        let index = -1;
        let i = 0;

        while (i < len) {
            const c = text[i];
            if (c === " " || c === "\n") {
                i++;
                continue;
            } else if (c === ":") {
                value = ":";
                index = this.currentTokenIndex + i;
                break;
            } else {
                let start = i;
                while (i < len) {
                    const cc = text[i];
                    if (cc === " " || cc === "\n" || cc === ":") {
                        break;
                    }
                    i++;
                }
                value = text.slice(start, i);
                index = this.currentTokenIndex + start;
                break;
            }
        }

        if (value === "") {
            return undefined;
        }

        this.currentTokenIndex = index + value.length;
        return { value, index };
    }

}

const tokenizer = new Tokenizer(`include "./Vec3.fass"
include "./Movement.fass"

struct Player {
    name: char[8]
    id: i32
    pos: Vec3
    movement: Movement
    data: u8[5]
}`);

console.log(tokenizer.getAllTokens());