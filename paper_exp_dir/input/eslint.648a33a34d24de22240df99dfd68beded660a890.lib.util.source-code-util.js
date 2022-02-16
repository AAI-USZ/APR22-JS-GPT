

"use strict";





const CLIEngine = require("../cli-engine"),
baseDefaultOptions = require("../../conf/default-cli-options");







function getSourceCodeOfFile(filename, options) {
debug("getting sourceCode of", filename);
const opts = Object.assign({}, options, { rules: {} });
const cli = new CLIEngine(opts);
const results = cli.executeOnFiles([filename]);

if (results && results.results[0] && results.results[0].messages[0] && results.results[0].messages[0].fatal) {
const msg = results.results[0].messages[0];

throw new Error(`(${filename}:${msg.line}:${msg.column}) ${msg.message}`);
}
const sourceCode = cli.linter.getSourceCode();

return sourceCode;
}









function getSourceCodeOfFiles(patterns, providedOptions, providedCallback) {
const sourceCodes = {};
const globPatternsList = typeof patterns === "string" ? [patterns] : patterns;
let options, callback;

const defaultOptions = Object.assign({}, baseDefaultOptions, { cwd: process.cwd() });

if (typeof providedOptions === "undefined") {
options = defaultOptions;
callback = null;
} else if (typeof providedOptions === "function") {
callback = providedOptions;
options = defaultOptions;
} else if (typeof providedOptions === "object") {
options = Object.assign({}, defaultOptions, providedOptions);
callback = providedCallback;
}
debug("constructed options:", options);

const filenames = globUtil.listFilesToProcess(globPatternsList, options)
.filter(fileInfo => !fileInfo.ignored)
.reduce((files, fileInfo) => files.concat(fileInfo.filename), []);

if (filenames.length === 0) {
debug(`Did not find any files matching pattern(s): ${globPatternsList}`);
}
filenames.forEach(filename => {
const sourceCode = getSourceCodeOfFile(filename, options);

if (sourceCode) {
debug("got sourceCode of", filename);
sourceCodes[filename] = sourceCode;
}
if (callback) {
callback(filenames.length);
}
});
return sourceCodes;
}

module.exports = {
getSourceCodeOfFiles
};
