







var Emitter     = require('events').EventEmitter;
var async       = require('async');
var nopt        = require('nopt');
var rimraf      = require('rimraf');
var path        = require('path');
var glob        = require('glob');
var _           = require('lodash');

var help        = require('./help');
var config      = require('../core/config');
var template    = require('../util/template');
var fileExists  = require('../util/file-exists');

var optionTypes = { help: Boolean };
var shorthand   = { 'h': ['--help'] };

var removePkg = function (pkg, emitter, next) {
var folder = path.join(config.cache, pkg);

fileExists(folder, function (exists) {
var err;

if (!exists) {
err = new Error('Package ' + pkg + ' is not installed');
emitter.emit('error', err);
return next(err);
}

rimraf(folder, function (err) {
if (err) {
emitter.emit('error', err);
