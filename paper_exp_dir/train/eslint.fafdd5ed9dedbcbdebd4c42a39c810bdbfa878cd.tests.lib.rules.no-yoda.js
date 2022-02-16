




var eslint = require("../../../lib/eslint"),
ESLintTester = require("eslint-tester");





var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/yoda", {
valid: [
{ code: "if (value === \"red\") {}", args: ["2", "never"] },
{ code: "if (value === value) {}", args: ["2", "never"] },
{ code: "if (value != 5) {}", args: ["2", "never"] },
{ code: "if (5 & foo) {}", args: ["2", "never"] },
{ code: "if (\"blue\" === value) {}", args: ["2", "always"] },
{ code: "if (value === value) {}", args: ["2", "always"] },
{ code: "if (4 != value) {}", args: ["2", "always"] },
{ code: "if (foo & 4) {}", args: ["2", "always"] }
],
