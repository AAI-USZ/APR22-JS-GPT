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
persistent: true,
awaitWriteFinish: {
stabilityThreshold: 200
}
}, options);

if (!base.endsWith(sep)) {
base += sep;
}

