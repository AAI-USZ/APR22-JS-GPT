'use strict';

const _ = require('lodash');
const pathFn = require('path');
const tildify = require('tildify');
const Theme = require('../theme');
const Source = require('./source');
const fs = require('hexo-fs');
const chalk = require('chalk');

const sep = pathFn.sep;

module.exports = ctx => {
if (!ctx.env.init) return;

const baseDir = ctx.base_dir;
