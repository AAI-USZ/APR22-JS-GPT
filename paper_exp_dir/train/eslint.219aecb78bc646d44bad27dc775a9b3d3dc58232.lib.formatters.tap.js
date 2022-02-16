
"use strict";

const yaml = require("js-yaml");






function getMessageType(message) {
if (message.fatal || message.severity === 2) {
return "error";
}
return "warning";
}


function outputDiagnostics(diagnostic) {
const prefix = "  ";
let output = `${prefix}---\n`;

output += prefix + yaml.safeDump(diagnostic).split("\n").join(`\n${prefix}`);
output += "...\n";
return output;
}





module.exports = function(results) {
let output = `TAP version 13\n1..${results.length}\n`;

results.forEach((result, id) => {
const messages = result.messages;
let testResult = "ok";
let diagnostics = {};

if (messages.length > 0) {
messages.forEach(message => {
const severity = getMessageType(message);
const diagnostic = {
message: message.message,
severity,
data: {
line: message.line || 0,
column: message.column || 0,
ruleId: message.ruleId || ""
}
};


if (severity === "error") {
testResult = "not ok";
}


if ("message" in diagnostics) {
if (typeof diagnostics.messages === "undefined") {
diagnostics.messages = [];
}
diagnostics.messages.push(diagnostic);
} else {
diagnostics = diagnostic;
}
});
}

output += `${testResult} ${id + 1} - ${result.filePath}\n`;


if (messages.length > 0) {
output += outputDiagnostics(diagnostics);
}

});

return output;
};
