







var Emitter = require('events').EventEmitter;
var async   = require('async');
var nopt    = require('nopt');
var _       = require('lodash');

var Manager   = require('../core/manager');
var help      = require('./help');
var uninstall = require('./uninstall');

var shorthand   = { 'h': ['--help'], 'f': ['--force'] };
var optionTypes = { help: Boolean, force: Boolean };

module.exports = function (names, options) {
options = options || {};

var manager = new Manager([], { force: options && options.force });
var emitter = new Emitter;

manager.on('data',  emitter.emit.bind(emitter, 'data'));
manager.on('error', emitter.emit.bind(emitter, 'error'));

var installURLS = function (err, arr) {
var mappings = {},
endpoints = [];

arr = _.compact(arr);
_.each(arr, function (info) {
endpoints.push(info.endpoint);
mappings[info.endpoint] = info.name;
});

options.endpointNames = mappings;




manager = new Manager(endpoints, options);
manager
.on('data',  emitter.emit.bind(emitter, 'data'))
.on('error', emitter.emit.bind(emitter, 'error'))
.on('resolve', emitter.emit.bind(emitter, 'end', null))
.resolve();
};

manager.once('resolveLocal', function () {
names = names.length ? _.uniq(names) : null;

async.map(_.values(manager.dependencies), function (pkgs, next) {
var pkg = pkgs[0];
pkg.once('loadJSON', function () {
pkg.once('fetchEndpoint', function (endpoint) {
if (!endpoint) return next();

