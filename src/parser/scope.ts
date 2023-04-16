import { Statement } from "./nodes/Statement";

export class Scope {
    public elements: ScopeElement[] = [];
    constructor() { }
    addElement(element: ScopeElement) {
        this.elements.push(element);
    }
    getElement(index?: number, name?: string) {
        if (index) {
            return this.elements[index];
        } else if (name) {
            let elementPosition = -1;
            const element = this.elements.find((value, pos) => {
                if (value.name == name) {
                    elementPosition = pos;
                    return value;
                };
            });
            if (elementPosition === -1) return undefined;
            return this.elements[elementPosition];
        }
        return undefined;
    }
}

export class ScopeElement {
    public name!: string;
    public node!: Statement;
    constructor(name: string, node: Statement) {
        this.name = name;
        this.node = node;
    }
}