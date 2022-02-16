





module.exports = function(context) {

"use strict";

return {

"NewExpression": function(node) {
if (node.callee.name === "Array") {
context.report(node, "The array literal notation [] is preferrable.");
}
}
};

};
