
"use strict";





const lodash = require("lodash"),
fs = require("fs"),
path = require("path"),
GlobSync = require("./glob"),

pathUtil = require("./path-utils"),
IgnoredPaths = require("../ignored-paths");

const debug = require("debug")("eslint:glob-utils");






function directoryExists(resolvedPath) {
return fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory();
}


function processPath(options) {
const cwd = (options && options.cwd) || process.cwd();
let extensions = (options && options.extensions) || [".js"];

extensions = extensions.map(ext => ext.replace(/^\./, ""));

let suffix = "/**";

if (extensions.length === 1) {
suffix += `
return function(pathname) {
let newPath = pathname;
const resolvedPath = path.resolve(cwd, pathname);

if (directoryExists(resolvedPath)) {
newPath = pathname.replace(/[/\\]$/, "") + suffix;
}

return pathUtil.convertPathToPosix(newPath);
};
}


class NoFilesFoundError extends Error {


constructor(pattern) {
super(`No files matching '${pattern}' were found.`);

this.messageTemplate = "file-not-found";
this.messageData = { pattern };
}

}


class AllFilesIgnoredError extends Error {


constructor(pattern) {
super(`All files matched by '${pattern}' are ignored.`);
this.messageTemplate = "all-files-ignored";
this.messageData = { pattern };
}
}

const NORMAL_LINT = {};
const SILENTLY_IGNORE = {};
const IGNORE_AND_WARN = {};


function testFileAgainstIgnorePatterns(filename, options, isDirectPath, ignoredPaths) {
const shouldProcessCustomIgnores = options.ignore !== false;
const shouldLintIgnoredDirectPaths = options.ignore === false;
const fileMatchesIgnorePatterns = ignoredPaths.contains(filename, "default") ||
(shouldProcessCustomIgnores && ignoredPaths.contains(filename, "custom"));

if (fileMatchesIgnorePatterns && isDirectPath && !shouldLintIgnoredDirectPaths) {
return IGNORE_AND_WARN;
}

if (!fileMatchesIgnorePatterns || (isDirectPath && shouldLintIgnoredDirectPaths)) {
return NORMAL_LINT;
}

return SILENTLY_IGNORE;
}






function resolveFileGlobPatterns(patterns, options) {
if (options.globInputPaths === false) {
return patterns;
}

const processPathExtensions = processPath(options);

return patterns.map(processPathExtensions);
}

const dotfilesPattern = /(?:(?:^\.)|(?:[/\\]\.))[^/\\.].*/;


function listFilesToProcess(globPatterns, providedOptions) {
const options = providedOptions || { ignore: true };
const cwd = options.cwd || process.cwd();

const getIgnorePaths = lodash.memoize(
optionsObj =>
new IgnoredPaths(optionsObj)
);


const resolvedGlobPatterns = module.exports.resolveFileGlobPatterns(globPatterns, options);

debug("Creating list of files to process.");
const resolvedPathsByGlobPattern = resolvedGlobPatterns.map(pattern => {
const file = path.resolve(cwd, pattern);

if (options.globInputPaths === false || (fs.existsSync(file) && fs.statSync(file).isFile())) {
const ignoredPaths = getIgnorePaths(options);
const fullPath = options.globInputPaths === false ? file : fs.realpathSync(file);

return [{
filename: fullPath,
behavior: testFileAgainstIgnorePatterns(fullPath, options, true, ignoredPaths)
}];
}


const globIncludesDotfiles = dotfilesPattern.test(pattern);
let newOptions = options;

if (!options.dotfiles) {
newOptions = Object.assign({}, options, { dotfiles: globIncludesDotfiles });
}

const ignoredPaths = getIgnorePaths(newOptions);
const shouldIgnore = ignoredPaths.getIgnoredFoldersGlobChecker();
const globOptions = {
nodir: true,
dot: true,
cwd
};

return new GlobSync(pattern, globOptions, shouldIgnore).found.map(globMatch => {
const relativePath = path.resolve(cwd, globMatch);

return {
filename: relativePath,
behavior: testFileAgainstIgnorePatterns(relativePath, options, false, ignoredPaths)
};
});
});

const allPathDescriptors = resolvedPathsByGlobPattern.reduce((pathsForAllGlobs, pathsForCurrentGlob, index) => {
if (pathsForCurrentGlob.every(pathDescriptor => pathDescriptor.behavior === SILENTLY_IGNORE)) {
throw new (pathsForCurrentGlob.length ? AllFilesIgnoredError : NoFilesFoundError)(globPatterns[index]);
}

pathsForCurrentGlob.forEach(pathDescriptor => {
switch (pathDescriptor.behavior) {
case NORMAL_LINT:
pathsForAllGlobs.push({ filename: pathDescriptor.filename, ignored: false });
break;
case IGNORE_AND_WARN:
pathsForAllGlobs.push({ filename: pathDescriptor.filename, ignored: true });
break;
case SILENTLY_IGNORE:


break;

default:
throw new Error(`Unexpected file behavior for ${pathDescriptor.filename}`);
}
});

return pathsForAllGlobs;
}, []);

return lodash.uniqBy(allPathDescriptors, pathDescriptor => pathDescriptor.filename);
}

module.exports = {
resolveFileGlobPatterns,
listFilesToProcess
};
