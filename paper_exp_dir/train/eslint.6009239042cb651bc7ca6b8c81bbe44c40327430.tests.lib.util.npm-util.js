
"use strict";





const assert = require("chai").assert,
spawn = require("cross-spawn"),
sinon = require("sinon"),
npmUtils = require("../../../lib/util/npm-utils"),
log = require("../../../lib/util/logging"),
mockFs = require("mock-fs");





describe("npmUtils", () => {

let sandbox;

beforeEach(() => {
sandbox = sinon.sandbox.create();
});

afterEach(() => {
sandbox.verifyAndRestore();
mockFs.restore();
});

describe("checkDevDeps()", () => {
let installStatus;

before(() => {
installStatus = npmUtils.checkDevDeps(["debug", "mocha", "notarealpackage", "jshint"]);
});

it("should not find a direct dependency of the project", () => {
assert.isFalse(installStatus.debug);
});

it("should find a dev dependency of the project", () => {
assert.isTrue(installStatus.mocha);
});

it("should not find non-dependencies", () => {
assert.isFalse(installStatus.notarealpackage);
});

it("should not find nested dependencies", () => {
assert.isFalse(installStatus.jshint);
});

it("should return false for a single, non-existent package", () => {
installStatus = npmUtils.checkDevDeps(["notarealpackage"]);
assert.isFalse(installStatus.notarealpackage);
});

it("should handle missing devDependencies key", () => {
mockFs({
"package.json": JSON.stringify({ private: true, dependencies: {} })
});


npmUtils.checkDevDeps(["some-package"]);
});

it("should throw with message when parsing invalid package.json", () => {
mockFs({
"package.json": "{ \"not: \"valid json\" }"
});

assert.throws(() => {
try {
npmUtils.checkDevDeps(["some-package"]);
} catch (error) {
assert.strictEqual(error.messageTemplate, "failed-to-read-json");
throw error;
}
}, "SyntaxError: Unexpected token v");
});
});

describe("checkDeps()", () => {
let installStatus;

before(() => {
installStatus = npmUtils.checkDeps(["debug", "mocha", "notarealpackage", "jshint"]);
});

afterEach(() => {
mockFs.restore();
});

it("should find a direct dependency of the project", () => {
assert.isTrue(installStatus.debug);
});

it("should not find a dev dependency of the project", () => {
assert.isFalse(installStatus.mocha);
});

it("should not find non-dependencies", () => {
assert.isFalse(installStatus.notarealpackage);
});

it("should not find nested dependencies", () => {
assert.isFalse(installStatus.jshint);
});

it("should return false for a single, non-existent package", () => {
installStatus = npmUtils.checkDeps(["notarealpackage"]);
assert.isFalse(installStatus.notarealpackage);
});

it("should throw if no package.json can be found", () => {
assert.throws(() => {
installStatus = npmUtils.checkDeps(["notarealpackage"], "/fakepath");
}, "Could not find a package.json file");
});

it("should handle missing dependencies key", () => {
mockFs({
"package.json": JSON.stringify({ private: true, devDependencies: {} })
});


npmUtils.checkDeps(["some-package"]);
