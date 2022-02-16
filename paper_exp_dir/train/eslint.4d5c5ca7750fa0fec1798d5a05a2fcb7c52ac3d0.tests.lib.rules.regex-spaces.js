





var eslintTester = require("eslint-tester");

eslintTester.addRuleTest("lib/rules/no-regex-spaces", {
valid: [
"var foo = /bar {3}baz/;",
"var foo = /bar\t\t\tbaz/;"
],

invalid: [
{
code: "var foo = /bar    baz/;",
errors: [
