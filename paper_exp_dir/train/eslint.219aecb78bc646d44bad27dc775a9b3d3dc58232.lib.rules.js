

"use strict";





const lodash = require("lodash");
const ruleReplacements = require("../../conf/replacements").rules;
const builtInRules = require("../rules");






const createMissingRule = lodash.memoize(ruleId => {
const message = Object.prototype.hasOwnProperty.call(ruleReplacements, ruleId)
? `Rule '${ruleId}' was removed and replaced by: ${ruleReplacements[ruleId].join(", ")}`
: `Definition for rule '${ruleId}' was not found`;

return {
create: context => ({
Program() {
context.report({
loc: { line: 1, column: 0 },
message
});
}
})
};
});


function normalizeRule(rule) {
return typeof rule === "function" ? Object.assign({ create: rule }, rule) : rule;
}





class Rules {
constructor() {
this._rules = Object.create(null);
}


define(ruleId, ruleModule) {
this._rules[ruleId] = normalizeRule(ruleModule);
}


get(ruleId) {
if (typeof this._rules[ruleId] === "string") {
this.define(ruleId, require(this._rules[ruleId]));
}
if (this._rules[ruleId]) {
return this._rules[ruleId];
}
if (builtInRules.has(ruleId)) {
return builtInRules.get(ruleId);
}

return createMissingRule(ruleId);
}

*[Symbol.iterator]() {
yield* builtInRules;

for (const ruleId of Object.keys(this._rules)) {
yield [ruleId, this.get(ruleId)];
}
}
}

module.exports = Rules;
