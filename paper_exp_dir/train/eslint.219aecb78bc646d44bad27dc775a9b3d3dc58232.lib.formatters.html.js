
"use strict";

const lodash = require("lodash");
const fs = require("fs");
const path = require("path");





const pageTemplate = lodash.template(fs.readFileSync(path.join(__dirname, "html-template-page.html"), "utf-8"));
const messageTemplate = lodash.template(fs.readFileSync(path.join(__dirname, "html-template-message.html"), "utf-8"));
const resultTemplate = lodash.template(fs.readFileSync(path.join(__dirname, "html-template-result.html"), "utf-8"));


function pluralize(word, count) {
return (count === 1 ? word : `${word}s`);
}


function renderSummary(totalErrors, totalWarnings) {
const totalProblems = totalErrors + totalWarnings;
let renderedText = `${totalProblems} ${pluralize("problem", totalProblems)}`;

if (totalProblems !== 0) {
renderedText += ` (${totalErrors} ${pluralize("error", totalErrors)}, ${totalWarnings} ${pluralize("warning", totalWarnings)})`;
}
return renderedText;
}


function renderColor(totalErrors, totalWarnings) {
if (totalErrors !== 0) {
return 2;
}
if (totalWarnings !== 0) {
return 1;
}
return 0;
}


function renderMessages(messages, parentIndex, rulesMeta) {


return lodash.map(messages, message => {
const lineNumber = message.line || 0;
const columnNumber = message.column || 0;
let ruleUrl;

if (rulesMeta) {
const meta = rulesMeta[message.ruleId];

ruleUrl = lodash.get(meta, "docs.url", null);
}

return messageTemplate({
parentIndex,
lineNumber,
columnNumber,
severityNumber: message.severity,
severityName: message.severity === 1 ? "Warning" : "Error",
message: message.message,
ruleId: message.ruleId,
ruleUrl
});
}).join("\n");
}


function renderResults(results, rulesMeta) {
return lodash.map(results, (result, index) => resultTemplate({
index,
color: renderColor(result.errorCount, result.warningCount),
filePath: result.filePath,
summary: renderSummary(result.errorCount, result.warningCount)

}) + renderMessages(result.messages, index, rulesMeta)).join("\n");
}





module.exports = function(results, data) {
let totalErrors,
totalWarnings;

const metaData = data ? data.rulesMeta : {};

totalErrors = 0;
totalWarnings = 0;


results.forEach(result => {
totalErrors += result.errorCount;
totalWarnings += result.warningCount;
});

return pageTemplate({
date: new Date(),
reportColor: renderColor(totalErrors, totalWarnings),
reportSummary: renderSummary(totalErrors, totalWarnings),
results: renderResults(results, metaData)
});
};
