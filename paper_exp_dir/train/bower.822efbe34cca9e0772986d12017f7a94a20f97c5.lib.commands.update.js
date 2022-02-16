







var Emitter = require('events').EventEmitter;
var async   = require('async');
var nopt    = require('nopt');
var _       = require('lodash');

var Manager = require('../core/manager');
var install = require('./install');
var help    = require('./help');

var shorthand   = { 'h': ['--help'], 'f': ['--force'] };
var optionTypes = { help: Boolean, force: Boolean };

module.exports = function (names, options) {
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

console.log(endpoints);


