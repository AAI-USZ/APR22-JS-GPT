





module.exports = function(context) {

"use strict";





function checkForTrailingComma(node) {
var tokens = context.getTokens(node),
secondToLastToken = tokens[tokens.length - 2];



if (secondToLastToken.value === ",") {
context.report(node, "Found trailing comma in object literal.");
}
}





return {
"ObjectExpression": checkForTrailingComma,
"ArrayExpression": checkForTrailingComma
};

};
