'use strict';

const { join, sep } = require('path');
const Promise = require('bluebird');
const File = require('./file');
const { Pattern, HashStream } = require('hexo-util');
const { createReadStream, readdir, stat, watch } = require('hexo-fs');
const { magenta } = require('chalk');
const { EventEmitter } = require('events');
const { isMatch, makeRe } = require('micromatch');
const ignore = ['**/themes/*/node_modules/**', '**/themes/*/.git/**'];

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

let ignoreCfg = ignore;
if (ctx.config.ignore) {
if (ctx.config.ignore.length) ignoreCfg = ignoreCfg.concat(ctx.config.ignore);
}
this.ignore = ignoreCfg;
const targets = ignoreCfg;
this.options.ignored = (this.options.ignored || []).concat(targets.map(s => toRegExp(ctx, s)).filter(x => x));
}
_createFileClass() {
const ctx = this.context;
