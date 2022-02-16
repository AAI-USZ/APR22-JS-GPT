


"use strict";





const util = require("util"),
path = require("path"),
inquirer = require("inquirer"),
ProgressBar = require("progress"),
semver = require("semver"),
recConfig = require("../../conf/eslint-recommended"),
ConfigOps = require("../shared/config-ops"),
log = require("../shared/logging"),
ModuleResolver = require("../shared/relative-module-resolver"),
autoconfig = require("./autoconfig.js"),
ConfigFile = require("./config-file"),
npmUtils = require("./npm-utils"),
{ getSourceCodeOfFiles } = require("./source-code-utils");

const debug = require("debug")("eslint:config-initializer");





const DEFAULT_ECMA_VERSION = 2018;



function writeFile(config, format) {


let extname = ".js";

if (format === "YAML") {
extname = ".yml";
} else if (format === "JSON") {
extname = ".json";
}

const installedESLint = config.installedESLint;

delete config.installedESLint;

ConfigFile.write(config, `./.eslintrc${extname}`);
log.info(`Successfully created .eslintrc${extname} file in ${process.cwd()}`);

if (installedESLint) {
log.info("ESLint was installed locally. We recommend using this local copy instead of your globally-installed copy.");
}
}


function getPeerDependencies(moduleName) {
let result = getPeerDependencies.cache.get(moduleName);

if (!result) {
log.info(`Checking peerDependencies of ${moduleName}`);

result = npmUtils.fetchPeerDependencies(moduleName);
getPeerDependencies.cache.set(moduleName, result);
}

return result;
}
getPeerDependencies.cache = new Map();


function getModulesList(config, installESLint) {
const modules = {};


if (config.plugins) {
for (const plugin of config.plugins) {
modules[`eslint-plugin-${plugin}`] = "latest";
}
}
if (config.extends && config.extends.indexOf("eslint:") === -1) {
const moduleName = `eslint-config-${config.extends}`;

modules[moduleName] = "latest";
Object.assign(
modules,
getPeerDependencies(`${moduleName}@latest`)
);
}

if (installESLint === false) {
delete modules.eslint;
} else {
const installStatus = npmUtils.checkDevDeps(["eslint"]);


if (installStatus.eslint === false) {
log.info("Local ESLint installation not found.");
modules.eslint = modules.eslint || "latest";
config.installedESLint = true;
}
}

return Object.keys(modules).map(name => `${name}@${modules[name]}`);
}


function configureRules(answers, config) {
const BAR_TOTAL = 20,
BAR_SOURCE_CODE_TOTAL = 4,
newConfig = Object.assign({}, config),
disabledConfigs = {};
let sourceCodes,
registry;


const bar = new ProgressBar("Determining Config: :percent [:bar] :elapseds elapsed, eta :etas ", {
width: 30,
total: BAR_TOTAL
});

bar.tick(0);


const patterns = answers.patterns.split(/[\s]+/u);

try {
sourceCodes = getSourceCodeOfFiles(patterns, { baseConfig: newConfig, useEslintrc: false }, total => {
bar.tick((BAR_SOURCE_CODE_TOTAL / total));
});
} catch (e) {
log.info("\n");
throw e;
}
const fileQty = Object.keys(sourceCodes).length;

if (fileQty === 0) {
log.info("\n");
throw new Error("Automatic Configuration failed.  No files were able to be parsed.");
}


registry = new autoconfig.Registry();
registry.populateFromCoreRules();


registry = registry.lintSourceCode(sourceCodes, newConfig, total => {
bar.tick((BAR_TOTAL - BAR_SOURCE_CODE_TOTAL) / total);
});
debug(`\nRegistry: ${util.inspect(registry.rules, { depth: null })}`);


const recRules = Object.keys(recConfig.rules).filter(ruleId => ConfigOps.isErrorSeverity(recConfig.rules[ruleId]));


const failingRegistry = registry.getFailingRulesRegistry();

Object.keys(failingRegistry.rules).forEach(ruleId => {


disabledConfigs[ruleId] = (recRules.indexOf(ruleId) !== -1) ? 2 : 0;
});


registry = registry.stripFailingConfigs();


const singleConfigs = registry.createConfig().rules;


const specTwoConfigs = registry.filterBySpecificity(2).createConfig().rules;


const specThreeConfigs = registry.filterBySpecificity(3).createConfig().rules;


const defaultConfigs = registry.filterBySpecificity(1).createConfig().rules;


newConfig.rules = Object.assign({}, disabledConfigs, defaultConfigs, specThreeConfigs, specTwoConfigs, singleConfigs);


bar.update(BAR_TOTAL);


const finalRuleIds = Object.keys(newConfig.rules);
const totalRules = finalRuleIds.length;
const enabledRules = finalRuleIds.filter(ruleId => (newConfig.rules[ruleId] !== 0)).length;
const resultMessage = [
`\nEnabled ${enabledRules} out of ${totalRules}`,
`rules based on ${fileQty}`,
`file${(fileQty === 1) ? "." : "s."}`
].join(" ");

log.info(resultMessage);

ConfigOps.normalizeToStrings(newConfig);
return newConfig;
}


