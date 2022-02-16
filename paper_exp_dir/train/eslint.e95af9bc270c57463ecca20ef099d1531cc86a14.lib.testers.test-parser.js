
"use strict";

const espree = require("espree");
const Traverser = require("../../lib/util/traverser");


function defineStartEndAsError(node) {
Object.defineProperty(node, "start", {
get() {
throw new Error("Use node.range[0] instead of node.start");
},
configurable: true,
enumerable: false
});
Object.defineProperty(node, "end", {
get() {
throw new Error("Use node.range[1] instead of node.end");
},
configurable: true,
enumerable: false
});
}


function defineStartEndAsErrorInTree(ast) {
new Traverser().traverse(ast, { enter: defineStartEndAsError });
ast.tokens.forEach(defineStartEndAsError);
ast.comments.forEach(defineStartEndAsError);
}

module.exports.parse = (code, options) => {
const ret = espree.parse(code, options);

defineStartEndAsErrorInTree(ret.ast || ret);

return ret;
};
