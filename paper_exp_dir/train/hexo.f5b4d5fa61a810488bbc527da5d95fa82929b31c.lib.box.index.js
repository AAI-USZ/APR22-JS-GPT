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
