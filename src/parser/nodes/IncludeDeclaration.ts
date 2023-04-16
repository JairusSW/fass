import { Declaration } from "./Declaration";

export class IncludeDeclaration extends Declaration {
    public included: Declaration[] = [];
}