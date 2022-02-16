var semver = require('semver');
var which = require('which');
var fs = require('fs');
var path = require('path');
var Q = require('q');
var execFile = require('child_process').execFile;
var Project = require('../core/Project');
var cli = require('../util/cli');
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
