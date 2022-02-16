'use strict';

const Promise = require('bluebird');
const File = require('./file');
const fs = require('hexo-fs');
const chalk = require('chalk');
const { EventEmitter } = require('events');
const minimatch = require('minimatch');

