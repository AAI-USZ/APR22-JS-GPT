







var vows = require("vows"),
assert = require("assert"),
sinon = require("sinon"),
eslint = require("../../lib/eslint");





var TEST_CODE = "var answer = 6 * 7;";





vows.describe("eslint").addBatch({

"when evaluating code": {

topic: TEST_CODE,

"events for each node type should fire": function(topic) {

var config = { rules: {} };


var spyLiteral = sinon.spy(),
spyVariableDeclarator = sinon.spy(),
spyVariableDeclaration = sinon.spy(),
spyIdentifier = sinon.spy(),
spyBinaryExpression = sinon.spy();

eslint.reset();
eslint.on("Literal", spyLiteral);
eslint.on("VariableDeclarator", spyVariableDeclarator);
eslint.on("VariableDeclaration", spyVariableDeclaration);
eslint.on("Identifier", spyIdentifier);
eslint.on("BinaryExpression", spyBinaryExpression);

var messages = eslint.verify(topic, config, true);

assert.equal(messages.length, 0);
sinon.assert.calledOnce(spyVariableDeclaration);
sinon.assert.calledOnce(spyVariableDeclarator);
sinon.assert.calledOnce(spyIdentifier);
sinon.assert.calledTwice(spyLiteral);
sinon.assert.calledOnce(spyBinaryExpression);
},
},

"after calling reset()": {

topic: TEST_CODE,

"previously registered event handlers should not be called": function(topic) {

var config = { rules: {} };


var spyLiteral = sinon.spy(),
spyVariableDeclarator = sinon.spy(),
spyVariableDeclaration = sinon.spy(),
spyIdentifier = sinon.spy(),
spyBinaryExpression = sinon.spy();

eslint.reset();
