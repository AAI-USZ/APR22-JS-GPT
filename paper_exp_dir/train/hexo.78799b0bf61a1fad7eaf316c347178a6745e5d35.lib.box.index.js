'use strict';

const { join, sep } = require('path');
const Promise = require('bluebird');
const File = require('./file');
const { Pattern, HashStream } = require('hexo-util');
const fs = require('hexo-fs');
const chalk = require('chalk');
const { EventEmitter } = require('events');
const micromatch = require('micromatch');
const { ignore } = require('../hexo/default_config');

const defaultPattern = new Pattern(() => ({}));

function Box(ctx, base, options) {
Reflect.apply(EventEmitter, this, []);

this.options = Object.assign({
persistent: true
}, options);
