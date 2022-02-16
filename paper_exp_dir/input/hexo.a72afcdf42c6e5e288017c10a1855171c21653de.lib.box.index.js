'use strict';

const pathFn = require('path');
const Promise = require('bluebird');
const File = require('./file');
const util = require('hexo-util');
const fs = require('hexo-fs');
const chalk = require('chalk');
const EventEmitter = require('events').EventEmitter;
const minimatch = require('minimatch');

const Pattern = util.Pattern;
const join = pathFn.join;
const sep = pathFn.sep;

const defaultPattern = new Pattern(() => ({}));

function Box(ctx, base, options) {
EventEmitter.call(this);

this.options = Object.assign({
persistent: true
}, options);

if (!base.endsWith(sep)) {
base += sep;
}

this.context = ctx;
this.base = base;
this.processors = [];
this._processingFiles = {};
this.watcher = null;
this.Cache = ctx.model('Cache');
this.File = this._createFileClass();
this.ignore = ctx.config.ignore;

if (!Array.isArray(this.ignore)) {
this.ignore = [this.ignore];
}
}

require('util').inherits(Box, EventEmitter);

function escapeBackslash(path) {

return path.replace(/\\/g, '/');
}

function getHash(path) {
return new Promise((resolve, reject) => {
const src = fs.createReadStream(path);
const hasher = new util.HashStream();

src.pipe(hasher)
.on('finish', () => {
resolve(hasher.read().toString('hex'));
})
.on('error', reject);
});
}

Box.prototype._createFileClass = function() {
const ctx = this.context;

const _File = function(data) {
File.call(this, data);
};

require('util').inherits(_File, File);

_File.prototype.box = this;

_File.prototype.render = function(options, callback) {
if (!callback && typeof options === 'function') {
callback = options;
options = {};
}

return ctx.render.render({
path: this.source
}, options).asCallback(callback);
};

_File.prototype.renderSync = function(options) {
return ctx.render.renderSync({
path: this.source
}, options);
};

return _File;
};

Box.prototype.addProcessor = function(pattern, fn) {
if (!fn && typeof pattern === 'function') {
fn = pattern;
pattern = defaultPattern;
}

if (typeof fn !== 'function') throw new TypeError('fn must be a function');
if (!(pattern instanceof Pattern)) pattern = new Pattern(pattern);

this.processors.push({
pattern,
process: fn
});
};

Box.prototype._readDir = function(base, fn, prefix = '') {
const self = this;
const ignore = self.ignore;

