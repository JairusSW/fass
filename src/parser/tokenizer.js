"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = void 0;
class Tokenizer {
    constructor(text) {
        this.currentToken = null;
        this.currentTokenIndex = 0;
        this.text = text;
    }
    getToken() {
        this.currentToken = this.getNextToken();
        return this.currentToken ? this.currentToken.value : null;
    }
    seeToken() {
        const pos = this.currentTokenIndex;
        const currentToken = this.getNextToken();
        this.currentTokenIndex = pos;
        return currentToken ? currentToken.value : null;
    }
    getTokensUntil(splitter) {
        const tokens = [];
        this.currentToken = this.getNextToken();
        while (this.currentToken && this.currentToken.value !== splitter) {
            tokens.push(this.currentToken.value);
            this.currentToken = this.getNextToken();
        }
        return tokens;
    }
    getAllTokens() {
        const tokens = [];
        const currentTokenIndex = this.currentTokenIndex;
        this.currentToken = this.getNextToken();
        while (this.currentToken) {
            tokens.push(this.currentToken.value);
            this.currentToken = this.getNextToken();
        }
        this.currentToken = null;
        this.currentTokenIndex = currentTokenIndex;
        return tokens;
    }
    getNextToken() {
        let text = this.text.slice(this.currentTokenIndex);
        const tokenRegExp = /[^\n\s:]+|:/g;
        const match = tokenRegExp.exec(text);
        if (match) {
            const value = match[0];
            if (value.startsWith("//")) {
                const comment = text.slice(match.index, text.indexOf("\n", match.index));
                this.currentTokenIndex =
                    match.index + comment.length + this.currentTokenIndex;
                return this.getNextToken();
            }
            let index = match.index + this.currentTokenIndex;
            this.currentTokenIndex = index + value.length;
            return { value, index };
        }
        return null;
    }
}
exports.Tokenizer = Tokenizer;
