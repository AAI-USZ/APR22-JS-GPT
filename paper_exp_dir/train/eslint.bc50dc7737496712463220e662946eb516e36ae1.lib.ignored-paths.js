

"use strict";





const fs = require("fs"),
path = require("path"),
ignore = require("ignore"),
pathUtils = require("./path-utils");

const debug = require("debug")("eslint:ignored-paths");





const ESLINT_IGNORE_FILENAME = ".eslintignore";


const DEFAULT_IGNORE_DIRS = [
"/node_modules/*",
"/bower_components/*"
];
const DEFAULT_OPTIONS = {
dotfiles: false,
cwd: process.cwd()
};






function findFile(cwd, name) {
const ignoreFilePath = path.resolve(cwd, name);

return fs.existsSync(ignoreFilePath) && fs.statSync(ignoreFilePath).isFile() ? ignoreFilePath : "";
}


function findIgnoreFile(cwd) {
return findFile(cwd, ESLINT_IGNORE_FILENAME);
}


function findPackageJSONFile(cwd) {
return findFile(cwd, "package.json");
}


function mergeDefaultOptions(options) {
return Object.assign({}, DEFAULT_OPTIONS, options);
}



const normalizePathSeps = path.sep === "/"
? (str => str)
: ((seps, str) => str.replace(seps, "/")).bind(null, new RegExp(`\\${path.sep}`, "g"));



function relativize(globPattern, relativePathToOldBaseDir) {
if (relativePathToOldBaseDir === "") {
return globPattern;
}

const prefix = globPattern.startsWith("!") ? "!" : "";
const globWithoutPrefix = globPattern.replace(/^!/, "");

if (globWithoutPrefix.startsWith("/")) {
return `${prefix}/${normalizePathSeps(relativePathToOldBaseDir)}${globWithoutPrefix}`;
}

return globPattern;
}






