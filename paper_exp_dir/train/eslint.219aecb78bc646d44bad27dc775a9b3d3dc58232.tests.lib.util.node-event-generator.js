
"use strict";





const assert = require("assert"),
sinon = require("sinon"),
espree = require("espree"),
Traverser = require("../../../lib/shared/traverser"),
EventGeneratorTester = require("../../../tools/internal-testers/event-generator-tester"),
createEmitter = require("../../../lib/linter/safe-emitter"),
NodeEventGenerator = require("../../../lib/linter/node-event-generator");





const ESPREE_CONFIG = {
ecmaVersion: 6,
comment: true,
tokens: true,
range: true,
loc: true
};

describe("NodeEventGenerator", () => {
EventGeneratorTester.testEventGeneratorInterface(
new NodeEventGenerator(createEmitter())
);

describe("entering a single AST node", () => {
let emitter, generator;

beforeEach(() => {
emitter = Object.create(createEmitter(), { emit: { value: sinon.spy() } });

["Foo", "Bar", "Foo > Bar", "Foo:exit"].forEach(selector => emitter.on(selector, () => {}));
generator = new NodeEventGenerator(emitter);
});

it("should generate events for entering AST node.", () => {
const dummyNode = { type: "Foo", value: 1 };

generator.enterNode(dummyNode);

assert(emitter.emit.calledOnce);
assert(emitter.emit.calledWith("Foo", dummyNode));
});

it("should generate events for exitting AST node.", () => {
const dummyNode = { type: "Foo", value: 1 };

generator.leaveNode(dummyNode);

assert(emitter.emit.calledOnce);
assert(emitter.emit.calledWith("Foo:exit", dummyNode));
});

it("should generate events for AST queries", () => {
const dummyNode = { type: "Bar", parent: { type: "Foo" } };

generator.enterNode(dummyNode);

assert(emitter.emit.calledTwice);
assert(emitter.emit.calledWith("Foo > Bar", dummyNode));
});
});

describe("traversing the entire AST", () => {


function getEmissions(ast, possibleQueries) {
const emissions = [];
const emitter = Object.create(createEmitter(), {
emit: {
value: (selector, node) => emissions.push([selector, node])
}
});

possibleQueries.forEach(query => emitter.on(query, () => {}));
const generator = new NodeEventGenerator(emitter);

Traverser.traverse(ast, {
enter(node, parent) {
node.parent = parent;
generator.enterNode(node);
},
leave(node) {
generator.leaveNode(node);
}
});

return emissions;
}


function assertEmissions(sourceText, possibleQueries, expectedEmissions) {
it(possibleQueries.join("; "), () => {
const ast = espree.parse(sourceText, ESPREE_CONFIG);
const emissions = getEmissions(ast, possibleQueries)
.filter(emission => possibleQueries.indexOf(emission[0]) !== -1);

assert.deepStrictEqual(emissions, expectedEmissions(ast));
});
}

assertEmissions(
"foo + bar;",
["Program", "Program:exit", "ExpressionStatement", "ExpressionStatement:exit", "BinaryExpression", "BinaryExpression:exit", "Identifier", "Identifier:exit"],
ast => [
["Program", ast],
["ExpressionStatement", ast.body[0]],
["BinaryExpression", ast.body[0].expression],
["Identifier", ast.body[0].expression.left],
["Identifier:exit", ast.body[0].expression.left],
["Identifier", ast.body[0].expression.right],
["Identifier:exit", ast.body[0].expression.right],
["BinaryExpression:exit", ast.body[0].expression],
["ExpressionStatement:exit", ast.body[0]],
["Program:exit", ast]
]
);

assertEmissions(
"foo + 5",
[
"BinaryExpression > Identifier",
"BinaryExpression",
"BinaryExpression Literal:exit",
"BinaryExpression > Identifier:exit",
"BinaryExpression:exit"
],
ast => [
["BinaryExpression", ast.body[0].expression],
["BinaryExpression > Identifier", ast.body[0].expression.left],
["BinaryExpression > Identifier:exit", ast.body[0].expression.left],
["BinaryExpression Literal:exit", ast.body[0].expression.right],
["BinaryExpression:exit", ast.body[0].expression]
]
);

assertEmissions(
"foo + 5",
["BinaryExpression > *[name='foo']"],
ast => [["BinaryExpression > *[name='foo']", ast.body[0].expression.left]]
);

assertEmissions(
"foo",
["*"],
ast => [
["*", ast],
["*", ast.body[0]],
["*", ast.body[0].expression]
]
);

assertEmissions(
"foo",
["*:not(ExpressionStatement)"],
ast => [
["*:not(ExpressionStatement)", ast],
["*:not(ExpressionStatement)", ast.body[0].expression]
]
);

assertEmissions(
"foo()",
["CallExpression[callee.name='foo']"],
ast => [["CallExpression[callee.name='foo']", ast.body[0].expression]]
);

assertEmissions(
"foo()",
["CallExpression[callee.name='bar']"],
() => []
);

assertEmissions(
"foo + bar + baz",
[":not(*)"],
() => []
);

assertEmissions(
"foo + bar + baz",
[":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])"],
ast => [
[":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])", ast.body[0].expression.left.left],
[":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])", ast.body[0].expression.left.right],
[":matches(Identifier[name='foo'], Identifier[name='bar'], Identifier[name='baz'])", ast.body[0].expression.right]
]
);

assertEmissions(
"foo + 5 + 6",
["Identifier, Literal[value=5]"],
ast => [
["Identifier, Literal[value=5]", ast.body[0].expression.left.left],
["Identifier, Literal[value=5]", ast.body[0].expression.left.right]
]
);

assertEmissions(
"[foo, 5, foo]",
["Identifier + Literal"],
ast => [["Identifier + Literal", ast.body[0].expression.elements[1]]]
);

assertEmissions(
"[foo, {}, 5]",
["Identifier + Literal", "Identifier ~ Literal"],
ast => [["Identifier ~ Literal", ast.body[0].expression.elements[2]]]
);

assertEmissions(
"foo; bar + baz; qux()",
[":expression", ":statement"],
ast => [
[":statement", ast.body[0]],
[":expression", ast.body[0].expression],
[":statement", ast.body[1]],
[":expression", ast.body[1].expression],
[":expression", ast.body[1].expression.left],
[":expression", ast.body[1].expression.right],
[":statement", ast.body[2]],
[":expression", ast.body[2].expression],
[":expression", ast.body[2].expression.callee]
]
);

assertEmissions(
"foo;",
[
"*",
":not(*)",
"Identifier",
"ExpressionStatement > *",
"ExpressionStatement > Identifier",
"ExpressionStatement > [name='foo']",
"Identifier, ReturnStatement",
"FooStatement",
"[name = 'foo']",
"[name='foo']",
"[name ='foo']",
"Identifier[name='foo']",
"[name='foo'][name.length=3]",
":not(Program, ExpressionStatement)",
":not(Program, Identifier) > [name.length=3]"
],
ast => [
["*", ast],
["*", ast.body[0]],


["*", ast.body[0].expression],
["ExpressionStatement > *", ast.body[0].expression],
["Identifier", ast.body[0].expression],
[":not(Program, ExpressionStatement)", ast.body[0].expression],
["ExpressionStatement > Identifier", ast.body[0].expression],
["Identifier, ReturnStatement", ast.body[0].expression],
["[name = 'foo']", ast.body[0].expression],
["[name ='foo']", ast.body[0].expression],
["[name='foo']", ast.body[0].expression],
["ExpressionStatement > [name='foo']", ast.body[0].expression],
["Identifier[name='foo']", ast.body[0].expression],
[":not(Program, Identifier) > [name.length=3]", ast.body[0].expression],
["[name='foo'][name.length=3]", ast.body[0].expression]
]
);

assertEmissions(
"foo(); bar; baz;",
["CallExpression, [name='bar']"],
ast => [
["CallExpression, [name='bar']", ast.body[0].expression],
["CallExpression, [name='bar']", ast.body[1].expression]
]
);

assertEmissions(
"foo; bar;",
["[name.length=3]:exit"],
ast => [
["[name.length=3]:exit", ast.body[0].expression],
["[name.length=3]:exit", ast.body[1].expression]
]
);
});

describe("parsing an invalid selector", () => {
it("throws a useful error", () => {
const emitter = createEmitter();

emitter.on("Foo >", () => {});
assert.throws(
() => new NodeEventGenerator(emitter),
/Syntax error in selector "Foo >" at position 5: Expected " ", "!", .*/u
);
});
});
});
