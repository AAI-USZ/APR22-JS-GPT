'use strict';

var pathFn = require('path');
var Promise = require('bluebird');
var _ = require('lodash');
var File = require('./file');
var util = require('hexo-util');
var fs = require('hexo-fs');
var chalk = require('chalk');
var xxhash = require('xxhash');

var Pattern = util.Pattern;
var escapeRegExp = util.escapeRegExp;
var join = pathFn.join;
var sep = pathFn.sep;

var defaultPattern = new Pattern(function() {
return {};
});

function Box(ctx, base, options) {
this.options = _.extend({
persistent: true,
ignored: /[\/\\]\./
}, options);

if (base.substring(base.length - 1) !== sep) {
base += sep;
}

this.context = ctx;
this.base = base;
this.processors = [];
this.processingFiles = {};
this.watcher = null;
this.Cache = ctx.model('Cache');

var _File = this.File = function(data) {
File.call(this, data);
};

require('util').inherits(_File, File);

_File.prototype.box = this;

_File.prototype.render = function(options, callback) {
if (!callback && typeof options === 'function') {
callback = options;
options = {};
}

var self = this;

return this.read().then(function(content) {
return ctx.render.render({
text: content,
path: self.source
}, options);
}).asCallback(callback);
};

_File.prototype.renderSync = function(options) {
return ctx.render.renderSync({
text: this.readSync(),
path: this.source
}, options);
};
}

function escapeBackslash(path) {

return path.replace(/\\/g, '/');
}

Box.prototype.addProcessor = function(pattern, fn) {
if (!fn && typeof pattern === 'function') {
fn = pattern;
pattern = defaultPattern;
}

if (typeof fn !== 'function') throw new TypeError('fn must be a function');
if (!(pattern instanceof Pattern)) pattern = new Pattern(pattern);

this.processors.push({
pattern: pattern,
process: fn
});
};

Box.prototype.process = function(callback) {
var self = this;

return fs.exists(this.base).then(function(exist) {
if (!exist) return;
return self._loadFiles();
}).then(function(files) {
if (files && files.length) {
return self._process(files);
}
}).asCallback(callback);
};

Box.prototype.load = Box.prototype.process;

function listDir(path) {
return fs.listDir(path).catch(function(err) {

