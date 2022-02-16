'use strict';

const { join, sep } = require('path');
const Promise = require('bluebird');
const File = require('./file');
const { Pattern, createSha1Hash } = require('hexo-util');
const { createReadStream, readdir, stat, watch } = require('hexo-fs');
const { magenta } = require('chalk');
const { EventEmitter } = require('events');
const { isMatch, makeRe } = require('micromatch');
