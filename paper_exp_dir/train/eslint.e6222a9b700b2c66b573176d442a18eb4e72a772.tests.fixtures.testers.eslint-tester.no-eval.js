





module.exports = function(context) {

"use strict";

return {
"CallExpression": function(node) {
if (node.callee.name === "eval") {
context.report(node, "eval sucks.");
}
}
};

};
