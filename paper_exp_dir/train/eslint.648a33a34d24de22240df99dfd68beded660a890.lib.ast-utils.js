

"use strict";





const esutils = require("esutils");
const espree = require("espree");





const anyFunctionPattern = /^(?:Function(?:Declaration|Expression)|ArrowFunctionExpression)$/;
const anyLoopPattern = /^(?:DoWhile|For|ForIn|ForOf|While)Statement$/;
const arrayOrTypedArrayPattern = /Array$/;
const arrayMethodPattern = /^(?:every|filter|find|findIndex|forEach|map|some)$/;
const bindOrCallOrApplyPattern = /^(?:bind|call|apply)$/;
const breakableTypePattern = /^(?:(?:Do)?While|For(?:In|Of)?|Switch)Statement$/;
const thisTagPattern = /^[\s*]*@this/m;


const COMMENTS_IGNORE_PATTERN = /^\s*(?:eslint|jshint\s+|jslint\s+|istanbul\s+|globals?\s+|exported\s+|jscs)/;
const LINEBREAKS = new Set(["\r\n", "\r", "\n", "\u2028", "\u2029"]);
const LINEBREAK_MATCHER = /\r\n|[\r\n\u2028\u2029]/;
const SHEBANG_MATCHER = /^#!([^\r\n]+)/;


const STATEMENT_LIST_PARENTS = new Set(["Program", "BlockStatement", "SwitchCase"]);


function isModifyingReference(reference, index, references) {
const identifier = reference.identifier;


const modifyingDifferentIdentifier = index === 0 ||
references[index - 1].identifier !== identifier;

return (identifier &&
reference.init === false &&
reference.isWrite() &&
modifyingDifferentIdentifier
);
}


function startsWithUpperCase(s) {
return s[0] !== s[0].toLocaleLowerCase();
}


function isES5Constructor(node) {
return (node.id && startsWithUpperCase(node.id.name));
}


function getUpperFunction(node) {
for (let currentNode = node; currentNode; currentNode = currentNode.parent) {
if (anyFunctionPattern.test(currentNode.type)) {
return currentNode;
}
}
return null;
}


function isFunction(node) {
return Boolean(node && anyFunctionPattern.test(node.type));
}


function isLoop(node) {
return Boolean(node && anyLoopPattern.test(node.type));
}


function isInLoop(node) {
for (let currentNode = node; currentNode && !isFunction(currentNode); currentNode = currentNode.parent) {
if (isLoop(currentNode)) {
return true;
}
}

return false;
}


function isNullOrUndefined(node) {
return (
module.exports.isNullLiteral(node) ||
(node.type === "Identifier" && node.name === "undefined") ||
(node.type === "UnaryExpression" && node.operator === "void")
);
}


function isCallee(node) {
return node.parent.type === "CallExpression" && node.parent.callee === node;
}


function isReflectApply(node) {
return (
node.type === "MemberExpression" &&
node.object.type === "Identifier" &&
node.object.name === "Reflect" &&
node.property.type === "Identifier" &&
node.property.name === "apply" &&
node.computed === false
);
}


function isArrayFromMethod(node) {
return (
node.type === "MemberExpression" &&
node.object.type === "Identifier" &&
arrayOrTypedArrayPattern.test(node.object.name) &&
node.property.type === "Identifier" &&
node.property.name === "from" &&
node.computed === false
);
}


function isMethodWhichHasThisArg(node) {
for (
let currentNode = node;
currentNode.type === "MemberExpression" && !currentNode.computed;
currentNode = currentNode.property
) {
if (currentNode.property.type === "Identifier") {
return arrayMethodPattern.test(currentNode.property.name);
}
}

return false;
}


function negate(f) {
return token => !f(token);
}


function hasJSDocThisTag(node, sourceCode) {
const jsdocComment = sourceCode.getJSDocComment(node);

if (jsdocComment && thisTagPattern.test(jsdocComment.value)) {
return true;
}





return sourceCode.getCommentsBefore(node).some(comment => thisTagPattern.test(comment.value));
}


function isParenthesised(sourceCode, node) {
const previousToken = sourceCode.getTokenBefore(node),
nextToken = sourceCode.getTokenAfter(node);

return Boolean(previousToken && nextToken) &&
previousToken.value === "(" && previousToken.range[1] <= node.range[0] &&
nextToken.value === ")" && nextToken.range[0] >= node.range[1];
}


function isArrowToken(token) {
return token.value === "=>" && token.type === "Punctuator";
}


