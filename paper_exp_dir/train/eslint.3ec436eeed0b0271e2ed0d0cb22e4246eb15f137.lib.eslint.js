

"use strict";





const assert = require("assert"),
EventEmitter = require("events").EventEmitter,
eslintScope = require("eslint-scope"),
levn = require("levn"),
blankScriptAST = require("../conf/blank-script.json"),
defaultConfig = require("../conf/default-config-options.js"),
replacements = require("../conf/replacements.json"),
CodePathAnalyzer = require("./code-path-analysis/code-path-analyzer"),
ConfigOps = require("./config/config-ops"),
validator = require("./config/config-validator"),
Environments = require("./config/environments"),
NodeEventGenerator = require("./util/node-event-generator"),
SourceCode = require("./util/source-code"),
Traverser = require("./util/traverser"),
RuleContext = require("./rule-context"),
Rules = require("./rules"),
timing = require("./timing"),
astUtils = require("./ast-utils"),

pkg = require("../package.json");













function parseBooleanConfig(string, comment) {
const items = {};


string = string.replace(/\s*([:,])\s*/g, "$1");

string.split(/\s|,+/).forEach(name => {
if (!name) {
return;
}
const pos = name.indexOf(":");
let value;

if (pos !== -1) {
value = name.substring(pos + 1, name.length);
name = name.substring(0, pos);
}

items[name] = {
value: (value === "true"),
comment
};

});
return items;
}


function parseJsonConfig(string, location, messages) {
let items = {};


try {
items = levn.parse("Object", string) || {};





if (ConfigOps.isEverySeverityValid(items)) {
return items;
}
} catch (ex) {


}



items = {};
string = string.replace(/([a-zA-Z0-9\-/]+):/g, "\"$1\":").replace(/(]|[0-9])\s+(?=")/, "$1,");
try {
items = JSON.parse(`{${string}}`);
} catch (ex) {

messages.push({
ruleId: null,
fatal: true,
severity: 2,
source: null,
message: `Failed to parse JSON from '${string}': ${ex.message}`,
line: location.start.line,
column: location.start.column + 1
});

}

return items;
}

/**
* Parses a config of values separated by comma.
* @param {string} string The string to parse.
* @returns {Object} Result map of values and true values
*/
function parseListConfig(string) {
const items = {};

// Collapse whitespace around ,
string = string.replace(/\s*,\s*/g, ",");

string.split(/,+/).forEach(name => {
name = name.trim();
if (!name) {
return;
}
items[name] = true;
});
return items;
}

/**
* Ensures that variables representing built-in properties of the Global Object,
* and any globals declared by special block comments, are present in the global
* scope.
* @param {ASTNode} program The top node of the AST.
* @param {Scope} globalScope The global scope.
* @param {Object} config The existing configuration data.
* @param {Environments} envContext Env context
* @returns {void}
*/
function addDeclaredGlobals(program, globalScope, config, envContext) {
const declaredGlobals = {},
exportedGlobals = {},
explicitGlobals = {},
builtin = envContext.get("builtin");

