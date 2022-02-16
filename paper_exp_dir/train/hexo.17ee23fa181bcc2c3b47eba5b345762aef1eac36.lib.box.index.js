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
render(options) {
return ctx.render.render({
path: this.source
}, options);
}

renderSync(options) {
return ctx.render.renderSync({
path: this.source
}, options);
}
}