function isCommaToken(token) {
return token.value === "," && token.type === "Punctuator";
}


function isSemicolonToken(token) {
return token.value === ";" && token.type === "Punctuator";
}


function isColonToken(token) {
return token.value === ":" && token.type === "Punctuator";
}


function isOpeningParenToken(token) {
return token.value === "(" && token.type === "Punctuator";
}


function isClosingParenToken(token) {
return token.value === ")" && token.type === "Punctuator";
}


function isOpeningBracketToken(token) {
return token.value === "[" && token.type === "Punctuator";
}


function isClosingBracketToken(token) {
return token.value === "]" && token.type === "Punctuator";
}


function isOpeningBraceToken(token) {
return token.value === "{" && token.type === "Punctuator";
}


function isClosingBraceToken(token) {
return token.value === "}" && token.type === "Punctuator";
}


function isCommentToken(token) {
return token.type === "Line" || token.type === "Block" || token.type === "Shebang";
}


function isKeywordToken(token) {
return token.type === "Keyword";
}


function getOpeningParenOfParams(node, sourceCode) {
return node.id
? sourceCode.getTokenAfter(node.id, isOpeningParenToken)
: sourceCode.getFirstToken(node, isOpeningParenToken);
}


function createGlobalLinebreakMatcher() {
return new RegExp(LINEBREAK_MATCHER.source, "g");
}


function equalTokens(left, right, sourceCode) {
const tokensL = sourceCode.getTokens(left);
const tokensR = sourceCode.getTokens(right);

if (tokensL.length !== tokensR.length) {
return false;
}
for (let i = 0; i < tokensL.length; ++i) {
if (tokensL[i].type !== tokensR[i].type ||
tokensL[i].value !== tokensR[i].value
) {
return false;
}
}

return true;
}





