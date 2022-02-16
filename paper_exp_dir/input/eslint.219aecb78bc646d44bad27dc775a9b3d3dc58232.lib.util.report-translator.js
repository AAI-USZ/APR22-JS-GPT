

"use strict";





const assert = require("assert");
const ruleFixer = require("./rule-fixer");
const interpolate = require("./interpolate");















function normalizeMultiArgReportCall(...args) {


if (args.length === 1) {


return Object.assign({}, args[0]);
}


if (typeof args[1] === "string") {
return {
node: args[0],
message: args[1],
data: args[2],
fix: args[3]
};
}


return {
node: args[0],
loc: args[1],
message: args[2],
data: args[3],
fix: args[4]
};
}


function assertValidNodeInfo(descriptor) {
if (descriptor.node) {
assert(typeof descriptor.node === "object", "Node must be an object");
} else {
assert(descriptor.loc, "Node must be provided when reporting error if location is not provided");
}
}


function normalizeReportLoc(descriptor) {
if (descriptor.loc) {
if (descriptor.loc.start) {
return descriptor.loc;
}
return { start: descriptor.loc, end: null };
}
return descriptor.node.loc;
}


function compareFixesByRange(a, b) {
return a.range[0] - b.range[0] || a.range[1] - b.range[1];
}


function mergeFixes(fixes, sourceCode) {
if (fixes.length === 0) {
return null;
}
if (fixes.length === 1) {
return fixes[0];
}

fixes.sort(compareFixesByRange);

const originalText = sourceCode.text;
const start = fixes[0].range[0];
const end = fixes[fixes.length - 1].range[1];
let text = "";
let lastPos = Number.MIN_SAFE_INTEGER;

for (const fix of fixes) {
assert(fix.range[0] >= lastPos, "Fix objects must not be overlapped in a report.");

if (fix.range[0] >= 0) {
text += originalText.slice(Math.max(0, start, lastPos), fix.range[0]);
}
text += fix.text;
lastPos = fix.range[1];
}
text += originalText.slice(Math.max(0, start, lastPos), end);

return { range: [start, end], text };
}


function normalizeFixes(descriptor, sourceCode) {
if (typeof descriptor.fix !== "function") {
return null;
}


const fix = descriptor.fix(ruleFixer);


if (fix && Symbol.iterator in fix) {
return mergeFixes(Array.from(fix), sourceCode);
}
return fix;
}


function createProblem(options) {
const problem = {
ruleId: options.ruleId,
severity: options.severity,
message: options.message,
line: options.loc.start.line,
column: options.loc.start.column + 1,
nodeType: options.node && options.node.type || null
};


if (options.messageId) {
problem.messageId = options.messageId;
}

if (options.loc.end) {
problem.endLine = options.loc.end.line;
problem.endColumn = options.loc.end.column + 1;
}

if (options.fix) {
problem.fix = options.fix;
}

return problem;
}



module.exports = function createReportTranslator(metadata) {


return (...args) => {
const descriptor = normalizeMultiArgReportCall(...args);

assertValidNodeInfo(descriptor);

let computedMessage;

if (descriptor.messageId) {
if (!metadata.messageIds) {
throw new TypeError("context.report() called with a messageId, but no messages were present in the rule metadata.");
}
const id = descriptor.messageId;
const messages = metadata.messageIds;

if (descriptor.message) {
throw new TypeError("context.report() called with a message and a messageId. Please only pass one.");
}
if (!messages || !Object.prototype.hasOwnProperty.call(messages, id)) {
throw new TypeError(`context.report() called with a messageId of '${id}' which is not present in the 'messages' config: ${JSON.stringify(messages, null, 2)}`);
}
computedMessage = messages[id];
} else if (descriptor.message) {
computedMessage = descriptor.message;
} else {
throw new TypeError("Missing `message` property in report() call; add a message that describes the linting problem.");
}


return createProblem({
ruleId: metadata.ruleId,
severity: metadata.severity,
node: descriptor.node,
message: interpolate(computedMessage, descriptor.data),
messageId: descriptor.messageId,
loc: normalizeReportLoc(descriptor),
fix: metadata.disableFixes ? null : normalizeFixes(descriptor, metadata.sourceCode)
});
};
};
