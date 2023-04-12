import { Declaration } from "../../parser/nodes/Declaration";

export class Generator {
    public decls!: Declaration[];
    constructor(decls: Declaration[]) {
        this.decls = decls;
    }
}