function processAnswers(answers) {
let config = {
rules: {},
env: {},
parserOptions: {},
extends: []
};


config.parserOptions.ecmaVersion = DEFAULT_ECMA_VERSION;
config.env.es6 = true;
config.globals = {
Atomics: "readonly",
SharedArrayBuffer: "readonly"
};


if (answers.moduleType === "esm") {
config.parserOptions.sourceType = "module";
} else if (answers.moduleType === "commonjs") {
config.env.commonjs = true;
}


answers.env.forEach(env => {
config.env[env] = true;
});


if (answers.framework === "react") {
config.parserOptions.ecmaFeatures = {
jsx: true
};
config.plugins = ["react"];
} else if (answers.framework === "vue") {
config.plugins = ["vue"];
config.extends.push("plugin:vue/essential");
}


if (answers.purpose === "problems") {
config.extends.unshift("eslint:recommended");
} else if (answers.purpose === "style") {
if (answers.source === "prompt") {
config.extends.unshift("eslint:recommended");
config.rules.indent = ["error", answers.indent];
config.rules.quotes = ["error", answers.quotes];
config.rules["linebreak-style"] = ["error", answers.linebreak];
config.rules.semi = ["error", answers.semi ? "always" : "never"];
} else if (answers.source === "auto") {
config = configureRules(answers, config);
config = autoconfig.extendFromRecommended(config);
}
}


if (config.extends.length === 0) {
delete config.extends;
} else if (config.extends.length === 1) {
config.extends = config.extends[0];
}

ConfigOps.normalizeToStrings(config);
return config;
}


function getLocalESLintVersion() {
try {
const eslintPath = ModuleResolver.resolve("eslint", path.join(process.cwd(), "__placeholder__.js"));
const eslint = require(eslintPath);

return eslint.linter.version || null;
} catch (_err) {
return null;
}
}


function getStyleGuideName(answers) {
if (answers.styleguide === "airbnb" && answers.framework !== "react") {
return "airbnb-base";
}
return answers.styleguide;
}


function hasESLintVersionConflict(answers) {


const localESLintVersion = getLocalESLintVersion();

if (!localESLintVersion) {
return false;
}


const configName = getStyleGuideName(answers);
const moduleName = `eslint-config-${configName}@latest`;
const peerDependencies = getPeerDependencies(moduleName) || {};
const requiredESLintVersionRange = peerDependencies.eslint;

if (!requiredESLintVersionRange) {
return false;
}

answers.localESLintVersion = localESLintVersion;
answers.requiredESLintVersionRange = requiredESLintVersionRange;


if (semver.satisfies(localESLintVersion, requiredESLintVersionRange)) {
answers.installESLint = false;
return false;
}

return true;
}


function installModules(modules) {
log.info(`Installing ${modules.join(", ")}`);
npmUtils.installSyncSaveDev(modules);
}



function askInstallModules(modules, packageJsonExists) {


if (modules.length === 0) {
return Promise.resolve();
}

log.info("The config that you've selected requires the following dependencies:\n");
log.info(modules.join(" "));
return inquirer.prompt([
{
type: "confirm",
name: "executeInstallation",
message: "Would you like to install them now with npm?",
default: true,
when() {
return modules.length && packageJsonExists;
}
}
]).then(({ executeInstallation }) => {
if (executeInstallation) {
installModules(modules);
}
});
}



