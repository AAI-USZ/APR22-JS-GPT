'use strict';

const { join, sep } = require('path');
const Promise = require('bluebird');
const File = require('./file');
const { Pattern, HashStream } = require('hexo-util');
const fs = require('hexo-fs');
const chalk = require('chalk');
const { EventEmitter } = require('events');
const minimatch = require('minimatch');

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
const hasher = new HashStream();

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
const { ignore } = self;

if (base && ignore && ignore.length) {
for (let i = 0, len = ignore.length; i < len; i++) {
if (minimatch(base, ignore[i])) {
return Promise.resolve('Ignoring dir.');
}
}
}

return fs.readdir(base).map(path => fs.stat(join(base, path)).then(stats => {
if (stats.isDirectory()) {
return self._readDir(join(base, path), fn, `${prefix + path}/`);
}

return self._checkFileStatus(prefix + path).then(file => fn(file).thenReturn(file));
})).catch(err => {
if (err.cause && err.cause.code === 'ENOENT') return;
throw err;
}).reduce((files, item) => files.concat(item), []);
};

Box.prototype._checkFileStatus = function(path) {
const { Cache, context: ctx } = this;
const src = join(this.base, path);

return Cache.compareFile(
escapeBackslash(src.substring(ctx.base_dir.length)),
() => getHash(src),

() => fs.stat(src)
).then(result => ({
type: result.type,
path
