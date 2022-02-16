'use strict';

const { join } = require('path');
const { exists, readFile, listDir } = require('hexo-fs');
const Promise = require('bluebird');
const { magenta } = require('chalk');

module.exports = ctx => {
if (!ctx.env.init || ctx.env.safe) return;

return loadModules(ctx).then(() => loadScripts(ctx));
};

function loadModuleList(ctx) {
const packagePath = join(ctx.base_dir, 'package.json');


return exists(packagePath).then(exist => {
if (!exist) return [];


return readFile(packagePath).then(content => {
const json = JSON.parse(content);
const deps = Object.keys(json.dependencies || {});
const devDeps = Object.keys(json.devDependencies || {});