class IgnoredPaths {


constructor(providedOptions) {
const options = mergeDefaultOptions(providedOptions);

this.cache = {};

this.defaultPatterns = [].concat(DEFAULT_IGNORE_DIRS, options.patterns || []);

this.ignoreFileDir = options.ignore !== false && options.ignorePath
? path.dirname(path.resolve(options.cwd, options.ignorePath))
: options.cwd;
this.options = options;
this._baseDir = null;

this.ig = {
custom: ignore(),
default: ignore()
};

this.defaultPatterns.forEach(pattern => this.addPatternRelativeToCwd(this.ig.default, pattern));
if (options.dotfiles !== true) {


this.addPatternRelativeToCwd(this.ig.default, ".*");
this.addPatternRelativeToCwd(this.ig.default, "!../");
}


this.ig.custom.ignoreFiles = [];
this.ig.default.ignoreFiles = [];

if (options.ignore !== false) {
let ignorePath;

if (options.ignorePath) {
debug("Using specific ignore file");

try {
fs.statSync(options.ignorePath);
ignorePath = options.ignorePath;
} catch (e) {
e.message = `Cannot read ignore file: ${options.ignorePath}\nError: ${e.message}`;
throw e;
}
} else {
debug(`Looking for ignore file in ${options.cwd}`);
ignorePath = findIgnoreFile(options.cwd);

try {
fs.statSync(ignorePath);
debug(`Loaded ignore file ${ignorePath}`);
} catch (e) {
debug("Could not find ignore file in cwd");
}
}

if (ignorePath) {
debug(`Adding ${ignorePath}`);
this.addIgnoreFile(this.ig.custom, ignorePath);
this.addIgnoreFile(this.ig.default, ignorePath);
} else {
try {


const packageJSONPath = findPackageJSONFile(options.cwd);

if (packageJSONPath) {
let packageJSONOptions;

try {
packageJSONOptions = JSON.parse(fs.readFileSync(packageJSONPath, "utf8"));
} catch (e) {
debug("Could not read package.json file to check eslintIgnore property");
e.messageTemplate = "failed-to-read-json";
e.messageData = {
path: packageJSONPath,
message: e.message
};
throw e;
}

if (packageJSONOptions.eslintIgnore) {
if (Array.isArray(packageJSONOptions.eslintIgnore)) {
packageJSONOptions.eslintIgnore.forEach(pattern => {
this.addPatternRelativeToIgnoreFile(this.ig.custom, pattern);
this.addPatternRelativeToIgnoreFile(this.ig.default, pattern);
});
} else {
throw new TypeError("Package.json eslintIgnore property requires an array of paths");
}
}
}
} catch (e) {
debug("Could not find package.json to check eslintIgnore property");
throw e;
}
}

if (options.ignorePattern) {
this.addPatternRelativeToCwd(this.ig.custom, options.ignorePattern);
this.addPatternRelativeToCwd(this.ig.default, options.ignorePattern);
}
}
}



addPatternRelativeToCwd(ig, pattern) {
const baseDir = this.getBaseDir();
const cookedPattern = baseDir === this.options.cwd
? pattern
: relativize(pattern, path.relative(baseDir, this.options.cwd));

ig.addPattern(cookedPattern);
debug("addPatternRelativeToCwd:\n  original = %j\n  cooked   = %j", pattern, cookedPattern);
}

addPatternRelativeToIgnoreFile(ig, pattern) {
const baseDir = this.getBaseDir();
const cookedPattern = baseDir === this.ignoreFileDir
? pattern
: relativize(pattern, path.relative(baseDir, this.ignoreFileDir));

ig.addPattern(cookedPattern);
debug("addPatternRelativeToIgnoreFile:\n  original = %j\n  cooked   = %j", pattern, cookedPattern);
}


getBaseDir() {
if (!this._baseDir) {
const a = path.resolve(this.options.cwd);
const b = path.resolve(this.ignoreFileDir);
let lastSepPos = 0;


this._baseDir = a.length < b.length ? a : b;


for (let i = 0; i < a.length && i < b.length; ++i) {
if (a[i] !== b[i]) {
this._baseDir = a.slice(0, lastSepPos);
break;
}
if (a[i] === path.sep) {
lastSepPos = i;
}
}


if (/^[A-Z]:$/.test(this._baseDir)) {
this._baseDir += "\\";
}

debug("baseDir = %j", this._baseDir);
}
return this._baseDir;
}


readIgnoreFile(filePath) {
if (typeof this.cache[filePath] === "undefined") {
this.cache[filePath] = fs.readFileSync(filePath, "utf8").split(/\r?\n/g).filter(Boolean);
}
return this.cache[filePath];
}


addIgnoreFile(ig, filePath) {
ig.ignoreFiles.push(filePath);
this
.readIgnoreFile(filePath)
.forEach(ignoreRule => this.addPatternRelativeToIgnoreFile(ig, ignoreRule));
}


contains(filepath, category) {

let result = false;
const absolutePath = path.resolve(this.options.cwd, filepath);
const relativePath = pathUtils.getRelativePath(absolutePath, this.getBaseDir());

if (typeof category === "undefined") {
result = (this.ig.default.filter([relativePath]).length === 0) ||
(this.ig.custom.filter([relativePath]).length === 0);
} else {
result = (this.ig[category].filter([relativePath]).length === 0);
}
debug("contains:");
debug("  target = %j", filepath);
debug("  result = %j", result);

return result;

}


getIgnoredFoldersGlobChecker() {
const baseDir = this.getBaseDir();
const ig = ignore();

DEFAULT_IGNORE_DIRS.forEach(ignoreDir => this.addPatternRelativeToCwd(ig, ignoreDir));

if (this.options.dotfiles !== true) {


ig.add([".*/*", "!../*"]);
}

if (this.options.ignore) {
ig.add(this.ig.custom);
}

const filter = ig.createFilter();

return function(absolutePath) {
const relative = pathUtils.getRelativePath(absolutePath, baseDir);

if (!relative) {
return false;
}

return !filter(relative);
};
}
}

module.exports = IgnoredPaths;
