





var vows = require("vows"),
assert = require("assert"),
eslint = require("../../../lib/eslint");





var RULE_ID = "max-params";





vows.describe(RULE_ID).addBatch({

"when evaluating 'function test(a, b, c) {}'": {

topic: "function test(a, b, c) {}",

"should report a violation": function(topic) {
var config = { rules: {} };
config.rules[RULE_ID] = [1, 2];

var messages = eslint.verify(topic, config);

assert.equal(messages.length, 1);
assert.equal(messages[0].ruleId, RULE_ID);
assert.equal(messages[0].message, "test function has too many parameters");
assert.include(messages[0].node.type, "FunctionDeclaration");
}
},

"when evaluating 'function test(a, b, c, d) {}'": {

topic: "function test(a, b, c, d) {}",

"should report a violation": function(topic) {
var config = { rules: {} };
config.rules[RULE_ID] = 1;

var messages = eslint.verify(topic, config);

assert.equal(messages.length, 1);
assert.equal(messages[0].ruleId, RULE_ID);
assert.equal(messages[0].message, "test function has too many parameters");
assert.include(messages[0].node.type, "FunctionDeclaration");
}
},

"when evaluating 'function test(d, e, f) {}'": {

topic: "function test(d, e, f) {}",

"should not report a violation": function(topic) {
var config = { rules: {} };
config.rules[RULE_ID] = 1;

var messages = eslint.verify(topic, config);

assert.equal(messages.length, 0);
}
},

"when evaluating 'var test = function(a, b, c, d) {}'": {

