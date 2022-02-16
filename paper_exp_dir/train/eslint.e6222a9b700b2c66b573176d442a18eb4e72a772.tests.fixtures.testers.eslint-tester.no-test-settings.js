





module.exports = function(context) {
"use strict";

return {
"Program": function(node) {
if (!context.settings || !context.settings.test) {
context.report(node, "Global settings test was not defined.");
}
}
};
};

