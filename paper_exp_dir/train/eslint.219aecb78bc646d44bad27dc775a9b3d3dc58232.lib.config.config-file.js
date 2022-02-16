

"use strict";





const fs = require("fs"),
path = require("path"),
stringify = require("json-stable-stringify-without-jsonify");

const debug = require("debug")("eslint:config-file");






function sortByKey(a, b) {
return a.key > b.key ? 1 : -1;
}






function writeJSONConfigFile(config, filePath) {
debug(`Writing JSON config file: ${filePath}`);

const content = stringify(config, { cmp: sortByKey, space: 4 });

fs.writeFileSync(filePath, content, "utf8");
}


function writeYAMLConfigFile(config, filePath) {
debug(`Writing YAML config file: ${filePath}`);


const yaml = require("js-yaml");

const content = yaml.safeDump(config, { sortKeys: true });

fs.writeFileSync(filePath, content, "utf8");
}


function writeJSConfigFile(config, filePath) {
debug(`Writing JS config file: ${filePath}`);

let contentToWrite;
const stringifiedContent = `module.exports = ${stringify(config, { cmp: sortByKey, space: 4 })};`;

try {
const { CLIEngine } = require("../cli-engine");
const linter = new CLIEngine({
baseConfig: config,
fix: true,
useEslintrc: false
});
const report = linter.executeOnText(stringifiedContent);

contentToWrite = report.results[0].output || stringifiedContent;
} catch (e) {
debug("Error linting JavaScript config file, writing unlinted version");
const errorMessage = e.message;

contentToWrite = stringifiedContent;
e.message = "An error occurred while generating your JavaScript config file. ";
e.message += "A config file was still generated, but the config file itself may not follow your linting rules.";
e.message += `\nError: ${errorMessage}`;
throw e;
} finally {
fs.writeFileSync(filePath, contentToWrite, "utf8");
}
}


function write(config, filePath) {
switch (path.extname(filePath)) {
case ".js":
writeJSConfigFile(config, filePath);
break;

case ".json":
writeJSONConfigFile(config, filePath);
break;

case ".yaml":
case ".yml":
writeYAMLConfigFile(config, filePath);
break;

default:
throw new Error("Can't write to unknown file type.");
}
}





module.exports = {
write
};
