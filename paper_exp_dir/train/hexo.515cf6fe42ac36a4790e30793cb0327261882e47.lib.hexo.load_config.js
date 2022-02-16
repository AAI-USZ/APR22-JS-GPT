'use strict';

const { sep, resolve, join, parse } = require('path');
const tildify = require('tildify');
const Theme = require('../theme');
const Source = require('./source');
const { exists, readdir } = require('hexo-fs');
const { magenta } = require('chalk');
const { deepMerge } = require('hexo-util');

module.exports = async ctx => {
if (!ctx.env.init) return;

const baseDir = ctx.base_dir;
let configPath = ctx.config_path;

const path = await exists(configPath) ? configPath : await findConfigPath(configPath);
if (!path) return;
configPath = path;

let config = await ctx.render.render({ path });
if (!config || typeof config !== 'object') return;

ctx.log.debug('Config loaded: %s', magenta(tildify(configPath)));

