'use strict';

const { join } = require('path');
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

const packagePath = join(ctx.base_dir, 'package.json');


return fs.exists(packagePath).then(exist => {
if (!exist) return [];


return fs.readFile(packagePath).then(content => {
const json = JSON.parse(content);
const deps = Object.keys(json.dependencies || {});
const devDeps = Object.keys(json.devDependencies || {});

return deps.concat(devDeps);
});
}).filter(name => {

if (!/^hexo-|^@[^/]+\/hexo-/.test(name)) return false;


if (/^@types\


const path = ctx.resolvePlugin(name);
return fs.exists(path);
});
}

function loadModules(ctx) {
return loadModuleList(ctx).map(name => {
