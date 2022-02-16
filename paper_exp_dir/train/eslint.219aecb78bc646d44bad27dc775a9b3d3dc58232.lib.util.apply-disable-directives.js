

"use strict";

const lodash = require("lodash");


function compareLocations(itemA, itemB) {
return itemA.line - itemB.line || itemA.column - itemB.column;
}


function applyDirectives(options) {
const problems = [];
let nextDirectiveIndex = 0;
let currentGlobalDisableDirective = null;
const disabledRuleMap = new Map();


const enabledRules = new Set();
const usedDisableDirectives = new Set();

for (const problem of options.problems) {
while (
nextDirectiveIndex < options.directives.length &&
compareLocations(options.directives[nextDirectiveIndex], problem) <= 0
) {
const directive = options.directives[nextDirectiveIndex++];

switch (directive.type) {
case "disable":
if (directive.ruleId === null) {
currentGlobalDisableDirective = directive;
disabledRuleMap.clear();
enabledRules.clear();
} else if (currentGlobalDisableDirective) {
enabledRules.delete(directive.ruleId);
disabledRuleMap.set(directive.ruleId, directive);
} else {
disabledRuleMap.set(directive.ruleId, directive);
}
break;

case "enable":
if (directive.ruleId === null) {
currentGlobalDisableDirective = null;
disabledRuleMap.clear();
} else if (currentGlobalDisableDirective) {
enabledRules.add(directive.ruleId);
disabledRuleMap.delete(directive.ruleId);
} else {
disabledRuleMap.delete(directive.ruleId);
}
break;


}
}

if (disabledRuleMap.has(problem.ruleId)) {
usedDisableDirectives.add(disabledRuleMap.get(problem.ruleId));
} else if (currentGlobalDisableDirective && !enabledRules.has(problem.ruleId)) {
usedDisableDirectives.add(currentGlobalDisableDirective);
} else {
problems.push(problem);
}
}

const unusedDisableDirectives = options.directives
.filter(directive => directive.type === "disable" && !usedDisableDirectives.has(directive))
.map(directive => ({
ruleId: null,
message: directive.ruleId
? `Unused eslint-disable directive (no problems were reported from '${directive.ruleId}').`
: "Unused eslint-disable directive (no problems were reported).",
line: directive.unprocessedDirective.line,
column: directive.unprocessedDirective.column,
severity: 2,
nodeType: null
}));

return { problems, unusedDisableDirectives };
}


module.exports = options => {
const blockDirectives = options.directives
.filter(directive => directive.type === "disable" || directive.type === "enable")
.map(directive => Object.assign({}, directive, { unprocessedDirective: directive }))
.sort(compareLocations);

const lineDirectives = lodash.flatMap(options.directives, directive => {
switch (directive.type) {
case "disable":
case "enable":
return [];

case "disable-line":
return [
{ type: "disable", line: directive.line, column: 1, ruleId: directive.ruleId, unprocessedDirective: directive },
{ type: "enable", line: directive.line + 1, column: 0, ruleId: directive.ruleId, unprocessedDirective: directive }
];

case "disable-next-line":
return [
{ type: "disable", line: directive.line + 1, column: 1, ruleId: directive.ruleId, unprocessedDirective: directive },
{ type: "enable", line: directive.line + 2, column: 0, ruleId: directive.ruleId, unprocessedDirective: directive }
];

default:
throw new TypeError(`Unrecognized directive type '${directive.type}'`);
}
}).sort(compareLocations);

const blockDirectivesResult = applyDirectives({ problems: options.problems, directives: blockDirectives });
const lineDirectivesResult = applyDirectives({ problems: blockDirectivesResult.problems, directives: lineDirectives });

return options.reportUnusedDisableDirectives
? lineDirectivesResult.problems
.concat(blockDirectivesResult.unusedDisableDirectives)
.concat(lineDirectivesResult.unusedDisableDirectives)
.sort(compareLocations)
: lineDirectivesResult.problems;
};
