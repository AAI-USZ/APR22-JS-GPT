
"use strict";





const RULE_SEVERITY_STRINGS = ["off", "warn", "error"],
RULE_SEVERITY = RULE_SEVERITY_STRINGS.reduce((map, value, index) => {
map[value] = index;
return map;
}, {}),
VALID_SEVERITIES = [0, 1, 2, "off", "warn", "error"];





module.exports = {


getRuleSeverity(ruleConfig) {
const severityValue = Array.isArray(ruleConfig) ? ruleConfig[0] : ruleConfig;

if (severityValue === 0 || severityValue === 1 || severityValue === 2) {
return severityValue;
}

if (typeof severityValue === "string") {
return RULE_SEVERITY[severityValue.toLowerCase()] || 0;
}

return 0;
},


normalizeToStrings(config) {

if (config.rules) {
Object.keys(config.rules).forEach(ruleId => {
const ruleConfig = config.rules[ruleId];

if (typeof ruleConfig === "number") {
config.rules[ruleId] = RULE_SEVERITY_STRINGS[ruleConfig] || RULE_SEVERITY_STRINGS[0];
} else if (Array.isArray(ruleConfig) && typeof ruleConfig[0] === "number") {
ruleConfig[0] = RULE_SEVERITY_STRINGS[ruleConfig[0]] || RULE_SEVERITY_STRINGS[0];
}
});
}
},


isErrorSeverity(ruleConfig) {
return module.exports.getRuleSeverity(ruleConfig) === 2;
},


isValidSeverity(ruleConfig) {
let severity = Array.isArray(ruleConfig) ? ruleConfig[0] : ruleConfig;

if (typeof severity === "string") {
severity = severity.toLowerCase();
}
return VALID_SEVERITIES.indexOf(severity) !== -1;
},


isEverySeverityValid(config) {
return Object.keys(config).every(ruleId => this.isValidSeverity(config[ruleId]));
},


normalizeConfigGlobal(configuredValue) {
switch (configuredValue) {
case "off":
return "off";

case true:
case "true":
case "writeable":
case "writable":
return "writable";

case null:
case false:
case "false":
case "readable":
case "readonly":
return "readonly";

default:
throw new Error(`'${configuredValue}' is not a valid configuration for a global (use 'readonly', 'writable', or 'off')`);
}
}
};
