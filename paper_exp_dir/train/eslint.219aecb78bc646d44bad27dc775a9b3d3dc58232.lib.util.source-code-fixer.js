
"use strict";





const debug = require("debug")("eslint:source-code-fixer");





const BOM = "\uFEFF";


function compareMessagesByFixRange(a, b) {
return a.fix.range[0] - b.fix.range[0] || a.fix.range[1] - b.fix.range[1];
}


function compareMessagesByLocation(a, b) {
return a.line - b.line || a.column - b.column;
}






function SourceCodeFixer() {
Object.freeze(this);
}


SourceCodeFixer.applyFixes = function(sourceText, messages, shouldFix) {
debug("Applying fixes");

if (shouldFix === false) {
debug("shouldFix parameter was false, not attempting fixes");
return {
fixed: false,
messages,
output: sourceText
};
}


const remainingMessages = [],
fixes = [],
bom = sourceText.startsWith(BOM) ? BOM : "",
text = bom ? sourceText.slice(1) : sourceText;
let lastPos = Number.NEGATIVE_INFINITY,
output = bom;


function attemptFix(problem) {
const fix = problem.fix;
const start = fix.range[0];
const end = fix.range[1];


if (lastPos >= start || start > end) {
remainingMessages.push(problem);
return false;
}


if ((start < 0 && end >= 0) || (start === 0 && fix.text.startsWith(BOM))) {
output = "";
}


output += text.slice(Math.max(0, lastPos), Math.max(0, start));
output += fix.text;
lastPos = end;
return true;
}

messages.forEach(problem => {
if (Object.prototype.hasOwnProperty.call(problem, "fix")) {
fixes.push(problem);
} else {
remainingMessages.push(problem);
}
});

if (fixes.length) {
debug("Found fixes to apply");
let fixesWereApplied = false;

for (const problem of fixes.sort(compareMessagesByFixRange)) {
if (typeof shouldFix !== "function" || shouldFix(problem)) {
attemptFix(problem);


fixesWereApplied = true;
} else {
remainingMessages.push(problem);
}
}
output += text.slice(Math.max(0, lastPos));

return {
fixed: fixesWereApplied,
messages: remainingMessages.sort(compareMessagesByLocation),
output
};
}

debug("No fixes to apply");
return {
fixed: false,
messages,
output: bom + text
};

};

module.exports = SourceCodeFixer;
