







var Emitter  = require('events').EventEmitter;
var async    = require('async');
var nopt     = require('nopt');
var fs       = require('fs');
var path     = require('path');
var _        = require('lodash');

var template = require('../util/template');
var Manager  = require('../core/manager');
var config   = require('../core/config');
var help     = require('./help');

var optionTypes = { help: Boolean, force: Boolean, save: Boolean };
var shorthand   = { 'h': ['--help'], 'S': ['--save'], 'f': ['--force'] };

module.exports = function (names, options) {
var packages, uninstallables, packagesCount = {};
var emitter = new Emitter;
var manager = new Manager;
var jsonDeps;

options = options || {};

manager.on('data',  emitter.emit.bind(emitter, 'data'));
manager.on('error', emitter.emit.bind(emitter, 'error'));

var resolveLocal = function () {
jsonDeps = manager.json.dependencies || {};
packages = _.flatten(_.values(manager.dependencies));
uninstallables = packages.filter(function (pkg) {
return _.include(names, pkg.name);
});
async.forEach(packages, function (pkg, next) {
pkg.once('loadJSON', next).loadJSON();
}, function () {
if (showWarnings(options.force) && !options.force) return;
expandUninstallabes(options.force);
uninstall();
});
};

var showWarnings = function (force) {
var foundConflicts = false;

packages.forEach(function (pkg) {
if (!pkg.json.dependencies) return;
if (containsPkg(uninstallables, pkg)) return;

var conflicts = _.intersection(
Object.keys(pkg.json.dependencies),
_.pluck(uninstallables, 'name')
);

if (conflicts.length) {
foundConflicts = true;
if (!force) {
conflicts.forEach(function (conflictName) {
emitter.emit('data', template('warning-uninstall', { packageName: pkg.name, conflictName: conflictName }, true));
});
}
}
});

if (foundConflicts && !force) {
emitter.emit('data', template('warn', { message: 'To proceed, run uninstall with the --force flag'}, true));
}

return foundConflicts;
};

var expandUninstallabes = function (force) {
var x,
pkg,
forcedUninstallables = {};


for (var key in jsonDeps) {
packagesCount[key] = 1;
}


