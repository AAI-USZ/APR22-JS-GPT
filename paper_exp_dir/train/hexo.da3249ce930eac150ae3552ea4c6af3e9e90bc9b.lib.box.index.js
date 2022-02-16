'use strict';

const pathFn = require('path');
const Promise = require('bluebird');
const File = require('./file');
const util = require('hexo-util');
const fs = require('hexo-fs');
const chalk = require('chalk');
const EventEmitter = require('events').EventEmitter;
const minimatch = require('minimatch');

const Pattern = util.Pattern;
const join = pathFn.join;
const sep = pathFn.sep;
