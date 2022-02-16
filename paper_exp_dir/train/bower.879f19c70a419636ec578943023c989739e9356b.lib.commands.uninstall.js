







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

if (!names.length) {
process.nextTick(function () {
emitter.emit('error', new Error('Please specify at least one package to uninstall'));
});

