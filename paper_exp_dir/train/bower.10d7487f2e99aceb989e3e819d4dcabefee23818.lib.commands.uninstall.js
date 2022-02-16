







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
