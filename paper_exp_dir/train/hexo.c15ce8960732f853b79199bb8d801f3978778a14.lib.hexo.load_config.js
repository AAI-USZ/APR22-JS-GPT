'use strict';

const { sep, resolve, join, parse } = require('path');
const tildify = require('tildify');
const Theme = require('../theme');
const Source = require('./source');
const fs = require('hexo-fs');
const chalk = require('chalk');
const { deepMerge } = require('hexo-util');

module.exports = ctx => {
if (!ctx.env.init) return;

const baseDir = ctx.base_dir;
let configPath = ctx.config_path;

return fs.exists(configPath).then(exist => {
return exist ? configPath : findConfigPath(configPath);
}).then(path => {
if (!path) return;

configPath = path;
return ctx.render.render({path});
}).then(config => {
if (!config || typeof config !== 'object') return;

ctx.log.debug('Config loaded: %s', chalk.magenta(tildify(configPath)));

ctx.config = deepMerge(ctx.config, config);
config = ctx.config;

ctx.config_path = configPath;
