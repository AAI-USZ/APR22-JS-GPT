'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const merge = require('lodash/merge');
const yml = require('js-yaml');

module.exports = ctx => function multiConfigPath(base, configPaths, outputDir) {
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

let configPath = pathFn.isAbsolute(configPaths) ? configPaths : pathFn.resolve(base, configPaths);

if (!fs.existsSync(configPath)) {
log.w(`Config file ${configPaths} not found, using default.`);
configPath = defaultPath;
}

return configPath;
}

const numPaths = paths.length;


const combinedConfig = {};
let count = 0;
for (let i = 0; i < numPaths; i++) {
const configPath = pathFn.isAbsolute(paths[i]) ? paths[i] : pathFn.join(base, paths[i]);

if (!fs.existsSync(configPath)) {
log.w(`Config file ${paths[i]} not found.`);
continue;
}


const file = fs.readFileSync(configPath);
const ext = pathFn.extname(paths[i]).toLowerCase();

if (ext === '.yml') {
