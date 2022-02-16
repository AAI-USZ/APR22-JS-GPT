

"use strict";





module.exports = function(context) {
var config = context.options[0] || {},
ignore = config.ignore || [0, 1, 2],
detectObjects = !!config.detectObjects,
enforceConst = !!config.enforceConst;


function isNumber(node) {
return typeof node.value === "number";
}


function shouldIgnoreNumber(num) {
return ignore.indexOf(num) !== -1;
}


return {
"Literal": function(node) {
var parent = node.parent,
okTypes = detectObjects ? [] : ["ObjectExpression", "Property", "AssignmentExpression"];

if (!isNumber(node) || shouldIgnoreNumber(node.value)) {
return;
}

if (parent.type === "VariableDeclarator") {
if (enforceConst && parent.parent.kind !== "const") {
context.report({
node: node,
message: "Number constants declarations must use 'const'"
});
}
} else if (okTypes.indexOf(parent.type) === -1) {
context.report({
node: node,
message: "No magic number: " + node.raw
});
}
}
};
};

module.exports.schema = [{
"type": "object",
"properties": {
"detectObjects": {
"type": "boolean"
},
"enforceConst": {
"type": "boolean"
},
"ignore": {
"type": "array",
"items": {
"type": "number"
},
"uniqueItems": true
}
},
"additionalProperties": false
}];
