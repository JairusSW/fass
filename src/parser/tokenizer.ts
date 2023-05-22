export class Tokenizer {
  private text: string;
  public currentToken: {
    value: string;
    index: number;
  } | null = null;
  public currentTokenIndex: number = 0;
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

  private getNextToken(): { value: string; index: number } | null {
    let text = this.text.slice(this.currentTokenIndex);
    const tokenRegExp = /[^\n\s:]+|:/g;
    const match = tokenRegExp.exec(text);
    if (match) {
      const value = match[0];
      if (value.startsWith("//")) {
        const comment = text.slice(
          match.index,
          text.indexOf("\n", match.index)
        );
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
