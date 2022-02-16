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

