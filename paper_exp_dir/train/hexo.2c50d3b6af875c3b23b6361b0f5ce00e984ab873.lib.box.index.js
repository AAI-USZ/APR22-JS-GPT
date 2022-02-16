'use strict';

const { join, sep } = require('path');
const Promise = require('bluebird');
const File = require('./file');
const { Pattern, HashStream } = require('hexo-util');
const { createReadStream, readdir, stat, watch } = require('hexo-fs');
const { magenta } = require('chalk');
const { EventEmitter } = require('events');
const { inherits } = require('util');
const { isMatch, makeRe } = require('micromatch');
const ignore = ['**/themes/*/node_modules/**', '**/themes/*/.git/**'];

const defaultPattern = new Pattern(() => ({}));

function Box(ctx, base, options) {
Reflect.apply(EventEmitter, this, []);