function promptUser() {

return inquirer.prompt([
{
type: "list",
name: "purpose",
message: "How would you like to use ESLint?",
default: "problems",
choices: [
{ name: "To check syntax only", value: "syntax" },
{ name: "To check syntax and find problems", value: "problems" },
{ name: "To check syntax, find problems, and enforce code style", value: "style" }
]
},
{
type: "list",
name: "moduleType",
message: "What type of modules does your project use?",
default: "esm",
choices: [
{ name: "JavaScript modules (import/export)", value: "esm" },
{ name: "CommonJS (require/exports)", value: "commonjs" },
{ name: "None of these", value: "none" }
]
},
{
type: "list",
name: "framework",
message: "Which framework does your project use?",
default: "react",
choices: [
{ name: "React", value: "react" },
{ name: "Vue.js", value: "vue" },
{ name: "None of these", value: "none" }
]
},
{
type: "checkbox",
name: "env",
message: "Where does your code run?",
default: ["browser"],
choices: [
{ name: "Browser", value: "browser" },
{ name: "Node", value: "node" }
]
},
{
type: "list",
name: "source",
message: "How would you like to define a style for your project?",
default: "guide",
choices: [
{ name: "Use a popular style guide", value: "guide" },
{ name: "Answer questions about your style", value: "prompt" },
{ name: "Inspect your JavaScript file(s)", value: "auto" }
],
when(answers) {
return answers.purpose === "style";
}
},
{
type: "list",
name: "styleguide",
message: "Which style guide do you want to follow?",
choices: [
{ name: "Airbnb (https://github.com/airbnb/javascript)", value: "airbnb" },
{ name: "Standard (https://github.com/standard/standard)", value: "standard" },
{ name: "Google (https://github.com/google/eslint-config-google)", value: "google" }
],
when(answers) {
answers.packageJsonExists = npmUtils.checkPackageJson();
return answers.source === "guide" && answers.packageJsonExists;
}
},
{
type: "input",
name: "patterns",
message: "Which file(s), path(s), or glob(s) should be examined?",
when(answers) {
return (answers.source === "auto");
},
validate(input) {
if (input.trim().length === 0 && input.trim() !== ",") {
return "You must tell us what code to examine. Try again.";
}
return true;
}
},
{
type: "list",
name: "format",
message: "What format do you want your config file to be in?",
default: "JavaScript",
choices: ["JavaScript", "YAML", "JSON"]
},
{
type: "confirm",
name: "installESLint",
message(answers) {
const verb = semver.ltr(answers.localESLintVersion, answers.requiredESLintVersionRange)
? "upgrade"
: "downgrade";

return `The style guide "${answers.styleguide}" requires eslint@${answers.requiredESLintVersionRange}. You are currently using eslint@${answers.localESLintVersion}.\n  Do you want to ${verb}?`;
},
default: true,
when(answers) {
return answers.source === "guide" && answers.packageJsonExists && hasESLintVersionConflict(answers);
}
}
]).then(earlyAnswers => {


if (earlyAnswers.purpose !== "style") {
const config = processAnswers(earlyAnswers);
const modules = getModulesList(config);

return askInstallModules(modules, earlyAnswers.packageJsonExists)
.then(() => writeFile(config, earlyAnswers.format));
}


if (earlyAnswers.source === "guide") {
if (!earlyAnswers.packageJsonExists) {
log.info("A package.json is necessary to install plugins such as style guides. Run `npm init` to create a package.json file and try again.");
return void 0;
}
if (earlyAnswers.installESLint === false && !semver.satisfies(earlyAnswers.localESLintVersion, earlyAnswers.requiredESLintVersionRange)) {
log.info(`Note: it might not work since ESLint's version is mismatched with the ${earlyAnswers.styleguide} config.`);
}
if (earlyAnswers.styleguide === "airbnb" && earlyAnswers.framework !== "react") {
earlyAnswers.styleguide = "airbnb-base";
}

const config = processAnswers(earlyAnswers);

if (Array.isArray(config.extends)) {
config.extends.push(earlyAnswers.styleguide);
} else if (config.extends) {
config.extends = [config.extends, earlyAnswers.styleguide];
} else {
config.extends = [earlyAnswers.styleguide];
}

const modules = getModulesList(config);

return askInstallModules(modules, earlyAnswers.packageJsonExists)
.then(() => writeFile(config, earlyAnswers.format));

}

if (earlyAnswers.source === "auto") {
const combinedAnswers = Object.assign({}, earlyAnswers);
const config = processAnswers(combinedAnswers);
const modules = getModulesList(config);

return askInstallModules(modules).then(() => writeFile(config, earlyAnswers.format));
}


return inquirer.prompt([
{
type: "list",
name: "indent",
message: "What style of indentation do you use?",
default: "tab",
choices: [{ name: "Tabs", value: "tab" }, { name: "Spaces", value: 4 }]
},
{
type: "list",
name: "quotes",
message: "What quotes do you use for strings?",
default: "double",
choices: [{ name: "Double", value: "double" }, { name: "Single", value: "single" }]
},
{
type: "list",
name: "linebreak",
message: "What line endings do you use?",
default: "unix",
choices: [{ name: "Unix", value: "unix" }, { name: "Windows", value: "windows" }]
},
{
type: "confirm",
name: "semi",
message: "Do you require semicolons?",
default: true
}
]).then(answers => {
const totalAnswers = Object.assign({}, earlyAnswers, answers);

const config = processAnswers(totalAnswers);
const modules = getModulesList(config);

return askInstallModules(modules).then(() => writeFile(config, earlyAnswers.format));
});
});
}





const init = {
getModulesList,
hasESLintVersionConflict,
installModules,
processAnswers,
initializeConfig() {
return promptUser();
}
};

module.exports = init;
