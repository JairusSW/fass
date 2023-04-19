grammar Fass

entry Program:
    (declarations+=Declaration)*;

Declaration:
    StructDeclaration;

StructDeclaration:
    "struct" name=IdentifierExpression "{"
        (members+=MemberStatement)*
    "}";

MemberStatement:
    name=IdentifierExpression ":" type=TypeExpression;

EnumDeclaration:
    "enum" name=IdentifierExpression "{"
        (members+=EnumMemberStatement*)?
    "}";

EnumMemberStatement:
    name=IdentifierExpression ("=" (value=IntegerLiteral)*)?;

IncludeDeclaration:
    "include" predicate=ID;

IntegerLiteral:
    value=INT;

TypeExpression:
    text=ID;

IdentifierExpression: 
    value=ID;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal FLOAT returns number: /[0-9]+\.[0-9]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"[^"]*"|'[^']*'/; // We're not handling strings yet.

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
