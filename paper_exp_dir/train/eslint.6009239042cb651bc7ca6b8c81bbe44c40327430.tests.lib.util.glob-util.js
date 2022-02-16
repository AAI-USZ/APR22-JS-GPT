
"use strict";





const assert = require("chai").assert,
path = require("path"),
os = require("os"),
sh = require("shelljs"),
globUtils = require("../../../lib/util/glob-utils"),
fs = require("fs");





let fixtureDir;


function getFixturePath(...args) {
return path.join(fs.realpathSync(fixtureDir), ...args);
}





describe("globUtils", () => {

before(() => {
fixtureDir = `${os.tmpdir()}/eslint/tests/fixtures/`;
sh.mkdir("-p", fixtureDir);
sh.cp("-r", "./tests/fixtures/*", fixtureDir);
});

after(() => {
sh.rm("-r", fixtureDir);
});

describe("resolveFileGlobPatterns()", () => {

it("should convert a directory name with no provided extensions into a glob pattern", () => {
const patterns = ["one-js-file"];
const opts = {
cwd: getFixturePath("glob-util")
};
const result = globUtils.resolveFileGlobPatterns(patterns, opts);

assert.deepStrictEqual(result, ["one-js-file/**/*.js"]);
});

it("should not convert path with globInputPaths option false", () => {
const patterns = ["one-js-file"];
const opts = {
cwd: getFixturePath("glob-util"),
globInputPaths: false
};
const result = globUtils.resolveFileGlobPatterns(patterns, opts);

assert.deepStrictEqual(result, ["one-js-file"]);
});

it("should convert an absolute directory name with no provided extensions into a posix glob pattern", () => {
const patterns = [getFixturePath("glob-util", "one-js-file")];
const opts = {
cwd: getFixturePath("glob-util")
};
const result = globUtils.resolveFileGlobPatterns(patterns, opts);
const expected = [`${getFixturePath("glob-util", "one-js-file").replace(/\\/g, "/")} *.js`];

assert.deepStrictEqual(result, expected);
});

it("should convert a directory name with a single provided extension into a glob pattern", () => {
const patterns = ["one-js-file"];
const opts = {
cwd: getFixturePath("glob-util"),
extensions: [".jsx"]
};
const result = globUtils.resolveFileGlobPatterns(patterns, opts);

assert.deepStrictEqual(result, ["one-js-file/**/*.jsx"]);
});

it("should convert a directory name with multiple provided extensions into a glob pattern", () => {
const patterns = ["one-js-file"];
const opts = {
cwd: getFixturePath("glob-util"),
extensions: [".jsx", ".js"]
};
const result = globUtils.resolveFileGlobPatterns(patterns, opts);

assert.deepStrictEqual(result, ["one-js-file/**/*.{jsx,js}"]);
});

it("should convert multiple directory names into glob patterns", () => {
const patterns = ["one-js-file", "two-js-files"];
const opts = {
cwd: getFixturePath("glob-util")
};
const result = globUtils.resolveFileGlobPatterns(patterns, opts);

assert.deepStrictEqual(result, ["one-js-file/**/*.js", "two-js-files/**/*.js"]);
});

it("should remove leading './' from glob patterns", () => {
const patterns = ["./one-js-file"];
const opts = {
cwd: getFixturePath("glob-util")
};
const result = globUtils.resolveFileGlobPatterns(patterns, opts);

assert.deepStrictEqual(result, ["one-js-file/**/*.js"]);
});

it("should convert a directory name with a trailing '/' into a glob pattern", () => {
const patterns = ["one-js-file/"];
const opts = {
cwd: getFixturePath("glob-util")
};
const result = globUtils.resolveFileGlobPatterns(patterns, opts);
