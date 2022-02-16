
"use strict";


const assert = require("assert");
const tmpIt = it;
const tmpDescribe = describe;

it = null;
describe = null;

try {
const ruleTester = new RuleTester();

assert.throws(() => {
ruleTester.run("no-var", require("../../fixtures/testers/rule-tester/no-var"), {
valid: [
"bar = baz;"
],
invalid: [
{ code: "var foo = bar;", output: "invalid output", errors: 1 }
]
});
}, new assert.AssertionError({ actual: " foo = bar;", expected: "invalid output", operator: "===" }).message);
} finally {
it = tmpIt;
describe = tmpDescribe;
}
