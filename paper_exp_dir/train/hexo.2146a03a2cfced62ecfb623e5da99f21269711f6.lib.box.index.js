'use strict';

const { join, sep } = require('path');
const Promise = require('bluebird');
const File = require('./file');
const { Pattern, HashStream } = require('hexo-util');
const fs = require('hexo-fs');
const chalk = require('chalk');
const { EventEmitter } = require('events');
const micromatch = require('micromatch');

const defaultPattern = new Pattern(() => ({}));

function Box(ctx, base, options) {
Reflect.apply(EventEmitter, this, []);

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
if (ctx.config.ignore) {
const targets = Array.isArray(ctx.config.ignore) ? ctx.config.ignore : [ctx.config.ignore];
this.options.ignored = (this.options.ignored || []).concat(targets.map(s => toRegExp(ctx, s)).filter(x => x));
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

function toRegExp(ctx, arg) {
if (!arg) return null;
if (typeof arg !== 'string') {
ctx.log.warn('A value of "ignore:" section in "_config.yml" is not invalid (not a string)');
return null;
}
const result = micromatch.makeRe(arg);
if (!result) {
ctx.log.warn('A value of "ignore:" section in "_config.yml" can not be converted to RegExp:' + arg);
return null;
}
return result;
}

Box.prototype._createFileClass = function() {
const ctx = this.context;

const _File = function(data) {
Reflect.apply(File, this, [data]);
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
const { ignore } = this;

if (base && ignore && ignore.length && micromatch.isMatch(base, ignore)) {
return Promise.resolve([]);
}

return fs.readdir(base).map(path => fs.stat(join(base, path)).then(stats => {
const fullpath = join(base, path);
if (stats.isDirectory()) {
return this._readDir(fullpath, fn, `${prefix + path}/`);
}

if (ignore && ignore.length && micromatch.isMatch(fullpath, ignore)) {
return Promise.resolve([]);
}