module.exports = {
COMMENTS_IGNORE_PATTERN,
LINEBREAKS,
LINEBREAK_MATCHER,
SHEBANG_MATCHER,
STATEMENT_LIST_PARENTS,


isTokenOnSameLine(left, right) {
return left.loc.end.line === right.loc.start.line;
},

isNullOrUndefined,
isCallee,
isES5Constructor,
getUpperFunction,
isFunction,
isLoop,
isInLoop,
isArrayFromMethod,
isParenthesised,
createGlobalLinebreakMatcher,
equalTokens,

isArrowToken,
isClosingBraceToken,
isClosingBracketToken,
isClosingParenToken,
isColonToken,
isCommaToken,
isCommentToken,
isKeywordToken,
isNotClosingBraceToken: negate(isClosingBraceToken),
isNotClosingBracketToken: negate(isClosingBracketToken),
isNotClosingParenToken: negate(isClosingParenToken),
isNotColonToken: negate(isColonToken),
isNotCommaToken: negate(isCommaToken),
isNotOpeningBraceToken: negate(isOpeningBraceToken),
isNotOpeningBracketToken: negate(isOpeningBracketToken),
isNotOpeningParenToken: negate(isOpeningParenToken),
isNotSemicolonToken: negate(isSemicolonToken),
isOpeningBraceToken,
isOpeningBracketToken,
isOpeningParenToken,
isSemicolonToken,


isStringLiteral(node) {
return (
(node.type === "Literal" && typeof node.value === "string") ||
node.type === "TemplateLiteral"
);
},


isBreakableStatement(node) {
return breakableTypePattern.test(node.type);
},


getLabel(node) {
if (node.parent.type === "LabeledStatement") {
return node.parent.label.name;
}
return null;
},


getModifyingReferences(references) {
return references.filter(isModifyingReference);
},


isSurroundedBy(val, character) {
return val[0] === character && val[val.length - 1] === character;
},


isDirectiveComment(node) {
const comment = node.value.trim();

return (
node.type === "Line" && comment.indexOf("eslint-") === 0 ||
node.type === "Block" && (
comment.indexOf("global ") === 0 ||
comment.indexOf("eslint ") === 0 ||
comment.indexOf("eslint-") === 0
)
);
},


getTrailingStatement: esutils.ast.trailingStatement,


getVariableByName(initScope, name) {
let scope = initScope;

while (scope) {
const variable = scope.set.get(name);

if (variable) {
return variable;
}

scope = scope.upper;
}

return null;
},


isDefaultThisBinding(node, sourceCode) {
if (isES5Constructor(node) || hasJSDocThisTag(node, sourceCode)) {
return false;
}
const isAnonymous = node.id === null;
let currentNode = node;

while (currentNode) {
const parent = currentNode.parent;

switch (parent.type) {


case "LogicalExpression":
case "ConditionalExpression":
currentNode = parent;
break;


case "ReturnStatement": {
const func = getUpperFunction(parent);

if (func === null || !isCallee(func)) {
return true;
}
currentNode = func.parent;
break;
}
case "ArrowFunctionExpression":
if (currentNode !== parent.body || !isCallee(parent)) {
return true;
}
currentNode = parent.parent;
break;


case "Property":
case "MethodDefinition":
return parent.value !== currentNode;


case "AssignmentExpression":
case "AssignmentPattern":
if (parent.left.type === "MemberExpression") {
return false;
}
if (
isAnonymous &&
parent.left.type === "Identifier" &&
startsWithUpperCase(parent.left.name)
) {
return false;
}
return true;


case "VariableDeclarator":
return !(
isAnonymous &&
parent.init === currentNode &&
parent.id.type === "Identifier" &&
startsWithUpperCase(parent.id.name)
);


case "MemberExpression":
return (
parent.object !== currentNode ||
parent.property.type !== "Identifier" ||
!bindOrCallOrApplyPattern.test(parent.property.name) ||
!isCallee(parent) ||
parent.parent.arguments.length === 0 ||
isNullOrUndefined(parent.parent.arguments[0])
);


case "CallExpression":
if (isReflectApply(parent.callee)) {
return (
parent.arguments.length !== 3 ||
parent.arguments[0] !== currentNode ||
isNullOrUndefined(parent.arguments[1])
);
}
if (isArrayFromMethod(parent.callee)) {
return (
parent.arguments.length !== 3 ||
parent.arguments[1] !== currentNode ||
isNullOrUndefined(parent.arguments[2])
);
}
if (isMethodWhichHasThisArg(parent.callee)) {
return (
parent.arguments.length !== 2 ||
parent.arguments[0] !== currentNode ||
isNullOrUndefined(parent.arguments[1])
);
}
return true;


default:
return true;
}
}


return true;
},


getPrecedence(node) {
switch (node.type) {
case "SequenceExpression":
return 0;

case "AssignmentExpression":
case "ArrowFunctionExpression":
case "YieldExpression":
return 1;

case "ConditionalExpression":
return 3;

case "LogicalExpression":
switch (node.operator) {
case "||":
return 4;
case "&&":
return 5;


}



case "BinaryExpression":

switch (node.operator) {
case "|":
return 6;
case "^":
return 7;
case "&":
return 8;
case "==":
case "!=":
case "===":
case "!==":
return 9;
case "<":
case "<=":
case ">":
case ">=":
case "in":
case "instanceof":
return 10;
case "<<":
case ">>":
case ">>>":
return 11;
case "+":
case "-":
return 12;
case "*":
case "/":
case "%":
return 13;
case "**":
return 15;


}



case "UnaryExpression":
case "AwaitExpression":
return 16;

case "UpdateExpression":
return 17;

case "CallExpression":
return 18;

case "NewExpression":
return 19;

default:
return 20;
}
},


isEmptyBlock(node) {
return Boolean(node && node.type === "BlockStatement" && node.body.length === 0);
},


isEmptyFunction(node) {
return isFunction(node) && module.exports.isEmptyBlock(node.body);
},


getStaticPropertyName(node) {
let prop;

switch (node && node.type) {
case "Property":
case "MethodDefinition":
prop = node.key;
break;

case "MemberExpression":
prop = node.property;
break;


}

switch (prop && prop.type) {
case "Literal":
return String(prop.value);

case "TemplateLiteral":
if (prop.expressions.length === 0 && prop.quasis.length === 1) {
return prop.quasis[0].value.cooked;
}
break;

case "Identifier":
if (!node.computed) {
return prop.name;
}
break;


}

return null;
},


getDirectivePrologue(node) {
const directives = [];


if (
node.type === "Program" ||
node.type === "FunctionDeclaration" ||
node.type === "FunctionExpression" ||


(node.type === "ArrowFunctionExpression" && node.body.type === "BlockStatement")
) {
const statements = node.type === "Program" ? node.body : node.body.body;

for (const statement of statements) {
if (
statement.type === "ExpressionStatement" &&
statement.expression.type === "Literal"
) {
directives.push(statement);
} else {
break;
}
}
}

return directives;
},



isDecimalInteger(node) {
return node.type === "Literal" && typeof node.value === "number" && /^(0|[1-9]\d*)$/.test(node.raw);
},


getFunctionNameWithKind(node) {
const parent = node.parent;
const tokens = [];

if (parent.type === "MethodDefinition" && parent.static) {
tokens.push("static");
}
if (node.async) {
tokens.push("async");
}
if (node.generator) {
tokens.push("generator");
}

if (node.type === "ArrowFunctionExpression") {
tokens.push("arrow", "function");
} else if (parent.type === "Property" || parent.type === "MethodDefinition") {
if (parent.kind === "constructor") {
return "constructor";
}
if (parent.kind === "get") {
tokens.push("getter");
} else if (parent.kind === "set") {
tokens.push("setter");
} else {
tokens.push("method");
}
} else {
tokens.push("function");
}

if (node.id) {
tokens.push(`'${node.id.name}'`);
} else {
const name = module.exports.getStaticPropertyName(parent);

if (name) {
tokens.push(`'${name}'`);
}
}

return tokens.join(" ");
},


getFunctionHeadLoc(node, sourceCode) {
const parent = node.parent;
let start = null;
let end = null;

if (node.type === "ArrowFunctionExpression") {
const arrowToken = sourceCode.getTokenBefore(node.body, isArrowToken);

start = arrowToken.loc.start;
end = arrowToken.loc.end;
} else if (parent.type === "Property" || parent.type === "MethodDefinition") {
start = parent.loc.start;
end = getOpeningParenOfParams(node, sourceCode).loc.start;
} else {
start = node.loc.start;
end = getOpeningParenOfParams(node, sourceCode).loc.start;
}

return {
start: Object.assign({}, start),
end: Object.assign({}, end)
};
},


getParenthesisedText(sourceCode, node) {
let leftToken = sourceCode.getFirstToken(node);
let rightToken = sourceCode.getLastToken(node);

while (
sourceCode.getTokenBefore(leftToken) &&
sourceCode.getTokenBefore(leftToken).type === "Punctuator" &&
sourceCode.getTokenBefore(leftToken).value === "(" &&
sourceCode.getTokenAfter(rightToken) &&
sourceCode.getTokenAfter(rightToken).type === "Punctuator" &&
sourceCode.getTokenAfter(rightToken).value === ")"
) {
leftToken = sourceCode.getTokenBefore(leftToken);
rightToken = sourceCode.getTokenAfter(rightToken);
}

return sourceCode.getText().slice(leftToken.range[0], rightToken.range[1]);
},


couldBeError(node) {
switch (node.type) {
case "Identifier":
case "CallExpression":
case "NewExpression":
case "MemberExpression":
case "TaggedTemplateExpression":
case "YieldExpression":
case "AwaitExpression":
return true;

case "AssignmentExpression":
return module.exports.couldBeError(node.right);

case "SequenceExpression": {
const exprs = node.expressions;

return exprs.length !== 0 && module.exports.couldBeError(exprs[exprs.length - 1]);
}

case "LogicalExpression":
return module.exports.couldBeError(node.left) || module.exports.couldBeError(node.right);

case "ConditionalExpression":
return module.exports.couldBeError(node.consequent) || module.exports.couldBeError(node.alternate);

default:
return false;
}
},


isNullLiteral(node) {


return node.type === "Literal" && node.value === null && !node.regex;
},


canTokensBeAdjacent(leftValue, rightValue) {
let leftToken;

if (typeof leftValue === "string") {
const leftTokens = espree.tokenize(leftValue, { ecmaVersion: 2015 });

leftToken = leftTokens[leftTokens.length - 1];
} else {
leftToken = leftValue;
}

const rightToken = typeof rightValue === "string" ? espree.tokenize(rightValue, { ecmaVersion: 2015 })[0] : rightValue;

if (leftToken.type === "Punctuator" || rightToken.type === "Punctuator") {
if (leftToken.type === "Punctuator" && rightToken.type === "Punctuator") {
const PLUS_TOKENS = new Set(["+", "++"]);
const MINUS_TOKENS = new Set(["-", "--"]);

return !(
PLUS_TOKENS.has(leftToken.value) && PLUS_TOKENS.has(rightToken.value) ||
MINUS_TOKENS.has(leftToken.value) && MINUS_TOKENS.has(rightToken.value)
);
}
return true;
}

if (
leftToken.type === "String" || rightToken.type === "String" ||
leftToken.type === "Template" || rightToken.type === "Template"
) {
return true;
}

if (leftToken.type !== "Numeric" && rightToken.type === "Numeric" && rightToken.value.startsWith(".")) {
return true;
}

return false;
}
};
