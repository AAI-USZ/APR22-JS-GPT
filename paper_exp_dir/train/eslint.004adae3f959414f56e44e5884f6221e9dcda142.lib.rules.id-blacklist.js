

"use strict";






function isAssignmentTarget(node) {
const parent = node.parent;

return (


(
parent.type === "AssignmentExpression" &&
parent.left === node
) ||


parent.type === "ArrayPattern" ||
parent.type === "RestElement" ||
(
parent.type === "Property" &&
parent.value === node &&
parent.parent.type === "ObjectPattern"
) ||
(
parent.type === "AssignmentPattern" &&
parent.left === node
)
);
}


function isRenamedImport(node) {
const parent = node.parent;

return (
(
parent.type === "ImportSpecifier" &&
parent.imported !== parent.local &&
parent.imported === node
) ||
(
parent.type === "ExportSpecifier" &&
parent.parent.source &&
parent.local !== parent.exported &&
parent.local === node
)
);
}


function isRenamedInDestructuring(node) {
const parent = node.parent;

return (
(
!parent.computed &&
parent.type === "Property" &&
parent.parent.type === "ObjectPattern" &&
parent.value !== node &&
parent.key === node
)
);
}


function isShorthandPropertyDefinition(node) {
const parent = node.parent;

return (
parent.type === "Property" &&
parent.parent.type === "ObjectExpression" &&
parent.shorthand
);
}





module.exports = {
meta: {
type: "suggestion",

docs: {
description: "disallow specified identifiers",
category: "Stylistic Issues",
recommended: false,
url: "https://eslint.org/docs/rules/id-denylist"
},

schema: {
type: "array",
items: {
type: "string"
},
uniqueItems: true
},
messages: {
restricted: "Identifier '{{name}}' is restricted."
}
},

create(context) {

const denyList = new Set(context.options);
const reportedNodes = new Set();

let globalScope;


function isRestricted(name) {
return denyList.has(name);
}


function isReferenceToGlobalVariable(node) {
const variable = globalScope.set.get(node.name);

return variable && variable.defs.length === 0 &&
variable.references.some(ref => ref.identifier === node);
}


function shouldCheck(node) {
const parent = node.parent;


if (
parent.type === "MemberExpression" &&
parent.property === node &&
!parent.computed
) {
return isAssignmentTarget(parent);
}

return (
parent.type !== "CallExpression" &&
parent.type !== "NewExpression" &&
!isRenamedImport(node) &&
!isRenamedInDestructuring(node) &&
!(
isReferenceToGlobalVariable(node) &&
!isShorthandPropertyDefinition(node)
)
);
}


function report(node) {
if (!reportedNodes.has(node)) {
context.report({
node,
messageId: "restricted",
data: {
name: node.name
}
});
reportedNodes.add(node);
}
}

return {

Program() {
globalScope = context.getScope();
},

Identifier(node) {
if (isRestricted(node.name) && shouldCheck(node)) {
report(node);
}
}
};
}
};
