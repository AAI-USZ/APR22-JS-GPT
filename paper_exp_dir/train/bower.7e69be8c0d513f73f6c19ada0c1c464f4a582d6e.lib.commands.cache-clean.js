







var Emitter     = require('events').EventEmitter;
var async       = require('async');
var nopt        = require('nopt');
var rimraf      = require('rimraf');
var path        = require('path');
var glob        = require('glob');
var fs          = require('fs');
var _           = require('lodash');

var help        = require('./help');
var config      = require('../core/config');
var template    = require('../util/template');
var fileExists  = require('../util/file-exists');

var optionTypes = { help: Boolean };
var shorthand   = { 'h': ['--help'] };

var processCachedPackage = function (emitter, pkg, next) {
removeCachedPackage(pkg, function (err, exists) {
if (err) {
emitter.emit('error', err);
return next();
}

if (exists) {
template('action', { name: 'cache cleared', shizzle: pkg })
.on('data', emitter.emit.bind(emitter, 'data'));
}

next();
});
};

var removeCachedPackage = function (pkg, next) {
var folder = path.join(config.cache, pkg);

fileExists(folder, function (exists) {
if (!exists) return next(null, false);
rimraf(folder, function (err) {
if (err) return next(err);
next(null, true);
});
});
};

var processLinkedPackage = function (emitter, pkg, next) {
checkAndRemoveLinkToPackage(pkg, function (err, removed) {
if (err) {
emitter.emit('error', err);
return next();
}

if (removed) {
template('action', { name: 'link cleared', shizzle: pkg })
.on('data', emitter.emit.bind(emitter, 'data'));
}

next();
});
};

var checkAndRemoveLinkToPackage = function (pkg, next) {
var folder = path.join(config.links, pkg);

fs.readlink(folder, function (err, linkString) {
if (err && err.code === 'ENOENT') return next();

fileExists(linkString, function (exists) {
if (!exists) {
return rimraf(folder, function (err) {
if (err) return next(err);
next(null, true);
});
}

next(null, false);
});
});
};

module.exports = function (pkgs) {
var emitter = new Emitter;

async.parallel({
cache: function (next) {
if (!pkgs || !pkgs.length) {
glob('./*', { cwd: config.cache }, function (err, dirs) {
if (err) {
emitter.emit('error', err);
return next();
}

var pkgs = dirs.map(function (dir) { return dir.replace(/^\.\
async.forEach(pkgs, processCachedPackage.bind(this, emitter), next);
});
} else {
pkgs = _.uniq(pkgs);
async.forEach(pkgs, processCachedPackage.bind(this, emitter), next);
}
},
links: function (next) {
if (!pkgs || !pkgs.length) {
glob('./*', { cwd: config.links }, function (err, dirs) {
if (err) {
emitter.emit('error', err);
return next();
}

var pkgs = dirs.map(function (dir) { return dir.replace(/^\.\
async.forEach(pkgs, processLinkedPackage.bind(this, emitter), next);
});
} else {
pkgs = _.uniq(pkgs);
async.forEach(pkgs, processLinkedPackage.bind(this, emitter), next);
}
},
completion: function (next) {

if (pkgs && pkgs.length) return next();

rimraf(config.completion, function (err) {
if (err) {
emitter.emit('error', err);
return next();
}

template('action', { name: 'completion cleared', shizzle: 'completion cache' })
.on('data', emitter.emit.bind(emitter, 'data'));
