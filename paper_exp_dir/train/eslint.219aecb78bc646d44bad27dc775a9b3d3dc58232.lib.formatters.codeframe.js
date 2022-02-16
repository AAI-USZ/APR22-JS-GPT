
"use strict";

const chalk = require("chalk");
const { codeFrameColumns } = require("@babel/code-frame");
const path = require("path");






function pluralize(word, count) {
return (count === 1 ? word : `${word}s`);
}


function formatFilePath(filePath, line, column) {
let relPath = path.relative(process.cwd(), filePath);

if (line && column) {
relPath += `:${line}:${column}`;
}

return chalk.green(relPath);
}


function formatMessage(message, parentResult) {
const type = (message.fatal || message.severity === 2) ? chalk.red("error") : chalk.yellow("warning");
const msg = `${chalk.bold(message.message.replace(/([^ ])\.$/u, "$1"))}`;
const ruleId = message.fatal ? "" : chalk.dim(`(${message.ruleId})`);
const filePath = formatFilePath(parentResult.filePath, message.line, message.column);
const sourceCode = parentResult.output ? parentResult.output : parentResult.source;

const firstLine = [
`${type}:`,
`${msg}`,
ruleId ? `${ruleId}` : "",
sourceCode ? `at ${filePath}:` : `at ${filePath}`
].filter(String).join(" ");

const result = [firstLine];

if (sourceCode) {
result.push(
codeFrameColumns(sourceCode, { start: { line: message.line, column: message.column } }, { highlightCode: false })
);
}

return result.join("\n");
}


function formatSummary(errors, warnings, fixableErrors, fixableWarnings) {
const summaryColor = errors > 0 ? "red" : "yellow";
const summary = [];
const fixablesSummary = [];

if (errors > 0) {
summary.push(`${errors} ${pluralize("error", errors)}`);
}

if (warnings > 0) {
summary.push(`${warnings} ${pluralize("warning", warnings)}`);
}

if (fixableErrors > 0) {
fixablesSummary.push(`${fixableErrors} ${pluralize("error", fixableErrors)}`);
}

if (fixableWarnings > 0) {
fixablesSummary.push(`${fixableWarnings} ${pluralize("warning", fixableWarnings)}`);
}

let output = chalk[summaryColor].bold(`${summary.join(" and ")} found.`);

if (fixableErrors || fixableWarnings) {
output += chalk[summaryColor].bold(`\n${fixablesSummary.join(" and ")} potentially fixable with the \`--fix\` option.`);
}

return output;
}





module.exports = function(results) {
let errors = 0;
let warnings = 0;
let fixableErrors = 0;
let fixableWarnings = 0;

const resultsWithMessages = results.filter(result => result.messages.length > 0);

let output = resultsWithMessages.reduce((resultsOutput, result) => {
const messages = result.messages.map(message => `${formatMessage(message, result)}\n\n`);

errors += result.errorCount;
warnings += result.warningCount;
fixableErrors += result.fixableErrorCount;
fixableWarnings += result.fixableWarningCount;

return resultsOutput.concat(messages);
}, []).join("\n");

output += "\n";
output += formatSummary(errors, warnings, fixableErrors, fixableWarnings);

return (errors + warnings) > 0 ? output : "";
};
