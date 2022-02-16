'use strict';

const { join, sep } = require('path');
const Promise = require('bluebird');
const File = require('./file');
const { Pattern, createSha1Hash } = require('hexo-util');
const { createReadStream, readdir, stat, watch } = require('hexo-fs');
const { magenta } = require('chalk');
const { EventEmitter } = require('events');
const { isMatch, makeRe } = require('micromatch');

const defaultPattern = new Pattern(() => ({}));

class Box extends EventEmitter {
constructor(ctx, base, options) {
super();

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
let targets = this.options.ignored || [];
if (ctx.config.ignore && ctx.config.ignore.length) {
targets = targets.concat(ctx.config.ignore);
}
this.ignore = targets;
this.options.ignored = targets.map(s => toRegExp(ctx, s)).filter(x => x);
}
_createFileClass() {
const ctx = this.context;

class _File extends File {
render(options, callback) {
if (!callback && typeof options === 'function') {
callback = options;
options = {};
}

return ctx.render.render({
path: this.source
}, options).asCallback(callback);
}

renderSync(options) {
return ctx.render.renderSync({
path: this.source
}, options);
}
}

_File.prototype.box = this;

return _File;
}

addProcessor(pattern, fn) {
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
}

_readDir(base, prefix = '') {
const results = [];
return readDirWalker(base, results, this.ignore, prefix)
.return(results)
.map(path => this._checkFileStatus(path))
.map(file => this._processFile(file.type, file.path).return(file.path));
}

_checkFileStatus(path) {
const { Cache, context: ctx } = this;
const src = join(this.base, path);
