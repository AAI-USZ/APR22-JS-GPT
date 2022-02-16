

"use strict";

const assert = require("chai").assert;

describe("when given an invalid rules directory", () => {
it("should throw an error", () => {
assert.throws(() => {
loadRules("invalidDir");
});
});
});

describe("when given a valid rules directory", () => {
it("should load rules and not throw an error", () => {
const rules = loadRules("tests/fixtures/rules", process.cwd());

});
});
