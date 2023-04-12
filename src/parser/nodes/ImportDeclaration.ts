import { Declaration } from "./Declaration";

export class ImportDeclaration extends Declaration {
    public imported: Declaration[] = [];
}