"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopeElement = exports.Scope = void 0;
class Scope {
    constructor() {
        this.elements = [];
    }
    addElement(element) {
        this.elements.push(element);
    }
    getElement(index, name) {
        if (index) {
            return this.elements[index];
        }
        else if (name) {
            let elementPosition = -1;
            const element = this.elements.find((value, pos) => {
                if (value.name == name) {
                    elementPosition = pos;
                    return value;
                }
            });
            if (elementPosition === -1)
                return null;
            return element;
        }
        return null;
    }
}
exports.Scope = Scope;
class ScopeElement {
    constructor(name, node) {
        this.name = name;
        this.node = node;
    }
}
exports.ScopeElement = ScopeElement;
