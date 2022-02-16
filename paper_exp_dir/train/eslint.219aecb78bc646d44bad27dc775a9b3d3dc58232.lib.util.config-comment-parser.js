


"use strict";





const levn = require("levn"),
ConfigOps = require("../shared/config-ops");

const debug = require("debug")("eslint:config-comment-parser");






module.exports = class ConfigCommentParser {


parseStringConfig(string, comment) {
debug("Parsing String config");

const items = {};


const trimmedString = string.replace(/\s*([:,])\s*/gu, "$1");

trimmedString.split(/\s|,+/u).forEach(name => {
if (!name) {
return;
}


const [key, value = null] = name.split(":");

items[key] = { value, comment };
});
return items;
}


parseJsonConfig(string, location) {
debug("Parsing JSON config");

let items = {};


try {
items = levn.parse("Object", string) || {};





if (ConfigOps.isEverySeverityValid(items)) {
return {
success: true,
config: items
};
}
} catch (ex) {

debug("Levn parsing failed; falling back to manual parsing.");


}


items = {};
const normalizedString = string.replace(/([a-zA-Z0-9\-/]+):/gu, "\"$1\":").replace(/(\]|[0-9])\s+(?=")/u, "$1,");

try {
items = JSON.parse(`{${normalizedString}}`);
} catch (ex) {
debug("Manual parsing failed.");

return {
success: false,
error: {
ruleId: null,
fatal: true,
severity: 2,
message: `Failed to parse JSON from '${normalizedString}': ${ex.message}`,
line: location.start.line,
column: location.start.column + 1
}
};

}

return {
success: true,
config: items
};
}

/**
* Parses a config of values separated by comma.
* @param {string} string The string to parse.
* @returns {Object} Result map of values and true values
*/
parseListConfig(string) {
debug("Parsing list config");

const items = {};

// Collapse whitespace around commas
string.replace(/\s*,\s*/gu, ",").split(/,+/u).forEach(name => {
const trimmedName = name.trim();

if (trimmedName) {
items[trimmedName] = true;
}
});
return items;
}

};
