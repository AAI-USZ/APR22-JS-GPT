





module.exports = function(context) {
"use strict";

var config = context.options[0];

return {
"Program": function(node) {
if (config && config !== "foo") {
context.report(node, "Expected foo.");
}
}
};
};

module.exports.schema = [
{
"enum": ["foo"]
}
];
