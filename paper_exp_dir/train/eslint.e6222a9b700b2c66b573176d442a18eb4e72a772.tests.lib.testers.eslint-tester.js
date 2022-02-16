
"use strict";







var sinon = require("sinon"),
eslint = require("../../../lib/eslint"),
RuleTester = require("../../../lib/testers/rule-tester"),
assert = require("chai").assert;







RuleTester.describe = function(text, method) {
return method.apply(this);
};

RuleTester.it = function(text, method) {
return method.apply(this);
