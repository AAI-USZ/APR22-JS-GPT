'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const _ = require('lodash');
const yml = require('js-yaml');

module.exports = ctx => function multiConfigPath(base, configPaths) {
const log = ctx.log;

const defaultPath = pathFn.join(base, '_config.yml');
let paths;

