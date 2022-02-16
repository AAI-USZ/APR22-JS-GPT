

"use strict";





const lodash = require("lodash"),
recConfig = require("../../conf/eslint-recommended"),
ConfigOps = require("../shared/config-ops"),
{ Linter } = require("../linter"),
configRule = require("./config-rule");

const debug = require("debug")("eslint:autoconfig");
const linter = new Linter();





const MAX_CONFIG_COMBINATIONS = 17,
RECOMMENDED_CONFIG_NAME = "eslint:recommended";










function makeRegistryItems(rulesConfig) {
return Object.keys(rulesConfig).reduce((accumulator, ruleId) => {
accumulator[ruleId] = rulesConfig[ruleId].map(config => ({
config,
specificity: config.length || 1,
errorCount: void 0
}));
return accumulator;
}, {});
}


class Registry {


constructor(rulesConfig) {
this.rules = (rulesConfig) ? makeRegistryItems(rulesConfig) : {};
}


populateFromCoreRules() {
const rulesConfig = configRule.createCoreRuleConfigs();

this.rules = makeRegistryItems(rulesConfig);
}


buildRuleSets() {
let idx = 0;
const ruleIds = Object.keys(this.rules),
ruleSets = [];


const addRuleToRuleSet = function(rule) {


const hasFewCombos = (this.rules[rule].length <= MAX_CONFIG_COMBINATIONS);

if (this.rules[rule][idx] && (hasFewCombos || this.rules[rule][idx].specificity <= 2)) {


if (!hasFewCombos && typeof this.rules[rule][idx].config[1] === "object") {
return;
}

ruleSets[idx] = ruleSets[idx] || {};
ruleSets[idx][rule] = this.rules[rule][idx].config;


this.rules[rule][idx].errorCount = 0;
}
}.bind(this);

while (ruleSets.length === idx) {
ruleIds.forEach(addRuleToRuleSet);
idx += 1;
}

return ruleSets;
}


stripFailingConfigs() {
const ruleIds = Object.keys(this.rules),
newRegistry = new Registry();

newRegistry.rules = Object.assign({}, this.rules);
ruleIds.forEach(ruleId => {
const errorFreeItems = newRegistry.rules[ruleId].filter(registryItem => (registryItem.errorCount === 0));

if (errorFreeItems.length > 0) {
newRegistry.rules[ruleId] = errorFreeItems;
} else {
delete newRegistry.rules[ruleId];
}
});

return newRegistry;
}


stripExtraConfigs() {
const ruleIds = Object.keys(this.rules),
newRegistry = new Registry();

newRegistry.rules = Object.assign({}, this.rules);
ruleIds.forEach(ruleId => {
newRegistry.rules[ruleId] = newRegistry.rules[ruleId].filter(registryItem => (typeof registryItem.errorCount !== "undefined"));
});

return newRegistry;
}


getFailingRulesRegistry() {
const ruleIds = Object.keys(this.rules),
failingRegistry = new Registry();

ruleIds.forEach(ruleId => {
const failingConfigs = this.rules[ruleId].filter(registryItem => (registryItem.errorCount > 0));

if (failingConfigs && failingConfigs.length === this.rules[ruleId].length) {
failingRegistry.rules[ruleId] = failingConfigs;
}
});

return failingRegistry;
}


createConfig() {
const ruleIds = Object.keys(this.rules),
config = { rules: {} };

ruleIds.forEach(ruleId => {
if (this.rules[ruleId].length === 1) {
config.rules[ruleId] = this.rules[ruleId][0].config;
}
});

return config;
}


filterBySpecificity(specificity) {
const ruleIds = Object.keys(this.rules),
newRegistry = new Registry();

newRegistry.rules = Object.assign({}, this.rules);
ruleIds.forEach(ruleId => {
newRegistry.rules[ruleId] = this.rules[ruleId].filter(registryItem => (registryItem.specificity === specificity));
});

return newRegistry;
}


lintSourceCode(sourceCodes, config, cb) {
let lintedRegistry = new Registry();

lintedRegistry.rules = Object.assign({}, this.rules);

const ruleSets = lintedRegistry.buildRuleSets();

lintedRegistry = lintedRegistry.stripExtraConfigs();

debug("Linting with all possible rule combinations");

const filenames = Object.keys(sourceCodes);
const totalFilesLinting = filenames.length * ruleSets.length;

filenames.forEach(filename => {
debug(`Linting file: ${filename}`);

let ruleSetIdx = 0;

ruleSets.forEach(ruleSet => {
const lintConfig = Object.assign({}, config, { rules: ruleSet });
const lintResults = linter.verify(sourceCodes[filename], lintConfig);

lintResults.forEach(result => {


if (
lintedRegistry.rules[result.ruleId] &&
lintedRegistry.rules[result.ruleId][ruleSetIdx]
) {
lintedRegistry.rules[result.ruleId][ruleSetIdx].errorCount += 1;
}
});

ruleSetIdx += 1;

if (cb) {
cb(totalFilesLinting);
}
});


sourceCodes[filename] = null;
});

return lintedRegistry;
}
}


function extendFromRecommended(config) {
const newConfig = Object.assign({}, config);

ConfigOps.normalizeToStrings(newConfig);

const recRules = Object.keys(recConfig.rules).filter(ruleId => ConfigOps.isErrorSeverity(recConfig.rules[ruleId]));

recRules.forEach(ruleId => {
if (lodash.isEqual(recConfig.rules[ruleId], newConfig.rules[ruleId])) {
delete newConfig.rules[ruleId];
}
});
newConfig.extends = RECOMMENDED_CONFIG_NAME;
return newConfig;
}






module.exports = {
Registry,
extendFromRecommended
};
