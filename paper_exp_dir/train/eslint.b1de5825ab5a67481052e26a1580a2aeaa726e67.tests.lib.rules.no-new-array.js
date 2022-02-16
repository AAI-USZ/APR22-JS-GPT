





var eslintTester = require("../../../lib/tests/eslintTester");





eslintTester.addRuleTest("no-array-constructor", {
valid: [
"var foo = new foo.Array()"
],
invalid: [
{ code: "var foo = new Array()", errors: [{ message: "The array literal notation [] is preferrable.", type: "NewExpression"}] }
]
});
