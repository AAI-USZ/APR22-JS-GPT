

"use strict";





const assert = require("assert"),
{ Linter } = require("../../../../lib/linter");
const linter = new Linter();






function parseCodePaths(code) {
const retv = [];

linter.defineRule("test", () => ({
onCodePathStart(codePath) {
retv.push(codePath);
}
}));
linter.verify(code, { rules: { test: 2 } });

return retv;
}


function getOrderOfTraversing(codePath, options, callback) {
const retv = [];

codePath.traverseSegments(options, (segment, controller) => {
retv.push(segment.id);
if (callback) {
callback(segment, controller);
}
});

return retv;
}





describe("CodePathAnalyzer", () => {
describe(".traverseSegments()", () => {
describe("should traverse segments from the first to the end:", () => {

it("simple", () => {
const codePath = parseCodePaths("foo(); bar(); baz();")[0];
const order = getOrderOfTraversing(codePath);

assert.deepStrictEqual(order, ["s1_1"]);


});

it("if", () => {
const codePath = parseCodePaths("if (a) foo(); else bar(); baz();")[0];
const order = getOrderOfTraversing(codePath);

assert.deepStrictEqual(order, ["s1_1", "s1_2", "s1_3", "s1_4"]);


});

it("switch", () => {
const codePath = parseCodePaths("switch (a) { case 0: foo(); break; case 1: bar(); } baz();")[0];
const order = getOrderOfTraversing(codePath);

assert.deepStrictEqual(order, ["s1_1", "s1_2", "s1_4", "s1_5", "s1_6"]);


});

it("while", () => {
const codePath = parseCodePaths("while (a) foo(); bar();")[0];
const order = getOrderOfTraversing(codePath);

assert.deepStrictEqual(order, ["s1_1", "s1_2", "s1_3", "s1_4"]);


});

it("for", () => {
const codePath = parseCodePaths("for (var i = 0; i < 10; ++i) foo(i); bar();")[0];
const order = getOrderOfTraversing(codePath);

assert.deepStrictEqual(order, ["s1_1", "s1_2", "s1_3", "s1_4", "s1_5"]);


});

it("for-in", () => {
const codePath = parseCodePaths("for (var key in obj) foo(key); bar();")[0];
const order = getOrderOfTraversing(codePath);

assert.deepStrictEqual(order, ["s1_1", "s1_3", "s1_2", "s1_4", "s1_5"]);


});

it("try-catch", () => {
const codePath = parseCodePaths("try { foo(); } catch (e) { bar(); } baz();")[0];
const order = getOrderOfTraversing(codePath);

assert.deepStrictEqual(order, ["s1_1", "s1_2", "s1_3", "s1_4"]);


});
});

it("should traverse segments from `options.first` to `options.last`.", () => {
const codePath = parseCodePaths("if (a) { if (b) { foo(); } bar(); } else { out1(); } out2();")[0];
const order = getOrderOfTraversing(codePath, {
first: codePath.initialSegment.nextSegments[0],
last: codePath.initialSegment.nextSegments[0].nextSegments[1]
});

assert.deepStrictEqual(order, ["s1_2", "s1_3", "s1_4"]);


});

it("should stop immediately when 'controller.break()' was called.", () => {
const codePath = parseCodePaths("if (a) { if (b) { foo(); } bar(); } else { out1(); } out2();")[0];
const order = getOrderOfTraversing(codePath, null, (segment, controller) => {
if (segment.id === "s1_2") {
controller.break();
}
});

assert.deepStrictEqual(order, ["s1_1", "s1_2"]);


});

it("should skip the current branch when 'controller.skip()' was called.", () => {
const codePath = parseCodePaths("if (a) { if (b) { foo(); } bar(); } else { out1(); } out2();")[0];
const order = getOrderOfTraversing(codePath, null, (segment, controller) => {
if (segment.id === "s1_2") {
controller.skip();
}
});

assert.deepStrictEqual(order, ["s1_1", "s1_2", "s1_5", "s1_6"]);


});


});
});
