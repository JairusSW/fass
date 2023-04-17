import { Declaration } from "./Declaration";

export class IncludeDeclaration extends Declaration {
    public predicate: string = "";
    public included: Declaration[] = [];
}