var semver = require('semver');
var which = require('which');
var fs = require('fs');
var path = require('path');
var Q = require('q');
var execFile = require('child_process').execFile;
var Project = require('../core/Project');
var defaultConfig = require('../config');
var createError = require('../util/createError');

function version(logger, versionArg, options, config) {
var project;

options = options || {};
config = defaultConfig(config);
project = new Project(config, logger);

return bump(project, versionArg, options.message);
}

function bump(project, versionArg, message) {
var cwd = project._config.cwd || process.cwd();
var newVersion;
var doGitCommit = false;

return checkGit(cwd)
.then(function (hasGit) {
doGitCommit = hasGit;
})
.then(project.getJson.bind(project))
.then(function (json) {
newVersion = getNewVersion(json.version, versionArg);
json.version = newVersion;
})
.then(project.saveJson.bind(project))
.then(function () {
if (doGitCommit) {
return gitCommitAndTag(cwd, newVersion, message);
}
})
.then(function () {
console.log('v' + newVersion);
return newVersion;
});
}

function getNewVersion(currentVersion, versionArg) {
var newVersion = semver.valid(versionArg);
if (!newVersion) {
newVersion = semver.inc(currentVersion, versionArg);
}
if (!newVersion) {
