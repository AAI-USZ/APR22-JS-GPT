'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const _ = require('lodash');
const yml = require('js-yaml');

module.exports = ctx => function multiConfigPath(base, configPaths, outputDir) {
const log = ctx.log;

const defaultPath = pathFn.join(base, '_config.yml');
let paths;

if (!configPaths) {
log.w('No config file entered.');
return pathFn.join(base, '_config.yml');
}


if (configPaths.indexOf(',') > -1) {
paths = configPaths.replace(' ', '').split(',');

} else {

let configPath = pathFn.isAbsolute(configPaths) ? configPaths : pathFn.resolve(base, configPaths);

if (!fs.existsSync(configPath)) {
log.w(`Config file ${configPaths} not found, using default.`);
configPath = defaultPath;
}

return configPath;
}

const numPaths = paths.length;
