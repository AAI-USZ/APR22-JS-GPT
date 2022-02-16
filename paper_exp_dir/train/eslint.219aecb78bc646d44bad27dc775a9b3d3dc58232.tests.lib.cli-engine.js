

"use strict";





const assert = require("chai").assert,
path = require("path"),
sinon = require("sinon"),
leche = require("leche"),
shell = require("shelljs"),
fs = require("fs"),
os = require("os"),
hash = require("../../../lib/cli-engine/hash"),
{ CascadingConfigArrayFactory } = require("../../../lib/cli-engine/cascading-config-array-factory"),
{ defineCLIEngineWithInMemoryFileSystem } = require("./_utils");

const proxyquire = require("proxyquire").noCallThru().noPreserveCache();

const fCache = require("file-entry-cache");





describe("CLIEngine", () => {

const examplePluginName = "eslint-plugin-example",
examplePluginNameWithNamespace = "@eslint/eslint-plugin-example",
examplePlugin = {
rules: {
"example-rule": require("../../fixtures/rules/custom-rule"),
"make-syntax-error": require("../../fixtures/rules/make-syntax-error-rule")
}
},
examplePreprocessorName = "eslint-plugin-processor",
originalDir = process.cwd(),
fixtureDir = path.resolve(fs.realpathSync(os.tmpdir()), "eslint/fixtures");


let CLIEngine;


let getCLIEngineInternalSlots;


function getFixturePath(...args) {
const filepath = path.join(fixtureDir, ...args);

try {
return fs.realpathSync(filepath);
} catch (e) {
return filepath;
}
}


function cliEngineWithPlugins(options) {
const engine = new CLIEngine(options);


engine.addPlugin(examplePluginName, examplePlugin);
engine.addPlugin(examplePluginNameWithNamespace, examplePlugin);
engine.addPlugin(examplePreprocessorName, require("../../fixtures/processors/custom-processor"));

return engine;
}


before(() => {
shell.mkdir("-p", fixtureDir);
shell.cp("-r", "./tests/fixtures/.", fixtureDir);
});

beforeEach(() => {
({ CLIEngine, getCLIEngineInternalSlots } = require("../../../lib/cli-engine/cli-engine"));
});

after(() => {
shell.rm("-r", fixtureDir);
});

describe("new CLIEngine(options)", () => {
it("the default value of 'options.cwd' should be the current working directory.", () => {
process.chdir(__dirname);
try {
const engine = new CLIEngine();
const internalSlots = getCLIEngineInternalSlots(engine);

assert.strictEqual(internalSlots.options.cwd, __dirname);
} finally {
process.chdir(originalDir);
}
});

it("should report one fatal message when given a path by --ignore-path that is not a file when ignore is true.", () => {
assert.throws(() => {

new CLIEngine({ ignorePath: fixtureDir });
}, `Cannot read ignore file: ${fixtureDir}\nError: ${fixtureDir} is not a file`);
});


it("should not modify baseConfig when format is specified", () => {
const customBaseConfig = { root: true };

new CLIEngine({ baseConfig: customBaseConfig, format: "foo" });

assert.deepStrictEqual(customBaseConfig, { root: true });
});
});

describe("executeOnText()", () => {

let engine;

it("should report the total and per file errors when using local cwd .eslintrc", () => {

engine = new CLIEngine();

const report = engine.executeOnText("var foo = 'bar';");

assert.strictEqual(report.results.length, 1);
assert.strictEqual(report.errorCount, 5);
assert.strictEqual(report.warningCount, 0);
assert.strictEqual(report.fixableErrorCount, 3);
assert.strictEqual(report.fixableWarningCount, 0);
assert.strictEqual(report.results[0].messages.length, 5);
assert.strictEqual(report.results[0].messages[0].ruleId, "strict");
assert.strictEqual(report.results[0].messages[1].ruleId, "no-var");
assert.strictEqual(report.results[0].messages[2].ruleId, "no-unused-vars");
assert.strictEqual(report.results[0].messages[3].ruleId, "quotes");
assert.strictEqual(report.results[0].messages[4].ruleId, "eol-last");
assert.strictEqual(report.results[0].fixableErrorCount, 3);
assert.strictEqual(report.results[0].fixableWarningCount, 0);
});

it("should report the total and per file warnings when using local cwd .eslintrc", () => {

engine = new CLIEngine({
rules: {
quotes: 1,
"no-var": 1,
"eol-last": 1,
strict: 1,
"no-unused-vars": 1
}
});

const report = engine.executeOnText("var foo = 'bar';");

assert.strictEqual(report.results.length, 1);
assert.strictEqual(report.errorCount, 0);
assert.strictEqual(report.warningCount, 5);
assert.strictEqual(report.fixableErrorCount, 0);
assert.strictEqual(report.fixableWarningCount, 3);
assert.strictEqual(report.results[0].messages.length, 5);
assert.strictEqual(report.results[0].messages[0].ruleId, "strict");
assert.strictEqual(report.results[0].messages[1].ruleId, "no-var");
assert.strictEqual(report.results[0].messages[2].ruleId, "no-unused-vars");
assert.strictEqual(report.results[0].messages[3].ruleId, "quotes");
assert.strictEqual(report.results[0].messages[4].ruleId, "eol-last");
assert.strictEqual(report.results[0].fixableErrorCount, 0);
assert.strictEqual(report.results[0].fixableWarningCount, 3);
});

it("should report one message when using specific config file", () => {

engine = new CLIEngine({
configFile: "fixtures/configurations/quotes-error.json",
useEslintrc: false,
cwd: getFixturePath("..")
});

const report = engine.executeOnText("var foo = 'bar';");

assert.strictEqual(report.results.length, 1);
assert.strictEqual(report.errorCount, 1);
assert.strictEqual(report.warningCount, 0);
assert.strictEqual(report.fixableErrorCount, 1);
assert.strictEqual(report.fixableWarningCount, 0);
assert.strictEqual(report.results[0].messages.length, 1);
assert.strictEqual(report.results[0].messages[0].ruleId, "quotes");
assert.isUndefined(report.results[0].messages[0].output);
assert.strictEqual(report.results[0].errorCount, 1);
assert.strictEqual(report.results[0].fixableErrorCount, 1);
assert.strictEqual(report.results[0].warningCount, 0);
});

it("should report the filename when passed in", () => {

engine = new CLIEngine({
ignore: false,
cwd: getFixturePath()
});

const report = engine.executeOnText("var foo = 'bar';", "test.js");

assert.strictEqual(report.results[0].filePath, getFixturePath("test.js"));
});

it("should return a warning when given a filename by --stdin-filename in excluded files list if warnIgnored is true", () => {
engine = new CLIEngine({
ignorePath: getFixturePath(".eslintignore"),
cwd: getFixturePath("..")
});

const report = engine.executeOnText("var bar = foo;", "fixtures/passing.js", true);

assert.strictEqual(report.results.length, 1);
assert.strictEqual(report.errorCount, 0);
assert.strictEqual(report.warningCount, 1);
assert.strictEqual(report.fixableErrorCount, 0);
assert.strictEqual(report.fixableWarningCount, 0);
assert.strictEqual(report.results[0].filePath, getFixturePath("passing.js"));
assert.strictEqual(report.results[0].messages[0].severity, 1);
assert.strictEqual(report.results[0].messages[0].message, "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.");
assert.isUndefined(report.results[0].messages[0].output);
assert.strictEqual(report.results[0].errorCount, 0);
assert.strictEqual(report.results[0].warningCount, 1);
assert.strictEqual(report.results[0].fixableErrorCount, 0);
assert.strictEqual(report.results[0].fixableWarningCount, 0);
});

it("should not return a warning when given a filename by --stdin-filename in excluded files list if warnIgnored is false", () => {
engine = new CLIEngine({
ignorePath: getFixturePath(".eslintignore"),
cwd: getFixturePath("..")
});


const report = engine.executeOnText("va r bar = foo;", "fixtures/passing.js", false);


assert.strictEqual(report.results.length, 0);
});

it("should suppress excluded file warnings by default", () => {
engine = new CLIEngine({
ignorePath: getFixturePath(".eslintignore"),
cwd: getFixturePath("..")
});

const report = engine.executeOnText("var bar = foo;", "fixtures/passing.js");


assert.strictEqual(report.results.length, 0);
});

it("should return a message when given a filename by --stdin-filename in excluded files list and ignore is off", () => {

engine = new CLIEngine({
ignorePath: "fixtures/.eslintignore",
cwd: getFixturePath(".."),
ignore: false,
useEslintrc: false,
rules: {
"no-undef": 2
}
});

const report = engine.executeOnText("var bar = foo;", "fixtures/passing.js");

assert.strictEqual(report.results.length, 1);
assert.strictEqual(report.results[0].filePath, getFixturePath("passing.js"));
assert.strictEqual(report.results[0].messages[0].ruleId, "no-undef");
assert.strictEqual(report.results[0].messages[0].severity, 2);
assert.isUndefined(report.results[0].messages[0].output);
});

it("should return a message and fixed text when in fix mode", () => {

engine = new CLIEngine({
useEslintrc: false,
fix: true,
rules: {
semi: 2
},
ignore: false,
cwd: getFixturePath()
});

const report = engine.executeOnText("var bar = foo", "passing.js");

assert.deepStrictEqual(report, {
results: [
{
filePath: getFixturePath("passing.js"),
messages: [],
errorCount: 0,
warningCount: 0,
fixableErrorCount: 0,
fixableWarningCount: 0,
output: "var bar = foo;"
}
],
errorCount: 0,
warningCount: 0,
fixableErrorCount: 0,
fixableWarningCount: 0,
usedDeprecatedRules: []
});
});

it("correctly autofixes semicolon-conflicting-fixes", () => {
engine = new CLIEngine({
cwd: path.join(fixtureDir, ".."),
useEslintrc: false,
fix: true
});
const inputPath = getFixturePath("autofix/semicolon-conflicting-fixes.js");
const outputPath = getFixturePath("autofix/semicolon-conflicting-fixes.expected.js");
const report = engine.executeOnFiles([inputPath]);
const expectedOutput = fs.readFileSync(outputPath, "utf8");

assert.strictEqual(report.results[0].output, expectedOutput);
});

it("correctly autofixes return-conflicting-fixes", () => {
engine = new CLIEngine({
cwd: path.join(fixtureDir, ".."),
useEslintrc: false,
fix: true
});
const inputPath = getFixturePath("autofix/return-conflicting-fixes.js");
const outputPath = getFixturePath("autofix/return-conflicting-fixes.expected.js");
const report = engine.executeOnFiles([inputPath]);
const expectedOutput = fs.readFileSync(outputPath, "utf8");

assert.strictEqual(report.results[0].output, expectedOutput);
});

describe("Fix Types", () => {

it("should throw an error when an invalid fix type is specified", () => {
assert.throws(() => {
engine = new CLIEngine({
cwd: path.join(fixtureDir, ".."),
useEslintrc: false,
fix: true,
fixTypes: ["layou"]
});
}, /invalid fix type/iu);
});

it("should not fix any rules when fixTypes is used without fix", () => {
engine = new CLIEngine({
cwd: path.join(fixtureDir, ".."),
useEslintrc: false,
fix: false,
fixTypes: ["layout"]
});

const inputPath = getFixturePath("fix-types/fix-only-semi.js");
const report = engine.executeOnFiles([inputPath]);

assert.isUndefined(report.results[0].output);
});

it("should not fix non-style rules when fixTypes has only 'layout'", () => {
engine = new CLIEngine({
cwd: path.join(fixtureDir, ".."),
useEslintrc: false,
fix: true,
fixTypes: ["layout"]
});
const inputPath = getFixturePath("fix-types/fix-only-semi.js");
const outputPath = getFixturePath("fix-types/fix-only-semi.expected.js");
const report = engine.executeOnFiles([inputPath]);
const expectedOutput = fs.readFileSync(outputPath, "utf8");

assert.strictEqual(report.results[0].output, expectedOutput);
});

it("should not fix style or problem rules when fixTypes has only 'suggestion'", () => {
engine = new CLIEngine({
cwd: path.join(fixtureDir, ".."),
useEslintrc: false,
fix: true,
fixTypes: ["suggestion"]
});
const inputPath = getFixturePath("fix-types/fix-only-prefer-arrow-callback.js");
const outputPath = getFixturePath("fix-types/fix-only-prefer-arrow-callback.expected.js");
const report = engine.executeOnFiles([inputPath]);
const expectedOutput = fs.readFileSync(outputPath, "utf8");

assert.strictEqual(report.results[0].output, expectedOutput);
});

it("should fix both style and problem rules when fixTypes has 'suggestion' and 'layout'", () => {
engine = new CLIEngine({
cwd: path.join(fixtureDir, ".."),
useEslintrc: false,
fix: true,
fixTypes: ["suggestion", "layout"]
});
const inputPath = getFixturePath("fix-types/fix-both-semi-and-prefer-arrow-callback.js");
const outputPath = getFixturePath("fix-types/fix-both-semi-and-prefer-arrow-callback.expected.js");
const report = engine.executeOnFiles([inputPath]);
const expectedOutput = fs.readFileSync(outputPath, "utf8");

assert.strictEqual(report.results[0].output, expectedOutput);
});

it("should not throw an error when a rule doesn't have a 'meta' property", () => {
engine = new CLIEngine({
cwd: path.join(fixtureDir, ".."),
useEslintrc: false,
fix: true,
fixTypes: ["layout"],
rulePaths: [getFixturePath("rules", "fix-types-test")]
});

const inputPath = getFixturePath("fix-types/ignore-missing-meta.js");
const outputPath = getFixturePath("fix-types/ignore-missing-meta.expected.js");
const report = engine.executeOnFiles([inputPath]);
const expectedOutput = fs.readFileSync(outputPath, "utf8");

assert.strictEqual(report.results[0].output, expectedOutput);
});

it("should not throw an error when a rule is loaded after initialization with executeOnFiles()", () => {
engine = new CLIEngine({
cwd: path.join(fixtureDir, ".."),
useEslintrc: false,
fix: true,
fixTypes: ["layout"]
});
const internalSlots = getCLIEngineInternalSlots(engine);

internalSlots.linter.defineRule(
"no-program",
require(getFixturePath("rules", "fix-types-test", "no-program.js"))
);

const inputPath = getFixturePath("fix-types/ignore-missing-meta.js");
const outputPath = getFixturePath("fix-types/ignore-missing-meta.expected.js");
const report = engine.executeOnFiles([inputPath]);
const expectedOutput = fs.readFileSync(outputPath, "utf8");

assert.strictEqual(report.results[0].output, expectedOutput);
});

it("should not throw an error when a rule is loaded after initialization with executeOnText()", () => {
engine = new CLIEngine({
cwd: path.join(fixtureDir, ".."),
useEslintrc: false,
fix: true,
fixTypes: ["layout"]
});
const internalSlots = getCLIEngineInternalSlots(engine);

internalSlots.linter.defineRule(
"no-program",
require(getFixturePath("rules", "fix-types-test", "no-program.js"))
);

const inputPath = getFixturePath("fix-types/ignore-missing-meta.js");
const outputPath = getFixturePath("fix-types/ignore-missing-meta.expected.js");
const report = engine.executeOnText(fs.readFileSync(inputPath, { encoding: "utf8" }), inputPath);
const expectedOutput = fs.readFileSync(outputPath, "utf8");

assert.strictEqual(report.results[0].output, expectedOutput);
});

});

it("should return a message and omit fixed text when in fix mode and fixes aren't done", () => {

engine = new CLIEngine({
useEslintrc: false,
fix: true,
rules: {
"no-undef": 2
},
ignore: false,
cwd: getFixturePath()
});

const report = engine.executeOnText("var bar = foo", "passing.js");

assert.deepStrictEqual(report, {
results: [
{
filePath: getFixturePath("passing.js"),
messages: [
{
ruleId: "no-undef",
severity: 2,
messageId: "undef",
message: "'foo' is not defined.",
line: 1,
column: 11,
endLine: 1,
endColumn: 14,
nodeType: "Identifier"
}
],
errorCount: 1,
warningCount: 0,
fixableErrorCount: 0,
fixableWarningCount: 0,
source: "var bar = foo"
}
],
errorCount: 1,
warningCount: 0,
fixableErrorCount: 0,
fixableWarningCount: 0,
usedDeprecatedRules: []
});
});

it("should not delete code if there is a syntax error after trying to autofix.", () => {
engine = cliEngineWithPlugins({
useEslintrc: false,
fix: true,
plugins: ["example"],
rules: {
"example/make-syntax-error": "error"
},
ignore: false,
cwd: getFixturePath()
});

const report = engine.executeOnText("var bar = foo", "test.js");

assert.deepStrictEqual(report, {
results: [
{
filePath: getFixturePath("test.js"),
messages: [
{
ruleId: null,
fatal: true,
severity: 2,
message: "Parsing error: Unexpected token is",
line: 1,
column: 19
}
],
errorCount: 1,
warningCount: 0,
fixableErrorCount: 0,
fixableWarningCount: 0,
output: "var bar = foothis is a syntax error."
}
],
errorCount: 1,
warningCount: 0,
fixableErrorCount: 0,
fixableWarningCount: 0,
usedDeprecatedRules: []
});
});

it("should not crash even if there are any syntax error since the first time.", () => {
engine = new CLIEngine({
useEslintrc: false,
fix: true,
rules: {
"example/make-syntax-error": "error"
},
ignore: false,
cwd: getFixturePath()
});

const report = engine.executeOnText("var bar =", "test.js");

assert.deepStrictEqual(report, {
results: [
{
filePath: getFixturePath("test.js"),
messages: [
{
ruleId: null,
fatal: true,
severity: 2,
message: "Parsing error: Unexpected token",
line: 1,
column: 10
}
],
errorCount: 1,
warningCount: 0,
fixableErrorCount: 0,
fixableWarningCount: 0,
source: "var bar ="
}
],
errorCount: 1,
warningCount: 0,
fixableErrorCount: 0,
fixableWarningCount: 0,
usedDeprecatedRules: []
});
});

it("should return source code of file in `source` property when errors are present", () => {
engine = new CLIEngine({
useEslintrc: false,
rules: { semi: 2 }
});

const report = engine.executeOnText("var foo = 'bar'");

assert.strictEqual(report.results[0].source, "var foo = 'bar'");
});

it("should return source code of file in `source` property when warnings are present", () => {
engine = new CLIEngine({
useEslintrc: false,
rules: { semi: 1 }
});

const report = engine.executeOnText("var foo = 'bar'");

assert.strictEqual(report.results[0].source, "var foo = 'bar'");
});


it("should not return a `source` property when no errors or warnings are present", () => {
engine = new CLIEngine({
useEslintrc: false,
rules: { semi: 2 }
});

const report = engine.executeOnText("var foo = 'bar';");

assert.lengthOf(report.results[0].messages, 0);
assert.isUndefined(report.results[0].source);
});

it("should not return a `source` property when fixes are applied", () => {
engine = new CLIEngine({
useEslintrc: false,
fix: true,
rules: {
semi: 2,
"no-unused-vars": 2
}
});

const report = engine.executeOnText("var msg = 'hi' + foo\n");

assert.isUndefined(report.results[0].source);
assert.strictEqual(report.results[0].output, "var msg = 'hi' + foo;\n");
});

it("should return a `source` property when a parsing error has occurred", () => {
engine = new CLIEngine({
useEslintrc: false,
rules: { semi: 2 }
});

const report = engine.executeOnText("var bar = foothis is a syntax error.\n return bar;");

assert.deepStrictEqual(report, {
results: [
{
filePath: "<text>",
messages: [
{
ruleId: null,
fatal: true,
severity: 2,
message: "Parsing error: Unexpected token is",
line: 1,
column: 19
}
],
errorCount: 1,
warningCount: 0,
fixableErrorCount: 0,
fixableWarningCount: 0,
source: "var bar = foothis is a syntax error.\n return bar;"
}
],
errorCount: 1,
warningCount: 0,
fixableErrorCount: 0,
fixableWarningCount: 0,
usedDeprecatedRules: []
});
});


it("should respect default ignore rules, even with --no-ignore", () => {

engine = new CLIEngine({
cwd: getFixturePath(),
ignore: false
});

const report = engine.executeOnText("var bar = foo;", "node_modules/passing.js", true);
const expectedMsg = "File ignored by default. Use \"--ignore-pattern '!node_modules/*'\" to override.";

assert.strictEqual(report.results.length, 1);
assert.strictEqual(report.results[0].filePath, getFixturePath("node_modules/passing.js"));
assert.strictEqual(report.results[0].messages[0].message, expectedMsg);
});


describe("(plugin shorthand)", () => {
const Module = require("module");
let originalFindPath = null;


before(() => {
originalFindPath = Module._findPath;
Module._findPath = function(id, ...otherArgs) {
if (id === "@scope/eslint-plugin") {
return path.resolve(__dirname, "../../fixtures/plugin-shorthand/basic/node_modules/@scope/eslint-plugin/index.js");
}
return originalFindPath.call(this, id, ...otherArgs);
};
});
after(() => {
Module._findPath = originalFindPath;
});


it("should resolve 'plugins:[\"@scope\"]' to 'node_modules/@scope/eslint-plugin'.", () => {
engine = new CLIEngine({ cwd: getFixturePath("plugin-shorthand/basic") });
const report = engine.executeOnText("var x = 0", "index.js").results[0];

assert.strictEqual(report.filePath, getFixturePath("plugin-shorthand/basic/index.js"));
assert.strictEqual(report.messages[0].ruleId, "@scope/rule");
assert.strictEqual(report.messages[0].message, "OK");
});

it("should resolve 'extends:[\"plugin:@scope/recommended\"]' to 'node_modules/@scope/eslint-plugin'.", () => {
engine = new CLIEngine({ cwd: getFixturePath("plugin-shorthand/extends") });
const report = engine.executeOnText("var x = 0", "index.js").results[0];

assert.strictEqual(report.filePath, getFixturePath("plugin-shorthand/extends/index.js"));
assert.strictEqual(report.messages[0].ruleId, "@scope/rule");
assert.strictEqual(report.messages[0].message, "OK");
});
});
it("should warn when deprecated rules are found in a config", () => {
engine = new CLIEngine({
cwd: originalDir,
useEslintrc: false,
configFile: "tests/fixtures/cli-engine/deprecated-rule-config/.eslintrc.yml"
});

const report = engine.executeOnText("foo");

assert.deepStrictEqual(
report.usedDeprecatedRules,
[{ ruleId: "indent-legacy", replacedBy: ["indent"] }]
);
});
});

describe("executeOnFiles()", () => {


let engine;

it("should use correct parser when custom parser is specified", () => {

engine = new CLIEngine({
cwd: originalDir,
ignore: false
});

const filePath = path.resolve(__dirname, "../../fixtures/configurations/parser/custom.js");
const report = engine.executeOnFiles([filePath]);

assert.strictEqual(report.results.length, 1);
assert.strictEqual(report.results[0].messages.length, 1);
assert.strictEqual(report.results[0].messages[0].message, "Parsing error: Boom!");

});

it("should report zero messages when given a config file and a valid file", () => {

engine = new CLIEngine({
cwd: originalDir,
configFile: ".eslintrc.js"
});

const report = engine.executeOnFiles(["lib/**/cli*.js"]);
