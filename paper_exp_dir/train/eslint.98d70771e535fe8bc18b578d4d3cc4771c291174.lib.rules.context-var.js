





module.exports = function(context) {

"use strict";
var stack = [{}];




function pushBlock() {
stack.push({});
}

function popBlock() {
stack.pop();
}

function hasAllowedAncestorsForCheck(ancestors) {
var grandparent = ancestors[ancestors.length-1],
belongsToFunction = grandparent.type === "FunctionDeclaration";

return belongsToFunction;
}

function addCommonDeclaration(node) {
var type = node.type,
topObject = stack.pop(),
i,
len,
declarations;

switch (type) {
case "VariableDeclaration":
declarations = node.declarations;
for (i = 0, len = declarations.length; i < len; i++) {
topObject[declarations[i].id.name] = 1;
}
break;
case "FunctionDeclaration":
declarations = node.params;
topObject[node.id.name] = 1;
for (i = 0, len = declarations.length; i < len; i++) {
topObject[declarations[i].name] = 1;
}
break;
case "CatchClause":
declarations = [];
topObject[node.param.name] = 1;

}

stack.push(topObject);
}

function checkStackForIdentifier(node) {
var i,
len,
ancestors = context.getAncestors();

if (!hasAllowedAncestorsForCheck(ancestors)) {
for (i = 0, len = stack.length; i < len; i++) {
if (stack[i][node.name]) {
return;
}
}

context.report(node, node.name + " used outside of binding context.");
}
}





return {
"BlockStatement": pushBlock,
"BlockStatement:after": popBlock,
"CatchClause": addCommonDeclaration,
"VariableDeclaration": addCommonDeclaration,
"FunctionDeclaration": addCommonDeclaration,
"Identifier": checkStackForIdentifier,
};

};
