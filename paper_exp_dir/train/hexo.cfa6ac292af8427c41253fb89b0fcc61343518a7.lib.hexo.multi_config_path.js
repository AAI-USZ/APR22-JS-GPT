'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const _ = require('lodash');
const yml = require('js-yaml');

module.exports = ctx => function multiConfigPath(base, configPaths) {
const log = ctx.log;

const defaultPath = pathFn.join(base, '_config.yml');
let paths;

if (!configPaths) {
log.w('No config file entered.');
return pathFn.join(base, '_config.yml');
}


if (configPaths.includes(',')) {
paths = configPaths.replace(' ', '').split(',');
} else {

if (!fs.existsSync(pathFn.join(base, configPaths))) {
log.w(`Config file ${configPaths} not found, using default.`);
return defaultPath;
}

return pathFn.resolve(base, configPaths);
}
