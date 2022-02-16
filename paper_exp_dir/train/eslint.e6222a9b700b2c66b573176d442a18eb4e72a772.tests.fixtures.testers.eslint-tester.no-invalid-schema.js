





module.exports = function(context) {
"use strict";

var config = context.options[0];

return {
"Program": function(node) {
if (config) {
context.report(node, "Expected nothing.");
}
}
};
};

module.exports.schema = [
{
"enum": []
}
];
