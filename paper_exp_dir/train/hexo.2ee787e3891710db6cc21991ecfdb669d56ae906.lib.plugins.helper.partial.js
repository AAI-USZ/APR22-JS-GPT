'use strict';

const pathFn = require('path');
const _ = require('lodash');
const chalk = require('chalk');

module.exports = ctx => function partial(name, locals, options) {
if (typeof name !== 'string') throw new TypeError('name must be a string!');

options = options || {};

const cache = options.cache;
const viewDir = this.view_dir;
