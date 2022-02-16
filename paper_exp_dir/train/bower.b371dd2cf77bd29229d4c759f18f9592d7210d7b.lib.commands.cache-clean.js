







var Emitter  = require('events').EventEmitter;
var async    = require('async');
var nopt     = require('nopt');
var rimraf   = require('rimraf');
var path     = require('path');
var fs       = require('fs');
var glob     = require('glob');
var _        = require('lodash');

var help     = require('./help');
var config   = require('../core/config');
var template = require('../util/template');

var optionTypes = { help: Boolean, force: Boolean };
var shorthand   = { 'h': ['--help'], 'S': ['--save'], 'f': ['--force'] };

var removePkg = function (pkg, emitter, next) {
var folder = path.join(config.cache, pkg);

fs.exists(folder, function (exists) {
if (!exists) return emitter.emit('error', new Error(pkg + ' is not cached'));

rimraf(folder, function (err) {
if (err) emitter.emit('error', err);
else {
emitter.emit('data', template('action', { name: 'cleared', shizzle: pkg }, true));
next();
}
});
});
};

var createFuncs = function (pkgs, emitter) {
return pkgs.map(function (pkg) {
pkg = pkg.replace(/^\.\
return removePkg.bind(removePkg, pkg, emitter);
});
