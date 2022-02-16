'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');
const chalk = require('chalk');

module.exports = ctx => {
if (!ctx.env.init || ctx.env.safe) return;

return loadModules(ctx).then(() => loadScripts(ctx));
};

function loadModuleList(ctx) {
if (ctx.config && Array.isArray(ctx.config.plugins)) {
return Promise.resolve(ctx.config.plugins).filter(item => typeof item === 'string');
}

const packagePath = pathFn.join(ctx.base_dir, 'package.json');


return fs.exists(packagePath).then(exist => {
if (!exist) return [];


return fs.readFile(packagePath).then(content => {
const json = JSON.parse(content);
const deps = Object.keys(json.dependencies || {});
const devDeps = Object.keys(json.devDependencies || {});

return deps.concat(devDeps);
