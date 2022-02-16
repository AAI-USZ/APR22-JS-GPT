
"use strict";





module.exports = function(context) {

function directives(block) {
var ds = [], body = block.body, e, i, l;

for (i = 0, l = body.length; i < l; ++i) {
e = body[i];

if (
e.type === "ExpressionStatement" &&
e.expression.type === "Literal" &&
typeof e.expression.value === "string"
) {
ds.push(e.expression);
