'use strict';

const merge = require('lodash/merge');
const { sep, resolve, join, parse } = require('path');
const tildify = require('tildify');
const Theme = require('../theme');
const Source = require('./source');
const fs = require('hexo-fs');
const chalk = require('chalk');

module.exports = ctx => {
if (!ctx.env.init) return;

const baseDir = ctx.base_dir;
let configPath = ctx.config_path;

return fs.exists(configPath).then(exist => {
return exist ? configPath : findConfigPath(configPath);
}).then(path => {
