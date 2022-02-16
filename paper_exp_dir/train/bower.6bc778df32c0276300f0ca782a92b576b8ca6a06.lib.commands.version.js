var semver = require('semver');
var which = require('which');
var fs = require('../util/fs');
var path = require('path');
var Q = require('q');
var execFile = require('child_process').execFile;
var defaultConfig = require('../config');
var createError = require('../util/createError');

function version(logger, versionArg, options, config) {
options = options || {};

config = defaultConfig(config);

return bump(logger, config, versionArg, options.message);
}

function bump(logger, config, versionArg, message) {
var cwd = config.cwd || process.cwd();
var newVersion;

if (!versionArg) {
throw createError('No <version> agrument provided', 'EREADOPTIONS');
}

return driver
.check(cwd)
.then(function() {
return Q.all([driver.versions(cwd), driver.currentVersion(cwd)]);
})
.spread(function(versions, currentVersion) {
currentVersion = currentVersion || '0.0.0';

if (semver.valid(versionArg)) {
newVersion = semver.valid(versionArg);
