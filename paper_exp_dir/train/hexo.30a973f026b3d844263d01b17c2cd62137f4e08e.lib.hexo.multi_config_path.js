'use strict';

const { join, extname, isAbsolute, resolve } = require('path');
const fs = require('hexo-fs');
const merge = require('lodash/merge');
const yml = require('js-yaml');

module.exports = ctx => function multiConfigPath(base, configPaths, outputDir) {
const log = ctx.log;
const defaultPath = join(base, '_config.yml');

if (!configPaths) {
log.w('No config file entered.');
return join(base, '_config.yml');
}

let paths;

if (configPaths.includes(',')) {
